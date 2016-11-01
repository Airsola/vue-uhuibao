<style scoped>
  .album-list{padding:.2rem;}
  .album-list>ul>li{float:left;width:1.62rem;height:1.2rem;margin-bottom:.1rem;}
  .album-list>ul>li:nth-of-type(2n){float:right;}
  .album-list>ul>li>figure{background-color:#f6f6f6;width:100%;height:100%;overflow:hidden;position:relative;}
  .album-list>ul>li>figure,.album-list>ul>li>figure>img{display:block;}
  .album-list>ul>li>figure>img{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:transform .3s ease;}
  .album-list>ul>li>figure>img.normal{min-height:100%;min-width:100%;}
  .album-list>ul>li>figure>img.portrait{width:100%;}
  .album-list>ul>li>figure>img.landscape{height:100%;}

  .album-swiper{position:fixed;left:0;top:.5rem;width:100%;height:calc(100% - .5rem);z-index:1;background-color:#000;visibility:hide;opacity:0;transform:scale(0);transition:opacity .3s ease,transform .3s ease;}
  .album-swiper.active{visibility:visible;opacity:1;transform:scale(1);}
  .album-swiper .swiper-slide figure, .album-swiper .swiper-slide figure>img{width:100%;display:block;}
  .album-swiper .swiper-slide figure{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}
</style>
<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <p v-if="photoList.length === 0" class="no-data"></p>
      <div v-else class="album-list">
        <ul class="clearfix">
          <li v-for="(item, index) in photoList">
            <figure @click="openPhoto(index)">
              <img :src="item.url" :class="item.scale" @load="imgResize($event, index)">
            </figure>
          </li>
        </ul>
      </div>
      <div :class="['album-swiper', 'swiper-container', show ? 'active' : '']">
        <div class="swiper-wrapper" @click="hidePhoto">
          <div v-for="(item, index) in photoList" class="swiper-slide">
            <figure>
              <img :src="item.url">
            </figure>
          </div>
        </div>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';

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
    Layout,
    LayoutHeader,
    LayoutBody
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

            result.data.map(url => {
              this.photoList.push({
                url,
                scale: 'normal'
              });
            });

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
    },
    imgResize: function(evt, index) {
      this.photoList[index].scale = evt.target.height >= evt.target.width ? 'portrait' : 'landscape';
    }
  },
  beforeDestroy: function() {
    this.swiper.destroy();
  }
};
</script>