// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjwL6sKJ0IRGFpDiDKPIGTYu9kKxuNNIs",
  authDomain: "bitnova-7b727.firebaseapp.com",
  projectId: "bitnova-7b727",
  storageBucket: "bitnova-7b727.firebasestorage.app",
  messagingSenderId: "660164238898",
  appId: "1:660164238898:web:3fc93a5a5926be7023662b",
  measurementId: "G-NCP5NF5F4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)

export {auth};
export {analytics};
export {db};