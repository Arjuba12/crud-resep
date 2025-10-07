import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [inCollection, setInCollection] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.uid || null;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchRecipeDetail();
    checkUserInteractions();
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      const response = await fetch(`${API_URL}/resep/${id}`);
      if (!response.ok) throw new Error("Recipe not found");
      const data = await response.json();
      setRecipe(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    try {
      // Check likes
      const likesRes = await fetch(`${API_URL}/user/${userId}/likes`);
      const liked = await likesRes.json();
      setIsLiked(liked.some((r) => r.id === id));

      // Check collection
      const collectionRes = await fetch(
        `${API_URL}/user/${userId}/collections`
      );
      const collections = await collectionRes.json();
      setInCollection(collections.some((r) => r.id === id));

      // Check user's rating (would need separate endpoint in real app)
      // For now, leaving at 0
    } catch (error) {
      console.error("Error checking interactions:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/resep/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, resepId: id }),
      });
      const data = await response.json();
      setIsLiked(data.isLiked);
      setRecipe({ ...recipe, likes: data.likes });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCollection = async () => {
    try {
      const response = await fetch(
        `${API_URL}/user/${userId}/collections/${id}`,
        { method: "POST" }
      );
      const data = await response.json();
      setInCollection(data.inCollection);
    } catch (error) {
      console.error("Error toggling collection:", error);
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await fetch(`${API_URL}/resep/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, resepId: id, rating }),
      });
      const data = await response.json();
      setUserRating(rating);
      setRecipe({
        ...recipe,
        rating: data.rating,
        totalRatings: data.totalRatings,
      });
    } catch (error) {
      console.error("Error rating recipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat resep...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <h2>Resep tidak ditemukan 😢</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Kembali
        </button>

        <div className="header-actions">
          <button
            className={`action-btn ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            {isLiked ? "❤️" : "🤍"} {recipe.likes || 0}
          </button>
          <button
            className={`action-btn ${inCollection ? "collected" : ""}`}
            onClick={handleCollection}
          >
            {inCollection ? "🔖" : "📑"}
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {recipe.gambar && (
        <div className="hero-image">
          <img src={recipe.gambar} alt={recipe.nama} />
          <div className="hero-overlay">
            <h1>{recipe.nama}</h1>
            <p>📍 {recipe.asal}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="detail-content">
        {/* Stats & Rating */}
        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{recipe.views || 0}</span>
            <span className="stat-label">Views</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{recipe.likes || 0}</span>
            <span className="stat-label">Likes</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">
              {recipe.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="stat-label">
              Rating ({recipe.totalRatings || 0})
            </span>
          </div>
        </div>

        {/* User Rating */}
        <div className="user-rating-section">
          <h3>Berikan Rating Anda</h3>
          <div className="stars-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${
                  (hoveredRating || userRating) >= star ? "active" : ""
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="rating-feedback">Terima kasih atas rating Anda! ⭐</p>
          )}
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          {recipe.kategori && (
            <div className="info-card">
              <span className="info-label">Kategori</span>
              <span className="info-value badge">{recipe.kategori}</span>
            </div>
          )}
          {recipe.porsi && (
            <div className="info-card">
              <span className="info-label">🍽️ Porsi</span>
              <span className="info-value">{recipe.porsi}</span>
            </div>
          )}
          {recipe.waktu && (
            <div className="info-card">
              <span className="info-label">⏱️ Waktu</span>
              <span className="info-value">{recipe.waktu}</span>
            </div>
          )}
        </div>

        {/* Bahan */}
        <div className="section">
          <h2>🛒 Bahan-bahan</h2>
          <ul className="ingredients-list">
            {recipe.bahan?.map((item, index) => (
              <li key={index}>
                <span className="bullet">✓</span>
                {item.nama}
              </li>
            ))}
          </ul>
        </div>

        {/* Langkah */}
        <div className="section">
          <h2>👩‍🍳 Cara Memasak</h2>
          <ol className="steps-list">
            {recipe.langkah?.map((item, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <p>{item.step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
