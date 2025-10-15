import { Link } from "react-router-dom";
import { useI18n } from "../i18n.jsx";

export default function Header() {
  const { lang, setLang } = useI18n();
  const isFr = lang === "fr";

  return (
    <header className="bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-[--color-brand] inline-flex items-center justify-center text-white font-black">
            P
          </span>
          <span className="text-lg font-bold">PlumeDex</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(isFr ? "en" : "fr")}
            className="text-sm px-3 py-1.5 rounded-xl border bg-white hover:bg-gray-50"
            title="Changer de langue"
          >
            {isFr ? "FR ▸ EN" : "EN ▸ FR"}
          </button>

          <nav className="text-sm text-gray-600">
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900"
            >
              PokeAPI
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
