<template>
  <view class="viewport">
    <view class="logo">
      <image src="/static/image/uda-logo.png"></image>
    </view>
    <view class="login">
      <view class="input">
        <up-input v-model="form.account" shape="circle" placeholder="請輸入帳號" />
      </view>
      <view class="input">
        <up-input v-model="form.password" shape="circle" placeholder="請輸入密碼" />
      </view>

      <button
        :disabled="disabled"
        :class="{ button: true, 'button-disabled': disabled }"
        type="primary"
        @tap="onSubmit"
      >
        登入
      </button>

      <!--  判断是否勾选协议 -->
      <view class="tips" :class="{ animate__shakeY: isAgreePrivacyShakeY }">
        <up-checkbox v-model:checked="isAgreePrivacy" active-color="#fcc800" name="agree" shape="circle" used-alone>
          <template #label>
            <text>我已閱讀並同意</text>
            <navigator class="link" hover-class="none" url="/pages/login/privacy">《韻達服務條款》</navigator>
          </template>
        </up-checkbox>
      </view>
    </view>
    <up-loading-page
      :loading="loading"
      loading-text="loading..."
      image="/static/image/uda.png"
      icon-size="48"
      font-size="13"
    ></up-loading-page>
  </view>
</template>

<script setup>
import { useMemberStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref, computed } from 'vue';
import { accountLoginAPI } from '@/config/api';
import md5 from 'js-md5';

// 表单登录
const form = reactive({
  account: 'uda',
  password: '!testuda123',
});

const disabled = computed(() => {
  return !form.account || !form.password;
});

// 表单提交
const onSubmit = async () => {
  try {
    await checkedAgreePrivacy();
    loading.value = true;
    const data = {
      account: form.account,
      password: md5(form.password),
    };
    const res = await accountLoginAPI(data);
    loginSuccess(res);
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const loading = ref(false);
const loginSuccess = (profile) => {
  // 保存会员信息
  const memberStore = useMemberStore();
  memberStore.setProfile(profile);
  uni.switchTab({ url: '/pages/index/index' });
};

// 请先阅读并勾选协议
const isAgreePrivacy = ref(false);
const isAgreePrivacyShakeY = ref(false);

const checkedAgreePrivacy = async () => {
  if (!isAgreePrivacy.value) {
    uni.showToast({
      icon: 'none',
      title: '請先閱讀並勾選協議',
    });
    // 震动提示
    isAgreePrivacyShakeY.value = true;
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false;
    }, 500);
    return Promise.reject(new Error('請先閱讀並勾選協議'));
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #fff;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  .login {
    display: flex;
    flex-direction: column;
    height: 60vh;
    padding: 40rpx;

    .input {
      // width: 100%;
      // height: 80rpx;
      // font-size: 28rpx;
      margin-bottom: 20rpx;
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 80rpx;
      font-size: 28rpx;
      border-radius: 72rpx;
      color: #222;
      background-color: #fcc800;
      .icon {
        font-size: 40rpx;
        margin-right: 6rpx;
      }
      &::after {
        border: none;
      }
    }

    .button-disabled {
      opacity: 0.5;
    }
  }
}

.logo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fcc800;
  image {
    width: 410rpx;
    height: 110rpx;
  }
}

@keyframes animate__shakeY {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5rpx);
  }
  100% {
    transform: translate(0, 0);
  }
}

.animate__shakeY {
  animation: animate__shakeY 0.2s ease-in-out 3;
}

.button-privacy-wrap {
  position: relative;
  .button-opacity {
    opacity: 0;
    position: absolute;
    z-index: 1;
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  display: flex;
  justify-content: center;
  font-size: 22rpx;
  color: #999;

  .link {
    display: inline;
    color: #fcc800;
  }
}
</style>
