import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";
import { BsGraphUp } from "react-icons/bs";
import { LuChartCandlestick } from "react-icons/lu";

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=";

export default function UserPortfolio() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [coinData, setCoinData] = useState({});
  const [transactions, setTransactions] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(true);

  // Fetch user portfolio from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const fetchPortfolio = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBalance(data.balance || 0);
          setHoldings(data.holdings || []);
        }

        // ✅ FETCH TRANSACTION HISTORY
        const q = query(
          collection(db, `users/${user.uid}/transactions`),
          orderBy("timestamp", "desc")
        );
        const txSnap = await getDocs(q);
        setTransactions(txSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [user]);

  // Fetch live coin prices for user holdings
  useEffect(() => {
    if (holdings.length === 0) return;

    const ids = holdings.map((h) => h.id).join(",");
    fetch(COINGECKO_API + ids)
      .then((res) => res.json())
      .then((data) => {
        const coinMap = {};
        data.forEach((coin) => {
          coinMap[coin.id] = coin;
        });
        setCoinData(coinMap);
      })
      .catch((err) => console.error("Failed to fetch coin data:", err));
  }, [holdings]);

  // Calculate total portfolio value
  const totalPortfolioValue = holdings.reduce((acc, h) => {
    const price = coinData[h.id]?.current_price || 0;
    return acc + h.amount * price;
  }, 0);

  // ✅ Calculate profit/loss for each coin
  const getProfitLoss = (coinId, amount, avgBuyPrice) => {
    const currentPrice = coinData[coinId]?.current_price || 0;
    const difference = currentPrice - avgBuyPrice;
    const percentage = (difference / avgBuyPrice) * 100;
    return { difference: difference * amount, percentage };
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Please <Link to="/login" className="text-blue-500 underline">log in</Link> to see your portfolio.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading your portfolio...</div>;
  }

  return (
    <section className="min-h-screen mx-auto px-5 md:px-10 py-20 bg-white dark:bg-black">
      {/* User Info */}
      <div className="mb-6">
        <h1 className="title text-3xl font-bold mb-1">Hello, {user.name || "Trader"}!</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      {/* Portfolio Summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-light dark:bg-card shadow-lg rounded p-4">
          <h3 className="text-sm uppercase text-zinc-500 mb-1">Available Balance</h3>
          <p className="text-2xl font-semibold text-black dark:text-white">${balance.toLocaleString()}</p>
        </div>
        <div className="bg-card-light dark:bg-card shadow-lg rounded p-4">
          <h3 className="text-sm uppercase text-zinc-500 mb-1">Portfolio Value</h3>
          <p className="text-2xl font-semibold text-black dark:text-white">${totalPortfolioValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
        </div>
        <div className="bg-card-light dark:bg-card shadow-lg rounded p-4">
          <h3 className="text-sm uppercase text-zinc-500 mb-1">Coins Held</h3>
          <p className="text-2xl font-semibold text-black dark:text-white">{holdings.length}</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Your Holdings</h2>
        {holdings.length === 0 ? (
          <p className="text-zinc-500">You do not own any coins yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="text-zinc-700 dark:text-zinc-300 bg-card-light dark:bg-card">
              <tr className="border-b border-zinc-200 dark:border-zinc-900">
                <th className="py-2 px-4">Coin</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Current Price</th>
                <th className="py-2 px-4">Total Value</th>
                <th className="py-2 px-4">P/L</th> {/* ✅ NEW */}
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(({ id, name, amount, avgBuyPrice }) => {
                const coin = coinData[id];
                const price = coin?.current_price || 0;
                const totalValue = amount * price;
                const { difference, percentage } = getProfitLoss(id, amount, avgBuyPrice || price);

                return (
                  <tr key={id} className=" text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {coin?.image && <img src={coin.image} alt={name} className="w-6 h-6" />}
                      <span>{name}</span>
                    </td>
                    <td className="py-3 px-4">{amount}</td>
                    <td className="py-3 px-4">${price.toFixed(2)}</td>
                    <td className="py-3 px-4">${totalValue.toFixed(2)}</td>
                    <td className={`py-3 px-4 ${difference >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {difference >= 0 ? "+" : ""}${difference.toFixed(2)} ({percentage.toFixed(2)}%)
                    </td>
                    <td className="py-3 px-4 gap-3 flex items-center">
                      <Link to={`/coin/${id}`} className="text-black dark:text-white hover:text-amber-500 font-bold mr-3">
                        <BsGraphUp />
                      </Link>
                      <Link to={`/spot/${id}`} className="text-black dark:text-white hover:text-amber-500 font-bold">
                        <LuChartCandlestick />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Transaction History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Coin</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#0B0E21]">
                  <td className="py-3 px-4">{tx.timestamp?.toDate().toLocaleString()}</td>
                  <td className={`py-3 px-4 ${tx.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                    {tx.type.toUpperCase()}
                  </td>
                  <td className="py-3 px-4">{tx.coin}</td>
                  <td className="py-3 px-4">{tx.amount}</td>
                  <td className="py-3 px-4">${tx.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal />
    </section>
  );
}



// import { useEffect, useState } from "react";
// import { auth, db } from "../../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useAuth } from "../../context/AuthContext";
// import { Link } from "react-router-dom";
// import Modal from "../../components/Modal";
// import { BsGraphUp } from "react-icons/bs";
// import { LuChartCandlestick } from "react-icons/lu";

// const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=";

// export default function UserPortfolio() {
//   const { user } = useAuth(); // Assumes you have user info in context
//   const [balance, setBalance] = useState(0);
//   const [holdings, setHoldings] = useState([]);
//   const [coinData, setCoinData] = useState({});
//   const [loading, setLoading] = useState(true);

//   // Fetch user portfolio from Firestore
//   useEffect(() => {
//     if (!user?.uid) return;
//     setLoading(true);
//     const fetchPortfolio = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setBalance(data.balance || 0);
//           setHoldings(data.holdings || []);
//         }
//       } catch (err) {
//         console.error("Failed to fetch portfolio:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPortfolio();
//   }, [user]);

//   // Fetch live coin prices for user holdings
//   useEffect(() => {
//     if (holdings.length === 0) return;

//     const ids = holdings.map((h) => h.id).join(",");
//     fetch(COINGECKO_API + ids)
//       .then((res) => res.json())
//       .then((data) => {
//         // Map coin id to coin info (price, image, etc)
//         const coinMap = {};
//         data.forEach((coin) => {
//           coinMap[coin.id] = coin;
//         });
//         setCoinData(coinMap);
//       })
//       .catch((err) => console.error("Failed to fetch coin data:", err));
//   }, [holdings]);

//   // Calculate total portfolio value
//   const totalPortfolioValue = holdings.reduce((acc, h) => {
//     const price = coinData[h.id]?.current_price || 0;
//     return acc + h.amount * price;
//   }, 0);

//   if (!user) {
//     return (
//       <div className="p-6 text-center">
//         <p>Please <Link to="/login" className="text-blue-500 underline">log in</Link> to see your portfolio.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return <div className="p-6 text-center">Loading your portfolio...</div>;
//   }

//   return (
//     <section className="min-h-max mx-auto px-5 md:px-10 py-20">
//       {/* User Info */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold mb-1">Hello, {user.displayName || "Trader"}!</h1>
//         <p className="text-gray-400">{user.email}</p>
//       </div>

//       {/* Portfolio Summary */}
//       <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-zinc-800 rounded p-4">
//           <h3 className="text-sm uppercase text-gray-400 mb-1">Available Balance</h3>
//           <p className="text-2xl font-semibold">${balance.toLocaleString()}</p>
//         </div>
//         <div className="bg-zinc-800 rounded p-4">
//           <h3 className="text-sm uppercase text-gray-400 mb-1">Portfolio Value</h3>
//           <p className="text-2xl font-semibold">${totalPortfolioValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
//         </div>
//         <div className="bg-zinc-800 rounded p-4">
//           <h3 className="text-sm uppercase text-gray-400 mb-1">Coins Held</h3>
//           <p className="text-2xl font-semibold">{holdings.length}</p>
//         </div>
//       </div>

//       {/* Holdings Table */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Your Holdings</h2>
//         {holdings.length === 0 ? (
//           <p className="text-gray-400">You do not own any coins yet.</p>
//         ) : (
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-zinc-700">
//                 <th className="py-2 px-4">Coin</th>
//                 <th className="py-2 px-4">Amount</th>
//                 <th className="py-2 px-4">Current Price</th>
//                 <th className="py-2 px-4">Total Value</th>
//                 <th className="py-2 px-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {holdings.map(({ id, name, amount }) => {
//                 const coin = coinData[id];
//                 const price = coin?.current_price || 0;
//                 const totalValue = amount * price;
//                 return (
//                   <tr key={id} className=" hover:bg-[#0B0E21]">
//                     <td className="py-3 px-4 flex items-center gap-3">
//                       {coin?.image && <img src={coin.image} alt={name} className="w-6 h-6" />}
//                       <span>{name}</span>
//                     </td>
//                     <td className="py-3 px-4">{amount}</td>
//                     <td className="py-3 px-4">${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//                     <td className="py-3 px-4">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
//                     <td className="py-3 px-4 gap-3 flex items-center">
//                       <Link
//                         to={`/coin/${id}`}
//                         className="text-white hover:text-amber-500 font-bold mr-3"
//                       >
//                         <BsGraphUp />
//                       </Link>
//                       <Link
//                         to={`/coin/${id}`}
//                         className="text-white hover:text-amber-500 font-bold"
//                       >
//                         <LuChartCandlestick />
//                       </Link>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//       </div>
//       <Modal />
//       {/* <BuySlider /> */}
//     </section>
//   );
// }
