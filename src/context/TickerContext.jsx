// context/TickerContext.jsx
import { createContext, useContext } from "react";
import useBinanceTicker from "../hooks/useBinanceTicker";

const TickerContext = createContext(null);

export function TickerProvider({ symbol = "BTCUSDT", isFutures = false, children }) {
  const ticker = useBinanceTicker(symbol, isFutures);
  return <TickerContext.Provider value={ticker}>{children}</TickerContext.Provider>;
}

export function useTicker() {
  return useContext(TickerContext);
}
