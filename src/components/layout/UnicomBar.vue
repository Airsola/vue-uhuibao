<style lang="stylus" scoped>
.top-bar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  height: .3rem;
  background-color: #fff;
  width: 100%;
  & > a {
    &.logo {
      width: .6rem;
      height: .2rem;
      background: url('../../assets/17wo.png') no-repeat 0 0;
      background-size: 100% 100%;
      display: block;
      position: absolute;
      left: .1rem;
      top: 50%;
      margin-top: -.1rem;
    }
    &.phone {
      display: inline-block;
      position: absolute;
      right: .1rem;
      top: 50%;
      margin-top: -.1rem;
      line-height: .2rem;
      color: #666;
    }
  }
}
</style>
<style lang="stylus">
.has-top-bar {
  & > .layout-header {
    top: .3rem !important;
  }
  & > .layout-body {
    padding-top: .8rem !important;
  }
  & > .top-bar-fixed {
    top: .8rem !important;
  }
}
</style>
<template>
  <header class="top-bar">
    <a :href="'http://wap.17wo.cn/Index.action?jsessionid=' + jsessionid" class="logo"></a>
    <a :href="'http://wap.17wo.cn/MyZone.action?jsessionid=' + jsessionid" class="phone">{{mobile}}</a>
  </header>
</template>

<script>
export default {
  props: ['jsessionid', 'mobile']
};
</script>
