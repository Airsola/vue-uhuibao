const routes = [
  {
    path: '/ucenter',
    name: 'ucenter',
    component: r => System.import('../components/ucenter/Index.vue')
  }
];

export default routes;
