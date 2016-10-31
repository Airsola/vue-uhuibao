import Vue from 'vue';
import Widget from './widget/index';

const install = function() {
  Vue.prototype.$login = Widget;
};

export default install;
