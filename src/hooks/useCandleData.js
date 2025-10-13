import { useEffect, useState, useRef } from "react";

const BINANCE_REST_BASE = "https://api.binance.com/api/v3/klines";
const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";

export default function useCandleData(symbol = "BTCUSDT", interval = "1m", limit = 200) {
  const [data, setData] = useState([]);
  const wsRef = useRef(null);

  // Convert API format to chart format
  const restToApex = (k) => ({
    x: new Date(k[0]),
    y: [parseFloat(k[1]), parseFloat(k[2]), parseFloat(k[3]), parseFloat(k[4])]
  });

  const wsToApex = (k) => ({
    x: new Date(k.t),
    y: [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)]
  });

  // Initial REST load
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const q = `?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const res = await fetch(`${BINANCE_REST_BASE}${q}`);
        const raw = await res.json();
        if (!abort) setData(raw.map(restToApex));
      } catch (err) {
        if (!abort) console.error(err);
      }
    })();
    return () => { abort = true; };
  }, [symbol, interval, limit]);

  // Live WebSocket
  useEffect(() => {
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket(`${BINANCE_WS_BASE}/${symbol.toLowerCase()}@kline_${interval}`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const { k } = JSON.parse(e.data);
      setData((prev) => {
        const updated = [...prev];
        const point = wsToApex(k);
        if (k.x) updated.push(point);
        else updated[updated.length - 1] = point;
        return updated.slice(-1500);
      });
    };

    return () => ws.close();
  }, [symbol, interval]);

  return data;
}
