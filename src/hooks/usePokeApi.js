import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n.jsx";

const API = "https://pokeapi.co/api/v2";

// Caches simples en mémoire
const speciesCache = new Map(); // key: id -> species json
const typeNameCache = new Map(); // key: `${name}|${lang}` -> localizedName
const abilityNameCache = new Map(); // key: `${name}|${lang}` -> localizedName

// Utilitaires localisation
function pickLocalizedName(entries, lang) {
  // entries: [{language:{name:'fr'}, name:'...'}]
  return entries?.find((e) => e.language?.name === lang)?.name;
}

function pickFlavor(entries, lang) {
  // entries: [{language:{name:'fr'}, flavor_text:'...'}]
  return entries
    ?.find((e) => e.language?.name === lang)
    ?.flavor_text?.replace(/\f/g, " ");
}

function mapPokemonBasic(p) {
  return {
    id: p.id,
    slug: p.name, // nom “originel” EN (au cas où)
    name: p.name, // remplacé par la version localisée ensuite
    image:
      p.sprites?.other?.["official-artwork"]?.front_default ??
      p.sprites?.front_default ??
      "",
    typesRaw:
      p.types?.map((t) => ({ name: t.type.name, url: t.type.url })) ?? [],
    abilitiesRaw:
      p.abilities?.map((a) => ({ name: a.ability.name, url: a.ability.url })) ??
      [],
  };
}

async function getSpeciesById(id) {
  if (speciesCache.has(id)) return speciesCache.get(id);
  const res = await fetch(`${API}/pokemon-species/${id}`);
  if (!res.ok) throw new Error("species not found");
  const json = await res.json();
  speciesCache.set(id, json);
  return json;
}

async function getLocalizedTypeName(nameOrUrl, lang) {
  const key = `${nameOrUrl}|${lang}`;
  if (typeNameCache.has(key)) return typeNameCache.get(key);
  const url = nameOrUrl.startsWith("http")
    ? nameOrUrl
    : `${API}/type/${nameOrUrl}`;
  const res = await fetch(url);
  if (!res.ok) return nameOrUrl; // fallback
  const json = await res.json();
  const loc = pickLocalizedName(json.names, lang) || json.name;
  typeNameCache.set(key, loc);
  return loc;
}

async function getLocalizedAbilityName(nameOrUrl, lang) {
  const key = `${nameOrUrl}|${lang}`;
  if (abilityNameCache.has(key)) return abilityNameCache.get(key);
  const url = nameOrUrl.startsWith("http")
    ? nameOrUrl
    : `${API}/ability/${nameOrUrl}`;
  const res = await fetch(url);
  if (!res.ok) return nameOrUrl;
  const json = await res.json();
  const loc = pickLocalizedName(json.names, lang) || json.name;
  abilityNameCache.set(key, loc);
  return loc;
}

async function localizeBasic(basic, lang) {
  // Nom via species
  let displayName = basic.name;
  try {
    const species = await getSpeciesById(basic.id);
    displayName =
      pickLocalizedName(species.names, lang) ||
      pickLocalizedName(species.names, "en") ||
      basic.name;
  } catch {
    // ignore
  }

  // Types localisés (en parallèle)
  const types = await Promise.all(
    basic.typesRaw.map((t) => getLocalizedTypeName(t.url || t.name, lang))
  );

  return { ...basic, name: displayName, types };
}

async function localizeDetail(basic, lang) {
  const [species, abilityNames] = await Promise.all([
    getSpeciesById(basic.id),
    Promise.all(
      basic.abilitiesRaw.map((a) =>
        getLocalizedAbilityName(a.url || a.name, lang)
      )
    ),
  ]);
  const flavor =
    pickFlavor(species.flavor_text_entries, lang) ||
    pickFlavor(species.flavor_text_entries, "en") ||
    "";

  return {
    id: basic.id,
    name:
      pickLocalizedName(species.names, lang) ||
      pickLocalizedName(species.names, "en") ||
      basic.name,
    image: basic.image,
    types: await Promise.all(
      basic.typesRaw.map((t) => getLocalizedTypeName(t.url || t.name, lang))
    ),
    abilities: abilityNames,
    height: basic.height,
    weight: basic.weight,
    flavor,
  };
}

// HOOK LISTE
export function usePokeList({ page, pageSize, search }) {
  const { lang } = useI18n();
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  useEffect(() => {
    let abort = new AbortController();
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (search) {
          const res = await fetch(
            `${API}/pokemon/${encodeURIComponent(search.toLowerCase())}`,
            { signal: abort.signal }
          );
          if (!res.ok) throw new Error("Not found");
          const p = await res.json();
          const basic = mapPokemonBasic(p);
          const item = await localizeBasic(basic, lang);
          setData({ items: [item], total: 1 });
        } else {
          const res = await fetch(
            `${API}/pokemon?limit=${pageSize}&offset=${offset}`,
            { signal: abort.signal }
          );
          const json = await res.json();
          const detailed = await Promise.all(
            json.results.map(async (r) => {
              const pr = await fetch(r.url, { signal: abort.signal });
              const p = await pr.json();
              const basic = mapPokemonBasic(p);
              return localizeBasic(basic, lang);
            })
          );
          setData({ items: detailed, total: json.count });
        }
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => abort.abort();
  }, [page, pageSize, search, lang]);

  return { ...data, loading, error };
}

// DETAIL
export async function fetchPokemonLocalized(key, lang) {
  // key: id (number) ou nom (string EN)
  const endpointKey =
    typeof key === "number"
      ? key
      : encodeURIComponent(String(key).toLowerCase());
  const res = await fetch(`${API}/pokemon/${endpointKey}`);
  if (!res.ok) throw new Error("Not found");
  const pokemon = await res.json();
  const basic = mapPokemonBasic(pokemon);
  basic.height = pokemon.height;
  basic.weight = pokemon.weight;
  return localizeDetail(basic, lang);
}