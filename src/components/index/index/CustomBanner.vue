<style lang="stylus" scoped>
.banner-swiper img,.banner-swiper a {
  display: block;
  width: 100%;
}
</style>
<style lang="stylus">
.swiper-pagination {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: .1rem;
  z-index: 2;
  text-align: center;
  font-size: 0;
}
.swiper-pagination-bullet {
  height: .07rem;
  width: .07rem;
  display: inline-block;
  background-color: #fff;
  border-radius: 50%;
  margin: 0 .05rem;
  opacity: .3;
  transition: opacity .2s ease,transform .2s ease;
  &.swiper-pagination-bullet-active {
    opacity: .5;
    transform: scale(1.3);
  }
}
</style>

<template>
  <div class="banner-swiper swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="item in data" :data-swiper-autoplay="item.bann_forecast_time ? item.bann_forecast_time * 1000 : 3000">
        <a :href="item.bann_link_url">
          <img v-if="observer" v-lazy="item.bann_pic_img" :src="placeholder" @load="update">
          <img v-else v-lazy="item.bann_pic_img" :src="placeholder" @load="update">
        </a>
      </div>
    </div>
    <div class="swiper-pagination" ref="pagination"></div>
  </div>
</template>

<script>
import placeholder from 'assets/x25_y11.png';
import Swiper from 'swiper';

let swiper = null;

export default {
  props: ['data'],
  computed: {
    observer() {
      return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
    }
  },
  data() {
    return {
      placeholder
    };
  },
  mounted() {
    swiper = new Swiper(this.$el, {
      observer: true,
      autoHeight: true,
      autoplay: 3000,
      loop: true,
      pagination: this.$refs['pagination']
    });
  },
  methods: {
    update() {
      swiper.update(true);
    }
  },
  beforeDestroy() {
    swiper.destroy();
  }
};
</script>
