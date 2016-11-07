<style lang="stylus" scoped>
.title {
  padding: .16rem .2rem;
  font-size: .15rem;
  line-height: 1em;
  & > a {
    font-size: .12rem;
    color: #999;
    position: absolute;
    right: .2rem;
    line-height: .15rem;
    &:before {
      margin-right: .05rem;
    }
  }
}
.link-grid {
  height: 1.7rem;
  padding: 0;
  position: relative;
  & > span {
    position: absolute;
    width: 50%;
    height: .85rem;
    &.lt {
      left: 0;
      top: 0;
    }
    &.lb {
      left: 0;
      bottom: 0;
    }
    &.rt {
      right: 0;
      top: 0;
    }
    &.rb {
      right: 0;
      bottom: 0;
    }
    & > a {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 0;
      & > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  &.th3-grid {
    & > span {
      &:first-of-type {
        height: 100%;
      }
    }
  }
}
.th1-grid {
  padding: .2rem;
  & > span {
    margin-bottom: .1rem;
    display: block;
    &:last-of-type {
      margin-bottom: 0;
    }
    & > a {
      position: relative;
      overflow: hidden;
      & > img {
        width: 100%;
      }
    }
  }
}
.th1-grid>span>a,.th1-grid>span>a>img {
  display: block;
}
</style>

<template>
  <div class="custom-item ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
    <div class="title ui-card-underline">
      <span class="t-bold">{{data.title}}</span>
      <a  v-if="data.category" @click="refreshData(data)" class="iconfont i-rotation-bfo">{{data.loading ? lang.rotation[0] : lang.rotation[1]}}</a>
    </div>
    <div class="generic-list" v-if="data.category">
      <slot v-for="item in data.list">
        <service-list-item v-if="item.type === 1" :productName="lang.productName[0]" :serviceId="item.thing_id" :serviceName="item.thing_name" :serviceLogo="item.thing_img" :discountTag="item.discount_tag" :serviceType="item.service_type" :serviceLink="item.service_link" :discountPrice="item.discount_price" :servicePrice="item.service_price" :serviceUv="item.count" :tags="item.tag_list" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></service-list-item>
        <task-list-item v-if="item.type === 2" :productName="lang.productName[1]" :taskId="item.thing_id" :taskName="item.thing_name" :taskLogo="item.thing_img" :taskCost="item.cost" :taskUv="item.count" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></task-list-item>
        <coupon-list-item v-if="item.type === 3" :productName="lang.productName[2]" :couponId="item.thing_id" :couponName="item.thing_name" :couponLogo="item.thing_img" :couponUv="item.count" :tags="item.tag_list" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></coupon-list-item>
        <news-list-item v-if="item.type === 4" :productName="lang.productName[3]" :newsId="item.thing_id" :newsName="item.thing_name" :newsLogo="item.thing_img" :newsUv="item.count" :tags="item.tag_list" :shopId="item.shop_id" :shopName="item.shop_name" :shopAuth="item.shop_auth"></news-list-item>
      </slot>
    </div>
    <div v-else :class="['clearfix', className]">
      <span v-for="(item, index) in data.list" :class="gridClass ? gridClass[index] : ''">
        <a :href="item.url">
          <img :src="item.image">
        </a>
      </span>
    </div>
  </div>
</template>

<script>
import ServiceListItem from '../../service/components/ListItem.vue';
import TaskListItem from '../../task/components/ListItem.vue';
import CouponListItem from '../../coupon/components/ListItem.vue';
import NewsListItem from '../../news/components/ListItem.vue';

import {Http, LANG_TYPE, CHANNEL_CODE, AREA_CODE} from 'config';

const Language = {
  'zh-cn': {
    rotation: ['加载中…', '换一批'],
    productName: ['服务', '淘流量', '卡券', '资讯']
  },
  'zh-tw': {
    rotation: ['加載中…', '換一批'],
    productName: ['服務', '淘流量', '卡券', '資訊']
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    ServiceListItem,
    TaskListItem,
    CouponListItem,
    NewsListItem
  },
  props: ['data'],
  data() {
    switch (this.data.order) {
      case 3 :
        return {
          className: 'link-grid th3-grid',
          gridClass: [
            'lt rightline',
            'rt underline',
            'rb'
          ],
          lang: language
        };

      case 4 :
        return {
          className: 'link-grid th4-grid',
          gridClass: [
            'lt underline',
            'rt leftline underline',
            'lb',
            'rb leftline'
          ],
          lang: language
        };

      case 5 :
        return {
          className: 'th1-grid',
          gridClass: [],
          lang: language
        };

      default :
        return {
          lang: language
        };
    }
  },
  methods: {
    /*
     * 换一换刷新数据
     * data *[Object] 该组数据对象
     */
    refreshData(data) {
      // 变更了数据加载中
      data.loading = true;

      Http.fetch('main/get_data_next_batch', {
        category_id: data.category,
        page: data.page + 1
      }, CHANNEL_CODE, AREA_CODE).then(response => {
        // 数据加载停止
        data.loading = false;

        Http.resolve(response).then(result => {
          // 页数增加
          data.page ++;

          // 清空数据并拉入新的数据
          data.list.splice(0, data.list.length);

          // 更换新的数据
          this.$set(data, 'list', data.list.concat(result.data));
        }).catch(error => {
          throw new Error(error);
        });
      });
    }
  }
};
</script>
