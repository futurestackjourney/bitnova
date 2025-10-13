import React from "react";
import useBinanceDepth from "../hooks/useBinanceDepth";

export default function OrderBook({ pair = "BTCUSDT", depth = 20, futures = false }) {
  // Ensure we always have a valid lowercase symbol for Binance API
  const streamPair = pair?.toLowerCase() || "btcusdt";

  // Custom hook should return { bids: [], asks: [] }
  const { bids = [], asks = [] } = useBinanceDepth(streamPair, { depth, futures });

  return (
    <div className="text-xs text-zinc-600 dark:text-zinc-200">
      {/* Header row */}
      <div className="grid grid-cols-3 gap-2 mb-1">
        <div className="text-left text-zinc-700 dark:text-zinc-300">Price</div>
        <div className="text-right text-zinc-700 dark:text-zinc-300">Amount</div>
        <div className="text-right text-zinc-700 dark:text-zinc-300">Total</div>
      </div>

      <div className="max-h-40 overflow-y-auto">
        {/* Asks (sell orders) - descending */}
        {asks.slice(0, depth).map(([price, qty], i) => (
          <div key={`ask-${i}`} className="grid grid-cols-3 py-0.5">
            <div className="text-left text-red-400">{Number(price).toLocaleString()}</div>
            <div className="text-right text-gray-300">{Number(qty)}</div>
            <div className="text-right text-gray-500">
              {(Number(price) * Number(qty)).toLocaleString()}
            </div>
          </div>
        ))}

        {/* Separator */}
        <div className="border-t border-zinc-300 dark:border-zinc-700 my-1" />

        {/* Bids (buy orders) - ascending */}
        {bids.slice(0, depth).map(([price, qty], i) => (
          <div key={`bid-${i}`} className="grid grid-cols-3 py-0.5">
            <div className="text-left text-green-400">{Number(price).toLocaleString()}</div>
            <div className="text-right text-gray-300">{Number(qty)}</div>
            <div className="text-right text-gray-500">
              {(Number(price) * Number(qty)).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
