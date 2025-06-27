const mpShareTimeline = {
  data() {
    return {
      shareTimeline: {
        // 转发的标题
        title: '', // 默认为小程序名称
        path: '/pages/index/index', // 默认为当前页面路径
        imageUrl: '', // 默认为当前页面的截图
      },
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    // 获取加载的页面
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    //分享的页面路径
    if (!this.shareTimeline.path) {
      // #ifdef MP-WEIXIN
      this.shareTimeline.path = `/${page.route}`;
      //#endif
    }
    //转发参数
    return this.shareTimeline;
  },
};

export default mpShareTimeline;
