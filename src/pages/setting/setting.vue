<template>
  <view class="container">
    <view class="card mb-12">
      <up-cell-group :border="false">
        <up-cell title="手机号" :value="phone" :border="false"></up-cell>
      </up-cell-group>
    </view>

    <up-button
      type="primary"
      :custom-style="{ color: '#222', width: '50%' }"
      color="#fcc800"
      shape="circle"
      text="退出登录"
      @click="show = true"
    ></up-button>
    <up-modal
      :show="show"
      :content="content"
      :show-cancel-button="true"
      confirm-color="#222"
      content-text-align="center"
      width="450rpx"
      @confirm="logout"
      @cancel="show = false"
    ></up-modal>
  </view>
</template>

<script setup>
import { useMemberStore } from '@/stores';
import { ref, computed } from 'vue';
import { maskPhoneNumber } from '@/util';

const memberStore = useMemberStore();

const phone = computed(() => {
  return memberStore.profile?.phone ? maskPhoneNumber(memberStore.profile.phone) : '';
});

const logout = () => {
  memberStore.clearProfile();
  uni.navigateBack();
};

const show = ref(false);
const content = ref('是否确定退出登录？');
</script>

<style lang="scss" scoped>
.container :deep(.u-modal__content__text) {
  text-align: center;
}
</style>
