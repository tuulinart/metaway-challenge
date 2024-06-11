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
                        <img @click="requestRemoveFavorite(contact, index)" v-if="contact.favorite"
                          class="star_favorite" src="../assets/star-solid.svg">
                        <img @click="requestSaveFavorite(contact, index)" v-else class="star_favorite"
                          src="../assets/star-regular.svg">
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <DynamicButton
                          :buttonConfig="{ label: 'Editar', outlined: true, handler: () => this.newOrAttContact(contact) }" />
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
                <div class="button_swap_page left" :class="{ 'disabled': activeLink == pages[0] }"
                  @click="activeLink == pages[0] ? null : swapPage(false)"></div>
                <ul>
                  <li v-for="(page, index) in pages" :key="index" :class="{
                    'link': true,
                    'active': activeLink === page,
                  }" @click="activePage(page)">
                    {{ page }}
                  </li>
                </ul>
                <div class="button_swap_page right" :class="{ 'disabled': activeLink == numberPages }"
                  @click="activeLink == numberPages ? null : swapPage(true)"></div>

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
      arraySearch: [],
      pages: [],
      activeLink: 1,
      itemsPerPage: 10,
      numberPages: null,
      searchTextValue: "",
      configButtonSearch: { label: 'Pesquisar', handler: () => this.searchContacts(), customColor: { backgroundColor: "#c71e06" } },
      configButtonClearSearch: { label: 'Limpar', handler: () => this.clearSearch(), customColor: { backgroundColor: "#f7a01d" } },
      configButtonNewContact: { label: '+', handler: () => this.newOrAttContact(), customColor: { backgroundColor: "#22bb33" } },
      showButtonClearSearch: false,
    };
  },

  async created() {
    this.showLoading = true;
    let idUser = JSON.parse(localStorage.getItem(USER_INFO_STORAGE)).id;
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
    this.showContactsArray = this.paginateArray(this.dataContacts, this.itemsPerPage, this.activeLink);
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
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataContacts;
      this.showContactsArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
      this.getNumPages(data);
    },

    activePage(pageNumber) {
      this.activeLink = pageNumber;
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataContacts;
      this.showContactsArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
      this.getNumPages(data);
    },

    getNumPages(data) {
      let array = data;
      this.numberPages = Math.ceil(array.length / this.itemsPerPage);
      this.pages = Array.from({ length: this.numberPages }, (_, i) => i + 1);
      this.pages = this.paginateLinks(this.numberPages);
    },

    paginateLinks(links) {
      let newLinksArray = [];
      links = Array.from({ length: links }, (_, i) => i + 1);
      let max = 0;
      this.activeLink == 1 ? max = this.activeLink + 2 : max = this.activeLink + 1;
      let min = this.activeLink - 1;
      links.forEach((link) => {
        if (link >= min && link <= max) {
          newLinksArray.push(link);
        }
      });
      return newLinksArray;
    },

    paginateArray(array, page_size, page_number) {
      console.log(array);
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
      showToast('success', 'Pesquisa feita com sucesso!');
      this.arraySearch = this.showContactsArray = newArray;
      this.getNumPages(this.showContactsArray);
      this.activePage(1);
    },

    validateObject(object) {
      if (
        object?.email?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.id?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.tag?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.telefone?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.cpf?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.nome?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.bairro?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.cep?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.cidade?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.estado?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.logradouro?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.numero?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.pessoa?.endereco?.pais?.toString().toLowerCase().includes(this.searchTextValue) ||
       object?.email?.toString().toLowerCase().includes(this.searchTextValue)) return true;
      return false;
    },

    clearSearch() {
      this.showButtonClearSearch = false;
      this.searchTextValue = "";
      this.arraySearch = [];
      this.getNumPages(this.dataContacts);
      this.activePage(1);
    },

    deleteContact(contact, index) {
      api.delete("contato/remover/" + contact.id).then(() => {
        showToast("success", "Sucesso ao remover contato!");
        this.showContactsArray.splice(1, index);
      }).catch((err) => {
        showToast("error", "Erro ao remover contato!");
        console.log(err);
      });
    },

    newOrAttContact(contact) {
      this.$store.commit('storeContact', contact);
      this.$router.push({ name: 'att_contact' });
    }
  },
  watch: {
    itemsPerPage() {
      let array = this.showButtonClearSearch ? this.arraySearch : this.dataContacts;
      this.getNumPages(array);
      this.showContactsArray = this.paginateArray(array, this.itemsPerPage, this.activeLink);
    }
  }
}
</script>

<style>
.body {
  padding: 30px 12px;
  height: 100%;

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
}
</style>
