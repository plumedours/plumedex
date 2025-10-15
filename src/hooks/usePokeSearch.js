import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";

const API = "https://pokeapi.co/api/v2";

// Caches
const speciesIndexCache = { list: null }; // [{id, slug, names:{en,fr}}]
const pokemonBasicCache = new Map(); // id -> { id, name(en default), image, typesRaw, ... }

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // sépare les accents
    .replace(/\p{Diacritic}/gu, ""); // supprime les diacritiques
}

async function buildSpeciesIndex() {
  if (speciesIndexCache.list) return speciesIndexCache.list;

  // 1) On récupère la liste complète des species (une seule fois)
  // PokeAPI ~1000+ espèces, un fetch "long" mais fait une seule fois et mis en cache en mémoire.
  const res = await fetch(`${API}/pokemon-species?limit=20000&offset=0`);
  const json = await res.json();

  // 2) On charge les species en parallèle (prudence: gros volume)
  // >> Astuce perf: on commence par mapper les ids et urls, puis on batch (50 par 50)
  const chunks = [];
  for (let i = 0; i < json.results.length; i += 50) {
    chunks.push(json.results.slice(i, i + 50));
  }

  const list = [];
  for (const chunk of chunks) {
    const batch = await Promise.allSettled(
      chunk.map(async (r) => {
        // id via url .../pokemon-species/{id}/
        const m = r.url.match(/\/pokemon-species\/(\d+)\//);
        if (!m) return null;
        const id = Number(m[1]);
        const sp = await fetch(r.url).then((x) => x.json());
        const en =
          sp.names?.find((n) => n.language?.name === "en")?.name || r.name;
        const fr = sp.names?.find((n) => n.language?.name === "fr")?.name || en;
        return { id, slug: r.name, names: { en, fr } };
      })
    );
    for (const b of batch)
      if (b.status === "fulfilled" && b.value) list.push(b.value);
  }

  // Trie par id (optionnel, stable)
  list.sort((a, b) => a.id - b.id);
  speciesIndexCache.list = list;
  return list;
}

async function fetchPokemonBasicById(id) {
  if (pokemonBasicCache.has(id)) return pokemonBasicCache.get(id);
  const res = await fetch(`${API}/pokemon/${id}`);
  if (!res.ok) throw new Error("pokemon not found");
  const p = await res.json();
  const basic = {
    id: p.id,
    slug: p.name,
    name: p.name,
    image:
      p.sprites?.other?.["official-artwork"]?.front_default ??
      p.sprites?.front_default ??
      "",
    typesRaw:
      p.types?.map((t) => ({ name: t.type.name, url: t.type.url })) ?? [],
    abilitiesRaw:
      p.abilities?.map((a) => ({ name: a.ability.name, url: a.ability.url })) ??
      [],
    height: p.height,
    weight: p.weight,
  };
  pokemonBasicCache.set(id, basic);
  return basic;
}

export function usePokeSearch(query, { limit = 24 } = {}) {
  const { lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // [{id, label, slug}]
  const [items, setItems] = useState([]); // cartes à afficher (basique, non-localisé ici)
  const qn = useMemo(() => normalize(query || ""), [query]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (qn.length < 3) {
        setSuggestions([]);
        setItems([]);
        return;
      }
      setLoading(true);

      try {
        const index = await buildSpeciesIndex();
        if (cancelled) return;

        const filtered = index.filter((sp) =>
          normalize(sp.names[lang] || sp.names.en).includes(qn)
        );

        // Suggestions (label localisé)
        const sug = filtered.slice(0, Math.max(limit, 10)).map((sp) => ({
          id: sp.id,
          slug: sp.slug,
          label: sp.names[lang] || sp.names.en,
        }));
        if (!cancelled) setSuggestions(sug);

        // Grille: on charge les premiers N pokémon (leurs sprites/types)
        const picked = filtered.slice(0, limit);
        const basics = await Promise.all(
          picked.map((sp) => fetchPokemonBasicById(sp.id))
        );
        if (cancelled) return;

        setItems(basics); // noms non localisés ici; l’écran les localisera comme d’habitude via ton hook liste (ou on remap dans Home)
      } catch (e) {
        // no-op
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [qn, lang, limit]);

  return { loading, suggestions, items };
}
