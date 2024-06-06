import { createStore } from 'vuex'

export default createStore({
  state: {
    showHeader: false,
  },
  getters: {
  },
  mutations: {
    storeShowHeader(state, data) {
      state.showHeader = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
