<template>
  <div class="container-fluid pt-5">
    <div class="row d-flex align-items-center justify-content-center px-3">
      <img class="img" src="../assets/logo-metaway.png" alt="">
    </div>
  </div>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <div class="card px-5 py-5" id="form1">
          <div class="form-data">
            <div class="forms-inputs mb-4">
              <span>Usuário</span>
              <input autocomplete="off" type="text" v-model="user" :class="{
                'form-control': true,
              }" @blur="userBlured = true" />
            </div>
            <div class="forms-inputs mb-4">
              <span>Senha</span>
              <input autocomplete="off" type="password" v-model="password" :class="{
                'form-control': true,
              }" @blur="passwordBlured = true" />
            </div>

            <div class="form-check mb-4 d-flex align-items-start justify-content-start gap-2">
              <input class="form-check-input" type="checkbox" id="flexCheckDefault" v-model="checkSaveData" />
              <label class="form-check-label" for="flexCheckDefault">
                <i> Lembrar-me </i>
              </label>
            </div>

            <div class="mb-3">
              <button @click="submit()" class="btn btn-dark w-100">Entrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoadingComponent v-if="showLoading" />
</template>

<script>
import api from "@/services/api.ts";
import LoadingComponent from "../components/LoadingComponent.vue";
import { SAVE_DATA_PROFILE, SAVE_TOKEN_STORAGE, showToast, USER_INFO_STORAGE } from "../utils/utils.js";
export default {
  name: "LoginView",
  components: {
    LoadingComponent,
  },
  el: "#form1",
  data() {
    return {
      user: "",
      userBlured: false,
      valid: false,
      password: "",
      passwordBlured: false,
      checkSaveData: false,
      showLoading: false,
    };
  },
  created() {
    let data = JSON.parse(localStorage.getItem(SAVE_DATA_PROFILE));
    if (data?.user) this.user = data.user;
    if (data?.password) this.password = data.password;
  },
  methods: {
    validate() {
      this.userBlured = true;
      this.passwordBlured = true;
      if (this.validuser(this.user) && this.validPassword(this.password)) {
        this.valid = true;
      }
    },

    validuser(user) {
      var re = /(.+)@(.+){2,}\.(.+){2,}/;
      if (re.test(user.toLowerCase())) {
        return true;
      }
    },

    validPassword(password) {
      if (password.length > 7) {
        return true;
      }
    },

    submit() {
      // this.validate();
      this.showLoading = true;
      let body = {
        username: this.user,
        password: this.password
      };
      const requestLoginApi = () => {
        api.post("auth/login", body).then((response) => {
          console.log(response);
          showToast("success", "Sucesso ao entrar!").then(() => {
            if (this.checkSaveData) this.saveData();
            localStorage.setItem(USER_INFO_STORAGE, JSON.stringify({ id: response.data.id, types: response.data.tipos }));
            localStorage.setItem(SAVE_TOKEN_STORAGE, JSON.stringify({ token: response.data.accessToken }));
            this.showLoading = false;
            this.$router.push({ name: 'home' });
            this.$store.commit('storeShowHeader', true);
          });
        }).catch((err) => {
          let message = "";
          if (err.response.status === 401) message = "Usuário ou senha inválido!";
          else message = "Tente novamente mais tarde!";
          showToast("error", message).then(() => this.showLoading = false);
          console.log(err);
        });
      }
      requestLoginApi();
    },

    saveData() {
      localStorage.setItem(SAVE_DATA_PROFILE, JSON.stringify({ user: this.user, password: this.password }));
    },
  },
};
</script>

<style scoped>
.img {
  width: 400px;
}

body {
  background: #000;
}

.card {
  border: none;
  height: 320px;
}

.forms-inputs {
  position: relative;
}

.forms-inputs span {
  position: absolute;
  top: -18px;
  left: 10px;
  background-color: #fff;
  padding: 5px 10px;
  font-size: 15px;
}

.forms-inputs input {
  height: 50px;
  border: 2px solid #eee;
}

.forms-inputs input:focus {
  box-shadow: none;
  outline: none;
  border: 2px solid #000;
}

.btn {
  height: 50px;
}

.success-data {
  display: flex;
  flex-direction: column;
}

.bxs-badge-check {
  font-size: 90px;
}
</style>
