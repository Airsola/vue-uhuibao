import Vue from 'vue';
import Helper from 'helper';
import Component from './component.vue';

const Constructor = Vue.extend(Component);
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

/*
 * @name 系统通知框
 *
 * @params message [*] String 通知文字
 * @params options (= {}) Object 其它选项参数
 * @params options.container Element 被包括的父级DOM元素
 * @params options.onShow Function 显示时的回调
 * @params options.onHide Function 关闭时的回调
 *
 * @author shusiwei
 * @date 2016/11/07
 */
const Notice = (message, options = {}) => {
  if (typeof message !== 'string') throw new Error('message must be a string');
  if (options && typeof options !== 'object') throw new Error('options must be a plain object');

  const {container, onShow, onHide} = options;
  const id = Helper.getRandomStamp();
  const data = {
    message,
    container,
    onHide() {
      methods.onHide(id, onHide);
    }
  };

  if (typeof onShow === 'function') {
    data.onShow = () => {
      methods.onShow(onShow);
    };
  };

  const instance = new Constructor({data});

  instance.id = id;
  instance.vm = instance.$mount();

  instances.push(instance);
};

export default Notice;
