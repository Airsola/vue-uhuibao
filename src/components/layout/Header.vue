<style lang="stylus" scoped>
.layout-header {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.5rem;
  text-align: center;
  background-color: #2cbcff;
  & > span {
    &.app-title {
      font-size: 0.18rem;
      line-height: 0.5rem;
      height: 0.5rem;
      display: block;
      overflow: hidden;
      margin: 0 0.5rem;
      color: #fff;
    }
  }
  & > a {
    &.icon {
      width: 0.24rem;
      height: 0.24rem;
      display: block;
      position: absolute;
      top: 50%;
      margin-top: -0.12rem;
      z-index: 1;
      overflow: hidden;
      &:before {
        font-size: .2rem;
        color: #fff;
        line-height: .24rem;
      }
    }
    &.search {
      right: .13rem;
    }
    &.back {
      left: 0.13rem;
      &:before {
        font-size: .16rem;
      }
    }
    &.link {
      position: absolute;
      right: .2rem;
      top: 50%;
      margin-top: -1em;
      font-size: .14rem;
      color: #fff;
      line-height: 2em;
    }
    &.shoppingcart {
      position: absolute;
      top: 50%;
      right: .2rem;
      z-index: 1;
      font-size: .09rem;
      color: #fff;
      display: none;
      white-space: nowrap;
      text-align: center;
      line-height: 1em;
      transform: translateY(-50%);
      &:before {
        font-size: .2rem;
        line-height: .2rem;
        margin-bottom: .02rem;
      }
      & > i {
        padding: 0 .04rem;
        background-color: #ff7800;
        border-radius: .14rem;
        line-height: 1.6em;
        height: 1.6em;
        font-size: .09rem;
        position: absolute;
        top: 0;
        left: .12rem;
        margin-top: -.04rem;
      }
    }
  }
  & > .search-bar {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -.15rem;
    height: .3rem;
    width: 2.7rem;
    margin-left: -1.35rem;
    border-radius: .02rem;
    background-color: #19a8ea;
    display: block;
    & > input {
      border: none;
      position: absolute;
      left: .07rem;
      top: 0;
      width: 95%;
      height: 100%;
      background-color: transparent;
      font-size: .13rem;
      color: #fff;
      &::-webkit-input-placeholder {
        color: rgba(255,255,255,.75);
      }
    }
  }
}
</style>

<template>
  <header class="layout-header">
    <slot>
      <slot name="head:left">
        <a class="icon iconfont i-arrow-left-bfo back" @click="$router.go(-1)"></a>
      </slot>
      <slot name="head:title">
        <span class="app-title">{{title}}</span>
      </slot>
      <slot name="head:right" v-if="search !== false">
        <router-link :to="{name: 'search'}" class="icon iconfont i-search-bfo search"></router-link>
      </slot>
    </slot>
  </header>
</template>

<script>
export default {
  name: 'header',
  props: ['title', 'search']
};
</script>
