import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import CategoryFilter from "../components/CategoryFilter";
import "../styles/Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [results, setResults] = useState([]);
  const [topRecipes, setTopRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSection, setActiveSection] = useState("all"); // all, top, recommended, collection
  const [userCollections, setUserCollections] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.uid || null;

  // API Base URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ✅ Ambil semua data resep
  useEffect(() => {
    fetchAllRecipes();
    fetchTopRecipes();
    fetchRecommendedRecipes();
    fetchCategories();

    if (userId) {
      fetchUserCollections();
    }
  }, [userId]);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/resep`);
      const data = await response.json();
      setRecipes(data);
      setResults(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchTopRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/resep/top?limit=6`);
      const data = await response.json();
      setTopRecipes(data);
    } catch (error) {
      console.error("Error fetching top recipes:", error);
    }
  };

  const fetchRecommendedRecipes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/resep/recommended/${userId}?limit=6`
      );
      const data = await response.json();

      let arr = [];
      if (Array.isArray(data)) {
        arr = data;
      } else if (typeof data === "object" && data !== null) {
        arr = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      }

      console.log("Recommended Recipes:", arr);
      setRecommendedRecipes(arr);
    } catch (error) {
      console.error("Error fetching recommended recipes:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/kategori`);
      const data = await response.json();
      const kategoriList = [
        "All",
        ...Object.keys(data).filter((key) => data[key] === true),
      ];
      setCategories(kategoriList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUserCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/collections`);
      const data = await response.json();
      setUserCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // ✅ Fungsi search
  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setResults(recipes);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/search?q=${searchTerm}`);
      const data = await response.json();
      setResults(data);
      setActiveSection("all");
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  // ✅ Fungsi filter kategori
  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    let filtered = recipes;
    if (category !== "All") {
      filtered = filtered.filter((r) => r.kategori === category);
    }

    setResults(filtered);
    setActiveSection("all");
  };

  // ✅ Switch section
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setActiveCategory("All"); // Reset category filter
  };

  // ✅ Render current section
  const renderRecipes = () => {
    let recipesToShow = [];

    switch (activeSection) {
      case "top":
        recipesToShow = topRecipes;
        break;
      case "recommended":
        recipesToShow = recommendedRecipes;
        break;
      case "collection":
        recipesToShow = userCollections;
        break;
      default:
        recipesToShow = results;
    }

    if (recipesToShow.length === 0) {
      return (
        <div className="no-results">
          <p>
            {activeSection === "collection"
              ? "Belum ada resep di koleksi Anda"
              : "Tidak ada resep ditemukan"}
          </p>
        </div>
      );
    }

    return recipesToShow.map((recipe) => (
      <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
    ));
  };

  return (
    <div className="home">
      {/* Floating Search Bar */}
      <div className="floating-search">
        <input
          type="text"
          placeholder="Cari resep..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <button onClick={() => handleSearch("")}>🔍</button>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        <button
          className={`tab ${activeSection === "all" ? "active" : ""}`}
          onClick={() => handleSectionChange("all")}
        >
          🏠 Semua Resep
        </button>
        <button
          className={`tab ${activeSection === "top" ? "active" : ""}`}
          onClick={() => handleSectionChange("top")}
        >
          🔥 Top Resep
        </button>
        <button
          className={`tab ${activeSection === "recommended" ? "active" : ""}`}
          onClick={() => handleSectionChange("recommended")}
        >
          ⭐ Rekomendasi
        </button>
      </div>

      {/* Filter & Category */}
      {activeSection === "all" && (
        <>
          <CategoryFilter
            categories={categories}
            onSelectCategory={handleCategoryClick}
            activeCategory={activeCategory}
          />
        </>
      )}

      {/* Section Title */}
      <div className="section-header">
        <h2>
          {activeSection === "all" && "Semua Resep"}
          {activeSection === "top" && "🔥 Top Resep (Paling Disukai)"}
          {activeSection === "recommended" && "⭐ Rekomendasi Terbaik"}
          {activeSection === "collection" && "🔖 Koleksi Saya"}
        </h2>
        {activeSection === "all" && (
          <p className="section-subtitle">{results.length} resep ditemukan</p>
        )}
      </div>

      {/* Recipe Grid */}
      <div className="recipe-list">{renderRecipes()}</div>
    </div>
  );
}
