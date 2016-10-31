<style scoped>
.passport-popup{position:fixed;left:0;width:100%;background-color:rgba(0,0,0,.8);}

.scale-enter-active{
  animation:scaleIn .4s ease;
}
.scale-leave-active{
  animation:scaleOut .3s ease;
}
@keyframes scaleIn{
  from {transform:scale(.5);opacity:0;}
  to {transform:scale(1);opacity:1;}
}
@keyframes scaleOut{
  from {transform:scale(1);opacity:1;}
  to {transform:scale(1.3);opacity:0;}
}
</style>

<template>
  <transition name="scale" v-if="visible">
    <div class="passport-popup ui-content-size ui-content-fixed ui-content-fixed">
      <sign-in v-if="active === 0" :swipeTo="swipeTo" :signInSuccess="signInSuccess" :close="close"></sign-in>
      <sign-up v-if="active === 1" :swipeTo="swipeTo" :close="close"></sign-up>
      <sign-up-next v-if="active === 2" :swipeTo="swipeTo"></sign-up-next>
      <reset v-if="active === 3" :swipeTo="swipeTo" :close="close"></reset>
      <reset-next v-if="active === 4" :swipeTo="swipeTo"></reset-next>
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
    closed: function(newVal) {
      if (newVal === true) {
        this.visible = false;
        if (typeof this.onHide === 'function') this.onHide(this);
        this.$el.addEventListener('webkitAnimationEnd', () => {
          this.$destroy(true);
          this.$el.parentNode.removeChild(this.$el);
        });
      };
    }
  },
  methods: {
    swipeTo: function(index) {
      this.active = index;
    },
    close: function() {
      this.closed = true;
    },
    signInSuccess: function() {
      if (typeof this.onSginIn === 'function') this.onSginIn(this);
      this.close();
    }
  }
};
</script>
