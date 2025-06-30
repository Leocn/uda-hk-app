import App from './App';
import i18n from './locale';
import { createSSRApp } from 'vue';
import uviewPlus from 'uview-plus';
import pinia from './stores';
import { initRequest } from './util/request/index';

export function createApp() {
  const app = createSSRApp(App);

  app.use(i18n).use(uviewPlus).use(pinia);
  // 引入请求封装
  initRequest(app);
  return {
    app,
  };
}
