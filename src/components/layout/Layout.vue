<style scoped>
.layout{min-height:100vh;background-color:#f6f6f6;}
.filter-blur{
  transition:filter .3s ease;
  -webkit-transition:-webkit-filter .3s ease;

  filter:blur(.05rem);
  -webkit-filter:blur(.05rem);
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
    topbar: function() {
      return !!unicom17wo;
    },
    jsessionid: function() {
      if (unicom17wo) return unicom17wo.jsessionid;
    },
    mobile: function() {
      if (unicom17wo) return unicom17wo.mobile;
    }
  },
  data() {
    return {
      blur: false
    };
  },
  methods: {
    blurIn: function() {
      this.blur = true;
    },
    blurOut: function() {
      this.blur = false;
    },
    blurToggle: function() {
      this.blur = !this.blur;
    }
  },
  mounted: function() {
    this.$root.$on('blur:in', function() {
      this.blurIn();
    }.bind(this));

    this.$root.$on('blur:out', function() {
      this.blurOut();
    }.bind(this));

    this.$root.$on('blur:toggle', function() {
      this.blurToggle();
    }.bind(this));
  }
};
</script>
