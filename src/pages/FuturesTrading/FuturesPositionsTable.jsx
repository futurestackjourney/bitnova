// Description: Shows open positions, unrealized PnL, est. liq price, close shortcuts
// ================================================
import React from "react";

const cell = "px-3 py-2 text-sm";

export default function FuturesPositionsTable({ positions, onClosePct }) {
  return (
    <div>
      <div className="overflow-auto rounded-lg border border-zinc-300 dark:border-zinc-800">
        <table className="min-w-max w-full">
          <thead className="text-zinc-900 dark:text-white bg-zinc-300 dark:bg-zinc-800">
            <tr>
              <th className={`${cell} text-left`}>Symbol</th>
              <th className={`${cell} text-left`}>Side</th>
              <th className={`${cell} text-right`}>Qty</th>
              <th className={`${cell} text-right`}>Entry</th>
              <th className={`${cell} text-right`}>Mark</th>
              <th className={`${cell} text-right`}>Notional</th>
              <th className={`${cell} text-right`}>uPnL (USDT)</th>
              <th className={`${cell} text-right`}>Lev</th>
              <th className={`${cell} text-right`}>Est. Liq</th>
              <th className={`${cell} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td className="text-center text-sm text-zinc-500 py-6" colSpan={10}>
                  No open positions yet.
                </td>
              </tr>
            ) : (
              positions.map((p) => {
                const up = Number(p.upnl || 0);
                const upClass = up > 0 ? "text-emerald-400" : up < 0 ? "text-rose-400" : "text-gray-300";
                return (
                  <tr key={p.id} className="border-t border-zinc-300 dark:border-zinc-800 text-black dark:text-white">
                    <td className={`${cell}`}>{p.symbol}</td>
                    <td className={`${cell} capitalize`}>{p.side}</td>
                    <td className={`${cell} text-right`}>{Number(p.qty).toLocaleString()}</td>
                    <td className={`${cell} text-right`}>{Number(p.entryPrice).toLocaleString()}</td>
                    <td className={`${cell} text-right`}>{p.markPrice ? Number(p.markPrice).toLocaleString() : "—"}</td>
                    <td className={`${cell} text-right`}>{Number(p.notional).toLocaleString()}</td>
                    <td className={`${cell} text-right ${upClass}`}>{up.toLocaleString()}</td>
                    <td className={`${cell} text-right`}>{Number(p.leverage).toFixed(2)}x</td>
                    <td className={`${cell} text-right`}>{p.liqPrice ? Number(p.liqPrice).toLocaleString() : "—"}</td>
                    <td className={`${cell} text-right`}> 
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-xs bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 rounded px-2 py-1"
                          onClick={() => onClosePct(p, 0.25)}
                        >
                          Close 25%
                        </button>
                        <button
                          className="text-xs bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 rounded px-2 py-1"
                          onClick={() => onClosePct(p, 0.5)}
                        >
                          50%
                        </button>
                        <button
                          className="text-xs bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 rounded px-2 py-1"
                          onClick={() => onClosePct(p, 1)}
                        >
                          100%
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
