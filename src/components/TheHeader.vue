<template>
  <nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-2"><router-link :to="{ name: 'home' }">Home</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'profile' }">Meu Cadastro</router-link>
        </div>
        <div class="col-2" v-if="accessUserTab">
          <router-link :to="{ name: 'users' }">Usuários</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'persons' }">Pessoas</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'contacts' }">Contatos</router-link>
        </div>
        <div class="col-2">
          <button @click="logout()" type="button" class="logout btn w-100">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { SAVE_TOKEN_STORAGE, USER_INFO_STORAGE } from "../utils/utils.js";

export default {

  name: "TheHeader",

  data() {
    return {
      accessUserTab: false,
    };
  },

  created() {
    let userRoles = JSON.parse(localStorage.getItem(USER_INFO_STORAGE))?.types;
    this.accessUserTab = userRoles?.includes("ROLE_ADMIN") ? true : false;
  },

  methods: {
    logout() {
      localStorage.removeItem(SAVE_TOKEN_STORAGE);
      this.$store.commit('storeShowHeader', false);
      this.$router.push({ name: 'login' });
    }
  },
}
</script>

<style>
nav {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1607843137);
}

.col-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout {
  background-color: #c71e06 !important;
  color: #FFF !important;
}
</style>
