const ServiceIndex = r => System.import('../components/service/Index.vue');
const routes = [
  {
    path: '/service',
    name: 'service',
    component: ServiceIndex
  }, {
    path: '/service/:category_id(-?\\d+)/:shop_id(\\d+)/:area_code',
    name: 'service@filter:all',
    component: ServiceIndex
  }, {
    path: '/service/:category_id(-?\\d+)/:shop_id(\\d+)',
    name: 'service@filter:subcategory',
    component: ServiceIndex
  }, {
    path: '/service/category/:category_id(-?\\d+)',
    name: 'service@filter:category',
    component: ServiceIndex
  }, {
    path: '/service/shop/:shop_id(\\d+)',
    name: 'service@filter:shop',
    component: ServiceIndex
  }, {
    path: '/service/area/:area_code',
    name: 'service@filter:area',
    component: ServiceIndex
  }, {
    path: '/service/:service_id(\\d+)',
    name: 'service:detail',
    component: r => System.import('../components/service/Detail.vue')
  }
];

export default routes;
