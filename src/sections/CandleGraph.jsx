// sections/CandleGraph/index.jsx
// import { useEffect, useMemo, useRef, useState } from "react";

// /**
//  * Lightweight, dependency-free candlestick renderer using <canvas>.
//  * - Fetches Binance REST klines (limit=300 by default)
//  * - Subscribes to Binance WS for live updates
//  * - Resizes with parent (ResizeObserver)
//  *
//  * Props:
//  *  - className?: string
//  *  - symbol?: string (controlled)  e.g. "BTCUSDT"
//  *  - interval?: string (controlled) e.g. "1m"
//  *  - defaultSymbol?: string        (if not controlled)
//  *  - defaultInterval?: string      (if not controlled)
//  *  - limit?: number (300 default)
//  *  - onError?: (err: Error) => void
//  *
//  * Styling:
//  *  - Give the parent a fixed height (e.g. h-[500px]) and pass `className="h-full w-full"`
//  */

// const BINANCE_REST_BASE = "https://api.binance.com/api/v3/klines";
// const BINANCE_WS_BASE = "wss://stream.binance.com:9443/ws";

// function kToPoint(k) {
//   // k: [openTime, open, high, low, close, ...]
//   return {
//     t: Number(k[0]),
//     o: Number(k[1]),
//     h: Number(k[2]),
//     l: Number(k[3]),
//     c: Number(k[4]),
//   };
// }

// function wsKToPoint(k) {
//   // k: { t, o, h, l, c, x: isFinal }
//   return {
//     t: Number(k.t),
//     o: Number(k.o),
//     h: Number(k.h),
//     l: Number(k.l),
//     c: Number(k.c),
//     isFinal: !!k.x,
//   };
// }

// export default function CandleChart({
//   className = "",
//   symbol: controlledSymbol,
//   interval: controlledInterval,
//   defaultSymbol = "BTCUSDT",
//   defaultInterval = "1m",
//   limit = 300,
//   onError,
// }) {
//   const [symbol, setSymbol] = useState(controlledSymbol || defaultSymbol);
//   const [interval, setInterval] = useState(controlledInterval || defaultInterval);

//   // keep internal in sync if controlled props change
//   useEffect(() => {
//     if (controlledSymbol) setSymbol(controlledSymbol);
//   }, [controlledSymbol]);
//   useEffect(() => {
//     if (controlledInterval) setInterval(controlledInterval);
//   }, [controlledInterval]);

//   const [data, setData] = useState([]);           // array of {t,o,h,l,c}
//   const [loading, setLoading] = useState(true);
//   const [errMsg, setErrMsg] = useState("");

//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);
//   const wsRef = useRef(null);
//   const rafRef = useRef(null);
//   const roRef = useRef(null);

//   // -------- Fetch history
//   useEffect(() => {
//     let cancelled = false;
//     const ctrl = new AbortController();

//     async function fetchHistory() {
//       setLoading(true);
//       setErrMsg("");
//       try {
//         const q = `?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(
//           interval
//         )}&limit=${limit}`;
//         const res = await fetch(`${BINANCE_REST_BASE}${q}`, { signal: ctrl.signal });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const raw = await res.json();
//         if (!Array.isArray(raw)) throw new Error("Unexpected klines payload");
//         const formatted = raw.map(kToPoint);
//         if (!cancelled) setData(formatted);
//       } catch (e) {
//         if (!cancelled) {
//           console.error("Candle history error:", e);
//           setErrMsg("Failed to load candles.");
//           onError && onError(e);
//         }
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     fetchHistory();

//     return () => {
//       cancelled = true;
//       ctrl.abort();
//     };
//   }, [symbol, interval, limit, onError]);

//   // -------- Live WS
//   useEffect(() => {
//     // close previous
//     try {
//       wsRef.current && wsRef.current.close();
//     } catch {}
//     wsRef.current = null;

//     const stream = `${symbol.toLowerCase()}@kline_${interval}`;
//     const ws = new WebSocket(`${BINANCE_WS_BASE}/${stream}`);
//     wsRef.current = ws;

//     ws.onmessage = (evt) => {
//       try {
//         const payload = JSON.parse(evt.data);
//         const k = payload?.k;
//         if (!k) return;
//         const pt = wsKToPoint(k);

//         setData((prev) => {
//           if (!prev || prev.length === 0) return [pt];
//           const next = prev.slice();
//           const last = next[next.length - 1];

//           // If same candle (same open time), update
//           if (last && last.t === pt.t) {
//             next[next.length - 1] = pt;
//           } else if (pt.isFinal || pt.t > last.t) {
//             // closed candle or new interval tick
//             next.push(pt);
//             if (next.length > 1500) next.splice(0, next.length - 1500);
//           }
//           return next;
//         });
//       } catch (e) {
//         console.error("WS parse error:", e);
//       }
//     };

//     ws.onerror = (e) => {
//       console.error("WS error", e);
//     };

//     return () => {
//       try {
//         ws.close();
//       } catch {}
//     };
//   }, [symbol, interval]);

//   // -------- Drawing (very simple canvas candlesticks)
//   const draw = useMemo(() => {
//     return (ctx, width, height, candles) => {
//       ctx.clearRect(0, 0, width, height);
//       if (!candles || candles.length === 0) return;

//       // padding
//       const padL = 50, padR = 20, padT = 20, padB = 20;
//       const W = width - padL - padR;
//       const H = height - padT - padB;

//       // find min/max
//       let min = Infinity, max = -Infinity;
//       for (const c of candles) {
//         if (!Number.isFinite(c.l) || !Number.isFinite(c.h)) continue;
//         if (c.l < min) min = c.l;
//         if (c.h > max) max = c.h;
//       }
//       if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return;
//       const yScale = (v) => padT + (max - v) * (H / (max - min));

//       // x scale
//       const n = candles.length;
//       const colW = Math.max(2, Math.min(18, Math.floor(W / n)));
//       const step = Math.max(colW + 2, Math.floor(W / n));

//       // axes
//       ctx.fillStyle = "#9aa4b2";
//       ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
//       // price ticks
//       const ticks = 5;
//       for (let i = 0; i <= ticks; i++) {
//         const v = min + ((max - min) * i) / ticks;
//         const y = yScale(v);
//         ctx.globalAlpha = 0.2;
//         ctx.beginPath();
//         ctx.moveTo(padL, y);
//         ctx.lineTo(width - padR, y);
//         ctx.strokeStyle = "#2c2c2c";
//         ctx.stroke();
//         ctx.globalAlpha = 1;
//         ctx.fillText(v.toFixed(2), 5, y + 3);
//       }

//       // candles
//       for (let i = Math.max(0, n - Math.floor(W / step) - 2), xIndex = 0; i < n; i++, xIndex++) {
//         const c = candles[i];
//         const xCenter = padL + xIndex * step + Math.floor(step / 2);
//         const yO = yScale(c.o), yC = yScale(c.c), yH = yScale(c.h), yL = yScale(c.l);
//         const up = c.c >= c.o;

//         // wick
//         ctx.beginPath();
//         ctx.moveTo(xCenter, yH);
//         ctx.lineTo(xCenter, yL);
//         ctx.strokeStyle = up ? "#26a69a" : "#ef5350";
//         ctx.stroke();

//         // body
//         const bodyTop = Math.min(yO, yC);
//         const bodyH = Math.max(1, Math.abs(yO - yC));
//         ctx.fillStyle = up ? "#26a69a" : "#ef5350";
//         ctx.fillRect(xCenter - Math.floor(colW / 2), bodyTop, colW, bodyH);
//       }
//     };
//   }, []);

//   // -------- Resize + paint
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const container = containerRef.current;
//     if (!canvas || !container) return;

//     const ctx = canvas.getContext("2d");

//     function paint() {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = requestAnimationFrame(() => {
//         const { clientWidth, clientHeight } = container;
//         if (clientWidth <= 0 || clientHeight <= 0) return;

//         // set canvas size (devicePixelRatio)
//         const dpr = window.devicePixelRatio || 1;
//         canvas.width = Math.floor(clientWidth * dpr);
//         canvas.height = Math.floor(clientHeight * dpr);
//         canvas.style.width = `${clientWidth}px`;
//         canvas.style.height = `${clientHeight}px`;
//         ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

//         draw(ctx, clientWidth, clientHeight, data);
//       });
//     }

//     paint();
//     roRef.current = new ResizeObserver(paint);
//     roRef.current.observe(container);

//     return () => {
//       cancelAnimationFrame(rafRef.current);
//       try { roRef.current && roRef.current.disconnect(); } catch {}
//     };
//   }, [data, draw]);

//   return (
//     <div ref={containerRef} className={`relative${className}`}>
//       {/* Header / state */}
//       <div className="absolute left-2 top-2 z-10 px-2 py-1 rounded  text-xs text-gray-300">
//         {symbol} • {interval} • {data.length} candles {loading ? "• Loading…" : ""}
//         {errMsg ? <span className="text-red-400 ml-2">({errMsg})</span> : null}
//       </div>

//       {/* Canvas chart */}
//       <canvas ref={canvasRef} className="block w-full h-full rounded-lg p-6" />

//       {/* Empty state */}
//       {!loading && data.length === 0 && (
//         <div className="absolute inset-0 grid place-items-center text-gray-400 text-sm">
//           No data
//         </div>
//       )}
//     </div>
//   );
// }





// ts/CandleGraph/CandleGraph.jsx
import React, { useState } from "react";
import GraphCard from "../components/GraphCard";
import useBinanceCandles from "../hooks/useBinanceCandles";
import { chartOptions, INTERVALS, POPULAR_SYMBOLS } from "../constants/candleGraph";

const CandleGraph = ({ 
  className = "", 
  defaultSymbol = "BTCUSDT", 
  defaultInterval = "1m",
  height = 500,  // ✅ make it configurable
  width = "100%" // ✅ allow responsive width
}) => {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [interval, setInterval] = useState(defaultInterval);

  const { series, isLoading, error, refresh } = useBinanceCandles(symbol, interval);

  return (
    <section className={`p-4 relative rounded-xl ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-white font-semibold text-lg">Live Market</h2>

          {/* Symbol dropdown */}
          <select
            className="bg-zinc-800 border border-zinc-600 text-gray-200 rounded px-2 py-1"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {POPULAR_SYMBOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Interval dropdown */}
          <select
            className="bg-zinc-800 border border-zinc-600 text-gray-200 rounded px-2 py-1"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            {INTERVALS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>

          {/* Manual Refresh */}
          <button
            onClick={refresh}
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Refresh
          </button>
        </div>

        <div className="text-sm text-gray-300">
          {symbol} • {interval} • {series[0]?.data?.length ?? 0} candles
        </div>
      </div>

      {error && <div className="text-red-400 mb-3">⚠️ {error.message}</div>}

      {isLoading ? (
        <div className="text-gray-400">Loading chart...</div>
      ) : (
        <GraphCard
          title={`${symbol} • ${interval}`}
          series={series}
          options={chartOptions}
          height={height}   // ✅ use prop
          width={width}     // ✅ use prop
        />
      )}
    </section>
  );
};

export default CandleGraph;