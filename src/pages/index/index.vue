<template>
  <view class="index">
    <view class="index-banner mb-12">
      <swiper autoplay circular interval="3000" duration="500">
        <swiper-item v-for="(item, index) in bannerList" :key="index">
          <image :src="item" style="height: 100%; width: 100%" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="index-statistic card mb-12">
      <view v-for="(item, index) in statisticList" :key="index">
        <view :key="index" class="index-statistic-group">
          <view class="title">{{ item.title }}</view>
          <view class="value">{{ item.value }}</view>
        </view>
      </view>
    </view>

    <view class="index-action">
      <view class="index-action-item card" @click="navigateToPage('/pages/inbound/inbound')">
        <image src="/static/image/inbound.png" style="height: 48px; width: 48px"></image>
        <view class="text">入庫</view>
      </view>
      <view class="index-action-item card" @click="navigateToPage('/pages/outbound/outbound')">
        <image src="/static/image/outbound.png" style="height: 48px; width: 48px"></image>
        <view class="text">出庫</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { navigateToPage } from '@/util';
import { useMemberStore } from '@/stores';
import { getParcelStatisticsAPI } from '@/config/api.js';

const getParcelStatistics = async () => {
  try {
    const res = await getParcelStatisticsAPI();
    statisticList[0].value = res.todayInCnt;
    statisticList[1].value = res.totalPendingOutCnt;
    statisticList[2].value = res.todayOutCnt;
  } catch (error) {
    console.error('获取数据统计失败:', error);
  }
};

onShow(() => {
  getParcelStatistics();
});

const bannerList = reactive(['/static/image/slider_1.jpg']);

const statisticList = reactive([
  {
    title: '今日已入庫',
    value: 0,
  },
  {
    title: '庫存量',
    value: 0,
  },
  {
    title: '今日出庫量',
    value: 0,
  },
]);
</script>

<style lang="scss" scoped>
.index-banner {
  overflow: hidden;
}
.index-statistic {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 8px;
}
.index-statistic-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.index-action {
  display: flex;
  justify-content: space-around;
}
.index-action-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40%;
  font-size: 16px;
  font-weight: 700;
}
</style>
