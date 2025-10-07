import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { loginWithGoogle, logout, observeUser } from "../firebase"; // pastikan path sesuai

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  useEffect(() => {
    // pantau perubahan login/logout
    observeUser(setUser);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogin = async () => {
    try {
      const data = await loginWithGoogle();
      console.log("📦 Data dari loginWithGoogle():", data);

      const userData = {
        uid: data.uid || data.user_id || data.user?.uid || "",
        name: data.name || data.displayName || data.user?.displayName || "User",
        email: data.email || data.user?.email || "",
        photo:
          data.photo ||
          data.picture ||
          data.photoURL ||
          data.user?.photoURL ||
          "",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Login sukses:", userData);
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    alert("👋 Anda telah logout.");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="logo-text">Resep Nusantara</span>
        </Link>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isOpen ? "show" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActive("/")}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>

          <Link
            to="/koleksi"
            className={`nav-link ${isActive("/koleksi")}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">🔖</span>
            <span>Koleksi</span>
          </Link>

          <Link
            to="/tentang"
            className={`nav-link ${isActive("/tentang")}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">ℹ️</span>
            <span>Tentang</span>
          </Link>

          <div className="nav-divider"></div>

          {/* 👤 Bagian Login / Profil */}
          {user ? (
            <div className="user-section" onClick={closeMenu}>
              <img
                src={user?.photo || "/default-avatar.png"}
                alt={user?.name || "User"}
                className="user-photo"
                title={user?.name || "User"}
              />

              <span className="user-name">
                {user?.name ? user.name.split(" ")[0] : "Guest"}
              </span>

              <button onClick={handleLogout} className="btn-signout">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn-signin">
              <span className="signin-icon">👤</span>
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Overlay untuk mobile */}
        {isOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
