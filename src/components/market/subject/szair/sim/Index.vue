<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../../../../layout';

import _ from 'lodash';
import {Http, CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '境外电话卡'
  },
  'zh-tw': {
    title: '境外電話卡'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody
  },
  data() {
    return {
      banner: [],
      nav: [],
      newList: [],
      newShow: false,
      list: [],
      lan: language
    };
  },
  watch: {
    $route: function(to, from) {
      this.fetchData();
    }
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // Http.fetch('main/get_data', CHANNEL_CODE, AREA_CODE).then(response => {
      //   if (response.ok) {
      //     response.json().then(result => {
      //       if (result.status === 0) return;
      //     });
      //   };
      // });
    }
  }
};
</script>
