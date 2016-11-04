import Vue from 'vue';
import Helper from 'helper';

const Constructor = Vue.extend(require('./component.vue'));
const instances = [];
const methods = {
  onShow(callback) {
    callback();
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

const Notice = function(message, options) {
  const {container, onShow, onHide} = options;

  const id = Helper.getRandomStamp();
  const data = {message};

  if (typeof onShow === 'function') {
    data.onShow = () => {
      methods.onShow(onShow);
    };
  };
  if (typeof onHide === 'function') {
    data.onHide = () => {
      methods.onHide(id, onHide);
    };
  };

  const instance = new Constructor({data});

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

export default Notice;
