import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>Admin Resep Nusantara 🍲</h2>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/add">Tambah Resep</Link>
      </div>
    </nav>
  );
}
