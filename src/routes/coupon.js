const CouponIndex = r => System.import('../components/coupon/Index.vue');
const routes = [
  {
    path: '/coupon',
    name: 'coupon',
    component: CouponIndex
  }, {
    path: '/coupon/:category_id(-?\\d+)/:shop_id(\\d+)',
    name: 'coupon@filter:subcategory',
    component: CouponIndex
  }, {
    path: '/coupon/category/:category_id(-?\\d+)',
    name: 'coupon@filter:category',
    component: CouponIndex
  }, {
    path: '/coupon/shop/:shop_id(\\d+)',
    name: 'coupon@filter:shop',
    component: CouponIndex
  }
];

export default routes;
