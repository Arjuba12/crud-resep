import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import CategoryFilter from "../components/CategoryFilter";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import "../styles/Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");

  // ✅ Ambil data resep
  useEffect(() => {
    const recipesRef = ref(db, "resep");
    onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recipeList = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setRecipes(recipeList);
        setResults(recipeList);
      }
    });
  }, []);

  // ✅ Ambil data kategori
  useEffect(() => {
    const kategoriRef = ref(db, "kategori");
    onValue(kategoriRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Kategori dari Firebase:", data); // Debug

      if (data) {
        const kategoriList = [
          "All",
          ...Object.keys(data).filter((key) => data[key] === true), // ambil key yang bernilai true
        ];
        setCategories(kategoriList);
      }
    });
  }, []);

  // ✅ Fungsi search
  const handleSearch = (searchTerm) => {
    let filtered = recipes;

    // filter kategori dulu
    if (activeCategory !== "All") {
      filtered = filtered.filter((r) => r.kategori === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      // prioritas ke nama, tapi fallback ke asal & kategori
      filtered = filtered.filter(
        (r) =>
          (r.nama && r.nama.toLowerCase().includes(term)) || // utama
          (r.asal && r.asal.toLowerCase().includes(term)) || // fallback
          (r.kategori && r.kategori.toLowerCase().includes(term)) // fallback
      );
    }

    setResults(filtered);
  };

  // ✅ Fungsi filter kategori
  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    let filtered = recipes;
    if (category !== "All") {
      filtered = filtered.filter((r) => r.kategori === category); // pakai "kategori"
    }

    setResults(filtered);
  };

  return (
    <div className="home">
      <h1 className="title">Resep Nusantara 🍲</h1>

      {/* ✅ Filter + Search sejajar */}
      <div className="filter-search">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div>
        <CategoryFilter
          categories={categories}
          onSelectCategory={handleCategoryClick}
          activeCategory={activeCategory}
        />
      </div>

      <div className="recipe-list">
        {results.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
