import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import "../styles/Detail.css";

export default function Detail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const snapshot = await get(ref(db, "resep/" + id));
      if (snapshot.exists()) {
        setRecipe({ id, ...snapshot.val() });
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <div className="detail">
        <h2>Resep tidak ditemukan</h2>
        <Link to="/" className="back-link">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <h1>{recipe.nama}</h1>
      {recipe.gambar && (
        <img src={recipe.gambar} alt={recipe.nama} className="detail-image" />
      )}
      <p className="description">Asal: {recipe.asal}</p>

      <h3>Bahan:</h3>
      <ul>
        {recipe.bahan &&
          (Array.isArray(recipe.bahan)
            ? recipe.bahan.map((item, idx) => <li key={idx}>{item}</li>)
            : Object.values(recipe.bahan).map((item, idx) => (
                <li key={idx}>{item}</li>
              )))}
      </ul>

      <h3>Langkah Memasak:</h3>
      <ol>
        {recipe.langkah &&
          (Array.isArray(recipe.langkah)
            ? recipe.langkah.map((step, idx) => <li key={idx}>{step}</li>)
            : Object.values(recipe.langkah).map((step, idx) => (
                <li key={idx}>{step}</li>
              )))}
      </ol>

      <Link to="/" className="back-link">
        ← Kembali ke Home
      </Link>
    </div>
  );
}
