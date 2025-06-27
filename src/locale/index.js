import { createI18n } from 'vue-i18n';
import en from './en.json';
import zhHans from './zh-Hans.json';

const messages = {
  en,
  'zh-Hans': zhHans,
};

const i18n = createI18n({
  locale: uni.getLocale(),
  legacy: false,
  globalInjection: true,
  messages,
});

export default i18n;
