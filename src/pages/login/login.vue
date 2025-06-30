<template>
  <view class="viewport">
    <view class="logo">
      <image src="/static/image/uda-logo.png"></image>
    </view>
    <view class="login">
      <view class="input">
        <up-input v-model="form.mobile" shape="circle" type="number" placeholder="请输入手机号码" />
      </view>
      <view class="input">
        <up-input v-model="form.validateNo" shape="circle" type="number" placeholder="请输入密码" />
      </view>
      <!-- <view class="input">
        <up-input v-model="form.validateNo" shape="circle" placeholder="请输入验证码">
          <template #suffix>
            <view>
              <up-code ref="uCodeRef" seconds="60" @change="codeChange"></up-code>
              <up-button
                :text="tips"
                :custom-style="{ color: '#222', backgroundColor: '#fcc800' }"
                size="mini"
                @tap="getCode"
              ></up-button>
            </view>
          </template>
        </up-input>
      </view> -->

      <button
        :disabled="disabled"
        :class="{ button: true, 'button-disabled': disabled }"
        type="primary"
        @tap="onSubmit"
      >
        登录
      </button>

      <!--  判断是否勾选协议 -->
      <view class="tips" :class="{ animate__shakeY: isAgreePrivacyShakeY }">
        <up-checkbox v-model:checked="isAgreePrivacy" active-color="#fcc800" name="agree" shape="circle" used-alone>
          <template #label>
            <text>我已阅读并同意</text>
            <navigator class="link" hover-class="none" url="/pages/login/privacy">《韵达服务条款》</navigator>
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
    <custom-slider
      ref="sliderVerifyRef"
      verify-img="/static/image/slider_2.jpg"
      @success="successHandle"
      @error="errorHandle"
      @close="closeHandle"
    ></custom-slider>
  </view>
</template>

<script setup>
import { useMemberStore } from '@/stores';
import { onLoad } from '@dcloudio/uni-app';
import { reactive, ref, watch } from 'vue';

// 表单登录
const tips = ref('');
const uCodeRef = ref(null);
const codeChange = (text) => {
  tips.value = text;
};

const sliderVerifyRef = ref(null);

//验证通过回调
const successHandle = (e) => {
  if (uCodeRef.value.canGetCode) {
    getCodeAPI({ country: '86', mobile: form.mobile })
      .then(() => {
        // 这里此提示会被start()方法中的提示覆盖
        uni.$u.toast('验证码已发送');
        // 通知验证码组件内部开始倒计时
        uCodeRef.value.start();
      })
      .catch(() => {});
  } else {
    uni.$u.toast('倒计时结束后再发送');
  }
  console.log(e);
};
//验证失败回调
const errorHandle = (e) => {
  console.log(e);
};
//组件关闭回调
const closeHandle = (e) => {
  console.log(e);
};
const getCode = () => {
  if (!form.mobile) {
    uni.$u.toast('请输入手机号码');
    return;
  }
  sliderVerifyRef.value.show();
};

const form = reactive({
  mobile: '',
  validateNo: '',
});
const disabled = ref(true);
watch([() => form.mobile, () => form.validateNo], ([newM, newV]) => {
  if (newM && newV) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});

// 表单提交
const onSubmit = async () => {
  try {
    await checkedAgreePrivacy();
    loading.value = true;
    // const res = await mobileLoginAPI(form);
    const res = {
      id: 14,
      phone: '17621800204',
      wxOpenid: 'oqkck7UeQvUzR93yfwDvOaQMfQ1k',
      createTime: '2024-10-10 10:55:20',
      level: 0,
      token:
        'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoieWQiLCJqdGkiOiIxNCIsInN1YiI6IjE0IiwiaWF0IjoxNzUwOTk0MjIxLCJleHAiOjE3NTM1ODYyMjF9.NLrwg6YqUlyU_Ws2ISH1PMBh8g45GrdjYOS2qPC_JG8',
    };
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
      title: '请先阅读并勾选协议',
    });
    // 震动提示
    isAgreePrivacyShakeY.value = true;
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false;
    }, 500);
    return Promise.reject(new Error('请先阅读并勾选协议'));
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
  padding: 20rpx 40rpx;
  .login {
    display: flex;
    flex-direction: column;
    height: 60vh;
    padding: 40rpx 20rpx 20rpx;

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
  text-align: center;
  image {
    width: 410rpx;
    height: 110rpx;
    margin-top: 15vh;
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
