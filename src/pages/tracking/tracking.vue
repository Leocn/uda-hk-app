<template>
  <view v-if="memberStore.profile">
    <view class="search-btn">
      <up-search
        v-model="trackingNo"
        placeholder=""
        :show-action="false"
        :clearabled="true"
        @focus="handleInput"
        @search="handleTracking"
      ></up-search>
      <view v-if="showHistory" class="overlay" @tap="showHistory = false"></view>
      <view v-if="showHistory" class="history">
        <view class="history-title">
          <text> 搜索历史 </text>
          <text @click="clearHistory"> 全部清除 </text>
        </view>
        <view class="history-number">
          <text v-for="item in historyMailNoList" :key="item" class="number" @tap="chooseHistoryNo(item)">
            {{ item }}
          </text>
        </view>
      </view>
    </view>
    <view v-if="trackList.length > 0" class="container track">
      <custom-track>
        <custom-track-item v-for="(item, index) in trackList" :key="index" background-color="transparent">
          <template #node>
            <view :class="index === 0 ? 'node-on' : 'node'">
              <up-icon :name="index === 0 ? 'checkbox-mark' : 'car'" color="#fff" :size="14" bold></up-icon>
            </view>
          </template>

          <template #content>
            <view>
              <!-- <view class="order-title">{{ item.scan_type }}</view> -->
              <view class="order-desc"> {{ item.remark }}</view>
              <view class="order-time">{{ item.time + ' Local Time' }} </view>
            </view>
          </template>
        </custom-track-item>
      </custom-track>
    </view>
    <view v-else class="container">
      <up-empty text="暂无物流信息" icon="/static/image/no_result.png"></up-empty>
    </view>
  </view>

  <view v-else class="no-auth">
    <up-empty text="登录后可查看更多信息" icon="/static/image/no_auth.png"></up-empty>
    <view style="width: 50%; margin-top: 20px">
      <up-button shape="circle" color="#fcc800" :custom-style="{ color: '#222' }" @click="handleLogin">
        登录
      </up-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useMemberStore } from '@/stores';
import { getTrackingInfoAPI } from '../../config/api';

onMounted(() => {
  if (uni.getStorageSync('TRACK_LIST')) {
    historyMailNoList.value = JSON.parse(uni.getStorageSync('TRACK_LIST'));
  }
});

const memberStore = useMemberStore();

const showHistory = ref(false);
const trackingNo = ref();
const historyMailNoList = ref([]);
const trackList = ref([]);
const handleInput = () => {
  showHistory.value = true;
};

const handleTracking = async () => {
  try {
    showHistory.value = false;
    if (trackingNo.value) {
      const data = { codeList: trackingNo.value, userId: memberStore.profile.phone };
      const res = await getTrackingInfoAPI(data);
      storeHistory(trackingNo.value);
      trackList.value = res[0].list || [];
    }
  } catch (e) {
    console.log(e);
  }
};
const storeHistory = (no) => {
  if (!historyMailNoList.value.includes(no)) {
    historyMailNoList.value.push(no);
    uni.setStorageSync('TRACK_LIST', JSON.stringify(historyMailNoList.value));
  }
}; // 删除历史记录
const clearHistory = () => {
  historyMailNoList.value.length = 0;
};
const chooseHistoryNo = (no) => {
  trackingNo.value = no;
  handleTracking();
};

const handleLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login',
  });
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.search-btn {
  background-color: #fff;
  padding: 15px;
}

.history {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  border-radius: 0 0 10px 10px;
  background: white;
  z-index: 100;
  max-height: 100px;
}
/* #ifdef H5 */
.history {
  position: fixed;
  top: 107px;
  left: 0;
  width: 100%;
  border-radius: 0 0 10px 10px;
  background: white;
  z-index: 100;
  max-height: 100px;
}
/* #endif */
.overlay {
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.history-title {
  display: flex;
  padding: 0 10px;
  justify-content: space-between;
  font-size: 12px;
  color: #7e7e7e;
}
.history-number {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  .number {
    flex: 1 100px;
    font-size: 12px;
    margin-bottom: 8px;
  }
}
.track {
  height: calc(100vh - 94px);
  overflow: auto;
}
/* #ifdef H5 */
.track {
  height: calc(100vh - 190px);
  overflow: auto;
}
/* #endif */
.slot-icon {
  width: 21px;
  height: 21px;
  background-color: $u-warning;
  border-radius: 100px;
  font-size: 12px;
  color: #fff;
  line-height: 21px;
  text-align: center;
}
.node {
  height: 44rpx;
  width: 44rpx;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.node-on {
  height: 44rpx;
  width: 44rpx;
  border-radius: 50%;
  background-color: #fcc800;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.order-title {
  padding-bottom: 12rpx;
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.order-desc {
  padding-bottom: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.order-time {
  font-size: 24rpx;
  font-weight: bold;
  color: #7e7e7e;
}
.no-auth {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
