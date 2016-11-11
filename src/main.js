import 'assets/reset.styl';
import 'assets/font.styl';
import 'assets/global.styl';

import Vue from 'vue';
import router from './router';
import GinGili from './plugins/index';
import App from './components/App.vue';

Vue.use(GinGili);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
