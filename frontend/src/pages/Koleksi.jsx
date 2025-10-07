import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import "../styles/Koleksi.css";

export default function Koleksi() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.uid || null;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/collections`);
      const data = await response.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="koleksi-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat koleksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="koleksi-page">
      <div className="koleksi-header">
        <h1>🔖 Koleksi Saya</h1>
        <p>Resep-resep favorit yang telah Anda simpan</p>
        <div className="collection-stats">
          <span className="stat-badge">
            {collections.length} Resep Tersimpan
          </span>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>Koleksi Masih Kosong</h2>
          <p>
            Mulai simpan resep favorit Anda dengan menekan tombol bookmark (🔖)
            pada resep yang Anda sukai
          </p>
          <a href="/" className="btn-explore">
            🔍 Jelajahi Resep
          </a>
        </div>
      ) : (
        <div className="recipe-grid">
          {collections.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
