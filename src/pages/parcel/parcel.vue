<template>
  <view class="parcel">
    <view class="head card">
      <up-search
        v-model="keyword"
        class="search"
        placeholder="運單後四位、取件碼、電話後四位、貨架號"
        height="48"
        color="#222"
        :show-action="false"
        @change="handleSearchDebounced"
        @search="handleSearchImmediate"
        @clear="handleSearchImmediate"
      ></up-search>
      <up-subsection
        :list="sectionList"
        :current="currentSection"
        active-color="#fcc800"
        @change="handleSectionChange"
      ></up-subsection>
    </view>
    <scroll-view class="list" scroll-y>
      <view class="list-content">
        <view v-for="item in parcelList" :key="item.id">
          <view class="card parcel-item">
            <view class="parcel-item-header">
              <text>
                貨架號：{{ item.shelfNumber }}
                <text style="display: inline-block; width: 16px"></text>
                取件碼：{{ item.receiverPickupNumber }}
              </text>
            </view>
            <view class="parcel-item-content">
              <view class="parcel-item-info">
                <text>{{ `${item.receiverName} ${item.receiverAddress}` }}</text>
              </view>
              <view class="parcel-item-info">
                <text>{{ '運單號：' + item.trackingNo }}</text>
              </view>
              <view class="parcel-item-info">
                <text> {{ '手機號：' + item.receiverPhone }}</text>
              </view>
            </view>

            <view v-if="item.orderStatus === 1" class="parcel-item-button">
              <up-button
                text="出庫"
                shape="circle"
                size="small"
                :custom-style="{ color: '#222', backgroundColor: '#fcc800', width: '60px', margin: 0 }"
                @tap="handleOutbound(item)"
              ></up-button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { getParcelAPI, pushTrackingAPI } from '@/config/api.js';
import { onShow } from '@dcloudio/uni-app';

onShow(() => {
  handleSearchImmediate();
});

const keyword = ref('');
const sectionList = ref([
  { id: 1, name: '已入库', status: 1 },
  { id: 2, name: '已出库', status: 2 },
]);
// 状态映射对象
const statusMap = {
  0: '待入庫',
  1: '已入庫',
  2: '已出庫',
  3: '已退回',
  4: '異常',
};
const getStatusName = (status) => {
  return statusMap[status];
};

const currentSection = ref(0);
const handleSectionChange = (index) => {
  currentSection.value = index;
  handleSearchImmediate();
};

const parcelList = ref([]);
const handleSearch = async () => {
  try {
    const res = await getParcelAPI({
      str: keyword.value,
      orderStatus: sectionList.value[currentSection.value].status,
    });
    parcelList.value = res || [];
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

let searchTimer = null;
// 防抖搜索 - 用于输入时的搜索
const handleSearchDebounced = () => {
  const trimmedKeyword = keyword.value.trim();
  if (trimmedKeyword && trimmedKeyword.length < 3) {
    return;
  }
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  // 设置新的定时器
  searchTimer = setTimeout(() => {
    handleSearch();
  }, 800); // 800ms 防抖延迟
};

// 立即搜索 - 用于点击搜索按钮、清空、切换标签等
const handleSearchImmediate = () => {
  // 清除防抖定时器
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }

  const trimmedKeyword = keyword.value.trim();
  if (trimmedKeyword && trimmedKeyword.length < 3) {
    return;
  }

  handleSearch();
};

const formatDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
const handleOutbound = async (item) => {
  try {
    uni.showLoading({
      title: '出庫中...',
    });

    const data = {
      statusCode: '10',
      dataList: [
        {
          trackingNo: item.trackingNo,
          scanTime: formatDateTime(),
        },
      ],
    };
    const res = await pushTrackingAPI(data);
    if (res) {
      uni.showToast({
        title: '出庫成功！',
        icon: 'success',
      });
      handleSearchImmediate();
    }
  } catch (error) {
    uni.showToast({
      title: '上傳失敗，請稍後再試',
      icon: 'none',
    });
  } finally {
    uni.hideLoading();
  }
};
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
}
.parcel {
  height: 100%;
}
.head {
  height: 100px;
}
.search {
  margin: 0 auto;
  padding-bottom: 12px;
  :deep(.uni-input-form) {
    font-size: 18px;
    font-weight: 700;
  }
}

.parcel-item {
  margin-bottom: 12px;
}
.parcel-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #222;
}
.parcel-item-content {
  margin-top: 8px;
  font-size: 13px;
}
.parcel-item-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
.list {
  height: calc(100% - 124px);
}
.list-content {
  padding: 12px;
}
</style>
