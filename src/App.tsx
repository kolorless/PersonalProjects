import "./App.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Favorites from "./components/Favorites";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <section className="bg">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </section>
  );
}
