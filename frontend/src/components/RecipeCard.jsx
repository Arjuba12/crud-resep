import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/RecipeCard.css";

export default function RecipeCard({ recipe, userId = "guest" }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(recipe.likes || 0);
  const [inCollection, setInCollection] = useState(false);

  // Check if user already liked this recipe
  useEffect(() => {
    if (userId !== "guest") {
      checkIfLiked();
      checkIfInCollection();
    }
  }, [recipe.id, userId]);

  const checkIfLiked = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/${userId}/likes`
      );
      const likedRecipes = await response.json();
      const isLikedByUser = likedRecipes.some((r) => r.id === recipe.id);
      setIsLiked(isLikedByUser);
    } catch (error) {
      console.error("Error checking likes:", error);
    }
  };

  const checkIfInCollection = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/user/${userId}/collections`
      );
      const collections = await response.json();
      const isInCollection = collections.some((r) => r.id === recipe.id);
      setInCollection(isInCollection);
    } catch (error) {
      console.error("Error checking collection:", error);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:8000/resep/${recipe.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            resepId: recipe.id,
          }),
        }
      );

      const data = await response.json();
      setIsLiked(data.isLiked);
      setLikes(data.likes);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCollection = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:8000/user/${userId}/collections/${recipe.id}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      setInCollection(data.inCollection);
    } catch (error) {
      console.error("Error toggling collection:", error);
    }
  };

  // Format rating to show stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className="recipe-card">
      {/* Gambar resep */}
      {recipe.gambar && (
        <div className="recipe-image-container">
          <img src={recipe.gambar} alt={recipe.nama} className="recipe-image" />

          {/* Overlay buttons */}
          <div className="recipe-overlay">
            <button
              className={`icon-button ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
              title={isLiked ? "Unlike" : "Like"}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
            <button
              className={`icon-button ${inCollection ? "collected" : ""}`}
              onClick={handleCollection}
              title={
                inCollection ? "Remove from collection" : "Add to collection"
              }
            >
              {inCollection ? "🔖" : "📑"}
            </button>
          </div>
        </div>
      )}

      {/* Info utama */}
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.nama}</h3>
        <p className="recipe-origin">📍 {recipe.asal}</p>

        {/* Rating & Likes */}
        <div className="recipe-stats">
          <div className="rating">
            <span className="stars">{renderStars(recipe.rating || 0)}</span>
            <span className="rating-value">
              {recipe.rating?.toFixed(1) || "0.0"}
            </span>
            <span className="rating-count">({recipe.totalRatings || 0})</span>
          </div>
          <div className="likes">
            <span>❤️ {likes}</span>
          </div>
        </div>

        {/* Tambahan info */}
        <div className="recipe-meta">
          {recipe.kategori && <span className="badge">{recipe.kategori}</span>}
          {recipe.porsi && <span>🍽️ {recipe.porsi}</span>}
          {recipe.waktu && <span>⏱️ {recipe.waktu}</span>}
        </div>

        {/* Tombol detail */}
        <Link to={`/recipe/${recipe.id}`} className="detail-link">
          Lihat Resep →
        </Link>
      </div>
    </div>
  );
}
