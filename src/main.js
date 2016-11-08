import 'assets/style/reset.css';
import 'assets/style/font.css';
import 'assets/style/global.css';

import Vue from 'vue';
import router from './router';
import GinGili from './plugins/index';
import App from './components/App.vue';

Vue.use(GinGili);

const imagesArr = [];

const each = function(evt) {
  for (let el of imagesArr) {
    check(el);
  };
};
const check = (el) => {
  const offset = el.getBoundingClientRect();
  const style = window.getComputedStyle(el, null);
  const width = parseInt(style.width);
  const height = parseInt(style.height);

  let x = false;
  let y = false;

  if (style.display !== 'none' || style.visibility !== 'hidden' || width !== 0 || height !== 0) {
    if ((offset.top > 0 && offset.top < window.innerHeight) || (offset.top < 0 && Math.abs(offset.top) < height)) y = true;
    if ((offset.left > 0 && offset.left < window.innerWidth) || (offset.left < 0 && Math.abs(offset.left) < width)) x = true;
  };

  if (x && y) emit(el);
};
const emit = (el) => {
  const image = new Image();

  image.src = el.lazy;

  if (image.complete) {
    apply(el, image.src);
  } else {
    image.addEventListener('load', (evt) => apply(el, evt.target.src));
  };
};
const apply = (el, src) => {
  el.src = src;
  remove(el);
};
const remove = (el) => {
  for (let i = 0, len = imagesArr.length; i < len; i++) {
    if (imagesArr[i] === el) {
      imagesArr.splice(i, 1);
      break;
    };
  };
};

window.addEventListener('scroll', each);
window.addEventListener('wheel', each);
window.addEventListener('mousewheel', each);
window.addEventListener('resize', each);
window.addEventListener('animationend', each);

Vue.directive('lazy', {
  bind(el, binding) {
    el.lazy = binding.value;
    imagesArr.push(el);
  },
  inserted: (el) => check(el),
  update: (el) => check(el),
  componentUpdated: (el) => check(el),
  unbind: (el) => remove(el)
});

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
