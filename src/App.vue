<template>
  <TheHeader v-if="tokenValid" @logout="logout()" />
  <router-view />
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import { SAVE_TOKEN_STORAGE } from "./utils/utils.js";
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

  methods: {

    logout() {
      localStorage.removeItem(SAVE_TOKEN_STORAGE);
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

@import "~bootstrap/dist/css/bootstrap.css";
</style>
