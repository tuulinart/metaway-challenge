import { createStore } from 'vuex'

export default createStore({
  state: {
    showHeader: false,
    contact: {},
    profile: {},
    person: {},
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
    storeProfile(state, data) {
      state.profile = data;
    },
    storePerson(state, data) {
      state.person = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
