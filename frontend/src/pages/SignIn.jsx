import React from "react";
import { loginWithGoogle, logout } from "../firebase";
import axios from "axios";

export default function SignIn() {
  const handleLogin = async () => {
    try {
      const { user, token } = await loginWithGoogle();

      // Kirim token ke backend untuk verifikasi
      const res = await axios.post("http://localhost:8000/auth/google", {
        id_token: token,
      });

      console.log("User verified:", res.data);
      alert(`Selamat datang, ${user.displayName}!`);
    } catch (error) {
      console.error("Login gagal:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>Masuk ke Resep Nusantara</h2>
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", fontSize: "1rem" }}
      >
        🔐 Login dengan Google
      </button>
      <br />
      <button onClick={logout} style={{ marginTop: "10px" }}>
        Keluar
      </button>
    </div>
  );
}
