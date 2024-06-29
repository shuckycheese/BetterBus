import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import 'intl-pluralrules'; // Import the polyfill

import enTranslations from './en.json';
import zhTranslations from './zh.json';
import msTranslations from './ms.json';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en', // default language
    resources: {
      en: {
        translation: enTranslations
      },
      zh: {
        translation: zhTranslations
      },
      ms: {
        translation: msTranslations
      }
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
