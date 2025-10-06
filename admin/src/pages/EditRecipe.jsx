import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RecipeForm from "../components/RecipeForm";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState({
    nama: "",
    asal: "",
    kategori: "",
    porsi: "",
    waktu: "",
    gambar: "",
    bahan: [],
    langkah: [],
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/resep/${id}`)
        .then((res) => {
          setRecipe({
            nama: res.data.nama || "",
            asal: res.data.asal || "",
            kategori: res.data.kategori || "",
            porsi: res.data.porsi || "",
            waktu: res.data.waktu || "",
            gambar: res.data.gambar || "",
            bahan: Array.isArray(res.data.bahan) ? res.data.bahan : [],
            langkah: Array.isArray(res.data.langkah) ? res.data.langkah : [],
          });
        })
        .catch((err) => {
          alert("Gagal memuat data resep");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleBahanChange = (index, value) => {
    const newBahan = [...recipe.bahan];
    newBahan[index] = { nama: value };
    setRecipe({ ...recipe, bahan: newBahan });
  };

  const addBahan = () => {
    setRecipe({ ...recipe, bahan: [...recipe.bahan, { nama: "" }] });
  };

  const removeBahan = (index) => {
    const newBahan = recipe.bahan.filter((_, i) => i !== index);
    setRecipe({ ...recipe, bahan: newBahan });
  };

  const handleLangkahChange = (index, value) => {
    const newLangkah = [...recipe.langkah];
    newLangkah[index] = { step: value };
    setRecipe({ ...recipe, langkah: newLangkah });
  };

  const addLangkah = () => {
    setRecipe({ ...recipe, langkah: [...recipe.langkah, { step: "" }] });
  };

  const removeLangkah = (index) => {
    const newLangkah = recipe.langkah.filter((_, i) => i !== index);
    setRecipe({ ...recipe, langkah: newLangkah });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axios.put(`http://localhost:8000/resep/${id}`, recipe);
        alert("Resep berhasil diperbarui!");
      } else {
        await axios.post("http://localhost:8000/resep", recipe);
        alert("Resep berhasil ditambahkan!");
      }
      navigate("/");
    } catch (err) {
      alert(`Gagal ${id ? "memperbarui" : "menambahkan"} resep`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="loading-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  return (
    <RecipeForm
      recipe={recipe}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={!!id}
      loading={loading}
      bahan={{
        items: recipe.bahan,
        onChange: handleBahanChange,
        onAdd: addBahan,
        onRemove: removeBahan,
      }}
      langkah={{
        items: recipe.langkah,
        onChange: handleLangkahChange,
        onAdd: addLangkah,
        onRemove: removeLangkah,
      }}
    />
  );
}
