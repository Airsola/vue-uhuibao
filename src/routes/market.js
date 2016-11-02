const routes = [
  {
    path: '/market/store/szair',
    name: 'market:store@szair',
    component: r => System.import('../components/market/store/szair/Index.vue')
  }, {
    path: '/market/store/szair/:goods_id',
    name: 'market:store@szair:detail',
    component: r => System.import('../components/market/store/szair/Detail.vue')
  }
];

export default routes;
