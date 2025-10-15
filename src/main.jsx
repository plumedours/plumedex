import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { I18nProvider } from "./i18n.jsx";
import { PokedexProvider } from "./store/pokedex.jsx"; // ⟵ AJOUT

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <PokedexProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </PokedexProvider>
    </I18nProvider>
  </React.StrictMode>
);
