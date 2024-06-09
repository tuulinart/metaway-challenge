<template>
  <div class="body">
    <div class="box-header--table">
      <div class="subheader">
        <span class="subtitle">Contatos</span>
        <div class="left">
          <div class="search_box">
            <input type="text" v-model="searchTextValue" placeholder="Pesquise por uma palavra chave">
          </div>
          <DynamicButton :buttonConfig="configButtonSearch" />
          <DynamicButton v-if="showButtonClearSearch" :buttonConfig="configButtonClearSearch" />
          <DynamicButton :buttonConfig="configButtonNewContact" />
        </div>
      </div>
      <div class="table mb-0" :class="{ 'mb-3': showContactsArray.length <= 0 }">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 px-0">
              <table class="dynamic_table" cellpadding="10" id="table__data">
                <thead>
                  <tr class="row_title">
                    <th class="title_column" v-for="(title, index) in titlesHeader" :key="index">{{ title }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(contact, index) in showContactsArray" :key="index" class="row_texts">
                    <!-- <td class="text_column" [attr.hover-tooltip]="contact"> -->
                    <td class="text_column">
                      <div class="p-0 table__title--mobile d-flex align-items-center justify-content-center">
                        <div class="miniature_photo" :style="{ 'background-image': contact.img }">
                        </div>
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[1] }}:</span>
                        {{ contact.id }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[2] }}:</span>
                        {{ contact.pessoa.nome }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[3] }}:</span>
                        {{ contact.pessoa.cpf }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[4] }}:</span>
                        {{ contact.pessoa.endereco.logradouro }},
                        {{ contact.pessoa.endereco.numero }},
                        {{ contact.pessoa.endereco.bairro }},
                        {{ contact.pessoa.endereco.cidade }},
                        {{ contact.pessoa.endereco.pais }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[5] }}:</span>
                        {{ contact.email }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[6] }}:</span>
                        {{ contact.usuario.telefone }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[7] }}: </span>
                        <img @click="requestRemoveFavorite(contact, index)" v-if="contact.favorite"
                          class="star_favorite" src="../assets/star-solid.svg">
                        <img @click="requestSaveFavorite(contact, index)" v-else class="star_favorite"
                          src="../assets/star-regular.svg">
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <DynamicButton
                          :buttonConfig="{ label: 'Editar', outlined: true, handler: () => this.editContact(contact) }" />
                      </div>
                    </td>

                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <div @click="deleteContact(contact, index)" class="delete_contact"></div>
                      </div>
                    </td>
                  </tr>
                  <span v-if="showContactsArray.length <= 0" class="no_data">Sem dados</span>
                </tbody>
              </table>

              <div v-if="showContactsArray.length > 0" class="pagination">
                <button class="button_swap_page" :disabled="activeLink == pages[0]" @click="swapPage(false)">
                  &lt;
                </button>
                <ul>
                  <li v-for="(page, index) in pages" :key="index" :class="{
                    'link': true,
                    'active': activeLink === page,
                  }" @click="activePage(page)">
                    {{ page }}
                  </li>
                </ul>
                <button class="button_swap_page" :disabled="activeLink == pages.length" @click="swapPage(true)">
                  &gt;
                </button>

                <div class="buttonSwapIteensPeerPage">
                  <label for="itemsPerPage">Itens por página:</label>
                  <select v-model="itemsPerPage" name="itemsPerPage" id="itemsPerPage">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <LoadingComponent v-if="showLoading" />
</template>

<script>
import LoadingComponent from "../components/LoadingComponent.vue";
import DynamicButton from "../components/DynamicButton.vue";
import api from "@/services/api.ts";
import { USER_INFO_STORAGE, showToast } from "../utils/utils.js";
export default {
  name: 'HomeView',
  components: {
    LoadingComponent,
    DynamicButton
  },
  data() {
    return {
      showLoading: false,
      titlesHeader: ['', 'Id', 'Nome', 'CPF', 'Endereço', 'Email', 'Telefone', 'Favorito', '', ''],
      dataContacts: [],
      showContactsArray: [],
      pages: [],
      activeLink: 1,
      itemsPerPage: 10,
      searchTextValue: "",
      configButtonSearch: { label: 'Pesquisar', handler: () => this.searchContacts(), customColor: { backgroundColor: "#c71e06" } },
      configButtonClearSearch: { label: 'Limpar', handler: () => this.clearSearch(), customColor: { backgroundColor: "#f7a01d" } },
      configButtonNewContact : { label: '+', handler: () => this.newContact(), customColor: { backgroundColor: "#22bb33" } },
      showButtonClearSearch: false,
    };
  },

  async created() {
    this.showLoading = true;
    let idUser = JSON.parse(localStorage.getItem(USER_INFO_STORAGE)).id;
    // let idUser = 1;
    const requestContactsApi = async () => {
      await api.get("contato/listar/" + idUser).then((response) => {
        this.dataContacts = response.data;
      }).catch((err) => {
        console.log(err);
      });
    };
    const requestFavoritesApi = async () => {
      await api.get("favorito/pesquisar").then(async (response) => {
        for (let index = 0; index < response.data.length; index++) {
          const favorite = response.data[index];
          favorite.favorite = true;
          if (!this.dataContacts.some(el => el.id === favorite.id))
            this.dataContacts.push(favorite);
        }
        this.dataContacts.sort((a, b) => a.id - b.id);
      }).catch((err) => {
        console.log(err);
      });
    };
    const requestPhotosApi = async () => {
      for (let index = 0; index < this.dataContacts.length; index++) {
        const contact = this.dataContacts[index];
        await api.get("foto/download/" + contact.pessoa.id, {
          headers: {
            'content-type': 'image/png',
            'accept': 'image/png'
          },
          responseType: 'blob'
        }).then(async (response) => {
          const urlCreator = window.URL || window.webkitURL;
          let fileBlob = urlCreator.createObjectURL(response.data);
          contact.img = `url("${fileBlob}")`;
        }).catch((err) => {
          console.log(err);
        });
      }
    };
    await requestContactsApi();
    await requestFavoritesApi();
    await requestPhotosApi();
    this.getNumPages(this.dataContacts);
    this.activePage(1);
    this.showLoading = false;
  },
  methods: {
    requestSaveFavorite(contact, index) {
      api.post("favorito/salvar", contact).then(async () => {
        showToast("success", "Contato favoritado com sucesso!");
        this.showContactsArray[index].favorite = true;

      }).catch((err) => {
        showToast("error", "Erro ao favoritar contato");
        console.log(err);
      });
    },

    requestRemoveFavorite(contact, index) {
      api.delete("favorito/remover/" + contact.id).then(async () => {
        showToast("success", "Contato removido dos favoritos com sucesso!");
        this.showContactsArray[index].favorite = false;
      }).catch((err) => {
        showToast("error", "Erro ao remover contato dos favoritos.");
        console.log(err);
      });
    },

    swapPage(nextPage) {
      if (nextPage) this.activeLink += 1;
      else this.activeLink -= 1;
      this.showContactsArray = this.paginateArray(this.dataContacts, this.itemsPerPage, this.activeLink);
    },

    activePage(pageNumber) {
      this.activeLink = pageNumber;
      this.showContactsArray = this.paginateArray(this.dataContacts, this.itemsPerPage, this.activeLink);
    },

    getNumPages(data) {
      let array = data;
      let numberPages = Math.ceil(array.length / this.itemsPerPage);
      this.pages = Array.from({ length: numberPages }, (_, i) => i + 1);
    },

    paginateArray(array, page_size, page_number) {
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    },

    searchContacts() {
      this.showButtonClearSearch = true;
      let newArray = [];
      this.dataContacts.forEach((elementArray) => {
        if (this.searchTextValue) {
          if (this.validateObject(elementArray, event.searchValue)) {
            newArray.push(elementArray);
          }
        }
      });
      this.showContactsArray = newArray;
      // this.getNumPages(this.dataContacts);
      // this.activePage(1);
    },

    validateObject(object) {
      if (
        object.email.toString().toLowerCase().includes(this.searchTextValue) ||
        object.id.toString().toLowerCase().includes(this.searchTextValue) ||
        object.tag.toString().toLowerCase().includes(this.searchTextValue) ||
        object.telefone.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.cpf.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.nome.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.bairro.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.cep.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.cidade.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.estado.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.logradouro.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.numero.toString().toLowerCase().includes(this.searchTextValue) ||
        object.pessoa.endereco.pais.toString().toLowerCase().includes(this.searchTextValue) ||
        object.email.toString().toLowerCase().includes(this.searchTextValue)) return true;
      return false;
    },

    clearSearch() {
      this.showButtonClearSearch = false;
      this.searchTextValue = "";
      this.getNumPages(this.dataContacts);
      this.activePage(1);
    },

    editContact(contact) {
      console.log(contact);
    },

    deleteContact(contact, index) {
      api.delete("contato/remover/" + contact.id).then(() => {
        showToast("success", "Sucesso ao remover contato!");
        this.showContactsArray.splice(0, index);
      }).catch((err) => {
        showToast("error", "Erro ao remover contato!");
        console.log(err);
      });
    },

    newContact() {
      console.log('aq');
    }
  },
  watch: {
    itemsPerPage() {
      this.getNumPages(this.dataContacts);
      this.activePage(1);
    }
  }
}
</script>

<style>
.body {
  background-color: #eaf2ff;
  padding: 30px 12px;

  @media (min-width: 850px) {
    .dynamic_table {
      width: 100%;
    }

    .headerColumnName {
      display: none;
    }

    tr {
      border-style: hidden;

      :first-child {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
      }

      :last-child {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        text-align: center !important;
      }
    }


    thead {
      background: #e3e9ef;
    }


    tbody::before {
      content: "";
      display: block;
      height: 5px;
    }

    .row_title {
      .title_column {
        text-align: center;
        letter-spacing: 0px;
        opacity: 1;
        color: #818e94;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .row_texts {
      .text_column {
        text-align: center;
        max-width: 20vw;

        & div {
          opacity: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
          color: #4f4f4f;
          font-size: 13px;
        }
      }

      .padding_top {
        padding-top: 15px;
      }

      .button_end_table {
        background-color: #fff;
        border-radius: 8px;
        opacity: 1;
        padding: 0.5vh 1vw;
        text-align: center;
        font-weight: 600;
        height: 45px;

        @media screen and (max-width: 500px) {
          font-size: 14px;
        }
      }

      .rede_mulher_color {
        border: 2px solid #541b82;
        color: #895bf1;

        &:hover {
          color: #fff;
          background: #895bf1;
          border: 2px solid #895bf1;
        }
      }

      .rj190_color {
        border: 2px solid #508ff4;
        color: #0090ff;

        &:hover {
          color: #fff;
          background: #0090ff;
          border: 2px solid #0090ff;
        }
      }

      .rede_escola_color {
        border: 2px solid #508ff4;
        color: #0090ff;

        &:hover {
          color: #fff;
          background: #0090ff;
          border: 2px solid #0090ff;
        }
      }

      &:hover {
        background-color: #f4f4f4;
      }
    }

    .no_data {
      position: absolute;
      left: 52%;
      letter-spacing: 0px;
      color: #4f4f4f;
      opacity: 1;
      margin-top: 10px;
    }

  }

  @media (max-width: 849px) {

    table {
      display: flex;
      align-items: center;
      justify-content: center;
      table-layout: fixed;
    }

    th {
      display: none;
    }

    tr {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      border-radius: 8px;

      border: 1px solid #e3e9ef;
      margin-top: 5px;
      margin-bottom: 5px;

      td {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        white-space: normal;
        border-bottom: 1px solid #e3e9ef;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    tr:nth-of-type(2n) {
      background: #e3e9ef;

      & td {
        border-bottom: 1px solid white;

        &:last-child {
          border-bottom: none;
        }
      }
    }

    tbody {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 16px;
      padding-bottom: 20px;
    }

    .headerColumnName {
      content: attr(data-cell) ":";
      font-weight: bold;
      text-transform: capitalize;
      padding-right: 3px;
    }

    .button_end_table {
      background-color: #fff;
      border-radius: 8px;
      opacity: 1;
      padding: 1vh 24px;
      text-align: center;
      font-weight: 600;

      @media screen and (max-width: 500px) {
        font-size: 14px;
      }
    }
  }

  .delete_contact {
    background-color: #4f4f4f;
    -webkit-mask: url("../assets/trash.svg") no-repeat center;
    mask: url("../assets/trash.svg") no-repeat center;
    background-repeat: no-repeat;
    background-position: center;
    width: 32px;
    height: 20px;
    cursor: pointer;

    &:hover {
      background-color: red;
    }
  }

  .miniature_photo {
    width: 50px;
    height: 50px;
    border-radius: 100% !important;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .star_favorite {
    width: 22px;
    height: 22px;
    cursor: pointer;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4f4f4f;
    padding: 10px 40px;
    border-radius: 6px;

    ul {
      margin: 0 5px;
      padding: 0px;
    }

    ul li {
      display: inline-block;
      background: #fff;
      width: 22px;
      height: 22px;
      border-radius: 8px;
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 21px;
      cursor: pointer;
    }

    ul li.active {
      background: #0090ff;
      color: white;
    }

    .button_swap_page {
      border: none;
      background: #fff;
      color: #7d8185;
      padding: 0px;
      margin-top: 4px;
      font-weight: 0;
      font-family: "Poppins";

      &:disabled {
        color: #e3e9ef;
      }
    }

    .buttonSwapIteensPeerPage {
      position: absolute;
      left: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;

      @media (max-width: 849px) {
        label {
          display: none;
        }
      }
    }
  }

  .table__title--mobile {
    @media screen and (max-width: 500px) {
      &:first-child {
        font-size: 14px;
      }

      font-size: 12px;
    }
  }

  @media (min-width: 850px) {
    .box-header--table {
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 6px #00000029;
      border-radius: 16px;
      border: 2px solid transparent;
      opacity: 1;
      padding: 20px;

      .subheader {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;

        .subtitle {
          text-align: left;
          letter-spacing: 0px;
          color: #4f4f4f;
          opacity: 1;
          text-wrap: nowrap;
          font-size: 18px;

          @media screen and (max-width: 500px) {
            font-size: 16px;
          }
        }

        .left {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;

          @media screen and (max-width: 500px) {
            min-width: 100%;
            flex-direction: column;
            align-items: start;
            justify-content: start;
          }

          .search_box {

            @media screen and (max-width: 500px) {
              width: 100%;
            }

            input {
              border: 1px solid #d3d3d3;
              border-radius: 8px;
              padding-left: 42px !important;
              padding: 10px;
              background-repeat: no-repeat;
              background-position: 15px;
              background-origin: padding-box;
              background-image: url("../assets/lupe.svg");
              width: 250px;
              text-align: left;
              font-weight: 400;
              color: #818e94;
              opacity: 1;

              &::placeholder {
                width: 100%;

                @media screen and (max-width: 500px) {
                  font-size: 14px;
                }
              }
            }

            textarea:focus,
            input:focus {
              outline: none;
            }

            img {
              background-color: red;
            }
          }
        }
      }
    }
  }

  @media (max-width: 849px) {
    .box-header--table {
      background: #ffffff 0% 0% no-repeat padding-box;
      box-shadow: 0px 3px 6px #00000029;
      border-radius: 16px;
      border: 2px solid transparent;
      opacity: 1;
      padding: 20px;

      .subheader {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding-bottom: 15px;

        @media screen and (max-width: 500px) {
          align-items: start;

          & select {
            font-size: 14px !important;
            height: 48px;
          }
        }

        .subtitle {
          text-align: left;
          letter-spacing: 0px;
          color: #4f4f4f;
          opacity: 1;
          text-wrap: nowrap;
          font-size: 18px;
          padding-bottom: 10px;

          @media screen and (max-width: 500px) {
            font-size: 16px;
          }
        }

        .left {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          @media screen and (max-width: 500px) {
            min-width: 100%;
            flex-direction: column;
            align-items: start;
            justify-content: start;
          }

          .search_box {

            @media screen and (max-width: 500px) {
              min-width: 100%;
            }

            input {
              border: 1px solid #d3d3d3;
              border-radius: 8px;
              padding-left: 32px !important;
              padding: 10px;
              background-repeat: no-repeat;
              background-position: 5px;
              background-image: url("../assets/lupe.svg");

              @media screen and (max-width: 500px) {
                background-position: 10px;
              }

              background-origin: padding-box;
              text-align: left;
              width: 100%;
              font-weight: 400;
              color: #818e94;
              opacity: 1;

              &::placeholder {
                width: 100%;

                @media screen and (max-width: 500px) {
                  font-size: 14px;
                }
              }
            }

            textarea:focus,
            input:focus {
              outline: none;
            }

            img {
              background-color: red;
            }
          }
        }
      }
    }
  }

  .search_box input {
    @media screen and (max-width: 500px) {
      font-size: 14px !important;
    }
  }
}
</style>
