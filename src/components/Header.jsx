import { useNavigate, NavLink } from "react-router-dom";
import { useI18n } from "../i18n.jsx";
import { usePokedex } from "../store/pokedex.jsx";
import { asset } from "../utils/asset.js";

export default function Header() {
  const nav = useNavigate();
  const { lang, setLang } = useI18n();
  const { ids } = usePokedex();
  const isFr = lang === "fr";

  return (
    <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => nav("/")}
          className="inline-flex items-center gap-2 cursor-pointer"
          aria-label="Accueil"
        >
          <img src={asset("poke.svg")} />
          <span className="text-lg font-bold">PlumeDex</span>
        </button>

        <div className="flex items-center gap-4">
          <NavLink
            to="/mypokedex"
            className="relative inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50"
          >
            <span>{isFr ? "Mon Pokédex" : "My Pokédex"}</span>
            <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full text-xs px-1 bg-[--color-brand] text-white">
              {ids.length}
            </span>
          </NavLink>

          <button
            onClick={() => setLang(isFr ? "en" : "fr")}
            className="text-sm px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50 cursor-pointer"
            title="Changer de langue"
          >
            {isFr ? "FR ▸ EN" : "EN ▸ FR"}
          </button>
        </div>
      </div>
    </header>
  );
}
