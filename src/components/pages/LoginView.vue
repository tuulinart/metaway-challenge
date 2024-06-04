<template>
  <div class="container mt-5">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <div class="card px-5 py-5" id="form1">
          <div class="form-data" v-if="!submitted">
            <div class="forms-inputs mb-4">
              <span>Usuário</span>
              <input
                autocomplete="off"
                type="text"
                v-model="email"
                :class="{
                  'form-control': true,
                }"
                v-on:blur="emailBlured = true"
              />
            </div>
            <div class="forms-inputs mb-4">
              <span>Senha</span>
              <input
                autocomplete="off"
                type="password"
                v-model="password"
                :class="{
                  'form-control': true,
                }"
                v-on:blur="passwordBlured = true"
              />
            </div>

            <div
              class="form-check mb-4 d-flex align-items-start justify-content-start gap-2"
            >
              <input
                class="form-check-input"
                type="checkbox"
                id="flexCheckDefault"
                v-model="checkSaveData"
              />
              <label class="form-check-label" for="flexCheckDefault">
                <i> Lembrar-me </i>
              </label>
            </div>

            <div class="mb-3">
              <button @click="submit()" class="btn btn-dark w-100">Entrar</button>
            </div>
          </div>

          <div class="success-data" v-else>
            <div class="text-center d-flex flex-column">
              <i class="bx bxs-badge-check"></i>
              <span class="text-center fs-1"
                >You have been logged in <br />
                Successfully</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoadingComponent v-if="showLoading" />
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import LoadingComponent from "../LoadingComponent.vue";

export default {
  name: "LoginView",
  components: {
    LoadingComponent,
  },
  el: "#form1",
  data() {
    return {
      email: "",
      emailBlured: false,
      valid: false,
      submitted: false,
      password: "",
      passwordBlured: false,
      checkSaveData: false,
      showLoading: false,
    };
  },
  methods: {
    validate() {
      this.emailBlured = true;
      this.passwordBlured = true;
      if (this.validEmail(this.email) && this.validPassword(this.password)) {
        this.valid = true;
      }
    },

    validEmail(email) {
      var re = /(.+)@(.+){2,}\.(.+){2,}/;
      if (re.test(email.toLowerCase())) {
        return true;
      }
    },

    validPassword(password) {
      if (password.length > 7) {
        return true;
      }
    },

    submit() {
      this.showLoading = true;
      setTimeout(() => {
        this.showToast("warning", "erro");
        this.showLoading = false;
      }, 4000);
      // this.validate();
      // if (this.valid) {
      //   this.submitted = true;
      //   this.saveData();
      // }
    },

    saveData() {
      if (this.checkSaveData) {
        console.log(this.checkSaveData);
      }
    },

    showToast(type, message) {
      if (type == "warning") {
        return toast.warning(message, {
          autoClose: 1500,
          position: "top-center",
        });
      } else if (type == "error") {
        return toast.error(message, {
          autoClose: 1500,
          position: "top-center",
        });
      } else {
        return toast.success(message, {
          autoClose: 1500,
          position: "top-center",
        });
      }
    },
  },
};
</script>

<style scoped>
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
