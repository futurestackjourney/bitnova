import React, { useEffect, useMemo, useState } from "react";

/**
 * Props:
 *  - pair, price (mark), onSubmit (for spot) or onSubmitFutures
 *  - mode: "spot" | "futures"
 *  - placing: boolean
 *  - defaultLeverage: number
 */
export default function TradeForm({ pair, price, onSubmit, onSubmitFutures, placing, mode = "spot", defaultLeverage = 10 }) {
  const [side, setSide] = useState("buy"); // buy/sell for spot, long/short for futures
  const [amount, setAmount] = useState("");
  const [useNotional, setUseNotional] = useState(false); // amount as base units or notional
  const [leverage, setLeverage] = useState(defaultLeverage);

  useEffect(() => {
    // keep amount sensible when price changes if using notional
    if (useNotional && price) {
      // no-op
    }
  }, [price]);

  const submit = async (e) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || !price) return alert("Enter amount and ensure price is available.");
    if (mode === "spot") {
      const amountInBase = useNotional ? parsed / price : parsed;
      if (onSubmit) onSubmit({ side, amountInBase, pricePerUnit: price });
    } else {
      // futures: treat `amount` as base units (size). user chooses leverage separately.
      const size = parsed;
      if (onSubmitFutures) onSubmitFutures({ side: side === "buy" ? "long" : "short", size, entryPrice: price, leverage });
    }
  };

  return (
    <form onSubmit={submit} className="bg-zinc-100 dark:bg-zinc-800 rounded p-3">
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setSide(mode === "spot" ? "buy" : "buy")} className={`flex-1 py-2 rounded  ${side === "buy" ? "bg-green-500" : "bg-zinc-400 dark:bg-zinc-700"}`}>Buy/Long</button>
        <button type="button" onClick={() => setSide(mode === "spot" ? "sell" : "sell")} className={`flex-1 py-2 rounded  ${side === "sell" ? "bg-red-500" : "bg-zinc-400 dark:bg-zinc-700"}`}>Sell/Short</button>
      </div>

      <div className="mb-2 text-sm text-zinc-500">Price: {price ? Number(price).toLocaleString() : "—"}</div>

      <div className="mb-2">
        <label className="text-xs text-zinc-500">Amount {useNotional ? "(notional)" : "(base units)"}</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={useNotional ? "USDT notional e.g. 100" : "Amount in base e.g. 0.001"}
          className="w-full bg-zinc-300 dark:bg-zinc-900 text-zinc-700 dark:text-white p-2 rounded mt-1"
        />
      </div>

      <div className="flex items-center gap-2 text-sm mb-2">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={useNotional} onChange={() => setUseNotional((s) => !s)} />
          <span className="text-gray-400">Use notional (quote)</span>
        </label>
      </div>

      {mode === "futures" && (
        <div className="mb-2">
          <label className="text-xs text-gray-400">Leverage: {leverage}x</label>
          <input
            type="range"
            min="1"
            max="50"
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <button type="submit" disabled={placing} className="w-full py-2 rounded bg-yellow-500 text-black font-semibold">
        {placing ? "Placing..." : mode === "spot" ? `${side.toUpperCase()} (Spot)` : `${side.toUpperCase()} ${mode === "futures" ? "(Futures)" : ""}`}
      </button>
    </form>
  );
}
