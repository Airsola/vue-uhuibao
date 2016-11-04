<style lang="sass" scoped>
.generic-list {
  dl {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
</style>

<template>
  <transition name="slide-left">
    <dl class="underline" @click="redirectTo(taskId)">
      <dt>
        <img :src="taskLogo" :alt="taskName">
      </dt>
      <dd>
        <h4 class="t-bold"><span v-if="productName" class="rightline">{{productName}}</span>{{taskName}}</h4>
        <div class="item-info" v-if="shopName">
          <span :class="['shop-name', 'iconfont', shopAuth ? 'i-verified-aft' : '']">{{lang.shop}}{{shopName}}</span>
        </div>
        <div class="taoflow">
          <span><b>{{taskCost}}</b>{{lang.flowCoin}}</span>
        </div>
        <span class="clicked">{{taskUv}} {{lang.clicked}}</span>
      </dd>
    </dl>
  </transition>
</template>

<script>
import {CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    clicked: '人参与',
    shop: '商家：',
    flowCoin: '流量币'
  },
  'zh-tw': {
    clicked: '人參與',
    shop: '商家：',
    flowCoin: '流量幣'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['taskId', 'taskName', 'taskLogo', 'taskCost', 'taskUv', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      lang: language
    };
  },
  methods: {
    redirectTo(taskId) {
      window.location.href = '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!taoflow/task?id=' + taskId;
    }
  }
};
</script>
