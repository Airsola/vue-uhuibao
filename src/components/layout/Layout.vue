<style lang="sass" scoped>
.layout {
  min-height: 100vh;
  background-color: #f6f6f6;
}
.filter-blur {
  transition: filter 0.3s ease;
  filter: blur(0.05rem);
}
</style>

<template>
  <div :class="['layout', blur ? 'filter-blur' : '', topbar ? 'has-top-bar' : '']">
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
  },
  data() {
    return {
      blur: false
    };
  },
  methods: {
    blurIn() {
      this.blur = true;
    },
    blurOut() {
      this.blur = false;
    },
    blurToggle() {
      this.blur = !this.blur;
    }
  },
  mounted() {
    this.$root.$on('blur:in', () => {
      this.blurIn();
    });

    this.$root.$on('blur:out', () => {
      this.blurOut();
    });

    this.$root.$on('blur:toggle', () => {
      this.blurToggle();
    });
  }
};
</script>
