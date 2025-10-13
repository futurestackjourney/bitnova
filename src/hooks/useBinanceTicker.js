// hooks/useBinanceTicker.js
import { useEffect, useRef, useState } from "react";

/**
 * pairs: array of strings like ["btcusdt","ethusdt","bnbusdt"] (lowercase)
 * options: { batchSize } (how many pairs per websocket stream — default 50)
 *
 * returns: { tickersMap } where tickersMap.get("btcusdt") => { c: "price", P: "24h change", ... }
 */
export default function useBinanceTicker(pairs = [], options = {}) {
  const { batchSize = 50 } = options;
  const [tickersMap, setTickersMap] = useState(new Map());
  const socketsRef = useRef([]);

  useEffect(() => {
    // Cleanup existing sockets
    socketsRef.current.forEach(s => s && s.close());
    socketsRef.current = [];

    if (!pairs || pairs.length === 0) return;

    // chunk pairs into batches to avoid super long URLs
    const chunk = (arr, size) => {
      const res = [];
      for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
      return res;
    };

    const batches = chunk([...new Set(pairs)], batchSize);
    const map = new Map(); // local map which we'll seed with previous state if present

    // optional: copy previous known prices to keep UI from flicker
    setTickersMap(prev => {
      prev.forEach((v, k) => map.set(k, v));
      return new Map(map);
    });

    batches.forEach((batch) => {
      const streams = batch.map(p => `${p}@ticker`).join("/");
      const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        // console.debug("WS open", url);
      };

      ws.onmessage = (msg) => {
        try {
          const payload = JSON.parse(msg.data);
          // Combined stream payload: { stream: "...", data: {...} }
          const data = payload.data;
          if (!data || !data.s) return;

          const symbol = data.s.toLowerCase(); // e.g., 'BTCUSDT' -> 'btcusdt'
          // store a simplified ticker object
          const ticker = {
            symbol,
            price: data.c, // lastPrice
            priceChangePercent: data.P,
            highPrice: data.h,
            lowPrice: data.l,
            volume: data.v,
            eventTime: data.E,
          };

          // update map in state (functional update recommended)
          setTickersMap(prev => {
            const next = new Map(prev);
            next.set(symbol, ticker);
            return next;
          });
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onerror = (e) => {
        console.error("WS error", e);
      };

      ws.onclose = () => {
        // console.debug("WS closed", url);
      };

      socketsRef.current.push(ws);
    });

    // cleanup on unmount or pairs change
    return () => {
      socketsRef.current.forEach(s => s && s.close());
      socketsRef.current = [];
    };
  }, [pairs.join(","), batchSize]); // re-run when pairs change

  return { tickersMap };
}
