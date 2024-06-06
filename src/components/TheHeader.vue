<template>
  <nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-2"><router-link :to="{ name: 'home' }">Home</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'profile' }">Meu Cadastro</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'users' }">Usuários</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'persons' }">Pessoas</router-link>
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'contacts' }">Contatos</router-link>
        </div>
        <div class="col-2">
          <button @click="logout()" type="button" class="btn btn-danger w-100">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { SAVE_TOKEN_STORAGE } from "../utils/utils.js";

export default {

  name: "TheHeader",

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
.col-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
