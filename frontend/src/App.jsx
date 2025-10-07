import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Koleksi from "./pages/Koleksi";
// import Kategori from "./pages/Kategori";
// import Tentang from "./pages/Tentang";
import SignIn from "./pages/SignIn";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:id" element={<Detail />} />
            <Route path="/koleksi" element={<Koleksi />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
