<template>
  <view class="inbound">
    <view class="inbound-scan"> </view>
    <view class="inbound-input">
      <view class="inbound-input-label">货架号</view>
      <up-input
        v-model="shelfNumber"
        class="up-input"
        font-size="18px"
        placeholder="输入货架号"
        border="surround"
        clearable
      >
        <template #suffix>
          <image
            style="width: 32px; height: 32px"
            mode="aspectFill"
            src="/static/image/scan.png"
            @tap="triggerScan('shelfNumber')"
          ></image>
        </template>
      </up-input>
    </view>
    <view class="inbound-input">
      <view class="inbound-input-label">运单号</view>
      <up-input
        v-model="trackingNo"
        class="up-input"
        type="number"
        font-size="18px"
        placeholder="输入运单号"
        border="surround"
        color="#ff0000"
        clearable
      >
        <template #suffix>
          <image
            style="width: 32px; height: 32px"
            mode="aspectFill"
            src="/static/image/scan.png"
            @tap="triggerScan('trackingNo')"
          ></image>
        </template>
      </up-input>
    </view>
    <view class="inbound-confirm">
      <up-button
        text="确认"
        shape="circle"
        :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
        @tap="handleConfirm"
      ></up-button>
    </view>
    <view v-if="trackingNoList.length > 0" class="inbound-table">
      <scroll-view scroll-y="true" style="max-height: 350px">
        <uni-table ref="table" border stripe>
          <uni-tr>
            <uni-th width="150" align="center">运单号</uni-th>
            <uni-th width="80" align="center">货架号</uni-th>
            <uni-th width="80" align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in trackingNoList" :key="index">
            <uni-td align="center">
              {{ item.trackingNo }}
            </uni-td>
            <uni-td align="center">{{ item.shelfNumber }}</uni-td>
            <uni-td align="center">
              <view class="inbound-table-button">
                <up-icon name="trash" color="#FF0000" size="18" @click="handleDelete(index)"></up-icon>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
      </scroll-view>
    </view>
    <view class="inbound-upload">
      <view class="aggregate">{{ '合计：' + trackingNoList.length }}</view>

      <up-button
        text="上传"
        shape="circle"
        :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
        @tap="handleUpload"
      ></up-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { pushTrackingAPI } from '@/config/api.js';

// const scannerVisible = ref(false);
// let scan = null;

// const openScanner = () => {
//   scannerVisible.value = true;
//   // 避免重复创建
//   if (scan) return;
//   // 创建扫码器
//   scan = plus.barcode.create('scanner', [plus.barcode.QR, plus.barcode.EAN13], {
//     top: '0px',
//     left: '0px',
//     width: '100%',
//     height: '300px',
//     position: 'static',
//     frameColor: '#fcc800', // 扫描框边框颜色
//     scanbarColor: '#FF0000', // 扫描线颜色
//   });
//   scan.onmarked = (type, result) => {
//     // 处理扫码结果
//     uni.showToast({ title: '扫码结果：' + result, icon: 'none' });
//     // 继续扫描
//     setTimeout(() => {
//       scan.start();
//     }, 500);
//   };
//   // 挂载到页面自定义容器
//   const pages = getCurrentPages();
//   const currentWebview = pages[pages.length - 1].$getAppWebview();
//   const scannerDom = document.getElementById('scanner');
//   currentWebview.append(scan, scannerDom);
//   scan.start();
// };

const shelfNumber = ref('');
const trackingNo = ref('');

const { trackingNoList, addItem, removeItem, autoLoad, saveToLocal } = useLocalStorage('inbound_tracking_list', []);

autoLoad();

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

const triggerScan = (field) => {
  uni.scanCode({
    onlyFromCamera: true,
    success: (res) => {
      if (field === 'shelfNumber') {
        shelfNumber.value = res.result;
      } else if (field === 'trackingNo') {
        trackingNo.value = res.result;
        handleConfirm();
      }
    },
    fail: (err) => {
      console.error('扫码失败:', err);
    },
  });
};
const handleConfirm = () => {
  if (!trackingNo.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    });
    return;
  }

  if (!/^76\d{11}$/.test(trackingNo.value)) {
    uni.showToast({
      title: '运单号必须为76开头且为13位数字',
      icon: 'none',
    });
    return;
  }
  const exists = trackingNoList.some((item) => item.trackingNo === trackingNo.value);
  if (!exists) {
    addItem({
      shelfNumber: shelfNumber.value,
      trackingNo: trackingNo.value,
      scanTime: formatDateTime(),
    });
    trackingNo.value = '';
  } else {
    uni.showToast({
      title: '运单号已存在',
    });
  }
};

const handleUpload = async () => {
  try {
    if (trackingNoList.length === 0) {
      uni.showToast({
        title: '请添加运单号',
        icon: 'none',
      });
      return;
    }
    uni.showLoading({
      title: '上传中...',
    });

    const data = {
      statusCode: '901',
      dataList: trackingNoList,
    };
    const res = await pushTrackingAPI(data);
    if (res.code === 200 && res.data && Array.isArray(res.data)) {
      const successTrackingNumbers = res.data.filter((item) => item.code === 200).map((item) => item.trackingNo);
      const failedItems = res.data.filter((item) => item.code !== 200);

      for (let i = trackingNoList.length - 1; i >= 0; i--) {
        if (successTrackingNumbers.includes(trackingNoList[i].trackingNo)) {
          trackingNoList.splice(i, 1);
        }
      }
      saveToLocal();
    }
  } catch (error) {
    uni.showToast({
      title: '上传失败，请稍后再试',
      icon: 'none',
    });
  } finally {
    uni.hideLoading();
  }
};
</script>

<style lang="scss" scoped>
.inbound {
  padding: 15px;
}
.inbound-input {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.inbound-input-label {
  width: 60px;
}
.up-input {
  flex: 1;
  background: #fff;
}
.inbound-confirm {
  margin-top: 20px;
}
.inbound-table {
  margin-top: 20px;
  .th {
    font-weight: bold;
    background-color: rgb(245, 246, 248);
  }
}
.inbound-table-button {
  display: flex;
  justify-content: center;
  align-items: center;
}
.inbound-upload {
  position: fixed;
  bottom: 40px;
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
