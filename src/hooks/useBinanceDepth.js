import { useEffect, useState, useRef } from "react";

export default function useBinanceDepth(symbol = "BTCUSDT", isFutures = false) {
  const [depth, setDepth] = useState({ bids: [], asks: [] });
  const wsRef = useRef(null);

  useEffect(() => {
    if (!symbol) return;

    const baseUrl = isFutures
      ? "wss://fstream.binance.com/ws"
      : "wss://stream.binance.com:9443/ws";

    const streamName = `${symbol.toLowerCase()}@depth20@100ms`;
    const wsUrl = `${baseUrl}/${streamName}`;

    // Close any old socket before opening a new one
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to Binance depth for ${symbol}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Ensure we have both bids and asks
        if (Array.isArray(data.bids) && Array.isArray(data.asks)) {
          setDepth({
            bids: data.bids
              .map(([price, qty]) => ({ price: parseFloat(price), qty: parseFloat(qty) }))
              .filter((o) => o.qty > 0)
              .sort((a, b) => b.price - a.price), // high to low
            asks: data.asks
              .map(([price, qty]) => ({ price: parseFloat(price), qty: parseFloat(qty) }))
              .filter((o) => o.qty > 0)
              .sort((a, b) => a.price - b.price), // low to high
          });
        }
      } catch (err) {
        console.error("Error parsing depth data:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("Binance depth WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log(`Disconnected from Binance depth for ${symbol}`);
    };

    return () => {
      ws.close();
    };
  }, [symbol, isFutures]);

  return depth;
}
