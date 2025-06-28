<template>
  <view class="inbound">
    <view class="inbound-scan"> </view>
    <view class="inbound-input">
      <view class="inbound-input-label">货架号</view>
      <up-input v-model="shelfNo" class="up-input" font-size="18px" placeholder="输入货架号" border="surround">
        <template #suffix>
          <image
            style="width: 32px; height: 32px"
            mode="aspectFill"
            src="/static/image/scan.png"
            @tap="triggerScan('shelfNo')"
          ></image>
        </template>
      </up-input>
    </view>
    <view class="inbound-input">
      <view class="inbound-input-label">运单号</view>
      <up-input v-model="waybillNo" class="up-input" font-size="18px" placeholder="输入运单号" border="surround">
        <template #suffix>
          <image
            style="width: 32px; height: 32px"
            mode="aspectFill"
            src="/static/image/scan.png"
            @tap="triggerScan('waybillNo')"
          ></image>
        </template>
      </up-input>
    </view>
    <view class="inbound-confirm">
      <up-button
        text="确认"
        :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
        @tap="handleConfirm"
      ></up-button>
    </view>
    <view class="inbound-table">
      <scroll-view scroll-y="true" style="max-height: 350px">
        <up-table>
          <up-tr>
            <up-td class="th" width="140px">运单号</up-td>
            <up-td class="th">货架号</up-td>
            <up-td class="th">操作</up-td>
          </up-tr>
          <up-tr v-for="(item, index) in waybillNoList" :key="index">
            <up-td width="140px">{{ item.waybillNo }}</up-td>
            <up-td>{{ item.shelfNo }}</up-td>
            <up-td style="color: red" @click="handleDelete(index)">删除</up-td>
          </up-tr>
        </up-table>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const scannerVisible = ref(false);
let scan = null;

const openScanner = () => {
  scannerVisible.value = true;
  // 避免重复创建
  if (scan) return;
  // 创建扫码器
  scan = plus.barcode.create('scanner', [plus.barcode.QR, plus.barcode.EAN13], {
    top: '0px',
    left: '0px',
    width: '100%',
    height: '300px',
    position: 'static',
    frameColor: '#fcc800', // 扫描框边框颜色
    scanbarColor: '#FF0000', // 扫描线颜色
  });
  scan.onmarked = (type, result) => {
    // 处理扫码结果
    uni.showToast({ title: '扫码结果：' + result, icon: 'none' });
    // 继续扫描
    setTimeout(() => {
      scan.start();
    }, 500);
  };
  // 挂载到页面自定义容器
  const pages = getCurrentPages();
  const currentWebview = pages[pages.length - 1].$getAppWebview();
  const scannerDom = document.getElementById('scanner');
  currentWebview.append(scan, scannerDom);
  scan.start();
};

const shelfNo = ref('');
const waybillNo = ref('');
const waybillNoList = reactive([]);

const handleDelete = (index) => {
  waybillNoList.splice(index, 1);
};

const triggerScan = (field) => {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['barCode'],
    success: (res) => {
      if (field === 'shelfNo') {
        shelfNo.value = res.result;
      } else if (field === 'waybillNo') {
        waybillNo.value = res.result;
        handleConfirm();
      }
    },
    fail: (err) => {
      console.error('扫码失败:', err);
    },
  });
};
const handleConfirm = () => {
  if (!waybillNo.value) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none',
    });
    return;
  }
  const exists = waybillNoList.some((item) => item.waybillNo === waybillNo.value);
  if (!exists) {
    waybillNoList.push({
      shelfNo: shelfNo.value,
      waybillNo: waybillNo.value,
    });
  } else {
    uni.showToast({
      title: '运单号已存在',
    });
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
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.inbound-table {
  margin-top: 20px;
  .th {
    font-weight: bold;
    background-color: rgb(245, 246, 248);
  }
}
</style>
