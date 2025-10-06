import { Link } from "react-router-dom";
import "../styles/RecipeCard.css";

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      {/* Gambar resep */}
      {recipe.gambar && (
        <img src={recipe.gambar} alt={recipe.nama} className="recipe-image" />
      )}

      {/* Info utama */}
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.nama}</h3>
        <p className="recipe-origin">{recipe.asal}</p>

        {/* Tambahan info */}
        <div className="recipe-meta">
          {recipe.porsi && <span>🍽️ {recipe.porsi} porsi</span>}
          {recipe.waktu && <span>⏱️ {recipe.waktu} menit</span>}
        </div>

        {/* Tombol detail */}
        <Link to={`/recipe/${recipe.id}`} className="detail-link">
          Lihat Resep →
        </Link>
      </div>
    </div>
  );
}
