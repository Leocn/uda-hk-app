<template>
  <View class="my">
    <view class="top">
      <view class="profile">
        <!-- 已登录 -->
        <view v-if="memberStore.profile" class="overview">
          <navigator url="" hover-class="none">
            <image class="avatar" mode="aspectFill" src="/static/image/avatar.png"></image>
          </navigator>
          <view class="meta">
            <view class="nickname">{{ memberStore.profile.account }}</view>
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
    <view class="my-list">
      <up-cell-group :border="false">
        <up-cell icon="setting-fill" title="账户信息" url="/pages/setting/setting" is-link>
          <template #icon>
            <up-image width="20px" height="20px" src="/static/image/setting.png"></up-image>
          </template>
        </up-cell>
      </up-cell-group>
    </view>
  </View>
</template>

<script setup>
import { ref } from 'vue';
import { useMemberStore } from '@/stores';
import { maskPhoneNumber } from '../../util';

const memberStore = useMemberStore();
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}

.my {
  height: 100%;
}
.top {
  height: 250rpx;
  background: linear-gradient(180deg, #ffd166 0%, rgba(255, 209, 102, 0) 100%);
  filter: blur(0px);
  padding-top: 30px;
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

.my-list {
  margin: 12px;
  border-radius: 12px;
  background: #fff;
}
</style>
