<template>
  <nav>
    <div class="container-fluid container-fluid-xxl">
      <div class="row">
        <div class="col-2" :class="{ 'col-3': !accessUserTab }"><router-link :to="{ name: 'home' }">Home</router-link>
        </div>
        <div class="col-2" v-if="accessUserTab">
          <router-link :to="{ name: 'users' }">Usuários</router-link>
        </div>
        <div class="col-2" :class="{ 'col-3': !accessUserTab }">
          <router-link :to="{ name: 'persons' }">Pessoas</router-link>
        </div>
        <div class="col-2" :class="{ 'col-3': !accessUserTab }">
          <router-link :to="{ name: 'contacts' }">Contatos</router-link>
        </div>
        <div class="col-2 profile_div">
          <span @click="navigation()">{{ profile.nome }}</span>
          <div @click="navigation()" class="miniature_photo" :style="{ 'background-image': profile?.img }"></div>
        </div>

        <div class="col-2 d-flex justify-content-center align-items-center">
          <div @click="logout()" class="logout_img"></div>
        </div>

      </div>
    </div>

    <div class="container-fluid box-checkbtn">
      <div class="row">
        <label @click="showCollpaseMenu()" class="checkbtn">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </label>
      </div>
    </div>
  </nav>

  <div class="side-bar-collapse" ref="side_bar_collapse">
    <div class="container-fluid">
      <div class="row actions-top">
        <div class="col-12 closebtn d-flex align-items-center justify-content-between">
          <div @click="logout()" class="logout_img"></div>
          <label @click="closeCollapseMenu()" for="check-menu-hamburguer"><img src="../assets/close.svg"></label>
        </div>


        <div class="col-12 d-flex align-items-center justify-content-center mb-3">
          <div @click="navigation()" class="miniature_photo" :style="{ 'background-image': profile?.img }"></div>
        </div>

        <div class="col-12 header__title d-flex align-items-center justify-content-center">
          <span @click="navigation()">{{ profile.nome }}</span>
        </div>

      </div>

      <div class="row">
        <section class="menu-option list-group pt-20">
          <a v-for="(option, index) in links" :key="index" class="menu-option--text-container"
            :class="{ 'active': this.currentLinkActive.includes(option.link) }" @click="navigation(option.link)">
            <div class="container-fluid">
              <div class="row no-padding">
                <div class="col-12 gap-2 no-padding d-flex justify-content-center align-items-center">
                  <div class="box-labels">
                    <div class="img">
                      <img class="menu-option--img my-auto"
                        :src="currentLinkActive.includes(option.link) ? require(`../assets/${option.img}_white.svg`) : require(`../assets/${option.img}_gray.svg`)" />
                    </div>
                    <label class="sidebar__button-label--default-color my-auto">
                      {{ option.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </section>
      </div>

    </div>

  </div>

</template>

<script>
import { SAVE_TOKEN_STORAGE, USER_INFO_STORAGE } from "../utils/utils.js";
import api from "@/services/api.ts";
export default {

  name: "TheHeader",
  data() {
    return {
      accessUserTab: false,
      profile: {},
      currentLinkActive: "",
      links: [
        {
          label: 'Home',
          img: 'house',
          link: '/home',
          active: false,
        },
        {
          label: 'Usuários',
          img: 'users',
          link: '/usuarios',
          active: false,
        },
        {
          label: 'Pessoas',
          img: 'persons',
          link: '/pessoas',
          active: false,
        },
        {
          label: 'Contatos',
          img: 'contacts',
          link: '/contatos',
          active: false,
        }
      ],
    };
  },

  async created() {
    this.currentLinkActive = window.location.hash.split('#')[1];
    let userRoles = JSON.parse(localStorage.getItem(USER_INFO_STORAGE))?.types;
    let idUser = JSON.parse(localStorage.getItem(USER_INFO_STORAGE)).id;
    this.accessUserTab = userRoles?.includes("ROLE_ADMIN") ? true : false;
    const requestApiProfile = async () => {
      await api.get("usuario/buscar/" + idUser).then(async (response) => {
        this.profile = response.data.object.usuario;
        this.$store.commit('storeProfile', response.data.object);
      }).catch((err) => {
        console.log(err);
      });
    };
    const requestPhotosApi = async () => {
      await api.get("foto/download/" + this.profile.id, {
        headers: {
          'content-type': 'image/png',
          'accept': 'image/png'
        },
        responseType: 'blob'
      }).then(async (response) => {
        const urlCreator = window.URL || window.webkitURL;
        let fileBlob = urlCreator.createObjectURL(response.data);
        this.profile.img = `url("${fileBlob}")`;
      }).catch((err) => {
        console.log(err);
      });
    };
    await requestApiProfile();
    await requestPhotosApi();
  },

  methods: {

    navigation(link) {
      if (link) this.$router.push(link).then(() => this.currentLinkActive = window.location.hash.split('#')[1]);
      else this.$router.push('/perfil').then(() => this.currentLinkActive = window.location.hash.split('#')[1]);
      this.closeCollapseMenu();
    },

    logout() {
      localStorage.removeItem(SAVE_TOKEN_STORAGE);
      this.$store.commit('storeShowHeader', false);
      this.$router.push({ name: 'login' });
      this.closeCollapseMenu();
    },

    showCollpaseMenu() {
      this.$refs.side_bar_collapse.style.left = "0%";
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    },

    closeCollapseMenu() {
      this.$refs.side_bar_collapse.style.left = "-100%";
      document.getElementsByTagName("body")[0].style.overflow = "scroll";
    }
  },
}
</script>

<style>
nav {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1607843137);
  padding: 0px !important;
  min-height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container-fluid-xxl {
  @media screen and (max-width: 1299px) {
    display: none !important;
  }
}

.profile_div {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 15px;

  span {
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }

  .miniature_photo {
    width: 40px;
    height: 40px;
    border-radius: 100% !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
  }
}



.col-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout_img {
  width: 30px;
  height: 30px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  background-image: url('../assets/logout-icon.svg');
}


.box-checkbtn {
  display: flex;
  align-items: center;
  justify-content: start;

  @media screen and (min-width: 1300px) {
    display: none !important;
  }

  .checkbtn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;

    .bar {
      border: none;
      border-radius: 8px;
      background: #4D4F5C;
      width: 20px;
      height: 2px;
    }
  }
}


.side-bar-collapse {
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  padding-top: 20px;
  width: 100%;
  height: 100%;
  background: #EAF2FF 0% 0% no-repeat padding-box;

  position: absolute;
  left: -100%;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  transition: all 0.5s;

  @media screen and (min-width: 1300px) {
    display: none !important;
  }
}

.header--portal-type--img {
  width: 13px;
  height: 15px;
  top: 3.5px;
  left: 4.5px;
}

.header--portal-type--title {
  margin-left: 7px;
  margin-right: 25px;
  letter-spacing: 0px;
  color: #ffffff;
  text-wrap: nowrap;
}

.header--username {
  width: 118px;
  letter-spacing: 0px;
  color: #ffffff;
  font-size: 18px;
}

.header--username-container {
  padding-bottom: 0px;
}

.actions-top {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;



  .closebtn {
    img {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }
  }

  .miniature_photo {
    width: 80px;
    height: 80px;
    border-radius: 100% !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .header__title {
    margin-bottom: 12px;

    span {
      font-size: 18px;
      font-family: 'Montserrat-Bold';
      color: #4D4F5C;
    }

    @media (max-width: 1299px) {
      span {
        font-size: 14px;
      }
    }

    ;
    cursor: pointer;
  }
}

.menu-option {
  padding-inline: 0.7vw;
  font-family: 'Montserrat-Regular';
}

.menu-option--img {
  width: 18px;
  height: 18px;
  text-align: center;
}

.menu-option--text-container {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  grid-template-columns: 30px auto;
  text-decoration: none;
  height: 45px;
  margin-bottom: 6px;
  margin-inline: 1vw;
  border-radius: 6px;
  box-shadow: 0px 2px 10px #00000029;
  background: #FFF;

  &.active {
    background: #c71e06;

    .sidebar__button-label--default-color {
      color: white;
    }
  }
}

.sidebar__button-label--default-color {
  cursor: pointer;
  font-size: 14px;
  color: #4D4F5C;
}

.box-labels {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}
</style>
