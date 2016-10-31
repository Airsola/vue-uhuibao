import Vue from 'vue';
import Vuex from 'vuex';
import layout from './stores/layout';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    layout
  }
});

export default store;
