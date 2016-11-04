<style lang="sass" scoped>
.layout-body {
  padding-top: .5rem;
  position: relative;
  z-index: 0;
}
.filter-blur {
  transition: filter 0.3s ease;
  filter: blur(0.05rem);
}
</style>

<template>
  <div :class="['layout-body', blur ? 'filter-blur' : '']">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      blur: false
    };
  },
  methods: {
    blurIn() {
      this.blur = true;
    },
    blurOut() {
      this.blur = false;
    },
    blurToggle() {
      this.blur = !this.blur;
    }
  },
  mounted() {
    this.$root.$on('blur:in', () => {
      this.blurIn();
    });

    this.$root.$on('blur:out', () => {
      this.blurOut();
    });

    this.$root.$on('blur:toggle', () => {
      this.blurToggle();
    });
  }
};
</script>
