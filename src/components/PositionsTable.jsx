import React from "react";

/**
 * Generic positions/holdings table.
 * - For spot: pass holdings = [{ symbol, amount, avgBuyPrice }]
 * - For futures: pass positions with pnl fields: { id, pair, side, entryPrice, size, leverage, pnl, notional, marginUsed }
 */
export default function PositionsTable({
  holdings = [],
  priceMap = {},
  isFutures = false,
  onClose,
}) {
  if (!isFutures) {
    return (
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded text-zinc-800 dark:text-white">
        {/* <h5 className="font-semibold mb-2 ps-4 pt-2">Spot Holdings</h5> */}
        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          {holdings.length === 0 ? (
            <div>No spot holdings</div>
          ) : (
            <table className="min-w-max w-full">
              <thead className="text-zinc-900 dark:text-white bg-zinc-300 dark:bg-zinc-800 h-8 rounded">
                <tr className="">
                  <th>Pair</th>
                  <th>Amount</th>
                  <th>Avg Price</th>
                  <th>Value</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const price = priceMap[h.symbol] ?? 0;
                  const value = (h.amount || 0) * price;
                  const avg = h.avgBuyPrice ?? 0;
                  const pl = (price - avg) * (h.amount || 0);
                  return (
                    <tr key={h.symbol} className="border-t border-zinc-200  dark:border-zinc-800">
                      <td className="py-2">{h.symbol}</td>
                      <td className="py-2">{h.amount}</td>
                      <td className="py-2">
                        {avg ? avg.toLocaleString() : "-"}
                      </td>
                      <td className="py-2">
                        {price ? value.toLocaleString() : "-"}
                      </td>
                      <td
                        className={`py-2 ${
                          pl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {pl ? pl.toFixed(2) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // Futures positions
  return (
    <div className="bg-zinc-900 rounded p-3">
      <h5 className="font-semibold mb-2">Futures Positions</h5>
      {holdings.length === 0 ? (
        <div className="text-gray-400">No open positions</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th>Pair</th>
              <th>Side</th>
              <th>Size</th>
              <th>Entry</th>
              <th>Leverage</th>
              <th>Margin</th>
              <th>PnL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((p) => (
              <tr key={p.id} className="border-t border-zinc-800">
                <td className="py-2">{p.pair}</td>
                <td className="py-2">{p.side}</td>
                <td className="py-2">{p.size}</td>
                <td className="py-2">{p.entryPrice.toLocaleString()}</td>
                <td className="py-2">{p.leverage}x</td>
                <td className="py-2">
                  {p.marginUsed ? p.marginUsed.toLocaleString() : "-"}
                </td>
                <td
                  className={`py-2 ${
                    p.pnl >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {p.pnl ? p.pnl.toFixed(2) : "-"}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => onClose && onClose(p)}
                    className="px-2 py-1 rounded bg-yellow-500 text-black text-xs"
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
