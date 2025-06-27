import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSceneStore = defineStore(
  'scene',
  () => {
    const scene = ref('');
    const setScene = (val) => {
      scene.value = val;
    };

    return {
      scene,
      setScene,
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
