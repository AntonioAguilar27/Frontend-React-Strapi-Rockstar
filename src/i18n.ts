// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importa tus traducciones
import translationES from "./locales/es/translation.json";
import translationEN from "./locales/en/translation.json";

const resources = {
  es: { translation: translationES },
  en: { translation: translationEN },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es", // idioma por defecto
  fallbackLng: "es", // idioma de respaldo si no se encuentra una traducción
  interpolation: {
    escapeValue: false, // React ya hace escaping
  },
});

export default i18n;
