const state = {
  title: '',
  item: [],
  footer: false,
  keyword: ''
};
const mutations = {
  UPDATE_CONFIG(state, config) {
    state.title = config.title;
    state.item.splice(0, state.item.length);
    state.item = state.item.concat(config.item);
  },
  UPDATE_KEYWORD(state, keyword) {
    state.keyword = keyword;
  }
};
const actions = {
  UpdateConfig: ({commit}, config) => {
    commit('UPDATE_CONFIG', config);
  },
  KeywordUpdate: ({commit}, keyword) => {
    commit('UPDATE_KEYWORD', keyword);
  }
};
const getters = {
  title: state => state.title,
  back: state => state.item.indexOf('back') >= 0,
  input: state => state.item.indexOf('input') >= 0,
  search: state => state.item.indexOf('search') >= 0,
  area: state => state.item.indexOf('area') >= 0,
  footer: state => state.item.indexOf('footer') >= 0,
  keyword: state => state.keyword
};

export default {state, mutations, actions, getters};
