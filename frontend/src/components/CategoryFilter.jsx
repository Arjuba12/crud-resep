import { useState } from "react";
import { FaBars } from "react-icons/fa"; // hamburger icon
import "../styles/CategoryFilter.css";

export default function CategoryFilter({
  categories,
  onSelectCategory,
  activeCategory,
}) {
  return (
    <div className="category-scroll">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-item ${
            activeCategory === category ? "active" : ""
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
