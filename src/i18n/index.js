import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import ar from "./ar";

const STORAGE_LANG_KEY = "ssp.lang";
const savedLang = localStorage.getItem(STORAGE_LANG_KEY);
const startLang = savedLang || "en";

const resources = { en, ar };

i18n.use(initReactI18next).init({
  resources,
  lng: startLang,
  fallbackLng: "en",
  defaultNS: "translation",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_LANG_KEY, lng);
  const dir = i18n.dir(lng);
  document.documentElement.setAttribute("dir", dir);
});
document.documentElement.setAttribute("dir", i18n.dir(startLang));

export default i18n;
export { STORAGE_LANG_KEY };
