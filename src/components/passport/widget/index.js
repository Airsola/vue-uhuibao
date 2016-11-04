import Vue from 'vue';
import Helper from 'helper';

const Constructor = Vue.extend(require('./component.vue'));
const instances = [];
const proxy = {
  onSginIn(id, callback) {
    for (let instance of instances) {
      if (instance.id === id) {
        callback(instance);
        break;
      };
    };
  },
  onHide(id) {
    for (let i = 0, len = instances.length; i < len; i++) {
      if (id === instances[i].id) {
        instances.splice(i, 1);
        break;
      };
    };
  }
};

const Widget = function(callback) {
  const id = Helper.getRandomStamp();
  const instance = new Constructor({
    data: {
      onSginIn() {
        proxy.onSginIn(id, callback);
        proxy.onHide(id);
      },
      onHide() {
        proxy.onHide(id);
      }
    }
  });

  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;

  instances.push(instance);
};

export default Widget;
