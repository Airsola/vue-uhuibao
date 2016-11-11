<template>
  <transition name="slide-left">
    <dl class="underline" @click="redirectTo(taskId)">
      <dt>
        <img v-lazy="taskLogo" :src="placeholder" :alt="taskName">
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
import placeholder from 'assets/x1_y1.png';
import {CHANNEL_CODE, AREA_CODE} from 'config';
import {translate} from 'methods';

const language = translate({
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
});

export default {
  props: ['taskId', 'taskName', 'taskLogo', 'taskCost', 'taskUv', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      placeholder,
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
