import 'assets/style/reset.css';
import 'assets/style/font.css';
import 'assets/style/global.css';

import Vue from 'vue';
import router from './router';
import GinGili from './plugins/index';

Vue.use(GinGili);

new Vue({
  router,
  el: '#app',
  render: h => <router-view></router-view>
});
