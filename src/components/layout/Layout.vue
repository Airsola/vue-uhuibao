<style lang="sass" scoped>
.layout {
  min-height: 100vh;
  background-color: #f6f6f6;
}
</style>

<template>
  <div :class="['layout', topbar ? 'has-top-bar' : '']">
    <unicom-bar v-if="topbar" :jsessionid="jsessionid" :mobile="mobile"></unicom-bar>
    <slot></slot>
  </div>
</template>

<script>
import UnicomBar from './UnicomBar.vue';

const unicom17wo = window.uhb_config['17wo'];

export default {
  components: {
    UnicomBar
  },
  computed: {
    topbar() {
      return !!unicom17wo;
    },
    jsessionid() {
      if (unicom17wo) return unicom17wo.jsessionid;
    },
    mobile() {
      if (unicom17wo) return unicom17wo.mobile;
    }
  }
};
</script>
