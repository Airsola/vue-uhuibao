import Vue from 'vue';

// 存放等待延时加载的图片元素
const imagesArr = [];
const className = 'lazy-pending';
const transitionend = window.hasOwnProperty('ontransitionend') ? 'transitionend' : 'webkitTransitionEnd';
const animationend = window.hasOwnProperty('ontransitionend') ? 'animationend' : 'webkitAnimationEnd';

// 将图片添加到数组队列
const push = (el, src) => {
  el.lazy = src;
  el.loaded = false;
  el.classList.add(className);

  imagesArr.push(el);
};

// 遍历每个图片
const each = (evt) => {
  for (let el of imagesArr) {
    check(el);
  };
};

// 检测某个图片元素是否在可见状态
const check = (el) => {
  const offset = el.getBoundingClientRect();
  const style = window.getComputedStyle(el, null);
  const width = parseInt(style.width);
  const height = parseInt(style.height);

  // 水平方向可见
  let x = false;

  // 垂直方向可见
  let y = false;

  if (style.display === 'none' || style.visibility === 'hidden' || width === 0 || height === 0 || parseFloat(style.opacity) === 0) return;

  // 水平方向是否可见
  if ((offset.left >= 0 && offset.left < window.innerWidth) || (offset.left < 0 && Math.abs(offset.left) < width)) x = true;

  // 垂直方向是否可见
  if ((offset.top >= 0 && offset.top < window.innerHeight) || (offset.top < 0 && Math.abs(offset.top) < height)) y = true;

  if (x && y) emit(el).then(el => apply(el, true)).catch(el => apply(el, false));
};

// 触发可见
const emit = (el) => {
  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.src = el.lazy;

    if (image.complete) {
      resolve(el);
    } else {
      image.addEventListener('load', () => resolve(el));
      image.addEventListener('error', () => reject(el));
    };
  });

  return promise;
};

// 使用真实地址
const apply = (el, ok) => {
  el.loaded = true;

  if (ok) {
    transition(el, 0).then(() => {
      el.src = el.lazy;
    });
  };

  remove(el);
};

// 从数组队列中移除
const remove = (el) => {
  for (let i = 0, len = imagesArr.length; i < len; i++) {
    if (imagesArr[i] === el) {
      imagesArr.splice(i, 1);
      break;
    };
  };
};

// 过渡动画
const transition = (el, opacity) => {
  const promise = new Promise((resolve) => {
    // 保存原先的transition值
    const styleNode = el.style;
    const original = styleNode.transition || styleNode.webkitTransition;
    const fadeOut = (evt) => {
      styleNode.opacity = 1;

      el.removeEventListener(transitionend, fadeOut);
      el.addEventListener(transitionend, fadeIn);

      resolve(el);
    };
    const fadeIn = () => {
      styleNode.transition = styleNode.webkitTransition = original;
      styleNode.removeProperty('opacity');

      el.removeEventListener(transitionend, fadeIn);
    };

    styleNode.transition = styleNode.webkitTransition = 'opacity .5s ease';
    styleNode.opacity = 0;

    el.addEventListener(transitionend, fadeOut);
  });

  return promise;
};

// 全局监听事件
window.addEventListener('scroll', each);
window.addEventListener('resize', each);
window.addEventListener(animationend, each);
window.addEventListener(transitionend, each);

// 添加vue指令
Vue.directive('lazy', {
  bind: (el, binding) => push(el, binding.value),
  inserted: (el) => check(el),
  update: (el, binding) => {
    if (!!el.loaded && el.lazy !== binding.value) {
      push(el, binding.value);
    };
    check(el);
  },
  componentUpdated: (el) => check(el),
  unbind: (el) => remove(el)
});
