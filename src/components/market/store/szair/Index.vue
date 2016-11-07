<style lang="stylus" scoped>
.banner-image {
  width: 100%;
  display: block;
}
.generic-list {
  border-bottom: solid 1px #eaeaea;
}
</style>

<template>
  <layout>
    <layout-header :title="lang.title">
      <a slot="head:right" class="link" @click="redirectTo">{{lang.myOrder}}</a>
    </layout-header>
    <layout-body>
      <img :src="bannerImg" class="banner-image">
      <div class="goods-list">
        <p v-if="curPage > 0 && list.length === 0 && isLoading" class="no-data">{{lang.moreLoading}}</p>
        <p v-if="curPage > 0 && list.length === 0 && !isLoading" class="no-data">{{lang.noData}}</p>
        <div class="generic-list" v-if="list.length > 0">
          <list-item v-for="item in list" :goodsId="item.goods_id" :goodsName="item.goods_name" :goodsLogo="item.img_url" :goodsPrice="item.goods_price" :goodsUv="item.sell_num"></list-item>
        </div>
        <p v-if="list.length > 0 && hasNext === true" class="no-next-data">{{isLoading ? lang.moreLoading : lang.pullUpLoadMore}}</p>
        <p v-if="list.length > 0 && hasNext === false" class="no-next-data">{{lang.nextNoData}}</p>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../../../layout';
import ListItem from './components/ListItem.vue';

import {Http, LANG_TYPE, CHANNEL_CODE, AREA_CODE} from 'config';
import Helper from 'helper';
import bannerImg from 'assets/images/szair/banner.jpg';

const Language = {
  'zh-cn': {
    title: '境外通讯卡',
    myOrder: '我的',
    noData: '亲，还没有通讯卡~',
    nextNoData: '下面没有了~',
    pullUpLoadMore: '上拉加载更多~',
    moreLoading: '请稍等，正在努力加载中…'
  },
  'zh-tw': {
    title: '境外通讯卡',
    myOrder: '我的',
    noData: '亲，还没有通讯卡~',
    nextNoData: '下面没有了~',
    pullUpLoadMore: '上拉加载更多~',
    moreLoading: '请稍等，正在努力加载中…'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    ListItem
  },
  data() {
    return {
      list: [],
      hasNext: false,
      curPage: 0,
      isLoading: false,
      bannerImg,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('goods/list', {
      category_id: 'szair'
    }).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'list', vm.list.concat(result.data.list));
          vm.$set(vm, 'hasNext', !!result.data.next);
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  },
  mounted() {
    window.document.addEventListener('scroll', this.loadMoreFn);
  },
  beforeDestroy() {
    window.document.removeEventListener('scroll', this.loadMoreFn);
  },
  methods: {
    fetchData() {
      // 加载开始
      this.isLoading = true;

      Http.fetch('goods/list', {
        category_id: 'szair'
      }).then(response => {
        // 加载结束
        this.isLoading = false;

        Http.resolve(response).then(result => {
          this.$set(this, 'list', this.list.concat(result.data.list));
          this.$set(this, 'hasNext', !!result.data.next);
        }).catch(error => {
          this.$router.replace({path: '/404'});
          throw new Error(error);
        });
      });
    },
    loadMoreFn(evt) {
      if (this.hasNext === false || this.isLoading === true) return;
      if (Helper.isPageBottom(Helper.rem2px(1))) this.loadMoreData();
    },
    redirectTo() {
      window.location.href = '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!ucenter/order';
    }
  }
};
</script>
