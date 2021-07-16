import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '../locales/en/common.json';
import jaCommon from '../locales/ja/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  ja: {
    common: jaCommon,
  },
};

i18n.use(initReactI18next).init({
  lng: 'ja',
  fallbackLng: 'ja',
  // debug: process.env.NODE_ENV === 'development',

  ns: ['common'],
  defaultNS: 'common',

  interpolation: {
    // react automatically escape tags
    escapeValue: false,
  },

  react: {
    wait: true,
  },
  resources,
});

export default i18n;
