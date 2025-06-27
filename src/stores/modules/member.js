import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref();

    // 保存会员信息，登录时使用
    const setProfile = (val) => {
      profile.value = val;
      uni.setStorageSync('token', val.token);
    };
    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined;
      uni.removeStorageSync('token');
    };

    return {
      profile,
      setProfile,
      clearProfile,
    };
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          uni.setStorageSync(key, value);
        },
      },
    },
  },
);
