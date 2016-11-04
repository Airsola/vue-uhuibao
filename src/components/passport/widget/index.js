import Vue from 'vue';
import Helper from 'helper';

const Constructor = Vue.extend(require('./component.vue'));
const instances = [];
const methods = {
  onSuccess(id, callback) {
    for (let instance of instances) {
      if (instance.id === id) {
        callback(instance);
        break;
      };
    };
  },
  onForgone(id, callback) {
    for (let instance of instances) {
      if (instance.id === id) {
        callback(instance);
        break;
      };
    };
  },
  onHide(id, callback) {
    if (typeof callback === 'function') callback();

    for (let i = 0, len = instances.length; i < len; i++) {
      if (id === instances[i].id) {
        instances.splice(i, 1);
        break;
      };
    };
  }
};

const Widget = function(options) {
  const {container, onSuccess, onForgone, onShow, onHide} = options;

  const id = Helper.getRandomStamp();
  const instance = new Constructor({
    data: {
      onHide() {
        methods.onHide(id, onHide);
      },
      onSuccess(vm) {
        methods.onSuccess(id, onSuccess);
      },
      onForgone() {
        methods.onForgone(id, onForgone);
      }
    }
  });

  if (typeof onShow === 'function') onShow();

  instance.id = id;
  instance.vm = instance.$mount();

  if (container) {
    container.appendChild(instance.vm.$el);
  } else {
    document.body.appendChild(instance.vm.$el);
  };

  instance.vm.visible = true;
  instance.dom = instance.vm.$el;

  instances.push(instance);
};

export default Widget;
