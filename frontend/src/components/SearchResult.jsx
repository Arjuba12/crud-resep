import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import recipes from "../data/recipe";
import "../styles/HomePage.css";

export default function HomePage() {
  const [results, setResults] = useState(recipes);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setResults(recipes);
      return;
    }
    const filtered = recipes.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="homepage">
      <h1 className="app-title">Search Engine Resep Nusantara 🍲</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults results={results} />
    </div>
  );
}
