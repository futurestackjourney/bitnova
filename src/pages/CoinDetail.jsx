import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GraphCard from "../components/GraphCard";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
// import BuySlider from "../components/BuySlider";

const CoinDetail = () => {
  const { id } = useParams(); // coin id from route (e.g., "bitcoin")
  const navigate = useNavigate();

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchPortfolio(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsub();
  }, []);

  // Fetch user portfolio
  const fetchPortfolio = async (uid) => {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setBalance(snap.data().balance || 0);
      setHoldings(snap.data().holdings || []);
    } else {
      await setDoc(docRef, { balance: 10000, holdings: [] }, { merge: true });
      setBalance(10000);
      setHoldings([]);
    }
  };

  // Fetch coin details
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        // Coin details
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&sparkline=true`
        );
        const data = await res.json();
        setCoin(data);

        // OHLC chart data (last 7 days, daily)
        const ohlcRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=7`
        );
        const ohlc = await ohlcRes.json();

        const series = [
          {
            data: ohlc.map((item) => ({
              x: new Date(item[0]),
              y: [item[1], item[2], item[3], item[4]],
            })),
          },
        ];
        const options = {
          chart: { type: "candlestick", background: "transparent" },
          xaxis: { type: "datetime" },
          yaxis: { tooltip: { enabled: true } },
        };
        setChartData({ series, options });

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoinData();
  }, [id]);

  // Buy coin
  const buyCoin = async () => {
    if (!userId) {
      alert("Please log in to buy coins!");
      navigate("/login");
      return;
    }
    const price = coin.market_data.current_price.usd;
    if (balance < price) {
      alert("Not enough balance!");
      return;
    }
    const newBalance = balance - price;
    const existing = holdings.find((h) => h.id === coin.id);
    let newHoldings;
    if (existing) {
      newHoldings = holdings.map((h) =>
        h.id === coin.id ? { ...h, amount: h.amount + 1 } : h
      );
    } else {
      newHoldings = [
        ...holdings,
        { id: coin.id, name: coin.name, amount: 1 },
      ];
    }
    await setDoc(
      doc(db, "users", userId),
      { balance: newBalance, holdings: newHoldings },
      { merge: true }
    );
    setBalance(newBalance);
    setHoldings(newHoldings);
    alert(`You bought 1 ${coin.name}`);
  };

  if (loading) return <p className="p-24">Loading coin details...</p>;
  if (!coin) return <p className="p-24">Coin not found</p>;

  return (
    <section className="min-h-screen px-5 md:px-10 py-18 bg-white dark:bg-black">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Coin Info */}
        <div className="flex-1 bg-card-light dark:bg-card text-black dark:text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
            <h1 className="text-3xl font-bold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
          </div>
          <p
            className="text-sm text-gray-400 mb-4"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split(". ")[0] + ".",
            }}
          ></p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-zinc-800 dark:text-white"> Price :</span> ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold text-zinc-800 dark:text-white"> Market Cap :</span> ${coin.market_data.market_cap.usd.toLocaleString()}
          </p>
          <p className="text-lg mb-4">
            <span className="font-semibold text-zinc-800 dark:text-white">24h Change :</span> {coin.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>

          {/* Buy Button */}
          {userId ? (
            <button
              onClick={buyCoin}
              disabled={balance < coin.market_data.current_price.usd}
              className={`px-5 py-2 rounded-lg font-semibold ${
                balance < coin.market_data.current_price.usd
                  ? "bg-zinc-200 dark:bg-zinc-600 cursor-not-allowed"
                  : "text-white dark:text-black bg-green-600 hover:bg-green-700"
              }`}
            >
              Buy 1 {coin.symbol.toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg font-semibold bg-yellow-600 hover:bg-yellow-700"
            >
              Log in to Buy
            </button>
          )}
          {/* {user && (
  <BuySlider 
    coin={coin} 
    balance={balance} 
    onBuy={(quantity) => buyCoin(coin, quantity)} 
  />
)} */}


        </div>

        {/* Right Side - Chart */}
        <div className="flex-1">
          <GraphCard
          className="text-black dark:text-white bg-card-light dark:bg-card p-6"
            title={`${coin.name} Price Chart (7D)`}
            series={chartData.series}
            options={chartData.options}
            height={500}
          />
        </div>
      </div>
    </section>
  );
};

export default CoinDetail;



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import GraphCard from "../components/GraphCard";
// import { auth, db } from "../firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const CoinDetail = () => {
//   const { id } = useParams();
//   const [coin, setCoin] = useState(null);
//   const [chartData, setChartData] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [balance, setBalance] = useState(0);
//   const [holdings, setHoldings] = useState([]);

//   // Watch user login state
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (user) setUserId(user.uid);
//       else setUserId(null);
//     });
//     return () => unsub();
//   }, []);

//   // Fetch coin details
//   useEffect(() => {
//     const fetchCoin = async () => {
//       const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
//       const data = await res.json();
//       setCoin(data);
//     };
//     fetchCoin();
//   }, [id]);

//   // Fetch chart data (candlestick)
//   useEffect(() => {
//     const fetchChart = async () => {
//       const res = await fetch(
//         `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=7`
//       );
//       const data = await res.json();
//       const series = [
//         {
//           data: data.map((d) => ({
//             x: new Date(d[0]),
//             y: [d[1], d[2], d[3], d[4]],
//           })),
//         },
//       ];
//       setChartData({
//         options: {
//           chart: { type: "candlestick" },
//           xaxis: { type: "datetime" },
//           yaxis: { tooltip: { enabled: true } },
//         },
//         series,
//       });
//     };
//     fetchChart();
//   }, [id]);

//   // Fetch user portfolio
//   useEffect(() => {
//     if (!userId) return;
//     const fetchPortfolio = async () => {
//       const docRef = doc(db, "users", userId);
//       const snap = await getDoc(docRef);
//       if (snap.exists()) {
//         setBalance(snap.data().balance || 0);
//         setHoldings(snap.data().holdings || []);
//       }
//     };
//     fetchPortfolio();
//   }, [userId]);

//   const buyCoin = async () => {
//     if (!userId) {
//       alert("You must be logged in to buy.");
//       return;
//     }

//     const price = coin.market_data.current_price.usd;
//     if (balance < price) {
//       alert("Not enough balance!");
//       return;
//     }

//     const newBalance = balance - price;
//     const existing = holdings.find((h) => h.id === coin.id);
//     let newHoldings;

//     if (existing) {
//       newHoldings = holdings.map((h) =>
//         h.id === coin.id ? { ...h, amount: h.amount + 1 } : h
//       );
//     } else {
//       newHoldings = [...holdings, { id: coin.id, name: coin.name, amount: 1 }];
//     }

//     await setDoc(
//       doc(db, "users", userId),
//       { balance: newBalance, holdings: newHoldings },
//       { merge: true }
//     );

//     setBalance(newBalance);
//     setHoldings(newHoldings);
//     alert("Coin purchased!");
//   };

//   if (!coin) return <p className="p-6">Loading coin details...</p>;

//   return (
//     <section className="min-h-max px-5 md:px-10 pt-14">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">{coin.name}</h1>
//         <p className="text-lg text-gray-400">
//           ${coin.market_data.current_price.usd.toLocaleString()}
//         </p>
//       </div>

//       <GraphCard
//         title={`${coin.name} Price Chart`}
//         series={chartData?.series}
//         options={chartData?.options}
//         height={400}
//       />

//       <div className="mt-6">
//         {userId ? (
//           <button
//             onClick={buyCoin}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg"
//           >
//             Buy
//           </button>
//         ) : (
//           <p className="text-red-500">
//             Log in to buy this coin.
//           </p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default CoinDetail;

