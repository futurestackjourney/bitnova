import React from "react";

export default function MarketSelector({ pairs = [], value, onChange }) {
  return (
    <select
      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-black dark:text-white rounded px-2 py-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {pairs.map((p, index) => {
        // If p is an object, pick a unique property for key & value
        const symbol = typeof p === "string" ? p : p.symbol || `pair-${index}`;
        return (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        );
      })}
    </select>
  );
}
