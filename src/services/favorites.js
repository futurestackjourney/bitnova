// services/favorites.js
import { doc, setDoc, getDoc } from "firebase/firestore";
// import { db } from "../firebase"; // your firebase config
import { db } from "../firebase";

export const getFavorites = async (userId) => {
  const docRef = doc(db, "favorites", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().coins || [] : [];
};

export const saveFavorites = async (userId, coins) => {
  await setDoc(doc(db, "favorites", userId), { coins });
};
