<style lang="stylus" scoped>
.service-list {
  padding-top: .4rem;
  position: relative;
  z-index: 0;
}
.generic-list {
  border-bottom: solid 1px #eaeaea;
}
</style>

<template>
  <div class="service-list">
    <p v-if="curPage > 0 && list.length === 0" class="no-data">{{lang.noData}}</p>
    <div class="generic-list" v-if="list.length > 0">
      <list-item v-for="item in list" :couponId="item.coupon_id" :couponName="item.coupon_name" :couponLogo="item.coupon_list_img_url" :couponUv="item.count" :tags="item.tags" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></list-item>
    </div>
    <p v-if="list.length > 0 && hasNext === true" class="no-next-data">{{isLoading ? lang.moreLoading : lang.pullUpLoadMore}}</p>
    <p v-if="list.length > 0 && hasNext === false" class="no-next-data">{{lang.nextNoData}}</p>
  </div>
</template>

<script>
import ListItem from '../components/ListItem.vue';

import Helper from 'helper';
import {Http, CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    noData: '亲，还没有卡券~',
    nextNoData: '下面没有了~',
    pullUpLoadMore: '上拉加载更多~',
    moreLoading: '请稍等，正在努力加载中…'
  },
  'zh-tw': {
    noData: '親，還沒有卡券~',
    nextNoData: '下面沒有了~',
    pullUpLoadMore: '上拉加載更多~',
    moreLoading: '請稍等，正在努力加載中…'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    ListItem
  },
  data() {
    return {
      list: [],
      hasNext: false,
      curPage: 0,
      isLoading: false,
      lang: language
    };
  },
  watch: {
    $route(to, from) {
      this.list.splice(0, this.list.length);
      this.fetchData(this.getUrlParams(1));
    }
  },
  created() {
    this.fetchData(this.getUrlParams(1));
  },
  mounted() {
    window.document.addEventListener('scroll', this.loadMoreFn);
  },
  beforeDestroy() {
    window.document.removeEventListener('scroll', this.loadMoreFn);
  },
  methods: {
    fetchData(params) {
      this.isLoading = true;
      Http.fetch('coupon/get_tickets_list', params, CHANNEL_CODE, AREA_CODE).then(response => {
        this.isLoading = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.$set(this, 'list', this.list.concat(result.data.result_list));
              this.$set(this, 'hasNext', !!result.data.has_next);
              this.$set(this, 'curPage', result.data.curre_page);
            } else {
              throw result.msg;
            };
          };
        });
      });
    },
    getUrlParams(pageNumber) {
      const params = this.$route.params;

      return {
        category_id: 'category_id' in params ? params.category_id : 0,
        shop_id: 'shop_id' in params ? params.shop_id : 0,
        page: pageNumber || this.curPage + 1
      };
    },
    loadMoreFn(evt) {
      if (this.hasNext === false || this.isLoading === true) return;
      if (Helper.isPageBottom(Helper.rem2px(1))) this.loadMoreData();
    },
    loadMoreData() {
      this.fetchData(this.getUrlParams(0));
    }
  }
};
</script>
