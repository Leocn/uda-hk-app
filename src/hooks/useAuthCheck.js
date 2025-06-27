import { onShow } from '@dcloudio/uni-app';

function isLoggedIn() {
  const token = uni.getStorageSync('token');
  return token;
}

export function useAuthCheck() {
  onShow(() => {
    if (!isLoggedIn()) {
      uni.redirectTo({
        url: '/pages/login/login',
      });
    }
  });
}
