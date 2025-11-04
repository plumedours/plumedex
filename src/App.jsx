import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PokemonDetail from "./pages/PokemonDetail.jsx";
import Header from "./components/Header.jsx";
import MyPokedex from "./pages/MyPokedex.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
// import DebugBar from "./components/DebugBar.jsx";

function AppRoutes() {
  const location = useLocation();
  // Remonte proprement les <Routes> à CHAQUE changement de hash/path
  return (
    <Routes key={location.key} location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:name" element={<PokemonDetail />} />
      <Route path="/mypokedex" element={<MyPokedex />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="container mx-auto max-w-7xl px-4 py-6 grow">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        Fait avec ❤️ par{" "}
        <a
          href="https://plumedours.github.io/portfolio/"
          target="_blanck"
          className="font-semibold"
        >
          plumedours
        </a>
      </footer>
      {/* <DebugBar /> */}
    </div>
  );
}
