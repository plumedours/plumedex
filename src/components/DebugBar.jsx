import { useLocation, useNavigate } from "react-router-dom";
import { usePokedex } from "../store/pokedex.jsx";

export default function DebugBar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { ids } = usePokedex();
  if (import.meta.env.PROD) return null; // on masque en prod si tu veux

  return (
    <div className="fixed bottom-3 right-3 text-xs bg-black/80 text-white rounded-lg px-3 py-2 shadow z-50">
      <div>hash: {window.location.hash}</div>
      <div>route: {loc.pathname}</div>
      <div>pokedex: {ids.length} id(s)</div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => nav("/")}
          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          Home
        </button>
        <button
          onClick={() => nav("/mypokedex")}
          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          MyPokedex
        </button>
      </div>
    </div>
  );
}
