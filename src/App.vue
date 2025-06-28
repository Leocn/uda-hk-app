<script>
export default {
  onLaunch: function () {
    const token = uni.getStorageSync('token');
    if (!token) {
      // 未登录时跳转至登录页，并关闭启动页
      uni.reLaunch({
        url: '/pages/login/login',
        success: () => {
          // 手动关闭启动页（解决跳转闪烁）
          // #ifdef APP-PLUS
          //plus.navigator.closeSplashscreen();
          // #endif
        },
      });
    } else {
      // 已登录时直接关闭启动页
      // #ifdef APP-PLUS
      //plus.navigator.closeSplashscreen();
      // #endif
    }
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style lang="scss">
@import 'uview-plus/index.scss';

page {
  background-color: #f8f8f8;
}
.container {
  padding: 15px;
}

.button {
  margin-bottom: 15px;
}
.card {
  border-radius: 8px;
  padding: 12px;
  background-color: #fff;
}
.fs-12 {
  font-size: 12px;
}
.fs-14 {
  font-size: 14px;
}
.fw-700 {
  font-weight: 700;
}
.mb-12 {
  margin-bottom: 12px;
}
.mb-6 {
  margin-bottom: 6px;
}
</style>
