import { createStore } from 'vuex'

export default createStore({
  state: {
    showHeader: false,
    contact: {},
  },
  getters: {
  },
  mutations: {
    storeShowHeader(state, data) {
      state.showHeader = data;
    },
    storeContact(state, data) {
      state.contact = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
