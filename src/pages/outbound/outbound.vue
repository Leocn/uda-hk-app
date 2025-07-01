<template>
  <view class="outbound">
    <view id="scanner" class="outbound-scan"> </view>
    <view class="outbound-content">
      <view class="outbound-input">
        <view class="outbound-input-label">運單號</view>
        <up-input
          v-model="trackingNo"
          class="up-input"
          type="number"
          font-size="18px"
          placeholder="輸入運單號"
          border="surround"
          color="#ff0000"
          clearable
          :custom-style="getInputStyle('trackingNo')"
        >
          <template #suffix>
            <image
              style="width: 32px; height: 32px"
              mode="aspectFill"
              src="/static/image/scan.png"
              @tap="triggerScan"
            ></image>
          </template>
        </up-input>
      </view>
      <view class="outbound-confirm">
        <up-button
          text="確認"
          shape="circle"
          :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
          @tap="handleConfirm"
        ></up-button>
      </view>
      <view v-if="trackingNoList.length > 0" class="outbound-table">
        <scroll-view scroll-y="true" style="max-height: 200px">
          <uni-table ref="table" border stripe>
            <uni-tr>
              <uni-th width="150" align="center">運單號</uni-th>
              <uni-th width="80" align="center">操作</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in trackingNoList" :key="index">
              <uni-td align="center">
                {{ item.trackingNo }}
              </uni-td>
              <uni-td align="center">
                <view class="outbound-table-button">
                  <up-icon name="trash" color="#FF0000" size="18" @click="handleDelete(index)"></up-icon>
                </view>
              </uni-td>
            </uni-tr>
          </uni-table>
        </scroll-view>
      </view>
    </view>

    <view class="outbound-upload">
      <view class="aggregate">{{ '合計：' + trackingNoList.length }}</view>
      <up-button
        text="上傳"
        shape="circle"
        :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
        @tap="handleUpload"
      ></up-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { pushTrackingAPI } from '@/config/api.js';

const { trackingNoList, addItem, removeItem, saveToLocal, autoLoad } = useLocalStorage('outbound_tracking_list', []);
autoLoad();

const scannerVisible = ref(false);
let scan = null;

onMounted(() => {
  // 頁面加載完成後自動打開掃描器
  openScanner();
});

const openScanner = () => {
  scannerVisible.value = true;
  // 避免重複創建
  if (scan) return;

  // 創建掃碼器
  scan = plus.barcode.create('scanner', [plus.barcode.CODE128, plus.barcode.QR], {
    top: '0px',
    left: '0px',
    width: '100%',
    height: '250px',
    position: 'static',
    frameColor: '#fcc800',
    scanbarColor: '#fcc800',
    background: '#000000',
    autoZoom: false,
  });

  scan.onmarked = (type, result) => {
    trackingNo.value = result;
    handleConfirm();

    // 繼續掃描
    setTimeout(() => {
      if (scan) {
        scan.start();
      }
    }, 500);
  };

  scan.onerror = (error) => {
    uni.showToast({
      title: '掃碼器啟動失敗',
      icon: 'none',
    });
  };

  // 掛載到頁面自定義容器
  const pages = getCurrentPages();
  const currentWebview = pages[pages.length - 1].$getAppWebview();
  currentWebview.append(scan);
  scan.start();
};

const closeScanner = () => {
  if (scan) {
    scan.close();
    scan = null;
  }
  scannerVisible.value = false;
};

const trackingNo = ref('');
const currentScanField = ref('trackingNo');
const onInputFocus = (field) => {
  currentScanField.value = field;
};

const getInputStyle = (field) => {
  return {
    borderColor: currentScanField.value === field ? '#ffc800 !important' : '#e5e5e5',
  };
};
const handleDelete = (index) => {
  removeItem(index);
};

const formatDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const triggerScan = () => {
  currentScanField.value = field;
};
const handleConfirm = () => {
  if (!trackingNo.value) {
    uni.showToast({
      title: '請填寫完整資訊',
      icon: 'none',
    });
    return;
  }

  if (!/^76\d{11}$/.test(trackingNo.value)) {
    uni.showToast({
      title: '運單號必須為76開頭且為13位數字',
      icon: 'none',
    });
    return;
  }
  const exists = trackingNoList.some((item) => item.trackingNo === trackingNo.value);
  if (!exists) {
    addItem({
      trackingNo: trackingNo.value,
      scanTime: formatDateTime(),
    });
    trackingNo.value = '';
  } else {
    uni.showToast({
      title: '運單號已存在',
      icon: 'none',
    });
  }
};
const handleUpload = async () => {
  try {
    if (trackingNoList.length === 0) {
      uni.showToast({
        title: '請添加運單號',
        icon: 'none',
      });
      return;
    }
    uni.showLoading({
      title: '上傳中...',
    });

    const data = {
      statusCode: '10',
      dataList: trackingNoList,
    };
    const res = await pushTrackingAPI(data);

    if (res) {
      const successTrackingNumbers = res.filter((item) => item.code === 200).map((item) => item.trackingNo);
      const failedItems = res.filter((item) => item.code !== 200);

      for (let i = trackingNoList.length - 1; i >= 0; i--) {
        if (successTrackingNumbers.includes(trackingNoList[i].trackingNo)) {
          trackingNoList.splice(i, 1);
        }
      }
      saveToLocal();
    }
  } catch (error) {
    uni.showToast({
      title: '上傳失敗，請稍後再試',
      icon: 'none',
    });
  } finally {
    uni.hideLoading();
  }
};
onUnmounted(() => {
  closeScanner();
});
</script>

<style lang="scss" scoped>
.outbound {
}
.outbound-scan {
  width: 100%;
  height: 240px;
  background: #000;
}
.outbound-content {
  margin: 15px;
}
.outbound-input {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.outbound-input-label {
  width: 60px;
}
.up-input {
  flex: 1;
  background: #fff;
}
.outbound-confirm {
  margin-top: 20px;
}
.outbound-table {
  margin-top: 12px;
}
.outbound-table-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.outbound-upload {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 100px;
}
.aggregate {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  font-size: 14px;
}
</style>
