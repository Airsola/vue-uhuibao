<style lang="stylus" scoped>
.page-404 {
  min-height: 80vh;
}
.page-content {
  text-align: center;
  color: #aaa;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: .25rem;
  transform: translate(-50%,-50%);
  &:before {
    font-size: .6rem;
    line-height: 1em;
    display: block;
  }
  & > p {
    font-size: .16rem;
    line-height: 1.2em;
    padding: .2rem 0;
  }
}
.link-to {
  white-space: nowrap;
  & > span {
    padding: 0 .05rem;
    display: inline-block;
    font-size: 0;
    & > a {
      font-size: .14rem;
      color: #2cbcff;
      line-height: .24rem;
      border: solid 1px #2cbcff;
      padding: 0 .08rem 0 .2rem;
      display: inline-block;
      border-radius: .02rem;
      position: relative;
      &:before {
        font-size: .12rem;
        position: absolute;
        left: .04rem;
      }
    }
  }
}

</style>
<template>
  <layout>
  <layout-header :title="lang.title" :search="false"></layout-header>
  <layout-body>
    <div class="page-404">
      <div class="page-content iconfont i-404-bfo">
        <p>{{lang.desc}}</p>
        <div class="link-to clearfix">
          <span><a @click="$router.go(-1)" class="iconfont i-arrow-left-bfo">{{lang.linkTo[0]}}</a></span>
          <span><router-link :to="{name: 'index'}" class="iconfont i-home-bfo">{{lang.linkTo[1]}}</router-link></span>
        </div>
      </div>
    </div>
  </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';

import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '页面未找到',
    desc: '您访问的页面未找到',
    linkTo: ['返回上一页', '回到首页']
  },
  'zh-tw': {
    title: '頁面未找到',
    desc: '您訪問的頁面未找到',
    linkTo: ['返回上一頁', '回到首頁']
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody
  },
  data() {
    return {
      lang: language
    };
  }
};
</script>
