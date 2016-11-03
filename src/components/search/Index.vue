<style lang="sass" scoped>
.main-nav {
  background-color: #fff;
  border-bottom: solid 1px #eaeaea;
  line-height: .39rem;
  position: relative;
  z-index: 0;
  & > span {
    float: left;
    width: 33.333%;
    position: relative;
    text-align: center;
    font-size: .14rem;
    color: #999;
    transition: color .2s ease;
    &.current {
      color: #222;
    }
    &:first-of-type {
      &:before {
        display: none;
      }
    }
    &:before {
      height: 50%;
    }
  }
}
</style>
<template>
  <layout>
    <layout-header>
      <div slot="head:title" class="search-bar">
        <input :placeholder="lang.title" v-model="keyword" type="text">
      </div>
      <a slot="head:right" class="icon iconfont i-search-bfo search" @click="searchData"></a>
    </layout-header>
    <layout-body>
      <p v-show="!lastKeyword" class="no-data">{{lang.noTypeKeyword}}</p>
      <div v-show="lastKeyword" class="search-result">
        <nav class="main-nav clearfix">
          <span v-for="(name, index) in lang.productName" :class="['leftline', index === active ? 'current t-bold' : '']" @click="slideTo(index)">{{name}}</span>
        </nav>
        <div class="swiper-container" ref="swiper">
          <div class="swiper-wrapper">
            <slide-list :productName="lang.productName[0]" :active="active" :index="4" :data="news" :keyword="keyword" :swiperUpdate="swiperUpdate"></slide-list>
            <slide-list :productName="lang.productName[1]" :active="active" :index="2" :data="task" :keyword="keyword" :swiperUpdate="swiperUpdate"></slide-list>
            <slide-list :productName="lang.productName[2]" :active="active" :index="3" :data="coupon" :keyword="keyword" :swiperUpdate="swiperUpdate"></slide-list>
          </div>
        </div>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import SlideList from './index/SlideList.vue';

import Swiper from 'swiper';
import {Http, CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '请输入需要搜索的关键字',
    noTypeKeyword: '请输入关键字~',
    noTypeKeywordTips: '请输入关键字！',
    noTypeNewKeywordTips: '请输入新的关键字！',
    productName: ['资讯', '淘流量', '卡券']
  },
  'zh-tw': {
    title: '請輸入需要搜索的關鍵字',
    noTypeKeyword: '請輸入關鍵字~',
    noTypeKeywordTips: '請輸入關鍵字！ ',
    noTypeNewKeywordTips: '請輸入新的關鍵字！ ',
    productName: ['資訊', '淘流量', '卡券']
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    SlideList
  },
  data() {
    return {
      service: {
        hasNext: false,
        curPage: 0,
        isLoading: false,
        list: []
      },
      task: {
        hasNext: false,
        curPage: 0,
        isLoading: false,
        list: []
      },
      news: {
        hasNext: false,
        curPage: 0,
        isLoading: false,
        list: []
      },
      coupon: {
        hasNext: false,
        curPage: 0,
        isLoading: false,
        list: []
      },
      keyword: this.$route.params.keyword || '',
      lastKeyword: this.$route.params.keyword || '',
      active: 0,
      swiper: '',
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.keyword) {
      Http.fetch('common/search_data', CHANNEL_CODE, AREA_CODE, {
        keyword: to.params.keyword,
        flag: 0,
        page: 1
      }).then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            next(false);
            throw result;
          } else {
            if (result.status === 1) {
              next(vm => {
                const task = result.data.tao_list;
                const coupon = result.data.coupon_list;
                const news = result.data.news_list;

                vm.$set(vm.news, 'list', news.result_list);
                vm.$set(vm.news, 'curPage', news.curre_page);
                vm.$set(vm.news, 'hasNext', news.has_next);

                vm.$set(vm.task, 'list', task.list);
                vm.$set(vm.task, 'curPage', task.page);
                vm.$set(vm.task, 'hasNext', task.page < task.total);

                vm.$set(vm.coupon, 'list', coupon.result_list);
                vm.$set(vm.coupon, 'curPage', coupon.curre_page);
                vm.$set(vm.coupon, 'hasNext', coupon.has_next);

                vm.$nextTick(() => {
                  vm.swiperUpdate();
                  // 修复动画退出过渡中元素依然点位导致的页面数据不准确的bug
                  setTimeout(() => {
                    vm.swiperUpdate();
                  }, 1000);
                });
              });
            } else {
              next({path: '/404'});
              throw result.msg;
            };
          };
        });
      });
    } else {
      next();
    };
  },
  watch: {
    $route: function(to, from) {
      if (to.params.keyword) {
        this.keyword = this.lastKeyword = to.params.keyword;

        Http.fetch('common/search_data', CHANNEL_CODE, AREA_CODE, {
          keyword: to.params.keyword,
          flag: 0,
          page: 1
        }).then(response => {
          Http.resolve(response, (error, result) => {
            if (error) {
              throw result;
            } else {
              if (result.status === 1) {
                const task = result.data.tao_list;
                const coupon = result.data.coupon_list;
                const news = result.data.news_list;

                this.$set(this.news, 'list', news.result_list);
                this.$set(this.news, 'curPage', news.curre_page);
                this.$set(this.news, 'hasNext', news.has_next);

                this.$set(this.task, 'list', task.list);
                this.$set(this.task, 'curPage', task.page);
                this.$set(this.task, 'hasNext', task.page < task.total);

                this.$set(this.coupon, 'list', coupon.result_list);
                this.$set(this.coupon, 'curPage', coupon.curre_page);
                this.$set(this.coupon, 'hasNext', coupon.has_next);

                this.$nextTick(() => {
                  this.swiperUpdate();
                  // 修复动画退出过渡中元素依然点位导致的页面数据不准确的bug
                  setTimeout(() => {
                    this.swiperUpdate();
                  }, 1000);
                });
              } else {
                this.$router.replace({path: '/404'});
                throw result.msg;
              };
            };
          });
        });
      };
    }
  },
  mounted: function() {
    this.createSwiper();
  },
  methods: {
    searchData() {
      if (!this.keyword) return this.$message(language.noTypeKeywordTips);
      if (this.lastKeyword === this.keyword) return this.$message(language.noTypeNewKeywordTips);

      this.$router.replace({
        name: 'search',
        params: {
          keyword: this.keyword
        }
      });
    },
    createSwiper: function() {
      this.swiper = new Swiper(this.$refs['swiper'], {
        autoHeight: true,
        observer: true,
        onSlideChangeStart: (swiper) => {
          this.active = swiper.activeIndex;
        }
      });
    },
    slideTo: function(index) {
      this.swiper.slideTo(index);
    },
    swiperUpdate: function() {
      this.swiper.update();
    }
  }
};
</script>
