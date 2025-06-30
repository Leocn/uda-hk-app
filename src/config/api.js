import { http } from 'uview-plus';

// import FormData from './formData.js'; // 自定义formData封装

// 获取验证码
export const getCodeAPI = (params, config = { custom: { auth: true } }) => {
  return http.post('/user/getLoginValidateNo', params, config);
};

// 登录
export const mobileLoginAPI = (params, config = { custom: { auth: true, catch: true } }) => {
  return http.post('/user/loginByMobile', params, config);
};

// 数据上传
export const pushTrackingAPI = (params, config = { custom: { auth: false } }) => {
  return http.post('/hkapp/popStationTrackingPush', params, config);
};
