<template>
  <nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-2"><router-link :to="{ name: 'home' }">Home</router-link> |</div>
        <div class="col-2">
          <router-link :to="{ name: 'profile' }">Meu Cadastro</router-link> |
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'users' }">Usuários</router-link> |
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'persons' }">Pessoas</router-link> |
        </div>
        <div class="col-2">
          <router-link :to="{ name: 'contacts' }">Contatos</router-link> |
        </div>
        <div class="col-2">
          <button @click="logout()" type="button" class="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: "TheHeader",

  methods: {
    logout() {
      this.$emit('logout');
    }
  },
};
</script>

<style></style>
