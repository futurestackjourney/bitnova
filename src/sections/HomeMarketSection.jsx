import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphCard from "../components/GraphCard";
import useBinanceTicker from "../hooks/useBinanceTicker";

// 👉 You can edit this list later
const FEATURED_COINS = [
  "bitcoin",
  "ethereum",
  "bnb",
  "solana",
  "xrp",
  "dogecoin",
  "cardano",
  "polkadot",
  "tron",
  "polygon",
];

function toBinancePair(symbol) {
  return symbol.toUpperCase() + "USDT"; // Binance expects uppercase
}

export default function HomeMarketSection() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");

  // candles for chart
  const [candles, setCandles] = useState([]);

  // Fetch coin data for FEATURED_COINS
  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${FEATURED_COINS.join(
        ","
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured coins:", err);
        setLoading(false);
      });
  }, []);

  // Subscribe to Binance WS for live tickers
  const pairs = useMemo(
    () => coins.map((c) => toBinancePair(c.symbol)).filter(Boolean),
    [coins]
  );
  const { tickersMap } = useBinanceTicker(pairs, { batchSize: 20 });

  // Fetch OHLC candles whenever selectedPair changes
  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${selectedPair}&interval=1h&limit=100`
        );
        const data = await res.json();
        // transform for ApexCharts candlestick
        const formatted = data.map((d) => ({
          x: new Date(d[0]),
          y: [
            parseFloat(d[1]),
            parseFloat(d[2]),
            parseFloat(d[3]),
            parseFloat(d[4]),
          ],
        }));
        setCandles(formatted);
      } catch (err) {
        console.error("Error fetching candles:", err);
      }
    }
    fetchCandles();
  }, [selectedPair]);

  return (
    <section className="min-h-[600px] px-4 md:px-10 py-16" >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card: Featured Coins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex-1 bg-card-light dark:bg-card rounded-xl p-4 overflow-x-auto shadow-md"
        >
          <h3 className="text-xl font-semibold text-zinc-700 dark:text-gray-300 mb-4">
            Featured Coins
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading coins...</p>
          ) : (
            <table className="w-full text-[16px]">
              <thead>
                <tr className="border-b border-gray-800 text-black dark:text-white">
                  <th className="py-2 text-left">Coin</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">24h</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin) => {
                  const pair = toBinancePair(coin.symbol);
                  const live = tickersMap.get(pair);

                  const price =
                    (live && Number(live.price).toLocaleString()) ||
                    `$${coin.current_price.toLocaleString()}`;

                  const change =
                    (live &&
                      `${Number(live.priceChangePercent).toFixed(2)}%`) ||
                    (coin.price_change_percentage_24h
                      ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                      : "-");

                  return (
                    <tr
                      key={coin.id}
                      className="cursor-pointer text-black dark:text-white hover:bg-card-light-hover dark:hover:bg-[#111418] sm:text-[16px] text-sm"
                      onClick={() => setSelectedPair(pair)}
                    >
                      <td className="py-2 flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-6 h-6"
                        />
                        <Link
                          to={`/coin/${coin.id}`}
                          className="hover:underline"
                        >
                          {coin.symbol.toUpperCase()}/USDT
                        </Link>
                      </td>
                      <td className="py-2 text-right">{price}</td>
                      <td
                        className={`py-2 text-right ${
                          (live
                            ? Number(live.priceChangePercent)
                            : coin.price_change_percentage_24h) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {change}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Right Card: Live Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
          className="flex-1 bg-card-light dark:bg-card rounded-xl p-2 sm:p-4 shadow-md "
        >
          <h3 className="text-xl font-semibold text-zinc-700 dark:text-gray-300 mb-4">
            Live {selectedPair} Chart
          </h3>
          <GraphCard
            title=""
            series={[{ data: candles }]}
            options={{
              chart: { type: "candlestick", background: "transparent" },
              xaxis: { type: "datetime" },
              yaxis: { tooltip: { enabled: true } },
            }}
            height={400}
          />
        </motion.div>
      </div>
    </section>
  );
}
