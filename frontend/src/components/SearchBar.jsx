import { useState } from "react";
import "../styles/SearchBar.css";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari resep..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Cari</button>
    </form>
  );
}
