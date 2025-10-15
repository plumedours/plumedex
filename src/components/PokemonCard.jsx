import { Link } from "react-router-dom";

export default function PokemonCard({ id, name, image, types }) {
  return (
    <Link
      to={`/pokemon/${id}`} // ⟵ on route par ID (stable)
      className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition"
    >
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
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 capitalize"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}