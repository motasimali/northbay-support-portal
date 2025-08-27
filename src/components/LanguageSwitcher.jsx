import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const setLang = (lng) => {
    if (lng !== i18n.language) {
      i18n.changeLanguage(lng);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded border cursor-pointer ${i18n.language === "en" ? "bg-black text-white" : "bg-white"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`px-3 py-1 rounded border cursor-pointer ${i18n.language === "ar" ? "bg-black text-white" : "bg-white"}`}
      >
        AR
      </button>
    </div>
  );
}
