import { Link } from "react-router-dom";
import "./RecipeForm.css";

export default function RecipeForm({
  recipe,
  onChange,
  onSubmit,
  isEdit,
  loading,
  bahan,
  langkah,
}) {
  return (
    <div className="form-page">
      <div className="form-header">
        <Link to="/" className="back-button">
          ← Kembali
        </Link>
        <h2>{isEdit ? "Edit Resep" : "Tambah Resep Baru"}</h2>
      </div>

      <form onSubmit={onSubmit} className="recipe-form">
        {/* Informasi Dasar */}
        <div className="form-section">
          <h3 className="section-title">📝 Informasi Dasar</h3>

          <div className="form-group">
            <label htmlFor="nama">
              Nama Masakan <span className="required">*</span>
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              value={recipe.nama}
              onChange={onChange}
              placeholder="Contoh: Rendang Padang"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="asal">
                Asal Daerah <span className="required">*</span>
              </label>
              <input
                id="asal"
                name="asal"
                type="text"
                value={recipe.asal}
                onChange={onChange}
                placeholder="Contoh: Sumatera Barat"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="kategori">
                Kategori <span className="required">*</span>
              </label>
              <select
                id="kategori"
                name="kategori"
                value={recipe.kategori}
                onChange={onChange}
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="Makanan Utama">Makanan Utama</option>
                <option value="Camilan">Camilan</option>
                <option value="Desert">Desert</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="porsi">Porsi</label>
              <input
                id="porsi"
                name="porsi"
                type="text"
                value={recipe.porsi}
                onChange={onChange}
                placeholder="Contoh: 4 porsi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="waktu">Waktu</label>
              <input
                id="waktu"
                name="waktu"
                type="text"
                value={recipe.waktu}
                onChange={onChange}
                placeholder="Contoh: 60 menit"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gambar">URL Gambar</label>
            <input
              id="gambar"
              name="gambar"
              type="url"
              value={recipe.gambar}
              onChange={onChange}
              placeholder="https://example.com/image.jpg"
            />
            {recipe.gambar && (
              <div className="image-preview">
                <img src={recipe.gambar} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {/* Bahan-Bahan */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">🥘 Bahan-Bahan</h3>
            <button
              type="button"
              onClick={bahan.onAdd}
              className="btn-add-item"
            >
              + Tambah Bahan
            </button>
          </div>

          {bahan.items.length === 0 ? (
            <p className="empty-message">
              Belum ada bahan. Klik tombol di atas untuk menambah.
            </p>
          ) : (
            <div className="items-list">
              {bahan.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-number">{index + 1}.</span>
                  <input
                    type="text"
                    value={item.nama || ""}
                    onChange={(e) => bahan.onChange(index, e.target.value)}
                    placeholder="Contoh: 1 kg daging sapi"
                    className="item-input"
                  />
                  <button
                    type="button"
                    onClick={() => bahan.onRemove(index)}
                    className="btn-remove"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Langkah-Langkah */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">👨‍🍳 Langkah-Langkah</h3>
            <button
              type="button"
              onClick={langkah.onAdd}
              className="btn-add-item"
            >
              + Tambah Langkah
            </button>
          </div>

          {langkah.items.length === 0 ? (
            <p className="empty-message">
              Belum ada langkah. Klik tombol di atas untuk menambah.
            </p>
          ) : (
            <div className="items-list">
              {langkah.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-number">{index + 1}.</span>
                  <textarea
                    value={item.step || ""}
                    onChange={(e) => langkah.onChange(index, e.target.value)}
                    placeholder="Jelaskan langkah memasak..."
                    className="item-textarea"
                    rows="3"
                  />
                  <button
                    type="button"
                    onClick={() => langkah.onRemove(index)}
                    className="btn-remove"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <Link to="/" className="btn-cancel">
            Batal
          </Link>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading
              ? "Menyimpan..."
              : isEdit
              ? "💾 Simpan Perubahan"
              : "✨ Tambah Resep"}
          </button>
        </div>
      </form>
    </div>
  );
}
