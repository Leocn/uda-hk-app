<template>
  <image
    :style="{ width: width + 'px', height: height + 'px', verticalAlign: align }"
    :src="imageUrl"
    mode="aspectFit"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps({
  width: {
    type: [Number, String],
    default: 48,
  },
  height: {
    type: [Number, String],
    default: 48,
  },
  src: {
    type: String,
    required: true,
  },
  align: {
    type: String,
    default: 'baseline',
  },
});
const imageUrl = ref();
onMounted(() => {
  let pixelRatio = uni.getWindowInfo().pixelRatio;
  if (pixelRatio >= 3) {
    imageUrl.value = props.src.replace('.png', '@3x.png');
  } else if (pixelRatio >= 2) {
    imageUrl.value = props.src.replace('.png', '@2x.png');
  } else {
    imageUrl.value = props.src;
  }
});
</script>

<style scoped></style>
