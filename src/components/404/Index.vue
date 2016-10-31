<style scoped>
  .page-404{min-height:80vh;}
  .page-content{text-align:center;color:#aaa;position:absolute;left:50%;top:50%;margin-top:.25rem;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);}
  .page-content:before{font-size:.6rem;line-height:1em;display:block;}
  .page-content>p{font-size:.16rem;line-height:1.2em;padding:.2rem 0;}
  .link-to{white-space:nowrap;}
  .link-to>span{padding:0 .05rem;display:inline-block;font-size:0;}
  .link-to>span>a{font-size:.14rem;color:#2cbcff;line-height:.24rem;border:solid 1px #2cbcff;padding:0 .08rem 0 .2rem;display:inline-block;border-radius:.02rem;position:relative;}
  .link-to>span>a:before{font-size:.12rem;position:absolute;left:.04rem;}
</style>
<template>
  <wrapper>
    <div class="page-404">
      <div class="page-content iconfont i-404-bfo">
        <p>{{lang.desc}}</p>
        <div class="link-to clearfix">
          <span><a @click="$router.go(-1)" class="iconfont i-arrow-left-bfo">{{lang.linkTo[0]}}</a></span>
          <span><router-link :to="{name: 'index'}" class="iconfont i-home-bfo">{{lang.linkTo[1]}}</router-link></span>
        </div>
      </div>
    </div>
  </wrapper>
</template>

<script>
import Wrapper from 'components/layout/Wrapper.vue';

import {LANG_TYPE} from 'config';

const Language = {
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
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Wrapper
  },
  data() {
    return {
      lang: language
    };
  },
  mounted: function() {
    this.$root.$emit('app:update', {
      title: language.title,
      item: ['back']
    });
  }
};
</script>
