import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPokemonLocalized } from "../hooks/usePokeApi.js";
import { useI18n } from "../i18n.jsx";
import { typePillClasses } from "../utils/typeColor.js";

export default function PokemonDetail() {
  const { name: param } = useParams(); // peut être un id (ex: "25") ou un nom ("pikachu")
  const { lang } = useI18n();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    // Si c’est un nombre, on le passe en nombre; sinon en texte
    const key = /^\d+$/.test(param) ? Number(param) : param;
    fetchPokemonLocalized(key, lang)
      .then((d) => {
        if (!ignore) setData(d);
      })
      .catch((e) => {
        if (!ignore) setError(e);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [param, lang]);

  if (loading)
    return (
      <div className="text-gray-500">
        {lang === "fr" ? "Chargement…" : "Loading…"}
      </div>
    );
  if (error || !data)
    return (
      <div className="text-red-600">
        {lang === "fr" ? "Pokémon introuvable." : "Pokémon not found."}
      </div>
    );

  return (
    <article className="grid md:grid-cols-2 gap-8">
      <div className="p-6 rounded-2xl border bg-white grid place-items-center">
        <img
          src={data.image}
          alt={data.name}
          className="h-64 w-64 object-contain"
        />
      </div>

      <div className="space-y-4">
        <div className="text-xs text-gray-500">
          #{String(data.id).padStart(4, "0")}
        </div>
        <h1 className="text-3xl font-extrabold capitalize">{data.name}</h1>

        <div className="flex gap-2 flex-wrap">
          {data.types.map((t) => (
            <span
              key={t}
              className={`text-xs px-2 py-1 rounded-full capitalize border border-black/5 ring-1 ${typePillClasses(
                t
              )}`}
              title={t}
            >
              {t}
            </span>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">
              {lang === "fr" ? "Taille" : "Height"}
            </dt>
            <dd className="font-medium">{data.height}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">
              {lang === "fr" ? "Poids" : "Weight"}
            </dt>
            <dd className="font-medium">{data.weight}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500">
              {lang === "fr" ? "Capacités" : "Abilities"}
            </dt>
            <dd className="font-medium capitalize">
              {data.abilities.join(", ")}
            </dd>
          </div>
          {data.flavor && (
            <div className="col-span-2">
              <dt className="text-sm text-gray-500">
                {lang === "fr" ? "Description" : "Flavor text"}
              </dt>
              <dd className="font-medium leading-relaxed">{data.flavor}</dd>
            </div>
          )}
        </dl>

        <Link
          to="/"
          className="inline-block mt-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          ← {lang === "fr" ? "Retour" : "Back"}
        </Link>
      </div>
    </article>
  );
}
