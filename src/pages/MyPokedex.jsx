import { useEffect, useMemo, useState } from "react";
import { usePokedex } from "../store/pokedex.jsx";
import PokemonCard from "../components/PokemonCard.jsx";
import { useI18n } from "../i18n.jsx";
import { fetchPokemonCard } from "../hooks/usePokeApi.js";
import { useNavigate } from "react-router-dom";

export default function MyPokedex() {
  const { lang } = useI18n();
  const { ids: ctxIds, toggle } = usePokedex();
  const navigate = useNavigate();

  // Fallback: si le contexte est vide, on relit le localStorage
  // const safeIds = ctxIds?.length
  //   ? ctxIds
  //   : (() => {
  //       try {
  //         const raw = localStorage.getItem("pokedex");
  //         const arr = raw ? JSON.parse(raw) : [];
  //         return Array.isArray(arr) ? arr : [];
  //       } catch {
  //         return [];
  //       }
  //     })();
    const safeIds = useMemo(() => {
    if (ctxIds?.length) return ctxIds
    try {
      const raw = localStorage.getItem("pokedex")
      const arr = raw ? JSON.parse(raw) : []
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  }, [ctxIds])

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (!safeIds.length) {
          setItems([]);
          return;
        }
        const cards = await Promise.all(
          safeIds.map((id) => fetchPokemonCard(id, lang))
        );
        if (!cancelled) setItems(cards);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [safeIds, lang]);

  if (loading)
    return (
      <div className="text-gray-500">
        {lang === "fr" ? "Chargement…" : "Loading…"}
      </div>
    );

  if (error) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">
          {lang === "fr" ? "Mon Pokédex" : "My Pokédex"}
        </h1>
        <p className="text-red-600">
          {lang === "fr" ? "Une erreur est survenue." : "An error occurred."}
        </p>
      </section>
    );
  }

  if (safeIds.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">
          {lang === "fr" ? "Mon Pokédex" : "My Pokédex"}
        </h1>
        <p className="text-gray-600">
          {lang === "fr"
            ? "Votre Pokédex est vide. Parcourez la liste et cliquez sur la pokéball pour ajouter un Pokémon."
            : "Your Pokédex is empty. Browse the list and click the pokéball to add a Pokémon."}
        </p>

        {/* <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          {lang === "fr" ? "Voir la liste" : "Browse list"}
        </Link> */}
        <button
        type="button"
        onClick={() => {
          // nav router
          navigate("/");
          // Fallback “marteau” si jamais quelque chose bloque encore :
          setTimeout(() => { if (location.hash !== "#/") window.location.hash = "#/"; }, 0);
        }}
        className="inline-block px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
      >
        {lang === "fr" ? "Voir la liste" : "Browse list"}
      </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {lang === "fr" ? "Mon Pokédex" : "My Pokédex"}
        </h1>
        <div className="text-sm text-gray-600">{safeIds.length} Pokémon</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((p) => (
          <PokemonCard
            key={p.id}
            {...p}
            inPokedex={true}
            onToggle={() => toggle(p.id)}
          />
        ))}
      </div>
    </section>
  );
}