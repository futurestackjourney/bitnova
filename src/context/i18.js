import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//  Import all language JSON files for Navbar
import enNavbar from "../i18n/locales/en/navbar.json";
import arNavbar from "../i18n/locales/ar/navbar.json";
import esNavbar from "../i18n/locales/es/navbar.json";
import ptNavbar from "../i18n/locales/pt/navbar.json";
import zhNavbar from "../i18n/locales/zh/navbar.json";

//  Import all language JSON files for HOME
import enHome from "../i18n/locales/en/home.json";
import arHome from "../i18n/locales/ar/home.json";
import esHome from "../i18n/locales/es/home.json";
import ptHome from "../i18n/locales/pt/home.json";
import zhHome from "../i18n/locales/zh/home.json";

//  Import all language JSON files for ABOUT
import enAbout from "../i18n/locales/en/about.json";
import arAbout from "../i18n/locales/ar/about.json";
import esAbout from "../i18n/locales/es/about.json";
import ptAbout from "../i18n/locales/pt/about.json";

//  Check if user has a saved language preference
const savedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  debug: false,
  lng: savedLang, // Use saved language
  fallbackLng: "en",
  interpolation: { escapeValue: false },

  resources: {
    en: {
      translation: {
        navbar: enNavbar.navbar,
        home: enHome.home,
        about: enAbout.about,
      },
    },
    ar: {
      translation: {
        navbar: arNavbar.navbar,
        home: arHome.home,
        about: arAbout.about,
      },
    },
    es: {
      translation: {
        navbar: esNavbar.navbar,
        home: esHome.home,
        about: esAbout.about,
      },
    },
    pt: {
      translation: {
        navbar: ptNavbar.navbar,
        home: ptHome.home,
        about: ptAbout.about,
      },
    },
    zh: {
      translation: {
        navbar: zhNavbar.navbar,
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
