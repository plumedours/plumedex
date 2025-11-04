// Normalise "Électrik" -> "electrik", "Plante" -> "plante"
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/**
 * Palette pastel (bg-50 + texte foncé + ring doux)
 * Mappée pour FR/EN.
 */
const MAP = {
  // Plante / Grass
  plante: "bg-green-50 text-green-800 ring-green-100",
  grass: "bg-green-50 text-green-800 ring-green-100",

  // Eau / Water
  eau: "bg-blue-50 text-blue-800 ring-blue-100",
  water: "bg-blue-50 text-blue-800 ring-blue-100",

  // Feu / Fire
  feu: "bg-orange-50 text-orange-800 ring-orange-100",
  fire: "bg-orange-50 text-orange-800 ring-orange-100",

  // Électrik / Electric
  electrik: "bg-amber-50 text-amber-800 ring-amber-100",
  electric: "bg-amber-50 text-amber-800 ring-amber-100",

  // Insecte / Bug
  insecte: "bg-lime-50 text-lime-700 ring-lime-100",
  bug: "bg-lime-50 text-lime-700 ring-lime-100",

  // Poison
  poison: "bg-purple-50 text-purple-800 ring-purple-100",

  // Vol / Flying
  vol: "bg-sky-50 text-sky-900 ring-sky-100",
  flying: "bg-sky-50 text-sky-900 ring-sky-100",

  // Sol / Ground
  sol: "bg-amber-50 text-amber-900 ring-amber-100",
  ground: "bg-amber-50 text-amber-900 ring-amber-100",

  // Roche / Rock
  roche: "bg-stone-50 text-stone-700 ring-stone-100",
  rock: "bg-stone-50 text-stone-700 ring-stone-100",

  // Psy / Psychic
  psy: "bg-rose-50 text-rose-800 ring-rose-100",
  psychic: "bg-rose-50 text-rose-800 ring-rose-100",

  // Glace / Ice
  glace: "bg-cyan-50 text-cyan-800 ring-cyan-100",
  ice: "bg-cyan-50 text-cyan-800 ring-cyan-100",

  // Dragon
  dragon: "bg-violet-50 text-violet-900 ring-violet-100",

  // Spectre / Ghost
  spectre: "bg-indigo-50 text-indigo-800 ring-indigo-100",
  ghost: "bg-indigo-50 text-indigo-800 ring-indigo-100",

  // Ténèbres / Dark
  tenebres: "bg-gray-50 text-gray-900 ring-gray-200",
  dark: "bg-gray-50 text-gray-900 ring-gray-200",

  // Acier / Steel
  acier: "bg-slate-50 text-slate-700 ring-slate-100",
  steel: "bg-slate-50 text-slate-700 ring-slate-100",

  // Fée / Fairy
  fee: "bg-pink-50 text-pink-800 ring-pink-100",
  fairy: "bg-pink-50 text-pink-800 ring-pink-100",

  // Combat / Fighting
  combat: "bg-orange-50 text-orange-900 ring-orange-100",
  fighting: "bg-orange-50 text-orange-900 ring-orange-100",

  // Normal
  normal: "bg-neutral-50 text-gray-700 ring-gray-200",
};

export function typePillClasses(label) {
  return MAP[norm(label)] || "bg-gray-100 text-gray-700 ring-gray-200";
}
