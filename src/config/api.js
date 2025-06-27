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

export const weChatLoginAPI = (params, config = { custom: { auth: true, catch: true } }) => {
  return http.post('/user/loginByWeChat', params, config);
};

//前端埋点数据保存
export const saveFrontEventAPI = (params, config = { custom: { auth: true } }) => {
  return http.post('/frontEvent/saveFrontEvent', params, config);
};

// 首页表单提交
export const submitFormAPI = (params, config = { custom: { auth: true } }) => {
  return http.post('/contact/saveContactInfo', params, config);
};

// 运费时效查询
export const getShippingCostAPI = (params, config = { custom: { auth: true, catch: true } }) => {
  return http.post('/miniQuote/getQuoteFromH5', params, config);
};

//  获取国家列表
export const getCountryListAPI = (config = { custom: { auth: true } }) => {
  return http.get('/sys/country/dic', config);
};
// 获取FBA仓库
export const getWarehouseListAPI = (config = { custom: { auth: true, catch: true } }) => {
  return http.get('/sys/freightWarehouse/dic', config);
};
// 物流查询
export const getTrackingInfoAPI = (params, config = { custom: { auth: true } }) => {
  return http.post('/miniTracking/getTrackingFromH5', params, config);
};

// 获取会员团登录信息
export const getVipUserIdAPI = (params, config = { custom: { auth: true, catch: true } }) => {
  return http.post('/vip/getVipUserId', params, config);
};
