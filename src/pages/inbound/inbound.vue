<template>
  <view class="warehouse-page inbound">
    <view v-show="currentTab === 1" id="scanner" class="warehouse-scan"> </view>
    <view class="warehouse-content">
      <view class="warehouse-content-tabs">
        <view
          v-for="item in tabList"
          :key="item.id"
          :class="['warehouse-content-tab', currentTab === item.id ? 'active-tab' : 'inactive-tab']"
          @tap="handleChangeTab(item.id)"
        >
          {{ item.name }}
          <image
            v-if="currentTab === item.id"
            src="/static/image/smile.png"
            style="height: 16px; width: 16px"
            mode="scaleToFill"
          />
        </view>
      </view>
      <view v-show="currentTab === 1" class="warehouse-input-group">
        <view class="warehouse-input" @tap="triggerScan('shelfNumber')">
          <view class="warehouse-input-label">貨架號</view>
          <up-input
            v-model="shelfNumber"
            class="up-input"
            font-size="18px"
            placeholder="掃描貨架號"
            border="surround"
            readonly
            clearable
            suffix-icon="scan"
            suffix-icon-style="color: #222"
            :custom-style="getInputStyle('shelfNumber')"
          >
          </up-input>
        </view>
        <view class="warehouse-input" @tap="triggerScan('trackingNo')">
          <view class="warehouse-input-label">運單號</view>
          <up-input
            v-model="trackingNo"
            class="up-input"
            type="number"
            font-size="18px"
            placeholder="掃描運單號"
            border="surround"
            color="#ff0000"
            readonly
            clearable
            suffix-icon="scan"
            suffix-icon-style="color: #222"
            :custom-style="getInputStyle('trackingNo')"
          >
          </up-input>
        </view>
      </view>
      <view v-show="currentTab === 2" class="warehouse-input-group">
        <view class="warehouse-input">
          <view class="warehouse-input-label">貨架號</view>
          <up-input
            v-model="shelfNumber"
            class="up-input"
            font-size="18px"
            placeholder="輸入貨架號"
            border="surround"
            clearable
          >
          </up-input>
        </view>
        <view class="warehouse-input">
          <view class="warehouse-input-label">運單號</view>
          <up-input
            v-model="trackingNo"
            class="up-input"
            type="number"
            font-size="18px"
            placeholder="輸入運單號"
            border="surround"
            color="#ff0000"
            clearable
          >
          </up-input>
        </view>
        <view class="warehouse-confirm">
          <up-button
            text="確認"
            shape="circle"
            :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
            @tap="handleConfirm"
          ></up-button>
        </view>
      </view>
      <view v-if="trackingNoList.length > 0" class="warehouse-table">
        <scroll-view scroll-y="true" style="max-height: 200px">
          <uni-table ref="table" border stripe>
            <uni-tr>
              <uni-th width="150" align="center">運單號</uni-th>
              <uni-th width="80" align="center">貨架號</uni-th>
              <uni-th width="80" align="center">操作</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in trackingNoList" :key="index">
              <uni-td align="center">
                {{ item.trackingNo }}
              </uni-td>
              <uni-td align="center">{{ item.shelfNumber }}</uni-td>
              <uni-td align="center">
                <view class="warehouse-table-button">
                  <up-icon name="trash" color="#FF0000" size="18" @click="handleDelete(index)"></up-icon>
                </view>
              </uni-td>
            </uni-tr>
          </uni-table>
        </scroll-view>
      </view>
    </view>

    <view class="warehouse-upload">
      <view class="aggregate">{{ '合計：' + trackingNoList.length }}</view>
      <view class="upload-button">
        <up-button
          text="上傳"
          shape="circle"
          :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
          @tap="handleUpload"
        ></up-button>
      </view>
    </view>
    <up-modal
      :show="showDeleteModal"
      title="提示"
      content="確認刪除嗎？"
      confirm-color="#ff0000"
      content-text-align="center"
      width="450rpx"
      :show-cancel-button="true"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    ></up-modal>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { pushTrackingAPI } from '@/config/api.js';

const { trackingNoList, addItem, removeItem, autoLoad, saveToLocal } = useLocalStorage('inbound_tracking_list', []);

autoLoad();

const currentTab = ref(1); // 默認選中第一個tab
const tabList = reactive([
  { id: 1, name: '掃描' },
  { id: 2, name: '手動輸入' },
]);
const handleChangeTab = (id) => {
  currentTab.value = id;
  if (id === 1) {
    openScanner();
  } else {
    closeScanner();
  }
};

const scannerVisible = ref(false);
let scan = null;
const shelfNumber = ref('');
const trackingNo = ref('');
const currentScanField = ref('shelfNumber');

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
    height: '280px',
    position: 'static',
    frameColor: '#fcc800', // 掃描框邊框顏色
    scanbarColor: '#fcc800', // 掃描線顏色
    background: '#000000', // 背景顏色
    autoZoom: true,
  });

  scan.onmarked = (type, result) => {
    if (currentScanField.value === 'shelfNumber') {
      shelfNumber.value = result;
    } else if (currentScanField.value === 'trackingNo') {
      handleScanConfirm(result);
    }

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

const getInputStyle = (field) => {
  return {
    borderColor: currentScanField.value === field ? '#ffc800 !important' : '#e5e5e5',
    borderWidth: currentScanField.value === field ? '1px !important' : '0.5px',
  };
};

const showDeleteModal = ref(false);
const deleteIndex = ref(null);

const handleDelete = (index) => {
  showDeleteModal.value = true;
  deleteIndex.value = index;
};

const confirmDelete = () => {
  removeItem(deleteIndex.value);
  showDeleteModal.value = false;
  deleteIndex.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  deleteIndex.value = null;
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

const triggerScan = (field) => {
  currentScanField.value = field;
};

const handleScanConfirm = (result) => {
  if (!/^76\d{11}$/.test(result)) {
    uni.showToast({
      title: '運單號必須為76開頭且為13位數字',
      icon: 'none',
    });
    return;
  }
  trackingNo.value = result;
  updateTrackingNoList();
};

const handleConfirm = () => {
  if (!trackingNo.value || !shelfNumber.value) {
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
  updateTrackingNoList();
};

const updateTrackingNoList = () => {
  // 扫描入库时检查货架号
  if (!shelfNumber.value) {
    uni.showToast({
      title: '​貨架號不能為空！',
      icon: 'none',
    });
    return;
  }
  const exists = trackingNoList.some((item) => item.trackingNo === trackingNo.value);
  if (!exists) {
    addItem({
      trackingNo: trackingNo.value,
      shelfNumber: shelfNumber.value,
      scanTime: formatDateTime(),
    });
  } else {
    uni.showToast({
      title: '運單號已存在',
      icon: 'none',
    });
  }
  trackingNo.value = '';
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
      statusCode: '901',
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
    trackingNo.value = '';
    shelfNumber.value = '';
    uni.hideLoading();
  }
};
onUnmounted(() => {
  closeScanner();
});
</script>

<style lang="scss" scoped>
@import '@/styles/warehouse-common.scss';
.inbound {
}
</style>
