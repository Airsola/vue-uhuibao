import Vue from 'vue';
let MessageConstructor = Vue.extend(require('./component.vue'));

let instances = [];
let count = 1;

var Message = function(options) {
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  const userOnHide = options.onHide;
  const id = 'message-' + count++;

  options.onHide = function() {
    Message.hide(id, userOnHide);
  };

  const instance = new MessageConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instances.push(instance);
};

Message.hide = function(id, onHide) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof onHide === 'function') onHide(instances[i]);
      instances.splice(i, 1);
      break;
    }
  }
};

export default Message;
