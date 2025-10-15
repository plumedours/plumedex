import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = "pokedex"; // LocalStorage key
const PokedexContext = createContext({
  ids: [],
  has: () => false,
  add: () => {},
  remove: () => {},
  toggle: () => {},
  clear: () => {},
});

export function PokedexProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const api = useMemo(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      add: (id) => setIds((s) => (s.includes(id) ? s : [...s, id])),
      remove: (id) => setIds((s) => s.filter((x) => x !== id)),
      toggle: (id) =>
        setIds((s) =>
          s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        ),
      clear: () => setIds([]),
    }),
    [ids]
  );

  return (
    <PokedexContext.Provider value={api}>{children}</PokedexContext.Provider>
  );
}

export function usePokedex() {
  return useContext(PokedexContext);
}
