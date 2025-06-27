<template>
  <view class="my-page">
    <view class="top">
      <view class="profile">
        <!-- 已登录 -->
        <view v-if="memberStore.profile" class="overview">
          <navigator url="" hover-class="none">
            <image class="avatar" mode="aspectFill" src="/static/image/avatar.png"></image>
          </navigator>
          <view class="meta">
            <view class="nickname">{{ maskPhoneNumber(memberStore.profile.phone) }}</view>
          </view>
          <!-- <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none">
            <up-icon name="setting-fill" size="24" color="#222"></up-icon>
          </navigator> -->
        </view>
        <!-- 未登录 -->
        <view v-else class="overview">
          <navigator url="/pages/login/login" hover-class="none">
            <image class="avatar" mode="aspectFill" src="/static/image/avatar.png"></image>
          </navigator>
          <view class="meta">
            <navigator url="/pages/login/login" hover-class="none" class="nickname">登录 | 注册</navigator>
          </view>
          <!-- <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none">
            <up-icon name="setting-fill" size="24" color="#222"></up-icon>
          </navigator> -->
        </view>
      </view>
    </view>
    <view class="container">
      <view class="board mb-12">
        <view class="flex-card share-card">
          <custom-ratio-image src="/static/image/share.png" width="32" height="32" align="middle"></custom-ratio-image>
          <text class="">分享有礼</text>
          <button class="share-button" open-type="share"></button>
        </view>
        <view class="flex-card">
          <custom-ratio-image src="/static/image/test.png" width="32" height="32" align="middle"></custom-ratio-image>
          <text class="">敬请期待</text>
        </view>
      </view>
      <view class="list">
        <up-cell-group :border="false">
          <up-cell icon="setting-fill" title="账户信息" url="/pageMember/setting/setting" is-link>
            <template #icon>
              <up-image width="20px" height="20px" src="/static/image/setting.png"></up-image>
            </template>
          </up-cell>
          <!-- <up-cell icon="map-fill" title="地址管理" url="/pages/addressBook/addressBook" is-link>
            <template #icon>
              <up-image width="20px" height="20px" src="/static/image/address.png"></up-image>
            </template>
          </up-cell> -->
          <up-cell icon="phone-fill" :border="false" title="联系客服" is-link @click="makePhoneCall">
            <template #icon>
              <up-image width="20px" height="20px" src="/static/image/phone.png"></up-image>
            </template>
          </up-cell>
        </up-cell-group>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useMemberStore } from '@/stores';
import { maskPhoneNumber } from '../../util';

const memberStore = useMemberStore();
const makePhoneCall = () => {
  uni.makePhoneCall({
    phoneNumber: '021-39296235',
    success: () => {
      console.log('拨打电话成功');
    },
    fail: () => {
      console.log('拨打电话失败');
    },
  });
};
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}

.my-page {
  height: 100%;
}
.top {
  height: 250rpx;
  background: linear-gradient(0deg, #fffcf9 0%, #ffd166 100%);
  filter: blur(0px);
  opacity: var(0.7);
  padding-top: 60px;
}
.profile {
  .overview {
    position: relative;
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #222;
  }

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 180rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
  }
}
.container {
  position: relative;
}
.board {
  position: absolute;
  top: -35px;
  left: 0;
  right: 0;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  .flex-card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    width: 45%;
    height: 70px;
    border-radius: 8px;
    padding: 12px;
    background-color: #fff;
  }
}
.list {
  margin-top: 45px;
  border-radius: 12px;
  background: #fff;
}
.share-card {
  position: relative;
}
.share-button {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  font-size: 16px;
  &::after {
    border: none;
  }
}
</style>
