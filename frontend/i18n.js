import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
            // Your English translations here
            "Select Language": "Select Language",
            "infoormation": "Information",
            "security": "Security",
            "others": "Others",
        },
      },
      ar: {
        translation: {
            "Select Language": "اختر اللغة",
            "infoormation": "معلومات",
            "security": "الأمان",
            "others": "الآخرون",
        },
      },
      fr: {
        translation: {
            "Select Language": "Choisir la langue",
            "infoormation": "Information",
            "security": "Sécurité",
            "others": "Autres",
        },
      },
      es: {
        translation: {
            "Select Language": "Seleccionar idioma",
            "infoormation": "Información",
            "security": "Seguridad",
            "others": "Otros",
        },
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
  });

export default i18n;