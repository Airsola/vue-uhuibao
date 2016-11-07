<style lang="stylus" scoped>
.custom-nav {
  padding-bottom: .2rem;
  &.even {
    & > span {
      width: 25%;
    }
  }
  &.odd {
    & > span {
      width: 33.33333%;
    }
  }
  & > span {
    width: 25%;
    float: left;
    text-align: center;
    padding-top: .2rem;
    & > a {
      display: block;
      font-size: .12rem;
      &:before {
        width: .5rem;
        height: .5rem;
        display: block;
        color: #fff;
        font-size: .22rem;
        line-height: .5rem;
        text-align: center;
        border-radius: 50%;
        margin: 0 auto .1rem;
      }
    }
    &:nth-of-type(1) {
      & > a {
        &:before {
          background-color: #2cbcff;
        }
      }
    }
    &:nth-of-type(2) {
      & > a {
        &:before {
          background-color: #00ddd3;
        }
      }
    }
    &:nth-of-type(3) {
      & > a {
        &:before {
          background-color: #6fe264;
        }
      }
    }
    &:nth-of-type(4) {
      & > a {
        &:before {
          background-color: #ffd600;
        }
      }
    }
    &:nth-of-type(5) {
      & > a {
        &:before {
          background-color: #ff9e31;
        }
      }
    }
    &:nth-of-type(6) {
      & > a {
        &:before {
          background-color: #ff635b;
        }
      }
    }
    &:nth-of-type(7) {
      & > a {
        &:before {
          background-color: #ff7298;
        }
      }
    }
    &:nth-of-type(8) {
      & > a {
        &:before {
          background-color: #c183e2;
        }
      }
    }
  }
}
.news-topic {
  position: relative;
  height: .4rem;
  &:before {
    content: '';
    display: block;
    width: .4rem;
    height: .4rem;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: auto 100%;
    position: absolute;
    left: .2rem;
    top: .2rem;
  }
  &.zh-cn {
    &:before {
      background-image: url(../../../assets/images/news_cn.png);
    }
  }
  &.zh-tw {
    &:before {
      background-image: url(../../../assets/images/news_tw.png);
    }
  }
  & > .news-topic-list {
    padding-left: .2rem;
    margin-left: .6rem;
    height: .5rem;
    position: relative;
    top: -.05rem;
    overflow: hidden;
    &:before {
      height: 80%;
    }
    .swiper-slide {
      height: .25rem;
      line-height: .25rem;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
</style>

<template>
  <div class="ui-card ui-card-underline ui-card-mar-btm">
    <div :class="['custom-nav', 'clearfix', nav.length % 4 === 0 ? 'even' : 'odd']">
      <span v-for="item in nav">
        <a :href="item.url" :class="['iconfont', 'i-' + item.cssname + '-bfo']">{{item.name}}</a>
      </span>
    </div>
    <div :class="['ui-card-padd', 'ui-card-overline', 'news-topic', langType]" v-if="show">
      <div class="news-topic-list swiper-container leftline" ref="news-topic">
        <div class="swiper-wrapper">
          <div v-for="item in news" class="swiper-slide">
            <a :href="'#!article?tid=' + item.news_id">{{item.news_title}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import {LANG_TYPE} from 'config';

export default {
  props: ['nav', 'news', 'show'],
  data() {
    return {
      swiper: null,
      langType: LANG_TYPE
    };
  },
  beforeDestroy() {
    if (this.show) this.swiper.destroy();
  },
  watch: {
    show(value) {
      this.$nextTick(() => {
        this.swiper = new Swiper(this.$refs['news-topic'], {
          direction: 'vertical',
          slidesPerView: 2,
          slidesPerGroup: 2,
          autoplay: 3000,
          observer: true,
          loop: true
        });
      });
    }
  }
};
</script>
