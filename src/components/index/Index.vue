<template>
  <layout>
    <layout-header :title="title">
      <area-selector slot="head:left"></area-selector>
    </layout-header>
    <layout-body :style="{paddingBottom: '.5rem'}">
      <custom-banner v-if="banner" :data="banner"></custom-banner>
      <custom-nav :nav="nav" :news="newList" :show="newShow"></custom-nav>
      <custom-item v-for="item in list" :data="item"></custom-item>
    </layout-body>
    <layout-footer></layout-footer>
  </layout>
</template>

<script>
import _ from 'lodash';

import {Layout, LayoutHeader, LayoutBody, LayoutFooter, AreaSelector} from '../layout';
import CustomBanner from './index/CustomBanner.vue';
import CustomNav from './index/CustomNav.vue';
import CustomItem from './index/CustomItem.vue';

import {CHANNEL_CODE, CHANNEL_NAME, AREA_CODE} from 'config';
import {Http, Weixin} from 'methods';

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    LayoutFooter,
    AreaSelector,
    CustomBanner,
    CustomNav,
    CustomItem
  },
  data() {
    return {
      banner: [],
      nav: [],
      newList: [],
      newShow: false,
      list: [],
      title: CHANNEL_NAME.channel_name
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('main/get_data', CHANNEL_CODE, AREA_CODE).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'banner', result.data.type0);
          vm.$set(vm, 'nav', result.data.type1);
          vm.$set(vm, 'newList', result.data.type2_news_list);
          vm.$set(vm, 'newShow', !!result.data.type2_display);

          const orderArr = [3, 4, 5, 6, 7, 8];
          const rankArr = [];
          const tempItemData = {};

          for (let order of orderArr) {
            const key = 'type' + order;
            const rank = result.data[key + '_rank'];

            // 遇到无数据的忽略
            if (result.data[key].length === 0) continue;

            if (!_.includes(rankArr, rank)) rankArr.push(rank);
            if (!tempItemData[rank]) tempItemData[rank] = [];

            tempItemData[rank].push(order);
          };

          rankArr.sort().reverse().forEach(rank => {
            tempItemData[rank].sort().forEach(order => {
              const key = 'type' + order;
              const title = result.data[key + '_title'];
              const category = result.data[key + '_category'];
              const list = result.data[key];
              const data = {order, title, list};

              if (category) {
                data.category = category;
                data.page = 0;
                data.loading = false;
              };

              vm.list.push(data);
            });
          });

          Weixin.updateShare();
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  }
};
</script>
