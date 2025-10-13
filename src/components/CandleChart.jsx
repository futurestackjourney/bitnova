import React from "react";
import Chart from "react-apexcharts";

export default function CandleChart({ data, height = "100%" }) {
  const series = [{ data }];
  const options = {
    chart: { type: "candlestick", background: "transparent", height },
    plotOptions: {
      candlestick: { colors: { upward: "#26a69a", downward: "#ef5350" } }
    },
    xaxis: { type: "datetime" },
    yaxis: { decimalsInFloat: 2 },
    theme: { mode: "dark" }
  };

  return <Chart options={options} series={series} type="candlestick" height={height} />;
}

// src/components/CandleChart.jsx
// import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import axios from "axios";

// export default function CandleChart({ symbol = "BTCUSDT" }) {
//   const [series, setSeries] = useState([]);
//   const [options, setOptions] = useState({
//     chart: {
//       type: "candlestick",
//       height: 400,
//       id: "candles",
//       toolbar: { show: true },
//       animations: { enabled: true },
//     },
//     xaxis: {
//       type: "datetime",
//     },
//     yaxis: {
//       tooltip: { enabled: true },
//     },
//   });

//   // fetch candle data (Binance API)
//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=50`
//       );
//       const formatted = res.data.map((d) => {
//         return {
//           x: new Date(d[0]),
//           y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])],
//         };
//       });
//       setSeries([{ data: formatted }]);
//     } catch (err) {
//       console.error("Error fetching candle data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 5000); // refresh every 5s
//     return () => clearInterval(interval);
//   }, [symbol]);

//   return (
//     <div className="bg-slate-900 p-4 rounded-2xl shadow-md">
//       <h2 className="text-white text-lg mb-2">{symbol} Chart</h2>
//       <Chart options={options} series={series} type="candlestick" height={400} />
//     </div>
//   );
// }
