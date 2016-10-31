import 'assets/style/reset.css';
import 'assets/style/font.css';
import 'assets/style/global.css';

import Vue from 'vue';
import router from './router';
import store from './store';
import VueLazyload from 'vue-lazyload';
import GinGili from './plugins/index';
import App from './App.vue';

Vue.use(GinGili);
Vue.use(VueLazyload);

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
