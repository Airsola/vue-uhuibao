import Vue from 'vue';
import Helper from 'helper';
import Component from './component.vue';

const Constructor = Vue.extend(Component);
const instances = [];
const methods = {
  /**
   * @name 登录成功回调
   *
   * @params {Function} callback * 回调函数
   */
  onSuccess(callback) {
    callback();
  },
  /**
   * @name 放弃登录回调
   *
   * @params {Function} callback * 回调函数
   */
  onForgone(callback) {
    callback();
  },
  /**
   * @name 显示回调
   *
   * @params {Function} callback * 回调函数
   */
  onShow(callback) {
    callback();
  },

  /**
   * @name 关闭回调
   *
   * @params {String} id * 实例ID
   * @params {function} callback 回调函数
   */
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

/**
 * @name 用户登录挂件
 *
 * @params {Object} options [{}] 其它选项参数
 * @params {Element} options.container 被包括的父级DOM元素
 * @params {Function} options.onSuccess 登录成功回调
 * @params {Function} options.onForgone 放弃登录回调
 * @params {Function} options.onShow 显示时的回调
 * @params {Function} options.onHide 关闭时的回调
 *
 * @author shusiwei
 * @date 2016/11/07
 */
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
