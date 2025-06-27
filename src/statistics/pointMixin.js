import pointCom from '@/statistics/pointCom.js';

export default {
  data() {
    return {
      pointPageUrl: '', //跳转 url
      pageType: '', //事件类型 进入 entryPage、离开 leavePage
      loadStartTime: '', //页面加载 (load) 开始时间
    };
  },
  onLoad() {
    //this.entryTrack("onLoad");
  },
  onShow() {
    // 页面显示/切入前台时的埋点
    this.entryTrack('onShow');
  },
  onReady() {
    this.pageLoadTime();
  },
  onHide() {
    this.hideTrack();
  },
  onUnload() {
    this.unloadTrack();
  },
  methods: {
    //进入页面
    entryTrack(type = '') {
      let currentPages = getCurrentPages();
      if (currentPages.length > 0) {
        let pointPageUrl = currentPages[currentPages.length - 1].route;
        //console.log('entryPage : ', type, pointPageUrl);
        let loadStartTime = pointCom.toDateDetail(Number(new Date()));
        this.pointPageUrl = pointPageUrl;
        this.pageType = 'entryPage';
        this.loadStartTime = loadStartTime;
        pointCom.myPointPage('entryPage', this.pointPageUrl);
      }
    },
    //离开页面
    hideTrack() {
      //console.log('onHide : ', this.pointPageUrl);
      if (this.pageType === 'leavePage') return;
      this.pageType = 'leavePage';
      pointCom.myPointPage('leavePage', this.pointPageUrl);
    },
    unloadTrack() {
      //console.log('onUnload : ', this.pointPageUrl);
      if (this.pageType === 'leavePage') return;
      this.pageType = 'leavePage';
      pointCom.myPointPage('leavePage', this.pointPageUrl);
    },
    //加载时间
    pageLoadTime() {
      let pageLoadTime = Number(new Date()) - new Date(this.loadStartTime).getTime();
      //console.log('pageLoadTime', pageLoadTime, this.loadStartTime);
      uni.setStorageSync('pageLoadTime', pageLoadTime);
    },
    eventTrack(eventTrack = {}) {
      //console.log('eventTrack', eventTrack, this.pointPageUrl);
      let pointPageUrl = getCurrentPages()[getCurrentPages().length - 1].route;
      this.pointPageUrl = pointPageUrl;
      pointCom.myPointEvent(eventTrack, this.pointPageUrl);
    },
  },
};
