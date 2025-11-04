import { Link } from "react-router-dom";
import { usePokedex } from "../store/pokedex.jsx";
import { asset } from "../utils/asset.js";
import { typePillClasses } from "../utils/typeColor.js";

export default function PokemonCard({ id, name, image, types }) {
  const { has, toggle } = usePokedex();
  const inPokedex = has(id);

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition relative">
      {/* Bouton pokéball : bloque la navigation et toggle l'état */}
      <button
        aria-pressed={inPokedex}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(id);
        }}
        className="group/pokeball absolute right-2 top-2 z-10 rounded-xl border bg-white/80 backdrop-blur p-1.5 shadow-sm
             hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-brand] focus-visible:ring-offset-2
             transition-all duration-200 cursor-pointer"
        title={inPokedex ? "Retirer du Pokédex" : "Ajouter au Pokédex"}
      >
        {/* halo uniquement quand on SURVOLE le bouton */}
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover/pokeball:ring-4 ring-[--color-brand]/20 transition-all duration-200" />

        {/* icône animée uniquement au survol du bouton */}
        <img
          src={inPokedex ? asset("poke_full.svg") : asset("poke_empty.svg")}
          alt={inPokedex ? "Dans le Pokédex" : "Hors du Pokédex"}
          className="h-6 w-6 transform transition-transform duration-200
               group-hover/pokeball:scale-110 group-hover/pokeball:rotate-6 active:scale-90"
          loading="lazy"
        />
      </button>

      <Link to={`/pokemon/${id}`} className="block">
        <div className="aspect-square grid place-items-center bg-gray-50">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-36 w-36 object-contain transition group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="animate-pulse h-10 w-10 bg-gray-200 rounded" />
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500">
            #{String(id).padStart(4, "0")}
          </div>
          <div className="font-semibold capitalize">{name}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {types?.map((t) => (
              <span
                key={t}
                className={`text-xs px-2 py-0.5 rounded-full capitalize border border-black/5 ring-1 ${typePillClasses(
                  t
                )}`}
                title={t}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
