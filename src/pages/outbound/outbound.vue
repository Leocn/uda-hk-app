<template>
  <view class="outbound">
    <view class="outbound-scan"> </view>

    <view class="outbound-input">
      <view class="outbound-input-label">运单号</view>
      <up-input v-model="waybillNo" class="up-input" font-size="18px" placeholder="输入运单号" border="surround">
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
    <view class="inbound-table">
      <scroll-view scroll-y="true" style="max-height: 350px">
        <up-table>
          <up-tr>
            <up-th>运单号</up-th>
            <up-th>操作</up-th>
          </up-tr>
          <up-tr v-for="(item, index) in waybillNoList" :key="index">
            <up-td>{{ item.waybillNo }}</up-td>
            <up-td style="color: red" @click="handleDelete(index)">删除</up-td>
          </up-tr>
        </up-table>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
const waybillNo = ref('');
const waybillNoList = reactive([]);

const handleDelete = (index) => {
  waybillNoList.splice(index, 1);
};
const triggerScan = () => {
  uni.scanCode({
    onlyFromCamera: true,
    scanType: ['barCode'],
    success: (res) => {
      waybillNo.value = res.result;
      // 检查运单号是否已存在
      const exists = waybillNoList.some((item) => item.waybillNo === waybillNo.value);
      if (!exists) {
        waybillNoList.push({
          waybillNo: waybillNo.value,
        });
      } else {
        uni.showToast({
          title: '运单号已存在',
        });
      }
    },
    fail: (err) => {
      console.error('扫码失败:', err);
    },
  });
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
.inbound-table {
  margin-top: 12px;
}
</style>
