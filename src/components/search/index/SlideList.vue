<style lang="sass" scoped>
.generic-list {
  border-bottom: solid 1px #eaeaea;
}
</style>

<template>
  <div class="swiper-slide">
    <p v-if="data.curPage > 0 && data.list.length === 0" class="no-data">{{lang.noData[0]}}{{productName}}{{lang.noData[1]}}</p>
    <div v-else class="generic-list">
      <news-list-item v-if="index === 4" v-for="item in data.list" :newsId="item.news_id" :newsName="item.news_title" :newsLogo="item.news_little_img_url" :newsDate="item.difftimedesc" :newsUv="item.news_click_num"></news-list-item>
      <task-list-item v-if="index === 2" v-for="item in data.list" :taskId="item.taskId" :taskName="item.title" :taskLogo="item.logo" :taskCost="item.cost" :taskUv="item.task_click_num"></task-list-item>
      <coupon-list-item v-if="index === 3" v-for="item in data.list" :couponId="item.coupon_id" :couponName="item.coupon_name" :couponLogo="item.coupon_list_img_url" :couponUv="item.count" :tags="item.tags" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></coupon-list-item>
    </div>
    <p v-if="data.list.length > 0 && data.hasNext === true" class="no-next-data">{{data.isLoading ? lang.moreLoading : lang.pullUpLoadMore}}</p>
    <p v-if="data.list.length > 0 && data.hasNext === false" class="no-next-data">{{lang.nextNoData}}</p>
  </div>
</template>

<script>
import TaskListItem from '../../task/components/ListItem.vue';
import CouponListItem from '../../coupon/components/ListItem.vue';
import NewsListItem from '../../news/components/ListItem.vue';

import Helper from 'helper';
import {Http, CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    noData: ['亲，还没有', '~'],
    nextNoData: '下面没有了~',
    pullUpLoadMore: '上拉加载更多~',
    moreLoading: '请稍等，正在努力加载中…'
  },
  'zh-tw': {
    noData: ['親，還沒有', '~'],
    nextNoData: '下面沒有了~',
    pullUpLoadMore: '上拉加載更多~',
    moreLoading: '請稍等，正在努力加載中…'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    NewsListItem,
    TaskListItem,
    CouponListItem
  },
  props: ['productName', 'data', 'active', 'index', 'keyword', 'swiperUpdate'],
  data() {
    return {
      lang: language
    };
  },
  mounted: function() {
    window.document.addEventListener('scroll', this.loadMoreFn);
  },
  beforeDestroy: function() {
    window.document.removeEventListener('scroll', this.loadMoreFn);
  },
  methods: {
    loadMoreFn: function(evt) {
      if (this.data.hasNext === false || this.data.isLoading === true) return;
      if (Helper.isPageBottom(Helper.rem2px(1))) this.fetchData(this.index, this.data.curPage + 1);
    },
    fetchData: function(flag, page) {
      switch (this.active) {
        case 0 :
          if (this.index !== 4) return;
          break;

        case 1 :
          if (this.index !== 2) return;
          break;

        case 2 :
          if (this.index !== 3) return;
          break;
      };

      // 加到加载状态
      this.data.isLoading = true;

      // 请求数据
      Http.fetch('common/search_data', CHANNEL_CODE, AREA_CODE, {
        keyword: this.keyword,
        flag: flag,
        page: page
      }).then(response => {
        // 加载完成，结束加载状态
        this.data.isLoading = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              const task = result.data.tao_list;
              const coupon = result.data.coupon_list;
              const news = result.data.news_list;

              if (this.index === 2) {
                this.$set(this.data, 'list', this.data.list.concat(task.list));
                this.$set(this.data, 'curPage', task.page);
                this.$set(this.data, 'hasNext', task.page < task.total);
              };

              if (this.index === 3) {
                this.$set(this.data, 'list', this.data.list.concat(coupon.result_list));
                this.$set(this.data, 'curPage', coupon.curre_page);
                this.$set(this.data, 'hasNext', coupon.has_next);
              };

              if (this.index === 4) {
                this.$set(this.data, 'list', this.data.list.concat(news.result_list));
                this.$set(this.data, 'curPage', news.curre_page);
                this.$set(this.data, 'hasNext', news.has_next);
              };

              this.$nextTick(this.swiperUpdate);
            } else {
              throw result.msg;
            };
          };
        });
      });
    }
  }
};
</script>
