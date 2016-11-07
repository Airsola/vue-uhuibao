<style lang="stylus" scoped>
.ui-message {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 8%;
  text-align: center;
  pointer-events: none;
  & > .ui-message-desc {
    border-radius: .03rem;
    font-size: .14rem;
    padding: .1rem .14rem;
    line-height: 1.5em;
    max-width: 75%;
    display: inline-block;
    box-shadow: 0 0 .2rem rgba(0, 0, 0,.3);
    background-color: rgba(0, 0, 0,.75);
    color: #fff;
    word-break: break-all;
  }
}
.scale-enter-active{
  animation: scaleIn .4s ease;
}
.scale-leave-active{
  animation: scaleOut .3s ease;
}
@keyframes scaleIn{
  from {
    transform: scale(.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes scaleOut{
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(1.3);
    opacity: 0;
  }
}
</style>
<template>
  <transition name="scale">
    <div v-if="visible" :class="['ui-message']" @animationend="destroy">
      <p class="ui-message-desc">
        {{message}}
      </p>
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
      if (newVal) {
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
    destroy() {
      if (this.closed) {
        this.$el.parentNode.removeChild(this.$el);
        this.$destroy(true);
      };
    }
  },
  mounted() {
    window.document.body.appendChild(this.$el);

    this.visible = true;
    if (this.onShow) this.onShow();

    // 计时器开始
    this.startTimer();
  }
};
</script>
