<script>
import initPermission from './router';
export default {
  onLaunch: function () {
    initPermission();
    console.log('App Launch');
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
