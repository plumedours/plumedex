export function asset(path) {
  const base = import.meta.env.BASE_URL || "/";
  const clean = String(path).replace(/^\/+/, ""); // enlève les / au début
  return base.endsWith("/") ? base + clean : base + "/" + clean;
}
