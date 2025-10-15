import { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext({ lang: "fr", setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
