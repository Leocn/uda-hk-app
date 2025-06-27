// 引入拦截器配置
import { requestInterceptors, responseInterceptors } from './interceptors.js';
import { http } from 'uview-plus';

const isMp = process.env.UNI_PLATFORM && process.env.UNI_PLATFORM.startsWith('mp');
const config = {
  baseURL: isMp ? import.meta.env.VITE_APP_BASE_URL_MP : import.meta.env.VITE_APP_BASE_URL,
};

//  初始化请求配置
const initRequest = (vm) => {
  http.setConfig((defaultConfig) => {
    /* defaultConfig 为默认全局配置 */
    defaultConfig.baseURL = config.baseURL; /* 根域名 */
    return defaultConfig;
  });
  requestInterceptors();
  responseInterceptors();
};
export { initRequest };
