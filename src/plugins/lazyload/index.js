/**
 * @name vue-directive-lazyload for vue2
 *
 * 为vue添加图片懒加载
 * 支持所iOS7+、安卓4.4+、Chrome、Firefox、IE10+、Edge
 *
 * @example
 * <img v-lazy="imgSrc" :src="placeholderSrc"></img>
 */

import Vue from 'vue';
// 添加 IntersectionObserver polyfill
import 'intersection-observer';

/**
 * viewport 探测器
 *
 * @params {Function} 探测过执行的回调
 * @options {Object} 其它参数
 *
 * @url https://wicg.github.io/IntersectionObserver/
 * @url https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill
 * @url http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
 * @url https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 * @url https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
 */
const observer = window.IntersectionObserver ? new window.IntersectionObserver(entries => {
  for (let entrie of entries) {
    if (entrie.intersectionRatio > 0.25) {
      emit(entrie.target).then(el => apply(el, true)).catch(el => apply(el, false));
    };
  };
}, {
  threshold: [0, 0.25]
}) : null;

// 存放等待延时加载的图片元素
const imagesArr = [];

// 动画事件名称
const transitionend = window.hasOwnProperty('onwebkittransitionend') ? 'webkitTransitionEnd' : 'transitionend';
const animationend = window.hasOwnProperty('onwebkitanimationend') ? 'webkitAnimationEnd' : 'animationend';

/**
 * @name 将图片添加到数组队列
 *
 * @params {Img Element} el * 要加入到队列的图片元素
 * @params {String} src * 真实的图片源地址
 */
const push = (el, src) => {
  // 标记真实的图片源地址
  el.lazy = src;

  // 标记图片状态为挂起
  el.setAttribute('lazy', 'pending');

  if (observer) {
    observer.observe(el);
  } else {
    imagesArr.push(el);
  };
};

/**
 * @name 从数组队列中移除
 *
 * @params {Img Element} el * 要从队列中移除的图片元素
 */
const remove = (el) => {
  if (observer) {
    observer.unobserve(el);
  } else {
    for (let i = 0, len = imagesArr.length; i < len; i++) {
      if (imagesArr[i] === el) {
        imagesArr.splice(i, 1);
        break;
      };
    };
  };
};

/**
 * @name 图片元素绑定占位图
 *
 * @params {Img Element} el * 要绑定占位图的图片元素
 */
const bind = (el) => {
  // 记住占位图
  el.placeholder = el.src;
};

/**
 * @name 更新图片元素状态
 *
 * @params {Img Element} el * 将要更新的图片元素
 * @params {String} src * 新的图片源地址
 */
const update = (el, src) => {
  if (el.lazy !== src) {
    switch (el.getAttribute('lazy')) {
      case 'pending' :
      case 'loading' :
        el.lazy === src;
        break;

      case 'success' :
      case 'failed' :
        push(el, src);
        break;
    };
  };

  // 在没有监视者的时候，需要主动检测
  if (!observer) check(el);
};

/**
 * @name 图片元素触发可见
 *
 * @params {Img Element} el * 将要触发显示的图片元素
 *
 * @retrun {Promise} 返回的图片加载Promise
 */
const emit = (el) => {
  // 标记图片状态为加载中
  el.setAttribute('lazy', 'loading');

  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = el.lazy;

    // 如果源图片存在于缓存
    if (image.complete) {
      resolve(el);
    } else {
      image.addEventListener('load', () => resolve(el));
      image.addEventListener('error', () => reject(el));
    };
  });

  return promise;
};

/**
 * @name 应用真实的图片源地址，并将此图片元素从队列中移除
 *
 * @params {Img Element} el * 显示的图片元素
 * @params {Boolean} ok * 图上片源地址的请求是否成功
 */
const apply = (el, ok) => {
  transition(el, 0).then((el) => {
    // 如果成功，则显示新的图片地址，否则显示原有的点位图
    el.src = ok ? el.lazy : el.placeholder;

    // 改变状态为成功/失败
    el.setAttribute('lazy', ok ? 'success' : 'failed');
  });

  remove(el);
};

/**
 * @name 图片请求完成后执行的过渡动画
 *
 * @params {Img Element} el * 执行过渡的图片元素
 * @params {Number [0, 1]} opacity * 透明过渡的值
 *
 * @retrun {Promise} 返回过渡的Promise
 */
const transition = (el, opacity) => {
  // 保存原先的transition值
  const styleNode = el.style;
  const original = styleNode.transition || styleNode.webkitTransition;
  const promise = new Promise((resolve) => {
    // 图片淡出，引用正常的图片地址
    const fadeOut = (evt) => {
      styleNode.opacity = 1;

      // 移除事件绑定
      el.removeEventListener(transitionend, fadeOut);
      el.addEventListener(transitionend, fadeIn);

      resolve(el);
    };
    // 图片淡入，还原原有的状态
    const fadeIn = () => {
      styleNode.transition = styleNode.webkitTransition = original;
      styleNode.removeProperty('opacity');

      // 移除事件绑定
      el.removeEventListener(transitionend, fadeIn);
    };

    // 图片开始淡出
    styleNode.transition = styleNode.webkitTransition = 'opacity .3s ease';
    styleNode.opacity = 0;

    // 增加 transitionend 事件
    el.addEventListener(transitionend, fadeOut);
  });

  return promise;
};

/**
 * @name 检测某个图片元素是否在窗口可见
 *
 * @params {Img Element} el * 被检测的图片元素
 */
const check = (el) => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el, null);
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);

  // 水平方向可见
  let x = false;

  // 垂直方向可见
  let y = false;

  if (style.display === 'none' || style.visibility === 'hidden' || width === 0 || height === 0 || parseFloat(style.opacity) === 0) return;

  // 水平方向是否可见
  if ((rect.left >= 0 && rect.left < window.innerWidth) || (rect.left < 0 && Math.abs(rect.left) < width)) x = true;

  // 垂直方向是否可见
  if ((rect.top >= 0 && rect.top < window.innerHeight) || (rect.top < 0 && Math.abs(rect.top) < height)) y = true;

  if (x && y) emit(el).then(el => apply(el, true)).catch(el => apply(el, false));
};

if (!observer) {
  /**
   * @name 对队列进行遍历
   */
  const each = () => {
    for (let el of imagesArr) {
      check(el);
    };
  };

  // 全局监听事件
  window.addEventListener('scroll', each);
  window.addEventListener('resize', each);
  window.addEventListener(animationend, each);
  window.addEventListener(transitionend, each);
};

// 添加vue指令
Vue.directive('lazy', {
  bind: (el) => bind(el),
  inserted: (el, binding) => push(el, binding.value),
  update: (el, binding) => update(el, binding.value),
  unbind: (el) => remove(el)
});
