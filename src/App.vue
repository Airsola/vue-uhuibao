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
  <div :class="['layout', blur ? 'filter-blur' : '', hasShowTopBar ? 'has-top-bar' : '']">
    <unicom-bar v-if="hasShowTopBar" :jsessionid="jsessionid" :mobile="mobile"></unicom-bar>
    <layout-header></layout-header>
    <layout-body>
      <router-view></router-view>
    </layout-body>
    <layout-footer v-show="footer"></layout-footer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import UnicomBar from './components/layout/UnicomBar.vue';
import LayoutHeader from './components/layout/Header.vue';
import LayoutBody from './components/layout/Body.vue';
import LayoutFooter from './components/layout/Footer.vue';

const unicom17wo = window.uhb_config['17wo'];

export default {
  name: 'app',
  components: {
    UnicomBar,
    LayoutHeader,
    LayoutBody,
    LayoutFooter
  },
  computed: {
    hasShowTopBar: function() {
      return !!unicom17wo;
    },
    jsessionid: function() {
      if (unicom17wo) return unicom17wo.jsessionid;
    },
    mobile: function() {
      if (unicom17wo) return unicom17wo.mobile;
    },
    ...mapGetters([
      'footer'
    ])
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
    },
    ...mapActions([
      'UpdateConfig'
    ])
  },
  created: function() {
    this.$root.$on('app:update', (config) => {
      this.UpdateConfig(config);
    });
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
