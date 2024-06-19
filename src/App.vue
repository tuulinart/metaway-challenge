<template>
  <TheHeader v-if="$store.state.showHeader" />
  <div class="routerView" :class="{ 'h-100': !$store.state.showHeader }">
    <router-view />
  </div>

</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import { SAVE_TOKEN_STORAGE, isTokenExpired } from "./utils/utils.js";
import "@/assets/global.css"
export default {
  components: {
    TheHeader
  },
  data() {
    return {
      tokenValid: "",
    }
  },
  created() {
    this.tokenValid = JSON.parse(localStorage.getItem(SAVE_TOKEN_STORAGE));
  },
  beforeMount() {
    if (this.tokenValid?.token && !isTokenExpired(this.tokenValid?.token)) this.$store.commit('storeShowHeader', true);
  }
};
</script>

<style>
html,
body {
  height: 100%;
}

.routerView {
  height: 92%;
  background-color: #eaf2ff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #c71e06;
}

@import "~bootstrap/dist/css/bootstrap.css";
</style>
