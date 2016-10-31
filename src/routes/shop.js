const ShopLocation = r => System.import('../components/shop/Location.vue');

const routes = [
  {
    path: '/shop/:shop_id(\\d+)',
    name: 'shop:detail',
    component: r => System.import('../components/shop/Detail.vue')
  }, {
    path: '/shop/:shop_id(\\d+)/stores',
    name: 'shop:stores',
    component: r => System.import('../components/shop/Stores.vue')
  }, {
    path: '/shop/:shop_id(\\d+)/album',
    name: 'shop:album',
    component: r => System.import('../components/shop/Album.vue')
  }, {
    path: '/shop/:shop_id(\\d+)/location',
    name: 'shop:location',
    component: ShopLocation
  }, {
    path: '/shop/:shop_id(\\d+)/location/:store_id(\\d+)',
    name: 'shop:location@store',
    component: ShopLocation
  }
];

export default routes;
