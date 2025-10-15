import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import PokemonCard from "../components/PokemonCard.jsx";
import { usePokeList } from "../hooks/usePokeApi.js";
import { clamp } from "../utils/format.js";
import { useI18n } from "../i18n.jsx";
import { usePokeSearch } from "../hooks/usePokeSearch.js";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination.jsx";

const PAGE_SIZE = 24;

export default function Home() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { items, total, loading, error } = usePokeList({
    page,
    pageSize: PAGE_SIZE,
    search: submitted,
  });

  // Recherche dynamique
  const live = usePokeSearch(q, { limit: PAGE_SIZE });
  const isLive = q.trim().length >= 3;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  function onSubmit(e) {
    e.preventDefault();
    // Soumission “exacte”: si q = id ou nom EN → détail ; sinon on force une recherche “exact match”
    const term = q.trim();
    if (/^\d+$/.test(term)) {
      navigate(`/pokemon/${Number(term)}`);
      return;
    }
    // Sinon, on garde le flux existant (exact name EN); l’utilisateur peut passer par suggestions FR
    setPage(1);
    setSubmitted(term);
  }

  function onSelectSuggestion(s) {
    // s: {id, label, slug}
    navigate(`/pokemon/${s.id}`); // route par id = infaillible
  }

  const t = {
    title: lang === "fr" ? "Pokédex" : "Pokédex",
    searchPlaceholder:
      lang === "fr"
        ? "Rechercher (nom FR) — min. 3 lettres"
        : "Search (EN name) — min. 3 letters",
    prev: lang === "fr" ? "Précédent" : "Previous",
    next: lang === "fr" ? "Suivant" : "Next",
    loading: lang === "fr" ? "Chargement…" : "Loading…",
    error: lang === "fr" ? "Une erreur est survenue." : "An error occurred.",
    page: lang === "fr" ? "Page" : "Page",
    of: lang === "fr" ? "sur" : "of",
    tip:
      lang === "fr"
        ? "Astuce : cliquez sur une suggestion pour ouvrir la fiche."
        : "Tip: click a suggestion to open the detail view.",
  };

  // Source pour la grille : si recherche dynamique active => live.items, sinon items paginés
  const gridItems = isLive ? live.items : items;
  const isLoading = isLive ? live.loading : loading;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <SearchBar
          value={q}
          onChange={setQ}
          onSubmit={onSubmit}
          placeholder={t.searchPlaceholder}
          suggestions={isLive ? live.suggestions : []}
          onSelectSuggestion={onSelectSuggestion}
        />
      </div>

      {isLive && <p className="text-xs text-gray-500">{t.tip}</p>}

      {isLoading && <div className="text-gray-500">{t.loading}</div>}
      {!isLoading && error && <div className="text-red-600">{t.error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {gridItems.map((p) => (
          <PokemonCard key={p.id} {...p} />
        ))}
      </div>

      {/* Pagination seulement quand il n'y a PAS de recherche dynamique */}
      {!isLive && !submitted && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(p) => setPage(p)}
        />
      )}
    </section>
  );
}
