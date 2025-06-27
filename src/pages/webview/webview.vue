<template>
  <web-view :src="url"></web-view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

let url = ref();
onLoad((option) => {
  if (option.url) {
    url.value = decodeURIComponent(option.url);
  } else {
    uni.navigateBack();
  }
});
</script>

<style lang="scss" scoped></style>
