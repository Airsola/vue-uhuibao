<style lang="sass" scoped>
.banner-swiper img,.banner-swiper a {
  display: block;
  width: 100%;
}
</style>
<style lang="sass">
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
      <div class="swiper-slide" v-for="item in data">
        <a :href="item.bann_link_url">
          <img v-if="observer" :src="item.bann_pic_img" @load="update">
          <img v-else :src="item.bann_pic_img" @load="update">
        </a>
      </div>
    </div>
    <div class="swiper-pagination" ref="pagination"></div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import placeholder from 'assets/images/x25_y11.png';

export default {
  props: ['data'],
  computed: {
    observer() {
      return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
    }
  },
  data() {
    return {
      swiper: null,
      placeholder
    };
  },
  mounted() {
    this.swiper = new Swiper(this.$el, {
      observer: true,
      autoHeight: true,
      pagination: this.$refs['pagination']
    });
  },
  methods: {
    update() {
      this.swiper.update(true);
    }
  },
  beforeDestroy() {
    this.swiper.destroy();
  }
};
</script>
