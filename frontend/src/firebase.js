// ==========================
// 🔥 Import yang dibutuhkan
// ==========================
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ==========================
// ⚙️ Konfigurasi Firebase
// ==========================
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

// ==========================
// 🚀 Inisialisasi Firebase
// ==========================
const app = initializeApp(firebaseConfig);
getAnalytics(app); // opsional
export const db = getDatabase(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ==========================
// 🔐 Fungsi Login
// ==========================
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken(); // token Firebase

    // Kirim token ke backend FastAPI untuk verifikasi
    const res = await fetch("http://localhost:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    });

    const data = await res.json();

    // Simpan user di localStorage
    localStorage.setItem("user", JSON.stringify(data));

    return data;
  } catch (err) {
    console.error("Login gagal:", err);
    throw err;
  }
};

// ==========================
// 🚪 Fungsi Logout
// ==========================
export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("user");
};

// ==========================
// 👀 Pantau Status Login
// ==========================
export const observeUser = (setUser) => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      const userData = {
        uid: currentUser.uid,
        name: currentUser.displayName || "User",
        email: currentUser.email,
        photo: currentUser.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  });
};
