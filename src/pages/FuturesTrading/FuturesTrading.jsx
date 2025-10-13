// ================================================
// File: pages/FuturesTrading.jsx
// Description: Full-featured USDT-margined isolated futures page
// Re-uses your CandleChart, OrderBook, MarketSelector, and Modal components
// Adds: FuturesTradeForm, FuturesPositionsTable, PnL & liquidation helpers,
// Firestore persistence (users/{uid}: futuresBalance, futuresPositions)
// ================================================
import React, { useEffect, useMemo, useState, useCallback } from "react";
import FeaturesChart from "./FeaturesChart";
import { TRADING_PAIRS } from "../../constants/tradingPairs";
import useBinanceTicker from "../../hooks/useBinanceTicker";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import OrderBook from "../../components/OrderBook";
import MarketSelector from "../../components/MarketSelector";
import Modal from "./FuturesAlert"; // same modal you used in SpotTrading
import FuturesTradeForm from "./FuturesTradeForm";
import FuturesPositionsTable from "./FuturesPositionsTable";

// ----- Helpers: math & formatting -----
const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
const fmt = (n, dp = 2) =>
  typeof n === "number" && Number.isFinite(n)
    ? n.toLocaleString(undefined, { maximumFractionDigits: dp })
    : "-";

// Unrealized PnL for linear USDT-margined contracts (qty in base asset)
function unrealizedPnl({ side, entryPrice, qty }, markPrice) {
  if (!markPrice || !Number.isFinite(markPrice)) return 0;
  if (side === "long") return (markPrice - entryPrice) * qty;
  return (entryPrice - markPrice) * qty; // short
}

// Effective leverage based on current entry & margin
function effectiveLeverage({ entryPrice, qty, margin }) {
  const notional = entryPrice * qty;
  return margin > 0 ? notional / margin : 0;
}

// Estimated isolated liquidation price (approx), ignoring fees & funding.
// MMR = maintenance margin rate (e.g., 0.5%)
function estimateLiqPrice(position, mmr = 0.005) {
  const { side, entryPrice: E, qty: q, margin: m } = position;
  if (!E || !q || !m) return null;

  if (side === "long") {
    // m + (P - E)q = mmr * P * q  =>  P(1 - mmr)q = E q - m  =>  P = (E q - m) / (q (1 - mmr))
    const numerator = E * q - m;
    const denom = q * (1 - mmr);
    if (denom <= 0) return null;
    const P = numerator / denom;
    return P > 0 ? P : null;
  } else {
    // m + (E - P)q = mmr * P * q  =>  m + E q = P q (1 + mmr)  =>  P = (m + E q) / (q (1 + mmr))
    const denom = q * (1 + mmr);
    if (denom <= 0) return null;
    const P = (m + E * q) / denom;
    return P > 0 ? P : null;
  }
}

export default function FuturesTrading() {
  const { user } = useAuth();
  const uid = user?.uid || null;

  const initialPair =
    typeof TRADING_PAIRS?.[0] === "string"
      ? TRADING_PAIRS[0]
      : TRADING_PAIRS?.[0]?.symbol || "BTCUSDT";

  const [pair, setPair] = useState(initialPair);
  const [interval, setInterval] = useState("1m");
  const [placing, setPlacing] = useState(false);

  // Futures-specific state
  const [futuresBalance, setFuturesBalance] = useState(0);
  const [positions, setPositions] = useState([]); // [{id, symbol, side, qty, entryPrice, margin, createdAt}]

  // Modals
  const [confirmOrder, setConfirmOrder] = useState(null); // { side, qty, leverage, pricePerUnit }
  const [resultInfo, setResultInfo] = useState(null);

  // Live ticker (lowercase map) for mark price
  const pairLower = typeof pair === "string" ? pair.toLowerCase() : "";
  const pairs = useMemo(() => (pairLower ? [pairLower] : []), [pairLower]);
  const { tickersMap } = useBinanceTicker(pairs, { batchSize: 50 });
  const ticker = tickersMap.get(pairLower);
  const markPrice = ticker ? Number(ticker.price) : null;

  // ------- Load futures state (balance + positions) -------
 useEffect(() => {
  let mounted = true;
  (async () => {
    if (!uid) {
      if (mounted) {
        setPositions([]);
        setFuturesBalance(0);
      }
      return;
    }
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() || {};

        // Initialize futuresBalance if missing
        if (!("futuresBalance" in data)) {
          const initialBalance = data.balance || 10000; // copy spot balance or default
          await setDoc(ref, { futuresBalance: initialBalance }, { merge: true });
          if (mounted) setFuturesBalance(initialBalance);
        } else if (mounted) {
          setFuturesBalance(data.futuresBalance);
        }

        // Initialize futuresPositions if missing
        if (!("futuresPositions" in data)) {
          await setDoc(ref, { futuresPositions: [] }, { merge: true });
          if (mounted) setPositions([]);
        } else if (mounted) {
          setPositions(Array.isArray(data.futuresPositions) ? data.futuresPositions : []);
        }

      } else {
        // New user
        const initialBalance = 10000;
        await setDoc(
          ref,
          { futuresBalance: initialBalance, futuresPositions: [] },
          { merge: true }
        );
        if (mounted) {
          setPositions([]);
          setFuturesBalance(initialBalance);
        }
      }
    } catch (e) {
      console.error("Load futures error:", e);
    }
  })();

  return () => {
    mounted = false;
  };
}, [uid]);


  // ------- Core actions -------
  const openConfirm = (payload) => {
    if (!uid) {
      setResultInfo({
        title: "Not logged in",
        message: "Please sign in to trade futures.",
      });
      return;
    }
    if (
      !pair ||
      !payload?.pricePerUnit ||
      !Number.isFinite(payload?.qty) ||
      payload.qty <= 0
    ) {
      setResultInfo({
        title: "Invalid order",
        message: "Enter a valid quantity and ensure price is available.",
      });
      return;
    }
    if (!Number.isFinite(payload?.leverage) || payload.leverage < 1) {
      setResultInfo({
        title: "Invalid leverage",
        message: "Choose a leverage of 1x or higher.",
      });
      return;
    }
    setConfirmOrder(payload);
  };

  const persist = async (nextBalance, nextPositions) => {
    if (!uid) return;
    const ref = doc(db, "users", uid);
    await setDoc(
      ref,
      { futuresBalance: nextBalance, futuresPositions: nextPositions },
      { merge: true }
    );
  };

  // Place futures order after confirm
  const placeFuturesOrder = useCallback(
    async ({ side, qty, leverage, pricePerUnit }) => {
      setPlacing(true);
      try {
        // Reload latest from DB for safety
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        const data = (snap.exists() && snap.data()) || {
          futuresBalance: 0,
          futuresPositions: [],
        };
        let curBalance = Number.isFinite(data.futuresBalance)
          ? data.futuresBalance
          : 0;
        let curPositions = Array.isArray(data.futuresPositions)
          ? [...data.futuresPositions]
          : [];

        // Required initial margin for this order
        const entry = pricePerUnit;
        const notional = entry * qty;
        const requiredMargin = notional / leverage;

        // Check if there is an opposite position we should reduce first
        const sameKey = (p) => p.symbol === pair && p.side === side;
        const oppositeKey = (p) => p.symbol === pair && p.side !== side;
        const existingOpp = curPositions.find(oppositeKey);

        // Helper to realize PnL for closing qty against an existing position
        const closeAgainst = (pos, closingQty, fillPrice) => {
          const proportion = clamp(closingQty / pos.qty, 0, 1);
          const marginReleased = pos.margin * proportion;
          // Realized PnL based on entry vs fill
          const pnl =
            pos.side === "long"
              ? (fillPrice - pos.entryPrice) * closingQty
              : (pos.entryPrice - fillPrice) * closingQty;

          curBalance += marginReleased + pnl; // return margin and add PnL
          pos.qty -= closingQty;
          pos.margin -= marginReleased;
          if (pos.qty <= 1e-12) {
            // remove fully closed
            curPositions = curPositions.filter((p) => p !== pos);
          }
        };

        // 1) If opposite position exists, reduce/close it first using this order's qty
        if (existingOpp && existingOpp.qty > 0) {
          if (qty <= existingOpp.qty + 1e-12) {
            // All used to reduce opposite; no new position opened
            closeAgainst(existingOpp, qty, entry);
            await persist(curBalance, curPositions);
            setFuturesBalance(curBalance);
            setPositions(curPositions);
            setResultInfo({
              title: "Position reduced",
              message: `Closed ${fmt(
                qty
              )} of ${pair} ${existingOpp.side.toUpperCase()} at ${fmt(
                entry
              )}.`,
            });
            return;
          } else {
            // Close the opposite fully, then open leftover on new side
            const usedToClose = existingOpp.qty;
            closeAgainst(existingOpp, usedToClose, entry);
            qty -= usedToClose; // leftover to open on requested side
          }
        }

        // 2) Now we're opening/adding to a position on the requested side
        if (curBalance < requiredMargin - 1e-12) {
          setResultInfo({
            title: "Insufficient margin",
            message: `Need ${fmt(requiredMargin)} USDT, available ${fmt(
              curBalance
            )} USDT. Reduce size or leverage up (higher risk).`,
          });
          return;
        }

        curBalance -= requiredMargin; // lock margin
        const existingSame = curPositions.find(sameKey);
        if (existingSame) {
          // Increase position: weighted avg price & add margin
          const prevQty = existingSame.qty;
          const prevNotional = existingSame.entryPrice * prevQty;
          const newQty = prevQty + qty;
          const newEntry = (prevNotional + entry * qty) / newQty;
          existingSame.qty = newQty;
          existingSame.entryPrice = newEntry;
          existingSame.margin += requiredMargin;
          existingSame.updatedAt = Date.now();
        } else {
          curPositions.push({
            id: `${pair}-${side}`,
            symbol: pair,
            side,
            qty,
            entryPrice: entry,
            margin: requiredMargin,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }

        await persist(curBalance, curPositions);
        setFuturesBalance(curBalance);
        setPositions(curPositions);

        setResultInfo({
          title: `${side === "long" ? "Long" : "Short"} opened`,
          message: `${side.toUpperCase()} ${fmt(qty)} ${pair.replace(
            /USDT$/i,
            ""
          )} @ ${fmt(entry)} with ~${fmt(leverage)}x (margin ${fmt(
            requiredMargin
          )} USDT).`,
        });
      } catch (err) {
        console.error("placeFuturesOrder err", err);
        setResultInfo({
          title: "Order failed",
          message: "Something went wrong while placing the futures order.",
        });
      } finally {
        setPlacing(false);
      }
    },
    [uid, pair]
  );

  // Close helper (used by positions table: 25% / 50% / 100%)
  const closePosition = useCallback(
    async (pos, fraction, fillPrice) => {
      setPlacing(true);
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        const data = (snap.exists() && snap.data()) || {
          futuresBalance: 0,
          futuresPositions: [],
        };
        let curBalance = Number.isFinite(data.futuresBalance)
          ? data.futuresBalance
          : 0;
        let curPositions = Array.isArray(data.futuresPositions)
          ? [...data.futuresPositions]
          : [];

        const target = curPositions.find((p) => p.id === pos.id);
        if (!target) {
          setResultInfo({
            title: "Position not found",
            message: "It might have been closed already.",
          });
          return;
        }

        const closingQty = clamp(target.qty * fraction, 0, target.qty);
        const marginReleased = target.margin * (closingQty / target.qty);
        const pnl =
          target.side === "long"
            ? (fillPrice - target.entryPrice) * closingQty
            : (target.entryPrice - fillPrice) * closingQty;

        curBalance += marginReleased + pnl;
        target.qty -= closingQty;
        target.margin -= marginReleased;
        target.updatedAt = Date.now();

        if (target.qty <= 1e-12) {
          curPositions = curPositions.filter((p) => p.id !== target.id);
        }

        const ref2 = doc(db, "users", uid);
        await setDoc(
          ref2,
          { futuresBalance: curBalance, futuresPositions: curPositions },
          { merge: true }
        );

        setFuturesBalance(curBalance);
        setPositions(curPositions);
        setResultInfo({
          title: "Position closed",
          message: `Closed ${fmt(closingQty)} @ ${fmt(
            fillPrice
          )}. Realized PnL: ${fmt(pnl)} USDT.`,
        });
      } catch (e) {
        console.error("closePosition err", e);
        setResultInfo({
          title: "Close failed",
          message: "Something went wrong while closing the position.",
        });
      } finally {
        setPlacing(false);
      }
    },
    [uid]
  );

  // Enriched positions for UI
  const positionsView = useMemo(() => {
    return positions.map((p) => {
      const mark = p.symbol === pair ? markPrice : null; // you can expand to a map if you subscribe to multiple
      const upnl = unrealizedPnl(p, mark);
      const lev = effectiveLeverage(p);
      const liq = estimateLiqPrice(p);
      const notional = p.entryPrice * p.qty;
      return {
        ...p,
        markPrice: mark,
        upnl,
        leverage: lev,
        liqPrice: liq,
        notional,
      };
    });
  }, [positions, markPrice, pair]);

  return (
    <section className="min-h-screen px-4 md:px-8 py-18 sm:py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT MAIN */}
        <div className="lg:col-span-8 space-y-6">
          {/* Market Header */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg p-4 text-black dark:text-white bg-card-light dark:bg-zinc-900 shadow-lg">
            <MarketSelector
              value={pair}
              pairs={TRADING_PAIRS}
              onChange={(p) =>
                setPair(typeof p === "string" ? p : p?.symbol || "BTCUSDT")
              }
            />
            <div className="ml-auto text-sm text-zinc-700 dark:text-zinc-300">
              {pair} • {interval} • Mark:{" "}
              <span className="font-bold text-green-400">
                {markPrice ? markPrice.toLocaleString() : "—"}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-3 h-[500px] shadow-lg">
            <FeaturesChart
              className="w-full h-full"
              symbol={pair}
              interval={interval}
              defaultSymbol="BTCUSDT"
              defaultInterval="1m"
              limit={300}
              onError={(e) => console.error("Features error:", e)}
            />
          </div>

          {/* Positions Table */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <FuturesPositionsTable
              positions={positionsView}
              onClosePct={(pos, pct) =>
                closePosition(
                  pos,
                  pct,
                  pos.symbol === pair && markPrice ? markPrice : pos.entryPrice
                )
              }
            />
            <div className="text-xs text-gray-500 mt-2">
              Futures Balance:{" "}
              <span className="font-medium">{fmt(futuresBalance)} USDT</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 self-start">
          {/* Order Book */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-zinc-700 dark:text-zinc-300">Order Book</h4>
              <span className="text-xs text-gray-400">Live</span>
            </div>
            <OrderBook pair={pair} depth={20} />
          </div>

          {/* Trade Form */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <FuturesTradeForm
              pair={pair}
              markPrice={markPrice}
              balance={futuresBalance}
              placing={placing}
              onSubmit={(payload) => openConfirm(payload)}
            />
          </div>

          <p className="text-xs text-gray-500">
            Futures are <span className="font-semibold">simulated</span>{" "}
            (isolated, USDT-margined). Stored at{" "}
            <code>users/{uid || "guest"}</code> → <code>futuresBalance</code> /{" "}
            <code>futuresPositions</code>.
          </p>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        open={!!confirmOrder}
        title="Confirm Order"
        onClose={() => setConfirmOrder(null)}
        actions={[
          { label: "Not now", onClick: () => setConfirmOrder(null) },
          {
            label: "Yes, place order",
            variant: "primary",
            onClick: async () => {
              const payload = confirmOrder;
              setConfirmOrder(null);
              if (payload) await placeFuturesOrder(payload);
            },
          },
        ]}
      />

      <Modal
        open={!!resultInfo}
        title={resultInfo?.title || "Notice"}
        onClose={() => setResultInfo(null)}
        actions={[
          {
            label: "OK",
            variant: "primary",
            onClick: () => setResultInfo(null),
          },
        ]}
      />
    </section>
  );
}
