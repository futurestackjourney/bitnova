// src/components/CandleGraph/useBinanceCandles.js
import { useEffect, useState, useRef } from "react";

const BINANCE_REST_BASE = "https://api.binance.com/api/v3/klines";
const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";
const LIMIT = 120; //CANDLE LIMIT

const klineToApex = (k) => ({
  x: new Date(k[0]),
  y: [parseFloat(k[1]), parseFloat(k[2]), parseFloat(k[3]), parseFloat(k[4])],
});

const wsKlineToApex = (k) => ({
  x: new Date(k.t),
  y: [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)],
});

export default function useBinanceCandles(symbol, interval) {
  const [series, setSeries] = useState([{ data: [] }]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  // Fetch REST history
  const fetchCandles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BINANCE_REST_BASE}?symbol=${symbol}&interval=${interval}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("Failed to fetch candles");
      const data = await res.json();
      setSeries([{ data: data.map(klineToApex) }]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh handler for UI
  const refresh = () => fetchCandles();

  useEffect(() => {
    fetchCandles();
  }, [symbol, interval]);

  // WebSocket live updates
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `${BINANCE_WS_BASE}/${symbol.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (!payload.k) return;
        const k = payload.k;
        const point = wsKlineToApex(k);

        setSeries((prev) => {
          const copy = prev[0] ? [...prev[0].data] : [];
          const isFinal = !!k.x;

          if (!isFinal) {
            copy[copy.length - 1] = point;
          } else {
            copy.push(point);
            if (copy.length > 1000) copy.splice(0, copy.length - 1000);
          }

          return [{ data: copy }];
        });
      } catch (err) {
        setError(err);
      }
    };

    ws.onerror = (err) => setError(new Error("WebSocket error"));

    return () => ws.close();
  }, [symbol, interval]);

  return { series, isLoading, error, refresh };
}
