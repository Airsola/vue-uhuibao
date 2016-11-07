import Vue from 'vue';
import Helper from 'helper';
import Component from './component.vue';

const Constructor = Vue.extend(Component);
const instances = [];
const methods = {
  onSuccess(callback) {
    callback();
  },
  onForgone(callback) {
    callback();
  },
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

const Widget = function(options = {}) {
  const {container, onShow, onHide, onSuccess, onForgone} = options;
  const id = Helper.getRandomStamp();
  const data = {container};

  data.onHide = () => {
    methods.onHide(id, onHide);
  };

  if (typeof onShow === 'function') {
    data.onShow = () => {
      methods.onShow(onShow);
    };
  };

  if (typeof onSuccess === 'function') {
    data.onSuccess = () => {
      methods.onSuccess(onSuccess);
    };
  };

  if (typeof onForgone === 'function') {
    data.onForgone = () => {
      methods.onForgone(onForgone);
    };
  };

  const instance = new Constructor({data});

  instance.id = id;
  instance.vm = instance.$mount();

  instances.push(instance);
};

export default Widget;
