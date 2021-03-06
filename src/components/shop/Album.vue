<style lang="stylus" scoped>
.album-list {
  padding: .2rem;
  & > ul {
    & > li {
      float: left;
      width: 1.62rem;
      height: 1.2rem;
      margin-bottom: .1rem;
      &:nth-of-type(2n) {
        float: right;
      }
      & > figure {
        background-color: #f6f6f6;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        & > img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          transition: transform .3s ease;
          &.normal {
            min-height: 100%;
            min-width: 100%;
          }
          &.portrait {
            width: 100%;
          }
          &.landscape {
            height: 100%;
          }
        }
      }
    }
  }
}
.album-list>ul>li>figure,.album-list>ul>li>figure>img {
  display: block;
}
.album-swiper {
  position: fixed;
  left: 0;
  top: .5rem;
  width: 100%;
  height: -webkit-calc(100% - .5rem);
  height: calc(100% - .5rem);
  z-index: 1;
  background-color: #000;
  visibility: hide;
  opacity: 0;
  transform: scale(0);
  transition: opacity .3s ease,transform .3s ease;
  &.active {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
  }
  .swiper-slide {
    figure {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
}
.album-swiper .swiper-slide figure, .album-swiper .swiper-slide figure>img {
  width: 100%;
  display: block;
}
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
              <img v-lazy="item.url" :src="placeholder" :class="item.scale" @load="imgResize($event, index)">
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
import {CHANNEL_CODE} from 'config';
import {Http, translate} from 'methods';
import placeholder from 'assets/x21_y16.png';

const language = translate({
  'zh-cn': {
    title: '商家相册',
    noData: '亲，暂时没有图片！'
  },
  'zh-tw': {
    title: '商家相冊',
    noData: '親愛的，暫時沒有圖片！'
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
      photoList: [],
      show: false,
      placeholder,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('shop/get_shop_photo', {
      shop_id: to.params.shop_id
    }, CHANNEL_CODE).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          result.data.map(url => {
            vm.photoList.push({
              url,
              scale: 'normal'
            });
          });
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  },
  watch: {
    $route(to, from) {
      Http.fetch('shop/get_shop_photo', {
        shop_id: to.params.shop_id
      }, CHANNEL_CODE).then(response => {
        Http.resolve(response).then(result => {
          result.data.map(url => {
            this.photoList.push({
              url,
              scale: 'normal'
            });
          });
        }).catch(error => {
          this.$router.replace({path: '/404'});
          throw new Error(error);
        });
      });
    }
  },
  mounted() {
    this.swiper = new Swiper(this.$el.querySelector('.album-swiper'), {
      observer: true
    });
  },
  methods: {
    openPhoto(index) {
      this.swiper.slideTo(index);
      this.show = !this.show;
    },
    hidePhoto() {
      this.show = !this.show;
    },
    imgResize(evt, index) {
      this.photoList[index].scale = evt.target.height >= evt.target.width ? 'portrait' : 'landscape';
    }
  },
  beforeDestroy() {
    this.swiper.destroy();
  }
};
</script>
