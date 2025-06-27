<template>
  <!-- v-if="memberStore.profile" -->
  <view class="container">
    <view v-for="(item, index) in productStore.introduction" :key="item.id" class="card mb-12">
      <view class="service-title">
        <custom-ratio-image width="48" height="48" :src="item.image"></custom-ratio-image>
        <text>{{ item.title }}</text>
      </view>
      <view class="service-desc">
        <up-text :lines="3" :text="item.description" size="12" color="#7e7e7e"></up-text>
      </view>
      <view class="service-detail" @tap="toProduct(item.title)">
        {{ $t('index.viewMore') }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useMemberStore, useProductStore } from '@/stores';

//useAuthCheck();
const memberStore = useMemberStore();
const productStore = useProductStore();

const toProduct = (title) => {
  uni.navigateTo({
    url: '/pages/product/product?title=' + title,
  });
};
</script>

<style lang="scss" scoped>
.service-title {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
}
.service-desc {
  margin-top: 20px;
  font-size: 12px;
  color: #7e7e7e;
}

.service-detail {
  margin-top: 20px;
  font-size: 12px;
}
</style>
