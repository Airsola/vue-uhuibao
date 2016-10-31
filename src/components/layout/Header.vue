<style scoped>
  .layout-header{position:fixed;z-index:1;left:0;top:0;width:100%;height:0.5rem;text-align:center;background-color:#2cbcff;}
  .layout-header>span.app-title{font-size:0.18rem;line-height:0.5rem;height:0.5rem;display:block;overflow:hidden;margin:0 0.5rem;color:#fff;}
  .layout-header>a.icon{width:0.24rem;height:0.24rem;display:block;position:absolute;top:50%;margin-top:-0.12rem;z-index:1;overflow:hidden;}
  .layout-header>a.icon:before{font-size:.2rem;color:#fff;line-height:.24rem;}

  .layout-header>a.search{right:.13rem;}
  .layout-header>a.back{left:0.13rem;}
  .layout-header>a.back:before{font-size:.16rem;}
  .layout-header>a.link{position:absolute;right:.2rem;top:50%;margin-top:-1em;font-size:.14rem;color:#fff;line-height:2em;}

  .layout-header>.search-bar{position:absolute;left:50%;top:50%;margin-top:-.15rem;height:.3rem;width:2.7rem;margin-left:-1.35rem;border-radius:.02rem;background-color:#19a8ea;display:block;}
  .layout-header>.search-bar>input{border:none;position:absolute;left:.07rem;top:0;width:95%;height:100%;background-color:transparent;font-size:.13rem;color:#fff;}
  .layout-header>.search-bar>input::-webkit-input-placeholder{color:rgba(255,255,255,.75);}

  .layout-header>a.shoppingcart{position:absolute;top:50%;right:.2rem;z-index:1;font-size:.09rem;color:#fff;display:none;white-space:nowrap;text-align:center;line-height:1em;
      transform:translateY(-50%);
      -webkit-transform:translateY(-50%);
  }
  .layout-header>a.shoppingcart:before{font-size:.2rem;line-height:.2rem;margin-bottom:.02rem;}
  .layout-header>a.shoppingcart>i{padding:0 .04rem;background-color:#ff7800;border-radius:.14rem;line-height:1.6em;height:1.6em;font-size:.09rem;position:absolute;top:0;left:.12rem;margin-top:-.04rem;}
</style>

<template>
  <header class="layout-header">
    <slot>
      <a v-if="back" class="icon iconfont i-arrow-left-bfo back" @click="$router.go(-1)"></a>
      <area-selector v-show="area"></area-selector>
      <div class="search-bar" v-if="input">
        <input :placeholder="title" :value="keyword" @keyup="keywordUpdate($event)" type="text">
      </div>
      <span v-else class="app-title">{{title}}</span>
      <a v-if="input && search" class="icon iconfont i-search-bfo search" @click="submitEvent"></a>
      <router-link :to="{name: 'search'}" v-if="!input && search" class="icon iconfont i-search-bfo search"></router-link>
    </slot>
  </header>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

import AreaSelector from './components/AreaSelector.vue';

export default {
  name: 'header',
  components: {
    AreaSelector
  },
  computed: {
    ...mapGetters([
      'title',
      'back',
      'area',
      'search',
      'input',
      'keyword'
    ])
  },
  data() {
    return {
      searchAction: null
    };
  },
  created: function() {
    this.$root.$on('app:search', callback => {
      this.searchAction = callback;
    });
  },
  methods: {
    submitEvent: function() {
      if (this.searchAction) this.searchAction(0, 0);
    },
    keywordUpdate: function(evt) {
      this.KeywordUpdate(evt.target.value);
    },
    ...mapActions([
      'KeywordUpdate'
    ])
  }
};
</script>
