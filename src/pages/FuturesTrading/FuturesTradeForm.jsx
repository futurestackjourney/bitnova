// Description: Form for Long/Short with leverage, quantity in base units
// Shows required margin, est. liq price, and max size by current balance
// ================================================
import React, { useMemo, useState } from "react";

const fmtDP = (n, dp = 4) => (Number.isFinite(n) ? Number(n).toFixed(dp) : "-");

export default function FuturesTradeForm({ pair, markPrice, balance, placing, onSubmit }) {
  const [side, setSide] = useState("long"); // long | short
  const [qty, setQty] = useState(0);
  const [leverage, setLeverage] = useState(10);

  const price = markPrice || 0;
  const notional = price * qty;
  const requiredMargin = leverage > 0 ? notional / leverage : 0;

  // Max qty we can open with current balance & leverage
  const maxQty = useMemo(() => {
    if (!price || !leverage) return 0;
    return balance * leverage / price;
  }, [balance, leverage, price]);

  const disabled = placing || !price || qty <= 0 || leverage < 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-lg text-[16px] font-semibold transition ${side === "long" ? "bg-emerald-600" : "bg-zinc-400 dark:bg-zinc-800"}`}
          onClick={() => setSide("long")}
          disabled={placing}
        >
          Long
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-[16px] font-semibold transition ${side === "short" ? "bg-rose-600" : "bg-zinc-400 dark:bg-zinc-800"}`}
          onClick={() => setSide("short")}
          disabled={placing}
        >
          Short
        </button>
        <div className="ml-auto text-xs text-zinc-400">{pair}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Quantity (base)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
            placeholder="e.g. 0.01"
          />
          <div className="flex items-center gap-2 mt-2">
            {[0.25, 0.5, 1].map((p) => (
              <button
                key={p}
                className="text-xs bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded px-2 py-1"
                onClick={() => setQty(parseFloat((maxQty * p).toFixed(6)))}
                type="button"
              >
                {Math.round(p * 100)}%
              </button>
            ))}
            <button
              className="text-xs bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded px-2 py-1"
              onClick={() => setQty(parseFloat(maxQty.toFixed(6)))}
              type="button"
            >
              Max
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Leverage</label>
          <input
            type="number"
            min="1"
            max="125"
            step="1"
            value={leverage}
            onChange={(e) => setLeverage(Math.max(1, Math.min(125, parseInt(e.target.value) || 1)))}
            className="w-full rounded-lg bg-zinc-300 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
          />
          <div className="text-xs text-gray-500 mt-2">Mark: {fmtDP(price, 2)} • Notional: {fmtDP(notional, 2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
        <div>Req. Margin: <span className="text-black dark:text-white font-medium">{fmtDP(requiredMargin, 2)} USDT</span></div>
        <div>Balance: <span className="text-black dark:text-white font-medium">{fmtDP(balance, 2)} USDT</span></div>
      </div>

      <button
        disabled={disabled}
        onClick={() => onSubmit({ side, qty, leverage, pricePerUnit: price })}
        className="w-full mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placing ? "Placing…" : side === "long" ? "Open Long" : "Open Short"}
      </button>

      <p className="text-[11px] text-gray-500">
        * Isolated mode. This simulator ignores fees & funding for simplicity.
      </p>
    </div>
  );
}