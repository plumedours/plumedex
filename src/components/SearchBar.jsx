import { useState, useRef, useEffect } from "react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  suggestions = [],
  onSelectSuggestion,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    setOpen((value?.length || 0) >= 3 && suggestions.length > 0);
  }, [value, suggestions]);

  return (
    <div className="relative" ref={ref}>
      <form
        onSubmit={(e) => {
          onSubmit(e);
          setOpen(false);
        }}
        className="flex gap-2"
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full md:w-80 px-4 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[--color-brand]"
          onFocus={() =>
            (value?.length || 0) >= 3 && suggestions.length > 0 && setOpen(true)
          }
        />
        <button className="px-4 py-2 rounded-xl bg-[--color-brand] text-white font-medium hover:opacity-90">
          OK
        </button>
      </form>

      {open && (
        <div className="absolute z-20 mt-2 w-full max-h-80 overflow-auto rounded-xl border bg-white shadow">
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelectSuggestion?.(s);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="truncate">{s.label}</span>
              <span className="text-xs text-gray-400">
                #{String(s.id).padStart(4, "0")}
              </span>
            </button>
          ))}
          {suggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Aucun résultat
            </div>
          )}
        </div>
      )}
    </div>
  );
}
