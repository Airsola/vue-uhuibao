const routes = [
  {
    path: '/market/store/szair',
    name: 'market:store@szair',
    component: r => System.import('../components/market/store/szair/Index.vue')
  }, {
    path: '/market/store/szair/:goods_id(\\d+)',
    name: 'market:store@szair:detail',
    component: r => System.import('../components/market/store/szair/Detail.vue')
  }, {
    path: '/market/store/szair/:goods_id(\\d+)/:count(\\d+)',
    name: 'market:store@szair:order',
    component: r => System.import('../components/market/store/szair/Order.vue')
  }
];

export default routes;
