<style lang="stylus" scoped>
.app-nav {
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0;
  height: .5rem;
  width: 100%;
  background-color: #fff;
  border-top: solid 1px #eaeaea;
  display: box;
  display: flex;
  &.backdrop {
    background-color: rgba(255,255,255,0.9);
  }
  & > span {
    height: 100%;
    position: relative;
    box-flex: 1;
    flex-grow: 1;
    display: block;
    & > a {
      text-align: center;
      color: #5f5f5f;
      font-size: .1rem;
      line-height: 1.1em;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      &:before {
        font-size: .24rem;
        line-height: .25rem;
        margin-bottom: .03rem;
        color: #b3b3b3;
      }
    }
    & > menu {
      padding: .05rem 0;
      margin: 0;
      position: absolute;
      border: solid 1px #b3b3b3;
      border-radius: .04rem;
      left: 50%;
      width: 92%;
      max-width: .82rem;
      background-color: #fff;
      pointer-events: none;
      bottom: .36rem;
      opacity: 0;
      transition: bottom .3s ease,opacity .3s ease;
      transform: translateX(-50%);
      & > a {
        display: block;
        margin: 0 .1rem;
        line-height: .42rem;
        height: .42rem;
        position: relative;
        border-top: solid 1px #f5f5f5;
        text-align: center;
        font-size: .12rem;
        overflow: hidden;
        &:first-of-type {
          border-top: none;
        }
      }
      &:after {
        content: '';
        display: block;
        width: .06rem;
        height: .06rem;
        border-left: solid 1px #b3b3b3;
        border-bottom: solid 1px #b3b3b3;
        background-color: #fff;
        border-bottom-left-radius: .02rem;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 60%) rotate(-45deg);
      }
    }
    &.active {
      & > menu {
        bottom: .56rem;
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
}
.app-nav>span>a,.app-nav>span>a:before {
  display: block;
  transition: color .2s ease;
}
.app-nav>span.active>a,.app-nav>span.active>a:before {
  color: #2cbcff;
}
</style>

<template>
  <nav class="app-nav">
    <span v-for="item in data" :class="[current === item.cid ? 'active' : '']">
      <menu v-if="item.subbars.length > 0">
        <a v-for="link in item.subbars" :href="link.url" data-hash="1">{{link.name}}</a>
      </menu>
      <a v-if="item.subbars.length > 0" :class="['iconfont', 'i-' + item.cssname + '-bfo', ]" @click="current = current === item.cid ? 0 : item.cid" data-hash="1">{{item.name}}</a>
      <a v-else :class="['iconfont', 'i-' + item.cssname + '-bfo']" :href="item.url" data-hash="1">{{item.name}}</a>
    </span>
  </nav>
</template>

<script>
import Helper from 'helper';
import {CHANNEL_CODE, HASH_CLICK} from 'config';
import {Http} from 'methods';

export default {
  name: 'footer',
  computed: {
    uuid: () => Helper.getRandomStamp()
  },
  data() {
    return {
      data: [],
      current: 0
    };
  },
  created() {
    Http.fetch('common/get_footer_data', CHANNEL_CODE).then(response => {
      Http.resolve(response).then(result => {
        this.$set(this, 'data', result.data.type2);
      }).catch(error => {
        throw new Error(error);
      });
    });
  },
  watch: {
    current(newVal) {
      HASH_CLICK[this.uuid] = !!newVal;
    }
  },
  mounted() {
    window.document.body.addEventListener('click', (evt) => {
      if (this.current !== 0 && !Helper.isChildNode(evt.target, this.$el)) {
        evt.preventDefault();
        this.current = 0;
      };
    });
  }
};
</script>
