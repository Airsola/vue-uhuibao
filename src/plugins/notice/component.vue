<style lang="stylus" scoped>
.ui-popup {
  position: fixed;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, .6);
  & > .ui-popup-animate {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    & > p {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: .03rem;
      box-shadow: 0 .01rem .03rem rgba(0,0,0,.2);
      overflow: hidden;
      font-size: .14rem;
      color: #333;
      padding: .12rem;
      white-space: nowrap;
      word-break: break-all;
      max-width: 90%;
      line-height: .24rem;
      text-align: center;
    }
  }
}
.fade-enter-active{
  animation: fadeIn .4s ease;
}
.fade-leave-active{
  animation: fadeOut .3s ease;
}
@keyframes fadeIn {
  from {
    opacity:0;
  }
  to {
    opacity:1;
  }
}
@keyframes fadeOut {
  from {
    opacity:1;
  }
  to {
    opacity:0;
  }
}
.zoom-enter-active{
  animation: zoomIn .4s ease;
}
.zoom-leave-active{
  animation: zoomOut .3s ease;
}
@keyframes zoomIn {
  from {
    transform: scale(.95);
  }
  to {
    transform: scale(1);
  }
}
@keyframes zoomOut {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>

<template>
  <transition name="fade">
    <div class="ui-popup ui-content-size ui-content-fixed ui-content-fixed" v-show="visible" @animationend="destroy($event)">
      <transition name="zoom">
        <div class="ui-popup-animate" v-show="visible">
          <p>{{message}}</p>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      visible: false,
      timeout: 3000,
      timer: null,
      closed: false
    };
  },
  watch: {
    closed(newVal) {
      if (newVal === true) {
        this.visible = false;
      };
    }
  },
  methods: {
    startTimer() {
      if (this.timeout > 0) {
        this.timer = window.setTimeout(() => {
          this.clearTimer();

          this.closed = true;
          this.onHide();
        }, this.timeout);
      }
    },
    clearTimer() {
      window.clearTimeout(this.timer);
    },
    destroy(evt) {
      if (this.closed && evt.target === this.$el) {
        this.$el.parentNode.removeChild(this.$el);
        this.$destroy(true);
      };
    }
  },
  mounted() {
    (this.container || window.document.body).appendChild(this.$el);

    this.visible = true;
    if (this.onShow) this.onShow();

    this.startTimer();
  }
};
</script>
