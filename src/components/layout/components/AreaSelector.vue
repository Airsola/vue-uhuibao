<style lang="sass" scoped>
.area-drop-down {
  position: absolute;
  left: .2rem;
  top: 50%;
  height: .4rem;
  color: #fff;
  line-height: .4rem;
  font-size: .14rem;
  display: inline-block;
  padding-right: .16rem;
  transform: translateY(-50%);
  &:after {
    position: absolute;
    height: 1em;
    line-height: 1em;
    right: 0;
    top: 50%;
    margin-top: -.5em;
    font-size: .12rem;
    transition: transform .3s ease;
  }
  &.active {
    &:after {
      transform: rotate(180deg);
    }
  }
}
/* 地区选择 */
.area-selector {
  position: fixed;
  left: 0;
  top: .5rem;
  z-index: 2;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 .02rem .02rem rgba(0,0,0,.2);
  & > a {
    width: 33.3333%;
    float: left;
    line-height: .48rem;
    font-size: .14rem;
    text-align: center;
    position: relative;
    &:before {
      top: 100%;
    }
    &:nth-of-type(3n):after {
      display: none;
    }
  }
}
/* 必需 */
.slide-fade-enter-active,.slide-fade-leave-active {
  transform-origin: 50% 0;
  transition: opacity .2s ease,transform .2s ease;
}
.slide-fade-enter-active {
  opacity: 1;
  transform: scaleY(1);
}
.slide-fade-enter,.slide-fade-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>

<template>
  <div>
    <a @click="visible = !visible" :class="['area-drop-down', 'iconfont', 'i-arrow-down-aft', visible === true ? 'active' : '']">{{areaName}}</a>
    <transition name="slide-fade">
      <div class="area-selector top-bar-fixed clearfix" v-show="visible">
        <a v-for="area in list" v-if="areaCode !== area.area_code" @click="changeArea(area.area_code, area.area_name)" class="overline rightline">{{area.area_name}}</a>
      </div>
    </transition>
  </div>
</template>

<script>
import Helper from 'helper';
import {Http, CHANNEL_CODE, AREA_CODE, LANG_TYPE, HASH_CLICK} from 'config';

const Language = {
  'zh-cn': {
    allArea: '所有地区'
  },
  'zh-tw': {
    allArea: '所有地區'
  }
};
const language = Language[LANG_TYPE];

export default {
  computed: {
    uuid: () => Helper.getRandomStamp()
  },
  data() {
    return {
      list: [
        {
          area_name: language.allArea,
          area_code: 'all'
        }
      ],
      areaName: '',
      areaCode: '',
      visible: false
    };
  },
  created() {
    Http.fetch('common/get_area_list').then(response => {
      Http.resolve(response, (error, result) => {
        if (error) {
          throw result;
        } else {
          if (result.status === 1) {
            this.$set(this, 'list', this.list.concat(result.data.area_list));

            for (let area of this.list) {
              if (area.area_code.toString() === AREA_CODE.area_code.toString()) return this.updateAreaCode(area.area_code, area.area_name);
            };
          } else {
            throw result.msg;
          };
        };
      });
    });
  },
  mounted() {
    // 其它区域点击关闭
    window.document.body.addEventListener('click', this.close);
  },
  beforeDestroy() {
    window.document.body.removeEventListener('click', this.close);
  },
  watch: {
    visible(newVal) {
      HASH_CLICK[this.uuid] = newVal;
    }
  },
  methods: {
    changeArea(areaCode, areaName) {
      this.visible = false;

      // 如果城市没有变化，则退出
      if (this.areaCode === areaCode) return;

      // 更新地区session
      Http.fetch('common/record_session', {area_code: areaCode}, CHANNEL_CODE).then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              // 得到当前地址栏的地址
              const query = Helper.query2json();
              // 更新地址栏地址，防止刷新重置
              if (query && query.area) window.history.replaceState(null, null, window.location.href.replace(new RegExp('area=' + query.area), 'area=' + areaCode));

              this.updateAreaCode(areaCode, areaName);
            } else {
              throw result.msg;
            };
          };
        });
      });
    },
    updateAreaCode(areaCode, areaName) {
      this.areaCode = areaCode;
      this.areaName = areaName;

      AREA_CODE.area_code = areaCode;
    },
    close(evt) {
      if (!Helper.isChildNode(evt.target, this.$el) && this.visible) {
        evt.preventDefault();
        this.visible = false;
      };
    }
  }
};
</script>
