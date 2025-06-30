<template>
  <view class="outbound">
    <view class="outbound-scan"> </view>

    <view class="outbound-input">
      <view class="outbound-input-label">运单号</view>
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
            @tap="triggerScan"
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
        <up-table>
          <up-tr>
            <up-th>运单号</up-th>
            <up-th>操作</up-th>
          </up-tr>
          <up-tr v-for="(item, index) in trackingNoList" :key="index">
            <up-td>{{ item.trackingNo }}</up-td>
            <up-td style="color: red" @click="handleDelete(index)">删除</up-td>
          </up-tr>
        </up-table>
      </scroll-view>
    </view>
    <view class="inbound-upload">
      <up-button
        text="确认上传"
        shape="circle"
        :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
        @tap="handleUpload"
      ></up-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { pushTrackingAPI } from '@/config/api.js';

const trackingNo = ref('');
const { trackingNoList, addItem, removeItem, clearData, autoLoad } = useLocalStorage('inbound_tracking_list', []);
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

const triggerScan = () => {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['barCode'],
    success: (res) => {
      trackingNo.value = res.result;
      handleConfirm();
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
      statusCode: '10',
      dataList: trackingNoList,
    };
    const res = await pushTrackingAPI(data);

    clearData();
    trackingNo.value = '';
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
.outbound {
  padding: 15px;
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
.inbound-confirm {
  margin-top: 20px;
}
.inbound-table {
  margin-top: 12px;
}
.inbound-upload {
  position: fixed;
  bottom: 40px;
  right: 10px;
  width: 100px;
}
</style>
