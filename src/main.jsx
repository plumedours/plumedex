import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { I18nProvider } from "./i18n.jsx";
import { PokedexProvider } from "./store/pokedex.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <I18nProvider>
        <PokedexProvider>
          <App />
        </PokedexProvider>
      </I18nProvider>
    </HashRouter>
  </React.StrictMode>
);