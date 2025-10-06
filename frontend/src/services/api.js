const API_URL = "http://localhost:8000"; // backend FastAPI

export async function getRecipes(query = "") {
  const res = await fetch(`${API_URL}/recipes?search=${query}`);
  return res.json();
}

export async function getRecipeById(id) {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  return res.json();
}
