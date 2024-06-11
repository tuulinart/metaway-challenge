<template>
  <div class="body">
    <div class="box-header--table">
      <div class="subheader">
        <span class="subtitle">Pessoas</span>
        <div class="left">
          <div class="search_box">
            <input type="text" v-model="searchTextValue" placeholder="Pesquise por uma palavra chave">
          </div>
          <DynamicButton :buttonConfig="configButtonSearch" />
          <DynamicButton v-if="showButtonClearSearch" :buttonConfig="configButtonClearSearch" />
          <DynamicButton :buttonConfig="configButtonNewperson" />
        </div>
      </div>
      <div class="table mb-0" :class="{ 'mb-3': showPersonsArray.length <= 0 }">
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
                  <tr v-for="(person, index) in showPersonsArray" :key="index" class="row_texts">
                    <td class="text_column">
                      <div class="p-0 table__title--mobile d-flex align-items-center justify-content-center">
                        <div class="miniature_photo" :style="{ 'background-image': person.img }">
                        </div>
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[1] }}:</span>
                        {{ person.id }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[2] }}:</span>
                        {{ person.nome }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[3] }}:</span>
                        {{ person.cpf }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[4] }}:</span>
                        {{ person.endereco.logradouro }},
                        {{ person.endereco.numero }},
                        {{ person.endereco.bairro }},
                        {{ person.endereco.cidade }},
                        {{ person.endereco.pais }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <DynamicButton
                          :buttonConfig="{ label: 'Editar', outlined: true, handler: () => this.newOrAttperson(person) }" />
                      </div>
                    </td>

                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <div @click="deletePerson(person, index)" class="delete_person"></div>
                      </div>
                    </td>
                  </tr>
                  <span v-if="showPersonsArray.length <= 0" class="no_data">Sem dados</span>
                </tbody>
              </table>

              <div v-if="showPersonsArray.length > 0" class="pagination">
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
import { showToast } from "../utils/utils.js";
export default {
  name: 'PersonsVIew',
  components: {
    LoadingComponent,
    DynamicButton
  },
  data() {
    return {
      showLoading: false,
      titlesHeader: ['', 'Id', 'Nome', 'CPF', 'Endereço', '', ''],
      dataPersons: [],
      showPersonsArray: [],
      arraySearch: [],
      pages: [],
      activeLink: 1,
      itemsPerPage: 10,
      numberPages: null,
      searchTextValue: "",
      configButtonSearch: { label: 'Pesquisar', handler: () => this.searchpersons(), customColor: { backgroundColor: "#c71e06" } },
      configButtonClearSearch: { label: 'Limpar', handler: () => this.clearSearch(), customColor: { backgroundColor: "#f7a01d" } },
      configButtonNewperson: { label: '+', handler: () => this.newOrAttperson(), customColor: { backgroundColor: "#22bb33" } },
      showButtonClearSearch: false,
    };
  },

  async created() {
    this.showLoading = true;
    const requestPersonsApi = async () => {
      await api.post("pessoa/pesquisar", {
        nome: ""
      }).then((response) => {
        console.log(response);
        this.dataPersons = response.data;
        this.dataPersons.sort((a, b) => a.id - b.id);
      }).catch((err) => {
        console.log(err);
      });
    };
    const requestPhotosApi = async () => {
      for (let index = 0; index < this.dataPersons.length; index++) {
        const person = this.dataPersons[index];
        await api.get("foto/download/" + person.id, {
          headers: {
            'content-type': 'image/png',
            'accept': 'image/png'
          },
          responseType: 'blob'
        }).then(async (response) => {
          const urlCreator = window.URL || window.webkitURL;
          let fileBlob = urlCreator.createObjectURL(response.data);
          person.img = `url("${fileBlob}")`;
        }).catch((err) => {
          console.log(err);
        });
      }
    };
    await requestPersonsApi();
    await requestPhotosApi();
    this.getNumPages(this.dataPersons);
    this.showPersonsArray = this.paginateArray(this.dataPersons, this.itemsPerPage, this.activeLink);
    this.showLoading = false;
  },
  methods: {
    swapPage(nextPage) {
      if (nextPage) this.activeLink += 1;
      else this.activeLink -= 1;
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataPersons;
      this.showPersonsArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
      this.getNumPages(data);
    },

    activePage(pageNumber) {
      this.activeLink = pageNumber;
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataPersons;
      this.showPersonsArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
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
      return array.slice((page_number - 1) * page_size, page_number * page_size);
    },

    searchpersons() {
      this.showButtonClearSearch = true;
      let newArray = [];
      this.dataPersons.forEach((elementArray) => {
        if (this.searchTextValue) {
          if (this.validateObject(elementArray, event.searchValue)) {
            newArray.push(elementArray);
          }
        }
      });
      showToast('success', 'Pesquisa feita com sucesso!');
      this.arraySearch = this.showPersonsArray = newArray;
      this.getNumPages(this.showPersonsArray);
      this.activePage(1);
    },

    validateObject(object) {
      if (
        object?.cpf?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.id?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.nome?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.bairro?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.cep?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.cidade?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.estado?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.logradouro?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.numero?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.endereco?.pais?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.email?.toString().toLowerCase().includes(this.searchTextValue)) return true;
      return false;
    },

    clearSearch() {
      this.showButtonClearSearch = false;
      this.searchTextValue = "";
      this.arraySearch = [];
      this.getNumPages(this.dataPersons);
      this.activePage(1);
    },

    deletePerson(person, index) {
      api.delete("pessoa/remover/" + person.id).then(() => {
        showToast("success", "Sucesso ao remover pessoa!");
        this.showPersonsArray.splice(1, index);
      }).catch((err) => {
        showToast("error", "Erro ao remover pessoa!");
        console.log(err);
      });
    },

    newOrAttperson(person) {
      this.$store.commit('storeperson', person);
      this.$router.push({ name: 'att_person' });
    }
  },
  watch: {
    itemsPerPage() {
      let array = this.showButtonClearSearch ? this.arraySearch : this.dataPersons;
      this.getNumPages(array);
      this.showPersonsArray = this.paginateArray(array, this.itemsPerPage, this.activeLink);
    }
  }
}
</script>

<style>
.body {
  padding: 30px 12px;
  height: 100%;

  .delete_person {
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
