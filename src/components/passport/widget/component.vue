<style lang="stylus" scoped>
.passport-popup {
  position: fixed;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, .6);
}
.passport-popup-animate {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
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
    <div class="passport-popup ui-content-size ui-content-fixed ui-content-fixed" v-show="visible" @animationend="destroy($event)">
      <transition name="zoom">
        <div class="passport-popup-animate" v-show="visible">
          <sign-in v-if="active === 0" :swipeTo="swipeTo" :close="close"></sign-in>
          <sign-up v-if="active === 1" :swipeTo="swipeTo" :close="close"></sign-up>
          <sign-up-next v-if="active === 2" :swipeTo="swipeTo"></sign-up-next>
          <reset v-if="active === 3" :swipeTo="swipeTo" :close="close"></reset>
          <reset-next v-if="active === 4" :swipeTo="swipeTo"></reset-next>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';
import SignUpNext from './components/SignUpNext.vue';
import Reset from './components/Reset.vue';
import ResetNext from './components/ResetNext.vue';

export default {
  components: {
    SignIn,
    SignUp,
    SignUpNext,
    Reset,
    ResetNext
  },
  data() {
    return {
      visible: false,
      active: 0,
      closed: false
    };
  },
  watch: {
    closed(newVal) {
      if (newVal === true) {
        this.visible = false;
        this.onHide();
      };
    }
  },
  methods: {
    swipeTo(index) {
      this.active = index;
    },
    close(error) {
      this.closed = true;
      if (error) {
        if (this.onForgone) this.onForgone(this);
      } else {
        if (this.onSuccess) this.onSuccess(this);
      };
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
  }
};
</script>
