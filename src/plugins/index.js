import Vue from 'vue';
import Message from './message/index';

const GinGili = function() {
  Vue.prototype.$message = Message;
};

export default GinGili;
