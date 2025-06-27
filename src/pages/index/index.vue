<template>
  <view class="index">
    <view class="mb-12 index-banner"> </view>
    <view class="index-statistic">
      <view></view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { useI18n } from 'vue-i18n';
import { ref, reactive, computed, nextTick } from 'vue';
import { navigateToPage } from '@/util';
import { useProductStore, useMemberStore, useSceneStore } from '@/stores';

const statisticList = ref([
  {
    title: '今日已入库',
    value: 0,
  },
  {
    title: '今日库存量',
    value: 0,
  },
  {
    title: '今日出库量',
    value: 0,
  },
]);
</script>

<style lang="scss" scoped>
.index-banner {
  height: 300rpx;
  background: linear-gradient(0deg, #fffcf9 0%, #ffd166 100%);
  filter: blur(0px);
  opacity: var(0.7);
}
.index-statistic {
}
</style>
