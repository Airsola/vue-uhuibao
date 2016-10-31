<style scoped>
  .album-list{padding:.2rem;}
  .album-list>ul>li{float:left;width:1.62rem;height:1.2rem;margin-bottom:.1rem;}
  .album-list>ul>li:nth-of-type(2n){float:right;}
  .album-list>ul>li>figure{background-color:#f6f6f6;width:100%;height:100%;overflow:hidden;position:relative;}
  .album-list>ul>li>figure,.album-list>ul>li>figure>img{display:block;}
  .album-list>ul>li>figure>img{min-height:100%;min-width:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}

  .album-swiper{position:fixed;left:0;top:.5rem;width:100%;height:calc(100% - .5rem);z-index:1;background-color:#000;visibility:hide;opacity:0;transform:scale(0);transition:opacity .3s ease,transform .3s ease;}
  .album-swiper.active{visibility:visible;opacity:1;transform:scale(1);}
  .album-swiper .swiper-slide figure, .album-swiper .swiper-slide figure>img{width:100%;display:block;}
  .album-swiper .swiper-slide figure{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}
</style>
<template>
  <wrapper>
    <p v-if="photoList.length === 0" class="no-data"></p>
    <div v-else class="album-list">
      <ul class="clearfix">
        <li v-for="(src, index) in photoList">
          <figure @click="openPhoto(index)">
            <img :src="src">
          </figure>
        </li>
      </ul>
    </div>
    <div :class="['album-swiper', 'swiper-container', show ? 'active' : '']">
      <div class="swiper-wrapper" @click="hidePhoto">
        <div v-for="src in photoList" class="swiper-slide">
          <figure>
            <img :src="src">
          </figure>
        </div>
      </div>
    </div>
  </wrapper>
</template>

<script>
import Wrapper from 'components/layout/Wrapper.vue';

import Swiper from 'swiper';
import {Http, LANG_TYPE, CHANNEL_CODE} from 'config';

const Language = {
  'zh-cn': {
    title: '商家相册',
    noData: '亲，暂时没有图片！'
  },
  'zh-tw': {
    title: '商家相冊',
    noData: '親愛的，暫時沒有圖片！'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Wrapper
  },
  data() {
    return {
      photoList: [],
      lang: language,
      show: false
    };
  },
  created: function() {
    this.fetchData(this.$route.params.shop_id);
  },
  mounted: function() {
    this.$root.$emit('app:update', {
      title: language.title,
      item: ['back']
    });
  },
  watch: {
    $route: function(to, from) {
      this.fetchData(to.params.shop_id);
    }
  },
  methods: {
    fetchData: function(shopId) {
      Http.fetch('shop/get_shop_photo', {
        shop_id: shopId
      }, CHANNEL_CODE).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

            this.$set(this, 'photoList', result.data);
            this.swiper = new Swiper(this.$el.querySelector('.album-swiper'), {
              observer: true
            });
          });
        };
      });
    },
    openPhoto: function(index) {
      this.swiper.slideTo(index);
      this.show = !this.show;
    },
    hidePhoto: function() {
      this.show = !this.show;
    }
  },
  beforeDestroy: function() {
    this.swiper.destroy();
  }
};
</script>
