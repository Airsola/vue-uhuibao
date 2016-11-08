<style lang="stylus" scoped>
.shop-item {
  & > h5 {
    padding: .16rem .2rem;
    line-height: .18rem;
    font-size: .14rem;
  }
}
.list-show-more {
  padding: .16rem 0;
  text-align: center;
  & > span {
    font-size: .14rem;
    line-height: .14rem;
    &:after {
      color: #ddd;
      margin-left: .05rem;
    }
  }
}

</style>

<template>
  <div v-if="list.length > 0" class="shop-item ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
    <h5 class="t-bold ui-card-underline">{{lang.title}}</h5>
    <div class="generic-list">
      <list-item v-for="item in showList" :newsId="item.news_id" :newsName="item.news_title" :newsLogo="item.news_little_img_url" :newsUv="item.news_click_num" :newsDate="item.difftimedesc" :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth"></list-item>
      <div v-if="hideList.length" @click="showMore" class="list-show-more ui-card-overline">
        <span class="iconfont i-arrow-down-aft">{{lang.showMore[0]}}{{hideList.length}}{{lang.showMore[1]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from '../../news/components/ListItem.vue';

import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '商家攻略',
    showMore: ['查看其它', '条攻略']
  },
  'zh-tw': {
    title: '商家攻略',
    showMore: ['查看其它', '條攻略']
  }
});

export default {
  components: {
    ListItem
  },
  props: ['shopId', 'shopName', 'shopAuth', 'list'],
  data() {
    return {
      lang: language,
      showList: [],
      hideList: []
    };
  },
  watch: {
    list() {
      this.showList.splice(0, this.showList.length);
      this.hideList.splice(0, this.hideList.length);

      this.list.forEach((item, index) => {
        if (index < 3) {
          this.showList.push(item);
        } else {
          this.hideList.push(item);
        };
      });
    }
  },
  methods: {
    showMore() {
      this.$set(this, 'showList', this.showList.concat(this.hideList));
      this.hideList.splice(0, this.hideList.length);
    }
  }
};
</script>
