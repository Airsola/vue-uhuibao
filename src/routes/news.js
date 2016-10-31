const routes = [
  {
    path: '/news/:news_id(\\d+)',
    name: 'news:detail',
    component: r => System.import('../components/news/Detail.vue')
  }
];

export default routes;
