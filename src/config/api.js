import { http } from 'uview-plus';

// import FormData from './formData.js'; // 自定义formData封装

// 登录
export const accountLoginAPI = (params, config = { custom: { auth: false, catch: true } }) => {
  return http.post('/user/loginByAccount', params, config);
};

// 数据上传
export const pushTrackingAPI = (params, config = { custom: { auth: true } }) => {
  return http.post('/hkapp/popStationTrackingPush', params, config);
};
