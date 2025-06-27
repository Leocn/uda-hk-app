export function objectToEncodedQueryString(params) {
  return Object.keys(params)
    .filter((key) => params[key] != null && params[key] !== '') // 过滤掉 undefined 值
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export function navigateToPage(url, params) {
  let queryString = '';
  if (params) {
    queryString = objectToEncodedQueryString(params);
  }
  uni.navigateTo({
    url: queryString ? url + '?' + queryString : url,
  });
}

export function maskPhoneNumber(phoneNumber) {
  phoneNumber = String(phoneNumber);
  return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

export function urlToBase64(src) {
  let img = src,
    base64Url = '';
  // #ifdef MP-WEIXIN
  let imgBase64 = wx.getFileSystemManager().readFileSync(img, 'base64');
  base64Url = `data:image/png;base64,${imgBase64}`;
  // #endif
  return base64Url || img;
}
