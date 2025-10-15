import { useState } from "react";

export default function Pagination({ page, totalPages, onChange }) {
  const [goto, setGoto] = useState(page);

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function changeTo(p) {
    const np = clamp(p, 1, totalPages);
    setGoto(np);
    onChange?.(np);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => changeTo(1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40"
        title="Première page"
      >
        <span className="material-symbols-rounded text-base">first_page</span>
        <span className="sr-only">Début</span>
      </button>

      <button
        onClick={() => changeTo(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40"
        title="Page précédente"
      >
        <span className="material-symbols-rounded text-base">chevron_left</span>
        <span className="sr-only">Précédent</span>
      </button>

      <span className="text-sm text-gray-600 mx-1">
        Page <strong>{page}</strong> / {totalPages}
      </span>

      <button
        onClick={() => changeTo(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40"
        title="Page suivante"
      >
        <span className="material-symbols-rounded text-base">
          chevron_right
        </span>
        <span className="sr-only">Suivant</span>
      </button>

      <button
        onClick={() => changeTo(totalPages)}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40"
        title="Dernière page"
      >
        <span className="material-symbols-rounded text-base">last_page</span>
        <span className="sr-only">Fin</span>
      </button>

      {/* Aller à… */}
      <div className="flex items-center gap-2 ml-3">
        <label className="text-sm text-gray-600">Aller à</label>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goto}
          onChange={(e) => setGoto(Number(e.target.value || 1))}
          onKeyDown={(e) => {
            if (e.key === "Enter") changeTo(goto);
          }}
          className="w-20 rounded-lg border bg-white px-2 py-1.5 text-sm"
        />
        <button
          onClick={() => changeTo(goto)}
          className="rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          OK
        </button>
      </div>
    </div>
  );
}
