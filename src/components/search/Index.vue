<style scoped>
  .main-nav{background-color:#fff;border-bottom:solid 1px #eaeaea;line-height:.39rem;position:relative;z-index:0;}
  .main-nav>span{float:left;width:33.333%;position:relative;text-align:center;font-size:.14rem;color:#999;
    transition:color .2s ease;
    -webkit-transition:color .2s ease;
  }
  .main-nav>span.current{color:#222;}
  .main-nav>span:first-of-type:before{display:none;}
  .main-nav>span:before{height:50%;}
</style>
<template>
  <wrapper>
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
  </wrapper>
</template>

<script>
import Wrapper from 'components/layout/Wrapper.vue';
import SlideList from './index/SlideList.vue';

import {mapGetters, mapActions} from 'vuex';
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
    Wrapper,
    SlideList
  },
  computed: mapGetters([
    'keyword'
  ]),
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
      lastKeyword: '',
      active: 0,
      swiper: '',
      lang: language
    };
  },
  watch: {
    $route: function(to, from) {
      if (to.params.keyword) {
        this.KeywordUpdate(to.params.keyword);
        this.fetchData();
      };
    }
  },
  created: function() {
    if (this.$route.params.keyword) {
      this.KeywordUpdate(this.$route.params.keyword);
      this.fetchData();
    };
  },
  mounted: function() {
    this.$root.$emit('app:update', {
      title: language.title,
      item: ['back', 'search', 'input']
    });
    this.$root.$emit('app:search', () => {
      if (!this.keyword) return this.$message(language.noTypeKeywordTips);
      if (this.lastKeyword === this.keyword) return this.$message(language.noTypeNewKeywordTips);

      this.$router.replace({
        name: 'search',
        params: {
          keyword: this.keyword
        }
      });
    });
    this.createSwiper();
  },
  methods: {
    ...mapActions([
      'KeywordUpdate'
    ]),
    fetchData() {
      // 得到最新的关键字
      this.lastKeyword = this.keyword;

      Http.fetch('common/search_data', CHANNEL_CODE, AREA_CODE, {
        keyword: this.keyword,
        flag: 0,
        page: 1
      }).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

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
          });
        };
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
  },
  beforeDestroy: function() {
    this.$root.$emit('app:search', null);
  }
};
</script>
