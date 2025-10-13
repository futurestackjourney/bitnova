import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ✅ Import all language JSON files for HOME
import enHome from "../i18n/locales/en/home.json";
import arHome from "../i18n/locales/ar/home.json";
import esHome from "../i18n/locales/es/home.json";
import ptHome from "../i18n/locales/pt/home.json";
import zhHome from "../i18n/locales/zh/home.json";

// ✅ Import all language JSON files for ABOUT
import enAbout from "../i18n/locales/en/about.json";
import arAbout from "../i18n/locales/ar/about.json";
import esAbout from "../i18n/locales/es/about.json";
import ptAbout from "../i18n/locales/pt/about.json";

// ✅ Check if user has a saved language preference
const savedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  debug: true,
  lng: savedLang, // Use saved language
  fallbackLng: "en",
  interpolation: { escapeValue: false },

  resources: {
    en: {
      translation: {
        home: enHome.home,
        about: enAbout.about,
      },
    },
    ar: {
      translation: {
        home: arHome.home,
        about: arAbout.about,
      },
    },
    es: {
      translation: {
        home: esHome.home,
        about: esAbout.about,
      },
    },
    pt: {
      translation: {
        home: ptHome.home,
        about: ptAbout.about,
      },
    },
    zh: {
      translation: {
        home: zhHome.home,
        // about: ptAbout.about,
      },
    },
  },
});

//  Watch for language changes and save them
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);


  //  Apply RTL or LTR based on language
  // if (lng === "ar") {
  //   document.documentElement.dir = "rtl";
  //   document.documentElement.lang = "ar";
  // } else {
  //   document.documentElement.dir = "ltr";
  //   document.documentElement.lang = lng;
  // }
});



export default i18n;
