<style scoped>
.layout-body{padding-top:.5rem;position:relative;z-index:0;}
.layout-body.show-footer{padding-bottom:.5rem;}
</style>

<template>
  <div :class="['layout-body', footer ? 'show-footer' : '']">
    <slot></slot>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'body',
  computed: mapGetters([
    'footer'
  ])
};
</script>
