import Vue from 'vue';
import Message from './message/index';
import Notice from './notice/index';

const GinGili = function() {
  Vue.prototype.$message = Message;
  Vue.prototype.$notice = Notice;
};

export default GinGili;
