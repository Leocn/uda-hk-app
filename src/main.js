import App from './App';
import i18n from './locale';
import { createSSRApp } from 'vue';
import uviewPlus from 'uview-plus';
import pinia from './stores';
import { initRequest } from './util/request/index';
import pointMixin from '@/statistics/pointMixin.js';
import mpShare from 'uview-plus/libs/mixin/mpShare';
import mpShareTimeline from '@/util/mixins/mpShareTimeline';

export function createApp() {
  const app = createSSRApp(App);
  //埋点的mixin
  app.mixin(pointMixin);
  app.mixin(mpShare);
  app.mixin(mpShareTimeline);
  app.use(i18n).use(uviewPlus).use(pinia);
  // 引入请求封装
  initRequest(app);
  return {
    app,
  };
}
