import { useTranslation } from "react-i18next";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const languages = ["en", "pt", "es", "ar", "zh"];

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(i18n.language);
    const nextLang = languages[(currentIndex + 1) % languages.length];
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-md bg-zinc-200 dark:bg-[#1c1c1c] hover:bg-zinc-300 dark:hover:bg-[#2b2b2b] text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300"
    >
      {i18n.language.toUpperCase()}
    </button>
  );
};

export default LanguageToggle;
