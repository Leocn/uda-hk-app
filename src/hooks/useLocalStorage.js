import { reactive, onMounted } from 'vue';

export function useLocalStorage(storageKey, defaultValue = []) {
  // 直接创建 trackingNoList
  const trackingNoList = reactive([...defaultValue]);

  // 保存到本地存储
  const saveToLocal = () => {
    try {
      uni.setStorageSync(storageKey, JSON.stringify(trackingNoList));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  };

  // 从本地存储读取
  const loadFromLocal = () => {
    try {
      const localData = uni.getStorageSync(storageKey);
      if (localData) {
        const list = JSON.parse(localData);
        trackingNoList.splice(0, trackingNoList.length, ...list);
      }
    } catch (error) {
      console.error('从本地存储读取失败:', error);
    }
  };

  // 清除本地存储
  const clearLocal = () => {
    try {
      uni.removeStorageSync(storageKey);
    } catch (error) {
      console.error('清除本地存储失败:', error);
    }
  };

  // 添加数据
  const addItem = (item) => {
    trackingNoList.push(item);
    saveToLocal();
  };

  // 删除数据
  const removeItem = (index) => {
    trackingNoList.splice(index, 1);
    saveToLocal();
  };

  // 清空所有数据
  const clearData = () => {
    trackingNoList.length = 0;
    clearLocal();
  };

  // 自动加载本地数据
  const autoLoad = () => {
    onMounted(() => {
      loadFromLocal();
    });
  };

  return {
    trackingNoList, // 直接返回 trackingNoList
    saveToLocal,
    loadFromLocal,
    clearLocal,
    addItem,
    removeItem,
    clearData,
    autoLoad,
  };
}
