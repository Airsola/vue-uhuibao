import 'assets/style/reset.css';
import 'assets/style/font.css';
import 'assets/style/global.css';

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
