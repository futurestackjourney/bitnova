
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../constants/api";
import { getFavorites, saveFavorites } from "../services/favorites";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import useBinanceTicker from "../hooks/useBinanceTicker";
import { useAuth } from "../context/AuthContext";

const MARKET_QUOTE = {
  usd: "usdt",
  btc: "btc",
  bnb: "bnb",
};

function toBinancePair(coinSymbol, selectedMarket) {
  // coinSymbol: e.g., 'btc', 'eth' ; selectedMarket: 'usd'|'btc'|'bnb'
  // return lowercase pair like 'btcusdt' or 'ethbtc'
  if (!coinSymbol) return null;
  const base = coinSymbol.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const quote = MARKET_QUOTE[selectedMarket] || "usdt";
  return `${base}${quote}`; // WARNING: may not exist on Binance for all coins
}

export default function Markets() {
  const [coins, setCoins] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("usd");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState("all"); // 'all' | 'favorites'
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch favorites from firebase
  useEffect(() => {
    if (user) {
      getFavorites(user.uid).then((fav) => setFavorites(fav || []));
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Fetch coin list (CoinGecko)
  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINTS.markets("usd"))
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching coins:", err);
        setLoading(false);
      });
  }, []);

  // Build visible coins according to search and tab
  const filteredCoins = useMemo(() => {
    const arr = coins.filter((coin) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
      );
    });
    if (tab === "favorites") {
      return arr.filter((c) => favorites.includes(c.id));
    }
    return arr;
  }, [coins, search, favorites, tab]);

  // Build Binance pair list (we'll subscribe to top N visible coins)
  const pairsToSubscribe = useMemo(() => {
    // subscribe to first 50 filtered coins (or whatever count you want)
    const visible = filteredCoins.slice(0, 50);
    return visible
      .map((c) => toBinancePair(c.symbol, selectedMarket))
      .filter(Boolean); // e.g. ['btcusdt','ethusdt']
  }, [filteredCoins, selectedMarket]);

  // Use WebSocket hook
  const { tickersMap } = useBinanceTicker(pairsToSubscribe, { batchSize: 50 });

  const toggleFavorite = (coinId) => {
    let updated;
    if (favorites.includes(coinId)) {
      updated = favorites.filter((id) => id !== coinId);
    } else {
      updated = [...favorites, coinId];
    }
    setFavorites(updated);
    if (user) saveFavorites(user.uid, updated);
  };

  return (
    <section className="min-h-screen px-2 md:px-5 py-16 sm:py-24 bg-white dark:bg-black">
      <div className="">
        <h3 className="text-2xl not-sm:text-center sm:text-3xl title px-2 md:text-2xl font-bold py-2">
          Top Tokens by Market Capitalization
        </h3>
        {/* Header row */}
        <div className="p-4  flex gap-4 items-center">
          {["usd", "btc", "bnb"].map((market) => (
            <button
              key={market}
              onClick={() => setSelectedMarket(market)}
              className={`px-3 py-1 rounded font-semibold ${
                selectedMarket === market
                  ? "bg-yellow-500 dark:text-black"
                  : "text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {market.toUpperCase()} Markets
            </button>
          ))}

          {/* Tabs */}
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setTab("all")}
              className={`px-2 py-1 rounded ${
                tab === "all" ? "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white" : "text-black dark:text-white  hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTab("favorites")}
              className={`px-2 py-1 rounded ${
                tab === "favorites" ? "bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white" : "text-black dark:text-white  hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              Favorites
            </button>
          </div>

          <input
            type="text"
            placeholder="Search coin or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white outline-none"
          />
        </div>

        {/* Table */}
        <div className="p-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 text-black dark:text-white bg-zinc-200 dark:bg-zinc-900 border-b border-t border-zinc-300 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4 text-left">Fav</th>
                <th className="py-3 px-4 text-left">Pair</th>
                <th className="py-3 px-4 text-right">Last Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right">24h High</th>
                <th className="py-3 px-4 text-right">24h Low</th>
                <th className="py-3 px-4 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-2xl py-10 text-zinc-500">
                    Loading coins...
                  </td>
                </tr>
              ) : (
                filteredCoins.map((coin) => {
                  const pair = toBinancePair(coin.symbol, selectedMarket);
                  const live = pair ? tickersMap.get(pair) : null;

                  // Price resolution: prefer live WS price, fallback to CoinGecko fetched price
                  const displayPrice =
                    (live && Number(live.price).toLocaleString()) ||
                    (selectedMarket === "usd"
                      ? `$${coin.current_price.toLocaleString()}`
                      : coin.current_price.toLocaleString());

                  const displayChange =
                    (live &&
                      `${Number(live.priceChangePercent).toFixed(2)}%`) ||
                    (coin.price_change_percentage_24h
                      ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                      : "-");

                  const displayHigh =
                    (live && Number(live.highPrice).toLocaleString()) ||
                    (coin.high_24h
                      ? `$${coin.high_24h.toLocaleString()}`
                      : "-");

                  const displayLow =
                    (live && Number(live.lowPrice).toLocaleString()) ||
                    (coin.low_24h ? `$${coin.low_24h.toLocaleString()}` : "-");

                  const displayVolume =
                    (live && Number(live.volume).toLocaleString()) ||
                    (coin.total_volume
                      ? coin.total_volume.toLocaleString()
                      : "-");

                  return (
                    <tr
                      key={coin.id}
                      className=" text-black dark:text-white hover:bg-card-light-hover dark:hover:bg-zinc-800 transition"
                    >
                      <td
                        className="py-3 px-4 cursor-pointer "
                        onClick={() => toggleFavorite(coin.id)}
                      >
                        {favorites.includes(coin.id) ? (
                          <AiFillStar className="text-yellow-500" />
                        ) : (
                          <AiOutlineStar className="text-gray-500" />
                        )}
                      </td>

                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-5 h-5"
                        />
                        <Link
                          to={`/coin/${coin.id}`}
                          className="hover:underline font-medium"
                         target="_blank"
                        >
                          {coin.symbol.toUpperCase()}/
                          {(
                            MARKET_QUOTE[selectedMarket] || "USDT"
                          ).toUpperCase()}
                        </Link>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {selectedMarket === "usd" && !live
                          ? displayPrice
                          : displayPrice}
                      </td>

                      <td
                        className={`py-3 px-4 text-right ${
                          (live
                            ? Number(live.priceChangePercent)
                            : coin.price_change_percentage_24h) > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {displayChange}
                      </td>

                      <td className="py-3 px-4 text-right">{displayHigh}</td>
                      <td className="py-3 px-4 text-right">{displayLow}</td>
                      <td className="py-3 px-4 text-right">{displayVolume}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
