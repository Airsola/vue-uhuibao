<style scoped>
  /* 导航栏 */
  .main-nav-bar{background-color:#fff;height:.4rem;line-height:.4rem;position:relative;z-index:1;position:fixed;width:100%;z-index:2;top:.5rem;}
  .filter-type{display:box;display:flex;border-bottom:solid 1px #eaeaea;position:relative;z-index:2;}
  .filter-type>span{box-flex:1;flex-grow:1;position:relative;text-align:center;max-width:50%;height:.4rem;overflow:hidden;}
  .filter-type>span:after{height:50%;}
  .filter-type>span>a.drop-arrow{height:.4rem;position:relative;font-size:.14rem;color:#999;display:inline-block;padding-right:.2rem;max-width:80%;transition:color .2s ease;}
  .filter-type>span>a.drop-arrow:after{font-size:.12rem;line-height:1em;position:absolute;right:0;top:55%;margin-top:-.6em;transform:rotate(0);transition:transform .2s ease;}
  .filter-type>span>a.drop-arrow.active:after{transform:rotate(180deg);}

  /* 下拉菜单 */
  .filter-menu{position:absolute;width:100%;z-index:1;}
  .filter-menu .drop-down{position:absolute;left:0;top:0;width:100%;background-color:#fff;box-shadow:0 .02rem .02rem rgba(0,0,0,.2);opacity:0;transform-origin:50% 0;transform:scaleY(0);transition:transform .2s ease, opacity .2s ease;}
  .filter-menu .drop-down.active{opacity:1;transform:scaleY(1);}

  /* 地区选择 */
  .area-selector>a{width:33.3333%;float:left;line-height:.48rem;font-size:.14rem;text-align:center;position:relative;}
  .area-selector>a:before{top:100%;}
  .area-selector>a:nth-of-type(3n):after{display:none;}

  /* 商家分类 */
  .filter-menu .drop-down>.category-swiper,
  .filter-menu .drop-down>.shop-swiper{width:50%;float:left;height:2.42rem;}
  .filter-menu .drop-down>.shop-swiper>.swiper-container{display:none;height:2.42rem;}
  .filter-menu .drop-down>.shop-swiper>.swiper-container:first-of-type{display:block;}
  .filter-menu .drop-down .swiper-container .swiper-slide{height:.48rem;overflow:hidden;border-bottom:solid 1px #eaeaea;}
  .filter-menu .drop-down>.category-swiper .swiper-slide.active,
  .filter-menu .drop-down>.shop-swiper,
  .filter-menu .drop-down>.shop-swiper .swiper-slide{background-color:#f7f7f7;}
  .filter-menu .drop-down .swiper-container .swiper-slide>span{font-size:.14rem;line-height:.48rem;color:#222;display:block;padding-left:.2rem;}
</style>
<template>
  <!-- 分类筛选 -->
  <div class="main-nav-bar top-bar-fixed">
    <div class="filter-type">
      <span class="rightline">
        <a @click="slideToggle(!showCateMenu, false)" :class="['drop-arrow', 'iconfont', 'i-arrow-down-aft', showCateMenu === true ? 'active' : '']">{{curCateName}}</a>
      </span>
      <span>
        <a @click="slideToggle(false, !showAreaMenu)" :class="['drop-arrow', 'iconfont', 'i-arrow-down-aft', showAreaMenu === true ? 'active' : '']">{{curAreaName}}</a>
      </span>
    </div>
    <!-- 筛选菜单 -->
    <div class="filter-menu">
      <!-- 商家分类 -->
      <div :class="['drop-down', 'clearfix', showCateMenu === true ? 'active' : '']">
        <div class="category-swiper swiper-container">
          <div class="swiper-wrapper">
            <div v-for="(item, index) in category" :class="['swiper-slide', tempCateId === item.category_id ? 'active' : '']">
              <span @click="updateTempCate(index, item.cate_name, item.category_id)">{{item.cate_name}}</span>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
        <!-- 推荐商家 -->
        <div class="shop-swiper swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="shop in curSubCate" @click="fliterShop(shop.shop_name, shop.shop_id)">
              <span>{{shop.shop_name}}</span>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </div>
      <!-- 商家地区 -->
      <div :class="['drop-down', 'area-selector', 'clearfix', showAreaMenu === true ? 'active' : '']">
        <a v-for="item in area" v-if="curAreaName !== item.area_name" @click="filterArea(item.area_name, item.area_code)"  class="overline rightline">{{item.area_name}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';

import {Http, CHANNEL_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    category: ['推荐商家', '所有地区'],
    allCategory: ['推荐商家', '全部商家'],
    allSubCategory: '全部'
  },
  'zh-tw': {
    category: ['推薦商家', '所有地區'],
    allCategory: ['推薦商家', '全部商家'],
    allSubCategory: '全部'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['showCateMenu', 'showAreaMenu', 'slideToggle'],
  data() {
    return {
      category: [
        {
          cate_name: language.allCategory[0],
          category_id: -1,
          shop_list: [
            {
              shop_id: 0,
              shop_name: language.allSubCategory
            }
          ]
        }, {
          cate_name: language.allCategory[1],
          category_id: 0,
          shop_list: [
            {
              shop_id: 0,
              shop_name: language.allSubCategory
            }
          ]
        }
      ],
      area: [
        {
          area_name: language.category[1],
          area_code: 'all'
        }
      ],
      curCateId: 'category_id' in this.$route.params ? parseInt(this.$route.params.category_id) : -1,
      curSubCateId: 'shop_id' in this.$route.params ? parseInt(this.$route.params.shop_id) : 0,
      curAreaCode: this.$route.params.area_code || 'all',
      curCateName: '',
      curAreaName: '',
      curSubCate: [],
      lang: language,
      categorySwiper: null,
      shopSwiper: null,
      tempCateName: '',
      tempCateId: ''
    };
  },
  created: function() {
    Http.fetch('service/get_cate', CHANNEL_CODE).then(response => {
      if (response.ok) {
        response.json().then(result => {
          if (result.status === 0) return;

          let index = 0;

          result.data.forEach((item) => {
            item.shop_list.unshift({
              shop_id: 0,
              shop_name: language.allSubCategory
            });
          });

          // 设计分类
          this.$set(this, 'category', this.category.concat(result.data));

          // 根据页面url地址得到当前选中的数据
          for (let i = 0; i < this.category.length; i++) {
            if (this.curCateId === this.category[i].category_id) {
              index = i;
              break;
            };
          };

          // 得到子分类列表
          this.$set(this, 'curSubCate', this.category[index].shop_list);

          // 如果选中的子分类不了全部，得到显示选中的子分类名称
          if (this.curSubCateId > 0) {
            for (let subCate of this.curSubCate) {
              if (this.curSubCateId === subCate.shop_id) {
                this.$set(this, 'curCateName', subCate.shop_name);
                break;
              };
            };
          } else {
            this.$set(this, 'curCateName', this.category[index].cate_name);
          };

          // 临时数据与当前数据保持一致
          this.tempCateName = this.curCateName;
          this.tempCateId = this.curCateId;
        });
      };
    });

    // 得到地区列表
    Http.fetch('service/get_area_list').then(response => {
      if (response.ok) {
        response.json().then(result => {
          if (result.status === 0) return;

          this.$set(this, 'area', this.area.concat(result.data.area_list));

          // 变更显示的地区名
          for (let item of this.area) {
            if (this.curAreaCode === item.area_code) {
              this.$set(this, 'curAreaName', item.area_name);
              break;
            };
          };
        });
      };
    });
  },
  mounted: function() {
    this.createSwiper();
  },
  beforeDestroy: function() {
    this.destroySwiper();
  },
  methods: {
    filterArea: function(areaName, areaCode) {
      // 隐藏下拉菜单
      this.slideToggle(false, !this.showAreaMenu);

      // 更新当前地区数据
      this.curAreaName = areaName;
      this.curAreaCode = areaCode;

      this.updateRoute('service@filter:all');
    },
    fliterShop: function(shopName, shopId) {
      // 隐藏下拉菜单
      this.slideToggle(!this.showCateMenu, false);

      // 根据子分类ID类型显示不同的分区名称
      this.curCateName = shopId > 0 ? shopName : this.tempCateName;

      // 更新子分类数据
      this.curCateId = this.tempCateId;
      this.curSubCateId = shopId;

      this.updateRoute('service@filter:subcategory');
    },
    updateTempCate: function(index, cateName, cateId) {
      // 更新分类数据
      this.tempCateName = cateName;
      this.tempCateId = cateId;

      // 更新子分类信息
      this.curSubCate = this.category[index].shop_list;
    },
    updateRoute: function(routeName) {
      // 更改路由
      this.$router.replace({
        name: routeName,
        params: {
          category_id: this.curCateId,
          shop_id: this.curSubCateId,
          area_code: this.curAreaCode
        }
      });
    },
    createSwiper: function() {
      const categorySwiper = this.$el.querySelector('.category-swiper');
      const shopSwiper = this.$el.querySelector('.shop-swiper');

      this.categorySwiper = new Swiper(categorySwiper, {
        direction: 'vertical',
        scrollbar: categorySwiper.querySelector('.swiper-scrollbar'),
        observer: true,
        slidesPerView: 'auto'
      });

      this.shopSwiper = new Swiper(shopSwiper, {
        direction: 'vertical',
        scrollbar: shopSwiper.querySelector('.swiper-scrollbar'),
        observer: true,
        slidesPerView: 'auto'
      });
    },
    destroySwiper: function() {
      this.categorySwiper.destroy();
      this.shopSwiper.destroy();
    }
  }
};
</script>
