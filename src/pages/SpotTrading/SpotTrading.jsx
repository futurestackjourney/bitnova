// pages/SpotTrading.jsx
import { useEffect, useMemo, useState } from "react";
import CandleChart from "./CandleChart";
import { TRADING_PAIRS } from "../../constants/tradingPairs";
import useBinanceTicker from "../../hooks/useBinanceTicker";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import OrderBook from "../../components/OrderBook";
import TradeForm from "../../components/TradeForm";
import PositionsTable from "../../components/PositionsTable";
import MarketSelector from "../../components/MarketSelector";
import Modal from "./TradeAlert";
import GraphCard from "../../components/GraphCard";

export default function SpotTrading() {
  const { user } = useAuth();
  const uid = user?.uid || null;

  // Ensure initial pair is a valid string
  const initialPair =
    typeof TRADING_PAIRS?.[0] === "string"
      ? TRADING_PAIRS[0]
      : TRADING_PAIRS?.[0]?.symbol || "BTCUSDT";

  const [pair, setPair] = useState(initialPair);
  const [interval, setInterval] = useState("1m");
  const [placing, setPlacing] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [balance, setBalance] = useState(0);

  // Confirmation + Result modal state
  const [confirmOrder, setConfirmOrder] = useState(null); // { side, amountInBase, pricePerUnit }
  const [resultInfo, setResultInfo] = useState(null);     // { title, message }

  // Ticker subscription (lowercase)
  const pairLower = typeof pair === "string" ? pair.toLowerCase() : "";
  const pairs = useMemo(() => (pairLower ? [pairLower] : []), [pairLower]);
  const { tickersMap } = useBinanceTicker(pairs, { batchSize: 50 });
  const ticker = tickersMap.get(pairLower);
  const lastPrice = ticker ? Number(ticker.price) : null;

  // ------- Load user holdings/balance
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!uid) {
        if (mounted) {
          setHoldings([]);
          setBalance(0);
        }
        return;
      }
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() || {};
          mounted && setHoldings(Array.isArray(data.holdings) ? data.holdings : []);
          mounted && setBalance(Number.isFinite(data.balance) ? data.balance : 0);
        } else {
          await setDoc(ref, { balance: 10000, holdings: [] }, { merge: true });
          mounted && setHoldings([]);
          mounted && setBalance(10000);
        }
      } catch (e) {
        console.error("Load holdings error:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [uid]);

  // ------- Helpers
  const fmt = (n) =>
    typeof n === "number" && Number.isFinite(n) ? n.toLocaleString() : "-";

  // ------- Submit flow: open confirm modal instead of placing immediately
  const handleSpotSubmit = ({ side, amountInBase, pricePerUnit }) => {
    if (!uid) {
      setResultInfo({
        title: "Not logged in",
        message: "Please sign in to place spot trades.",
      });
      return;
    }
    if (!pair || !pricePerUnit || !Number.isFinite(amountInBase) || amountInBase <= 0) {
      setResultInfo({
        title: "Invalid order",
        message: "Enter a valid amount and ensure price is available.",
      });
      return;
    }
    setConfirmOrder({ side, amountInBase, pricePerUnit });
  };

  // ------- Actually place order (after confirm)
  const placeSpotOrder = async ({ side, amountInBase, pricePerUnit }) => {
    setPlacing(true);
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      const data = (snap.exists() && snap.data()) || { balance: 0, holdings: [] };
      let curBalance = Number.isFinite(data.balance) ? data.balance : 0;
      let curHoldings = Array.isArray(data.holdings) ? [...data.holdings] : [];

      const cost = amountInBase * pricePerUnit;

      if (side === "buy") {
        if (curBalance < cost - 1e-12) {
          setResultInfo({
            title: "Insufficient balance",
            message: `You need ${fmt(cost)} but you only have ${fmt(curBalance)}.`,
          });
          return;
        }
        curBalance -= cost;

        const existing = curHoldings.find((h) => h.symbol === pair);
        if (existing) {
          const prevAmount = Number(existing.amount) || 0;
          const prevAvg = Number(existing.avgBuyPrice) || pricePerUnit;
          const newAmount = prevAmount + amountInBase;
          const newAvg = (prevAmount * prevAvg + amountInBase * pricePerUnit) / newAmount;
          existing.amount = newAmount;
          existing.avgBuyPrice = newAvg;
        } else {
          curHoldings.push({
            symbol: pair,
            base: pair.replace(/USDT|BTC|BNB$/i, ""),
            amount: amountInBase,
            avgBuyPrice: pricePerUnit,
          });
        }

        await setDoc(ref, { balance: curBalance, holdings: curHoldings }, { merge: true });
        setBalance(curBalance);
        setHoldings(curHoldings);

        setResultInfo({
          title: "Buy order filled",
          message:
            amountInBase === 1
              ? `You bought 1 ${pair.replace(/USDT$/i, "")} at ${fmt(pricePerUnit)}.`
              : `You bought ${amountInBase} ${pair.replace(/USDT$/i, "")} at ${fmt(pricePerUnit)}.`,
        });
      } else if (side === "sell") {
        const existing = curHoldings.find((h) => h.symbol === pair);
        const owned = existing ? Number(existing.amount) : 0;
        if (!existing || owned < amountInBase - 1e-12) {
          setResultInfo({
            title: "Insufficient asset",
            message: existing
              ? `You have ${owned} but tried to sell ${amountInBase}.`
              : `You don't own ${pair.replace(/USDT$/i, "")} yet.`,
          });
          return;
        }

        existing.amount = owned - amountInBase;
        if (existing.amount <= 1e-12) {
          curHoldings = curHoldings.filter((h) => h.symbol !== pair);
        }

        curBalance += cost;

        await setDoc(ref, { balance: curBalance, holdings: curHoldings }, { merge: true });
        setBalance(curBalance);
        setHoldings(curHoldings);

        setResultInfo({
          title: "Sell order filled",
          message:
            amountInBase === 1
              ? `You sold 1 ${pair.replace(/USDT$/i, "")} at ${fmt(pricePerUnit)}.`
              : `You sold ${amountInBase} ${pair.replace(/USDT$/i, "")} at ${fmt(pricePerUnit)}.`,
        });
      } else {
        setResultInfo({ title: "Unknown side", message: "Use buy or sell." });
      }
    } catch (err) {
      console.error("placeSpotOrder err", err);
      setResultInfo({
        title: "Order failed",
        message: "Something went wrong while placing the order. Check console for details.",
      });
    } finally {
      setPlacing(false);
    }
  };

  // ------- Render
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
              onChange={(p) => setPair(typeof p === "string" ? p : p?.symbol || "BTCUSDT")}
            />
            <div className="ml-auto text-sm text-zinc-700 dark:text-zinc-300">
              {pair} • {interval} • Price:{" "}
              <span className="font-bold text-green-400">
                {lastPrice ? lastPrice.toLocaleString() : "—"}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-3 h-[500px] shadow-lg">
            <CandleChart
              className="w-full h-full"
              symbol={pair}
              interval={interval}
              defaultSymbol="BTCUSDT"
              defaultInterval="1m"
              limit={300}
              onError={(e) => console.error("Candle error:", e)}
              
            />
          </div>

          {/* Positions Table */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <PositionsTable
              holdings={holdings}
              priceMap={{ [pair]: lastPrice ?? null }}
            />
            <div className="text-xs text-zinc-700 dark:text-zinc-100 mt-2">
              Balance: <span className="font-medium">{fmt(balance)} USDT</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 self-start">
          {/* Order Book */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-zinc-700 dark:text-white">Order Book</h4>
              <span className="text-xs text-gray-400">Live</span>
            </div>
            <OrderBook pair={pair} depth={20} />
          </div>

          {/* Trade Form */}
          <div className="bg-card-light dark:bg-zinc-900 rounded-lg p-4 shadow-lg">
            <TradeForm
              pair={pair}
              price={lastPrice}
              onSubmit={handleSpotSubmit}
              placing={placing}
              mode="spot"
            />
          </div>

          <p className="text-xs text-gray-500">
            Spot trades are simulated and stored in Firestore <code>users/{uid || "guest"}</code>.
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
              if (payload) await placeSpotOrder(payload);
            },
          },
        ]}
      >
        {confirmOrder ? (
          <div className="space-y-1">
            <div>
              Action: <span className="font-semibold">{confirmOrder.side.toUpperCase()}</span>
            </div>
            <div>
              Pair: <span className="font-semibold">{pair}</span>
            </div>
            <div>
              Amount: <span className="font-semibold">{confirmOrder.amountInBase}</span>
            </div>
            <div>
              Price: <span className="font-semibold">{fmt(confirmOrder.pricePerUnit)}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              This is a simulated spot order. Your balance and holdings will update immediately.
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Result Modal */}
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
      >
        <div>{resultInfo?.message}</div>
      </Modal>
    </section>
  );
}
