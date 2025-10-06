import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKategori, setFilterKategori] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchTerm, filterKategori, recipes]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/resep");
      setRecipes(res.data);
      setFilteredRecipes(res.data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data resep");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.asal?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterKategori !== "all") {
      filtered = filtered.filter((r) => r.kategori === filterKategori);
    }

    setFilteredRecipes(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus resep ini?")) return;

    try {
      await axios.delete(`http://localhost:8000/resep/${id}`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      alert("Resep berhasil dihapus!");
    } catch (err) {
      alert("Gagal menghapus resep");
      console.error(err);
    }
  };

  const getKategoriList = () => {
    const kategoriSet = new Set(recipes.map((r) => r.kategori));
    return Array.from(kategoriSet);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
        <button onClick={fetchRecipes} className="btn-retry">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍽️ Admin Resep Nusantara</h1>
          <Link to="/tambah" className="btn-add">
            + Tambah Resep Baru
          </Link>
        </div>
      </header>

      <div className="filters-container">
        <input
          type="text"
          placeholder="🔍 Cari resep atau daerah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="filter-select"
        >
          <option value="all">Semua Kategori</option>
          {getKategoriList().map((kat, index) => (
            <option key={`kategori-${index}-${kat}`} value={kat}>
              {kat}
            </option>
          ))}
        </select>

        <div className="result-count">
          Menampilkan {filteredRecipes.length} dari {recipes.length} resep
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <p>Tidak ada resep yang ditemukan</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="recipe-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Asal</th>
                <th>Kategori</th>
                <th>Info</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                    {r.gambar ? (
                      <img
                        src={r.gambar}
                        alt={r.nama}
                        className="recipe-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td className="recipe-name">{r.nama}</td>
                  <td>{r.asal}</td>
                  <td>
                    <span className="badge">{r.kategori}</span>
                  </td>
                  <td className="recipe-info">
                    {r.porsi && <div>📊 {r.porsi}</div>}
                    {r.waktu && <div>⏱️ {r.waktu}</div>}
                  </td>
                  <td className="action-buttons">
                    <Link to={`/edit/${r.id}`} className="btn-edit">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="btn-delete"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
