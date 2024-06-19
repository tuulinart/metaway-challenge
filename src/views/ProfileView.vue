<template>
  <div v-if="showForms" class="content">
    <div class="add-user__container--grid">
      <div></div>
      <div class="pb-5">
        <div class="title-box">
          <div class="row border-bottom-0 pb-0">
            <div class="div-col-title col-lg-6 col-xl-6 col-12">
              <p class="title portal-body__title mb-0">Meu perfil</p>
            </div>
            <div class="div-col-back col-lg-6 col-xl-6 col-12">
              <DynamicButton :buttonConfig="configButtonBack" />
            </div>
          </div>
        </div>
        <div class="portal-body__add-annoucement-card--bigger-padding">
          <div class="mb-3">
            <div class="col-12">
              <label class="add-user__input-label d-block mb-1" for="name">Nome</label>
              <input class="w-100 px-10" type="text" id="name" v-model="this.profile.usuario.nome" autocomplete="off" />
            </div>
          </div>
          <div class="mb-3">
            <div class="row">
              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label d-block mb-1" for="cpf">CPF</label>
                <input class="w-100 px-10" type="text" id="cpf" maxlength="14" v-model="this.profile.usuario.cpf"
                  autocomplete="off" />
              </div>

              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label d-block mb-1" for="phone">Telefone</label>
                <input class="w-100 px-10" type="tel" id="phone" maxlength="13" v-model="this.profile.usuario.telefone"
                  autocomplete="off" />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <div class="row">

              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label d-block mb-1" for="cellphone">E-mail</label>
                <input class="w-100 px-10" type="tel" id="cellphone" maxlength="14" v-model="this.profile.usuario.email"
                  autocomplete="off" />
              </div>

              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label d-block mb-1" for="cellphone">Usuário</label>
                <input class="w-100 px-10" type="tel" id="cellphone" maxlength="14"
                  v-model="this.profile.usuario.username" autocomplete="off" />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="row">

              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label d-block mb-1" for="cellphone">Data de Nascimento</label>
                <input class="w-100 px-10" type="tel" id="cellphone" maxlength="14"
                  v-model="this.profile.usuario.dataNascimento" autocomplete="off" />
              </div>

              <div class="col-lg-6 col-xl-6 col-12">
                <label class="add-user__input-label mb-1" for="profile">Perfil*</label>
                <select disabled class="select_input form-select" id="profile" v-model="this.profile.tipos[0]">
                  <option v-for="(type, index) in types" :key="index" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <div class="row">
              <!-- <div class="margin-bottom col-lg-6 col-xl-6 col-12">
                                  <label class="add-user__input-label mb-1" for="organ">Orgão*</label>
                                  <select class="form-select" id="organ" v-model="organ">
                                      <option selected value="0">Selecione</option>
                                      @for(organ of annoucement.organs; track organ.id){
                                      <option [value]="organ.id">{{ organ.name }}</option>
                                      }
                                  </select>
                              </div> -->
              <!-- <div class="col-lg-6 col-xl-6 col-12">
                                  <label class="add-user__input-label mb-1" for="profile">Perfil*</label>
                                  <select class="form-select" id="profile" v-model="profile">
                                      <option selected value="0">Selecione</option>
                                      @for(profile of annoucement.profiles; track profile.id){
                                      <option [value]="profile.id">{{ profile.name }}</option>
                                      }
                                  </select>
                              </div> -->
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <button @click="saveProfile()" class="mt-30 save-button" type="submit" :disabled="this.validForm()">
              Salvar
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>

  <LoadingComponent v-if="showLoading" />
</template>
<script>
import LoadingComponent from "../components/LoadingComponent.vue";
import DynamicButton from "../components/DynamicButton.vue";
import { USER_INFO_STORAGE } from "../utils/utils.js";
import api from "@/services/api.ts";
export default {
  name: 'ProfileView',
  components: {
    LoadingComponent,
    DynamicButton
  },
  data() {
    return {
      showLoading: false,
      profile: {},
      cachedProfile: {},
      idUser: null,
      showForms: false,
      configButtonBack: { label: 'Voltar', handler: () => this.$router.go(-1), customColor: { backgroundColor: "#c71e06" } },
      types: ['ROLE_ADMIN', 'ROLE_USER']
    };
  },
  async created() {
    this.cachedProfile = this.profile = this.$store.state.profile;
    this.idUser = JSON.parse(localStorage.getItem(USER_INFO_STORAGE)).id;
    if (Object.keys(this.profile).length === 0) this.cachedProfile = this.profile = await this.getProfileRequest();
    this.showForms = true;
  },

  methods: {

    saveProfile() {
      (this.cachedProfile, this.profile);
    },

    validForm() {

    },

    async getProfileRequest() {
      return new Promise((resolve) => {
        api.get("usuario/buscar/" + this.idUser).then((response) => {
          resolve(response.data.object);
        }).catch((err) => {
          console.log(err);
          resolve({});
        });
      })
    }
  }
}
</script>
<style>
.content {
  height: 92%;
  padding: 30px 50px;
}

.title-box {
  @media (max-width: 991px) {
    margin-bottom: 20px;

    .row {
      display: flex;
      flex-direction: column-reverse;
    }

    .div-col-title {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .div-col-back {
      display: flex;
      align-items: center;
      justify-content: end;
      margin-bottom: 10px;
    }
  }

  @media (min-width: 992px) {
    margin-top: 20px;
    margin-bottom: 20px;

    .div-col-title {
      display: flex;
      align-items: center;
      justify-content: start;
    }

    .div-col-back {
      display: flex;
      align-items: center;
      justify-content: end;
    }
  }

  .title {
    text-align: left;
    letter-spacing: 0px;
    color: #4f4f4f;
    opacity: 1;

    @media (max-width: 849px) {
      font-size: 18px;

      @media screen and (max-width: 500px) {
        font-size: 16px;
      }
    }
  }
}

.add-user__container--grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  padding: 30px 12px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 16px;
  border: 2px solid transparent;
  opacity: 1;
}

.add-user__input-label {
  font-weight: 600;
  font-family: 'Poppins';
  text-align: left;
  letter-spacing: 0px;
  color: #4f4f4f;
  opacity: 1;
  text-wrap: nowrap;
  font-size: 12px;
}

input {
  height: 48px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  outline: none;
  padding-left: 12px;
}

.select_input {
  cursor: pointer;
  font-size: 14px;
  height: 48px;
  letter-spacing: 0px;
  color: #818e94;
  padding-top: 10px;
  padding-bottom: 10px;

  &:disabled {
    color: #818e947c;
  }
}

.save-button {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0px;
  cursor: pointer;
  color: #ffffff;
  width: 240px;
  height: 48px;
  background: #f7a01d 0% 0% no-repeat padding-box;
  border-radius: 8px;
  border: 0;

  svg {
    width: 1vw;
    height: 2vh;
  }

  &:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
  }
}

.margin-bottom {
  @media (max-width: 991px) {
    margin-bottom: 20px;
  }
}
</style>