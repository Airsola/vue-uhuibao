<style lang="stylus" scoped>
/* 导航栏 */
.main-nav-bar {
  background-color: #fff;
  height: .4rem;
  line-height: .4rem;
  position: relative;
  z-index: 1;
  position: fixed;
  width: 100%;
  z-index: 2;
  top: .5rem;
}
.filter-type {
  display: box;
  display: flex;
  border-bottom: solid 1px #eaeaea;
  position: relative;
  z-index: 2;
  & > span {
    position: relative;
    height: .4rem;
    overflow: hidden;
    padding: 0 .2rem;
    & > a {
      &.drop-arrow {
        height: .4rem;
        position: relative;
        font-size: .14rem;
        color: #999;
        display: inline-block;
        padding-right: .2rem;
        max-width: 80%;
        transition: color .2s ease;
        &:after {
          font-size: .12rem;
          line-height: 1em;
          position: absolute;
          right: 0;
          top: 55%;
          margin-top: -.6em;
          transform: rotate(0);
          transition: transform .2s ease;
        }
        &.active {
          &:after {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
/* 下拉菜单 */
.filter-menu {
  position: absolute;
  width: 100%;
  z-index: 1;
  .drop-down {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 .02rem .02rem rgba(0,0,0,.2);
    opacity: 0;
    transform-origin: 50% 0;
    transform: scaleY(0);
    transition: transform .2s ease, opacity .2s ease;
    &.active {
      opacity: 1;
      transform: scaleY(1);
    }
    & > .shop-swiper {
      & > .swiper-container {
        display: none;
        height: 2.42rem;
        &:first-of-type {
          display: block;
        }
      }
    }
    .swiper-container {
      .swiper-slide {
        height: .48rem;
        overflow: hidden;
        border-bottom: solid 1px #eaeaea;
        & > span {
          font-size: .14rem;
          line-height: .48rem;
          color: #222;
          display: block;
          padding-left: .2rem;
        }
      }
    }
  }
}
/* 商家分类 */
.filter-menu .drop-down>.category-swiper,
  .filter-menu .drop-down>.shop-swiper {
  width: 50%;
  float: left;
  height: 2.42rem;
}
.filter-menu .drop-down>.category-swiper .swiper-slide.active,
  .filter-menu .drop-down>.shop-swiper,
  .filter-menu .drop-down>.shop-swiper .swiper-slide {
  background-color: #f7f7f7;
}
</style>
<template>
  <!-- 分类筛选 -->
  <div class="main-nav-bar top-bar-fixed">
    <div class="filter-type">
      <span>
        <a @click="slideToggle(!showCateMenu, false)" :class="['drop-arrow', 'iconfont', 'i-arrow-down-aft', showCateMenu === true ? 'active' : '']">{{curCateName}}</a>
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
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import {Http, CHANNEL_CODE, LANG_TYPE, AREA_CODE} from 'config';

const Language = {
  'zh-cn': {
    allSubCategory: '全部商家'
  },
  'zh-tw': {
    allSubCategory: '全部商家'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['showCateMenu', 'slideToggle'],
  data() {
    return {
      category: [],
      curCateId: 'category_id' in this.$route.params ? parseInt(this.$route.params.category_id) : 0,
      curSubCateId: 'shop_id' in this.$route.params ? parseInt(this.$route.params.shop_id) : 0,
      curCateName: '',
      curSubCate: [],
      categorySwiper: null,
      shopSwiper: null,
      tempCateName: '',
      tempCateId: '',
      lang: language
    };
  },
  created() {
    Http.fetch('coupon/get_cate', CHANNEL_CODE, AREA_CODE).then(response => {
      Http.resolve(response).then(result => {
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
      }).catch(error => {
        throw new Error(error);
      });
    });
  },
  mounted() {
    this.createSwiper();
  },
  beforeDestroy() {
    this.destroySwiper();
  },
  methods: {
    fliterShop(shopName, shopId) {
      // 隐藏下拉菜单
      this.slideToggle(!this.showCateMenu, false);

      // 根据子分类ID类型显示不同的分区名称
      this.curCateName = shopId > 0 ? shopName : this.tempCateName;

      // 更新子分类数据
      this.curCateId = this.tempCateId;
      this.curSubCateId = shopId;

      this.updateRoute('coupon@filter:subcategory');
    },
    updateTempCate(index, cateName, cateId) {
      // 更新分类数据
      this.tempCateName = cateName;
      this.tempCateId = cateId;

      // 更新子分类信息
      this.curSubCate = this.category[index].shop_list;
    },
    updateRoute(routeName) {
      // 更改路由
      this.$router.replace({
        name: routeName,
        params: {
          category_id: this.curCateId,
          shop_id: this.curSubCateId
        }
      });
    },
    createSwiper() {
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
    destroySwiper() {
      this.categorySwiper.destroy();
      this.shopSwiper.destroy();
    }
  }
};
</script>
