// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // ✅ tambahkan ini

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv69IUep451NLTHEIYFuGhs0epNl0AYIg",
  authDomain: "resepnusantara-4699d.firebaseapp.com",
  databaseURL:
    "https://resepnusantara-4699d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "resepnusantara-4699d",
  storageBucket: "resepnusantara-4699d.firebasestorage.app",
  messagingSenderId: "492861427981",
  appId: "1:492861427981:web:c2eff80d9a6d9a27da2044",
  measurementId: "G-6XG33GRT05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Export Realtime Database
export const db = getDatabase(app);
