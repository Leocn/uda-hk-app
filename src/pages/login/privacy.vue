<template>
  <view class="privacy">
    <view v-html="policy.html"></view>
  </view>
</template>

<script setup>
import policy from '../../config/policy';
</script>

<style lang="scss" scoped>
.privacy {
  padding: 15px;
  background-color: #fff;
}
</style>
