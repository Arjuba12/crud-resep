import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Hamburger */}
      <div
        className={`hamburger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu Links */}
      <div className={`nav-links ${isOpen ? "show" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/kategori" onClick={() => setIsOpen(false)}>
          Kategori
        </Link>
        <Link to="/tentang" onClick={() => setIsOpen(false)}>
          Tentang
        </Link>
        <Link to="/kontak" onClick={() => setIsOpen(false)}>
          Kontak
        </Link>
        <Link
          to="/signin"
          className="btn-signin"
          onClick={() => setIsOpen(false)}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
