import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './en.json';
import translationZh from './zh.json';
import enWalletRecods from './en-walletRecods';
import zhWalletRecods from './zh-walletRecods';
import enMessi from './en-messi.json';
import zhMessi from './zh-messi.json';

const resources = {
  en: {
    translation: { ...translationEn, ...enWalletRecods, ...enMessi },
  },
  zh: {
    translation: { ...translationZh, ...zhWalletRecods, ...zhMessi },
  },
};
const platformConfig = navigator.language;
const localStorageLanguage = localStorage.getItem('currentLanguage') || '';
const defaultLanguage = () => {
  if (platformConfig === 'zh-CN' || platformConfig === 'zh-SG') {
    return 'zh';
  }
  if (platformConfig === 'zh-TW' || platformConfig === 'zh-HK') {
    return 'zh_TW';
  }
  return 'en';
};
i18n.use(initReactI18next).init({
  resources,
  lng: localStorageLanguage || defaultLanguage(),
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
