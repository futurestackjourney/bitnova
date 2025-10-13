// src/components/CandleGraph/config.js
export const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"];

export const POPULAR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "SOLUSDT",
  "DOTUSDT",
  "LTCUSDT",
];

export const chartOptions = {
  chart: {
    type: "candlestick",
    background: "transparent",
    toolbar: { show: true },
    animations: { enabled: true, speed: 400 },
  },
  plotOptions: {
    candlestick: {
      colors: { upward: "#26a69a", downward: "#ef5350" },
      wick: { useFillColor: true },
    },
  },
  tooltip: { enabled: true, theme: "dark" },
  xaxis: { type: "datetime" },
  yaxis: { decimalsInFloat: 2 },
  grid: { borderColor: "#2c2c2c", strokeDashArray: 2 },
  theme: { mode: "dark" },
};
