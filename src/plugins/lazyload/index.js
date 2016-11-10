import Vue from 'vue';
import 'intersection-observer';

// viewport 探测器
const detector = window.IntersectionObserver ? new window.IntersectionObserver(entries => {
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

// 将图片添加到数组队列
const push = (el, src) => {
  el.lazy = src;
  el.dataset.lazy = 'pending';

  if (detector) {
    detector.observe(el);
  } else {
    imagesArr.push(el);
  };
};

// 从数组队列中移除
const remove = (el) => {
  if (detector) {
    detector.unobserve(el);
  } else {
    for (let i = 0, len = imagesArr.length; i < len; i++) {
      if (imagesArr[i] === el) {
        imagesArr.splice(i, 1);
        break;
      };
    };
  };
};

const bind = (el) => {
  // 记住占位图
  el.placeholder = el.src;
};

const update = (el, src) => {
  if (el.lazy !== src) {
    switch (el.dataset.lazy) {
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

  if (!detector) check(el);
};

// 触发可见
const emit = (el) => {
  el.dataset.lazy = 'loading';

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
  transition(el, 0).then((el) => {
    el.src = ok ? el.lazy : el.placeholder;
    el.dataset.lazy = ok ? 'success' : 'failed';
  });

  remove(el);
};

// 过渡动画
const transition = (el, opacity) => {
  // 保存原先的transition值
  const styleNode = el.style;
  const original = styleNode.transition || styleNode.webkitTransition;
  const promise = new Promise((resolve) => {
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

// 检测某个图片元素是否在可见状态
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

if (!detector) {
  // 遍历每个图片
  const each = (evt) => {
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
