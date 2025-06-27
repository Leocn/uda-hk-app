import pagesObj from '@/config/pagesRoute.js'; // 页面路由和标题的映射 map

import { saveFrontEventAPI } from '@/config/api';

//console.log(pagesObj)

async function myPointPage(pageType = '', pageUrl = '') {
  //console.log('埋点', pageType, pageUrl);
  let entryTime, leaveTime, stayTime, nowTime;
  if (!pageType) return;
  if (pageType == 'entryPage') {
    entryTime = new Date().getTime();
    nowTime = new Date().getTime();
    leaveTime = null;
    uni.setStorageSync('entryTime', entryTime);
  } else {
    entryTime = uni.getStorageSync('entryTime');
    leaveTime = new Date().getTime();
    stayTime = leaveTime - entryTime;
    nowTime = new Date().getTime();
  }
  uni.getNetworkType({
    success: function (res) {
      let networkType = res.networkType;
      try {
        uni.getSystemInfo({
          success: function (res) {
            let { brand, platform, system } = res;
            let data = {
              pageType: pageType,
              pageUrl: pageUrl,
              title: pagesObj[pageUrl],
              entryTime: toDateDetail(entryTime),
              leaveTime: toDateDetail(leaveTime),
              stayTime: stayTime,
            };
            if (pageType === 'leavePage') {
              data.pageLoadTime = uni.getStorageSync('pageLoadTime');
            }
            //console.log('发送调用埋点接口', data);
            saveFrontEventAPI(data);
          },
          fail(error) {
            console.log('sysTemInfo is null');
          },
        });
      } catch (e) {
        console.log('sysTemInfo is null');
      }
    },
  });
}

async function myPointEvent(eventTrack = {}, pageUrl = '') {
  uni.getNetworkType({
    success: function (res) {
      let networkType = res.networkType;
      try {
        uni.getSystemInfo({
          success: function (res) {
            let { appName, appWgtVersion, brand, platform, system } = res;
            let data = {
              networkType: networkType,
              pageInfo: {
                pageUrl: pageUrl,
                title: pagesObj[pageUrl],
              },
              sysTemInfo: {
                appName,
                appVersion: appWgtVersion,
                brand,
                platform,
                system,
              },
              eventTrack,
            };
            //console.log('myPointEvent 发送调用埋点接口', data);
          },
          fail(error) {
            sysTemInfo = 'null';
          },
        });
      } catch (e) {}
    },
  });
}

function toDateDetail(number) {
  if (!number) return undefined;
  // var n = number * 1000
  var date = new Date(number);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '' + M + '' + D + ' ' + h + ':' + mm + ':' + s;
}

export default {
  myPointPage,
  toDateDetail,
  myPointEvent,
};
