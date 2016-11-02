import Vue from 'vue';
import Widget from '../components/passport/widget';

Vue.use(Widget);

const routes = [
  {
    path: '/passport/signin',
    name: 'passport:signin',
    component: r => System.import('../components/passport/SignIn.vue')
  }, {
    path: '/passport/signup',
    name: 'passport:signup',
    component: r => System.import('../components/passport/SignUp.vue')
  }, {
    path: '/passport/forgot',
    name: 'passport:forgot',
    component: r => System.import('../components/passport/Forgot.vue')
  }, {
    path: '/passport/privacy',
    name: 'passport:privacy',
    component: r => System.import('../components/passport/Privacy.vue')
  }
];

export default routes;
