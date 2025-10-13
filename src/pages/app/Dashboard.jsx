import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [userId, setUserId] = useState(null);

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);

  // Real-time listener for portfolio
  useEffect(() => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setBalance(snap.data().balance || 0);
        setHoldings(snap.data().holdings || []);
      }
    });
    return unsubscribe;
  }, [userId]);

  // Fetch coins once
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1"
        );
        const data = await res.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      }
    };
    fetchCoins();
  }, []);

  // Buy coin
  const buyCoin = async (coin) => {
    const price = coin.current_price;
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
      newHoldings = [...holdings, { id: coin.id, name: coin.name, amount: 1 }];
    }

    await setDoc(
      doc(db, "users", userId),
      { balance: newBalance, holdings: newHoldings },
      { merge: true },
      
    );

    await addDoc(collection(db, "users", userId, "transactions"), {
      type: "buy",
      coin: coin.name,
      amount: 1,
      price: price,
      timestamp: serverTimestamp()
    });

    alert(`✅ Purchased 1 ${coin.name} for $${price}`);
  };

  // Sell coin
  const sellCoin = async (coin) => {
    const existing = holdings.find((h) => h.id === coin.id);
    if (!existing) {
      alert("You don't own this coin!");
      return;
    }

    const price = coin.current_price;
    const newBalance = balance + price;
    let newHoldings;
    if (existing.amount > 1) {
      newHoldings = holdings.map((h) =>
        h.id === coin.id ? { ...h, amount: h.amount - 1 } : h
      );
    } else {
      newHoldings = holdings.filter((h) => h.id !== coin.id);
    }

    await setDoc(
      doc(db, "users", userId),
      { balance: newBalance, holdings: newHoldings },
      { merge: true }
    );

    await addDoc(collection(db, "users", userId, "transactions"), {
      type: "sell",
      coin: coin.name,
      amount: 1,
      price: price,
      timestamp: serverTimestamp()
    });

    alert(`💰 Sold 1 ${coin.name} for $${price}`);
  };

  return (
    <section className="min-h-screen px-5 md:px-10 pt-14 bg-white dark:bg-black">
      <div className="p-6">
        <h2 className="title text-3xl font-bold mb-4">Dashboard</h2>
        <p className="text-xl mb-6 text-black dark:text-white">
          Your Current Balance: ${balance.toLocaleString()}
        </p>

        {loading ? (
          <p>Loading coins...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded shadow-lg bg-card-light dark:bg-card"
              >
                <h3 className="text-xl font-semibold title uppercase">{coin.name}</h3>
                <p className="text-zinc-700 dark:text-white"><b>Price:</b> ${coin.current_price}</p>
                <p className="text-zinc-700 dark:text-white"><b>Market Cap:</b> ${coin.market_cap.toLocaleString()}</p>
                <button
                  onClick={() => buyCoin(coin)}
                  className="mt-3 px-4 py-1 bg-green-600 text-white rounded mr-2"
                >
                  Buy
                </button>
                <button
                  onClick={() => sellCoin(coin)}
                  className="mt-3 px-4 py-1 bg-red-600 text-white rounded"
                >
                  Sell
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;





// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { auth, db } from "../../firebase"; 
// import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const Dashboard = () => {
//   const [coins, setCoins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [balance, setBalance] = useState(0);
//   const [holdings, setHoldings] = useState([]);
//   const [userId, setUserId] = useState(null);

//   // Wait for Firebase to load the current user
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//       } else {
//         setUserId(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Fetch user's portfolio from Firestore
//   const fetchPortfolio = async (uid) => {
//     if (!uid) return;
//     const docRef = doc(db, "users", uid);
//     const snap = await getDoc(docRef);
//     if (snap.exists()) {
//       setBalance(snap.data().balance || 0);
//       setHoldings(snap.data().holdings || []);
//     } else {
//       await setDoc(docRef, { balance: 1000, holdings: [] }, { merge: true });
//       setBalance(1000);
//       setHoldings([]);
//     }
//   };

//   // Fetch coins from API
//   const fetchCoins = async () => {
//     try {
//       const res = await fetch(
//         "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1"
//       );
//       const data = await res.json();
//       setCoins(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch coins:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCoins();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchPortfolio(userId);
//     }
//   }, [userId]);

//   // Buy coin
//   // const buyCoin = async (coin) => {
//   //   const price = coin.current_price;
//   //   if (balance < price) {
//   //     alert("Not enough balance!");
//   //     return;
//   //   }

//   //   const newBalance = balance - price;
//   //   const existing = holdings.find((h) => h.id === coin.id);
//   //   let newHoldings;

//   //   if (existing) {
//   //     newHoldings = holdings.map((h) =>
//   //       h.id === coin.id ? { ...h, amount: h.amount + 1 } : h
//   //     );
//   //   } else {
//   //     newHoldings = [...holdings, { id: coin.id, name: coin.name, amount: 1 }];
//   //   }

//   //   await setDoc(doc(db, "users", userId), {
//   //     balance: newBalance,
//   //     holdings: newHoldings
//   //   }, { merge: true });

//   //   setBalance(newBalance);
//   //   setHoldings(newHoldings);
//   // };

//   // // Sell coin
//   // const sellCoin = async (coin) => {
//   //   const existing = holdings.find((h) => h.id === coin.id);
//   //   if (!existing) {
//   //     alert("You don't own this coin!");
//   //     return;
//   //   }

//   //   const price = coin.current_price;
//   //   const newBalance = balance + price;
//   //   let newHoldings;

//   //   if (existing.amount > 1) {
//   //     newHoldings = holdings.map((h) =>
//   //       h.id === coin.id ? { ...h, amount: h.amount - 1 } : h
//   //     );
//   //   } else {
//   //     newHoldings = holdings.filter((h) => h.id !== coin.id);
//   //   }

//   //   await setDoc(doc(db, "users", userId), {
//   //     balance: newBalance,
//   //     holdings: newHoldings
//   //   }, { merge: true });

//   //   setBalance(newBalance);
//   //   setHoldings(newHoldings);
//   // };

//   return (
//    <section className="min-h-max px-5 md:px-10 pt-14">
//      <div className="p-6">
//       <h2 className="text-3xl font-bold mb-4">Dashboard </h2>
//       <p className="text-xl mb-6">
//         Your Current Balance: ${balance.toLocaleString()}
//       </p>

//       {loading ? (
//         <p>Loading coins...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {coins.map((coin) => (
//             <motion.div
//               key={coin.id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="border p-4 rounded shadow"
//             >
//               <h3 className="text-xl font-semibold">{coin.name}</h3>
//               <p>💲 Price: ${coin.current_price}</p>
//               <p>📈 Market Cap: ${coin.market_cap.toLocaleString()}</p>
//               <button
//                 onClick={() => buyCoin(coin)}
//                 className="mt-3 px-4 py-1 bg-green-600 text-white rounded mr-2"
//               >
//                 Buy
//               </button>
//               <button
//                 onClick={() => sellCoin(coin)}
//                 className="mt-3 px-4 py-1 bg-red-600 text-white rounded"
//               >
//                 Sell
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//    </section>
//   );
// };

// export default Dashboard;
