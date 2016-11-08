<style lang="stylus" scoped>
.masker {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  &.active {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body :style="{paddingBottom: '.5rem'}">
      <div @click="showCateMenu = showAreaMenu = false" :class="['masker', showCateMenu || showAreaMenu ? 'active' : '']"></div>
      <drop-menu :showCateMenu="showCateMenu" :showAreaMenu="showAreaMenu" :slideToggle="slideToggle"></drop-menu>
      <list></list>
    </layout-body>
    <layout-footer></layout-footer>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody, LayoutFooter} from '../layout';
import DropMenu from './index/DropMenu.vue';
import List from './index/List.vue';

import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '精选服务'
  },
  'zh-tw': {
    title: '精選服務'
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    LayoutFooter,
    DropMenu,
    List
  },
  data() {
    return {
      showCateMenu: false,
      showAreaMenu: false,
      lang: language
    };
  },
  methods: {
    slideToggle(cateMenu, areaMenu) {
      this.showCateMenu = cateMenu;
      this.showAreaMenu = areaMenu;
    }
  }
};
</script>
