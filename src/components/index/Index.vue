<template>
  <layout>
    <layout-header :title="title">
      <area-selector slot="head:left"></area-selector>
    </layout-header>
    <layout-body>
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

import {Http, CHANNEL_CODE, CHANNEL_NAME, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '首页'
  },
  'zh-tw': {
    title: '首頁'
  }
};
const language = Language[LANG_TYPE];

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
      lan: language,
      title: CHANNEL_NAME.channel_name
    };
  },
  watch: {
    $route(to, from) {
      this.fetchData();
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Http.fetch('main/get_data', CHANNEL_CODE, AREA_CODE).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

            this.$set(this, 'banner', result.data.type0);
            this.$set(this, 'nav', result.data.type1);
            this.$set(this, 'newList', result.data.type2_news_list);
            this.$set(this, 'newShow', !!result.data.type2_display);

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

                this.list.push(data);
              });
            });
          });
        };
      });
    }
  }
};
</script>
