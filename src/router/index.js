//白名单 不需要验证token
const whiteList = [
  '/',
  '/pages/index/index',
  '/pages/login/login',
  '/pages/login/privacy',
  '/pages/my/my',
  '/pages/tracking/tracking',
  '/pages/timeCost/timeCost',
  '/pages/service/service',
];
//登录页
const loginPage = '/pages/login/login';
export default function initPermission() {
  /**
   * 页面跳转拦截器
   */
  const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
  list.forEach((item) => {
    //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
    uni.addInterceptor(item, {
      invoke(e) {
        // 调用前拦截
        //console.log('拦截', e);
        //获取用户的token
        const token = uni.getStorageSync('token'),
          //获取要跳转的页面路径（url去掉"?"和"?"后的参数）
          url = e.url.split('?')[0];
        // 如果在whiteList里面就不需要登录
        if (whiteList.includes(url)) {
          return e;
        } else {
          //需要登录
          if (!token) {
            uni.navigateTo({
              url: loginPage,
            });
            return false;
          } else {
            return e;
          }
        }
      },
      fail(err) {
        // 失败回调拦截
        console.log(err);
      },
    });
  });
}
