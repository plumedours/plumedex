import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// IMPORTANT: change "Repo" si ton dépôt s'appelle autrement
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/plumedex/", // chemin de base pour GitHub Pages
});