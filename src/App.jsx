import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PokemonDetail from "./pages/PokemonDetail.jsx";
import Header from "./components/Header.jsx";
import MyPokedex from "./pages/MyPokedex.jsx";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-6 grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
          <Route path="/mypokedex" element={<MyPokedex />} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        Fait avec ❤️ par <span className="font-semibold">plumedours</span>
      </footer>
    </div>
  );
}