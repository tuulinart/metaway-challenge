<template>
  <div class="body">
    <div class="box-header--table">
      <div class="subheader">
        <span class="subtitle">Usuários</span>
        <div class="left">
          <div class="search_box">
            <input type="text" v-model="searchTextValue" placeholder="Pesquise por uma palavra chave">
          </div>
          <DynamicButton :buttonConfig="configButtonSearch" />
          <DynamicButton v-if="showButtonClearSearch" :buttonConfig="configButtonClearSearch" />
          <DynamicButton :buttonConfig="configButtonNewContact" />
        </div>
      </div>
      <div class="table mb-0" :class="{ 'mb-3': showUsersArray.length <= 0 }">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 px-0">
              <table class="dynamic_table" cellpadding="10" id="table__data">
                <thead>
                  <tr class="row_title">
                    <th class="title_column" v-for="(title, index) in titlesHeader" :key="index">{{
                      title }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in showUsersArray" :key="index" class="row_texts">
                    <!-- <td class="text_column" [attr.hover-tooltip]="contact"> -->
                    <td class="text_column">
                      <span class="headerColumnName">{{ titlesHeader[0] }}:</span>
                      <div class="p-0 table__title--mobile">
                        {{ user.id }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[1] }}:</span>
                        {{ user.nome }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[2] }}:</span>
                        {{ user.cpf }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[3] }}:</span>
                        {{ user.email }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[4] }}:</span>
                        {{ user.telefone }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <span class="headerColumnName">{{ titlesHeader[5] }}:</span>
                        {{ user.username }}
                      </div>
                    </td>
                    <td class="text_column">
                      <div class="p-0 table__title--mobile">
                        <DynamicButton
                          :buttonConfig="{ label: 'Editar', outlined: true, handler: () => this.newOrAttUser(user) }" />
                      </div>
                    </td>
                  </tr>
                  <span v-if="showUsersArray.length <= 0" class="no_data">Sem dados</span>
                </tbody>
              </table>

              <div v-if="showUsersArray.length > 0" class="pagination">
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
  name: 'UserView',
  components: {
    LoadingComponent,
    DynamicButton
  },
  data() {
    return {
      showLoading: false,
      titlesHeader: ['Id', 'Nome', 'CPF', 'Email', 'Telefone', 'Usuário', ''],
      dataUsers: [],
      showUsersArray: [],
      pages: [],
      arraySearch: [],
      activeLink: 1,
      itemsPerPage: 10,
      numberPages: null,
      searchTextValue: "",
      configButtonSearch: { label: 'Pesquisar', handler: () => this.searchUsers(), customColor: { backgroundColor: "#c71e06" } },
      configButtonClearSearch: { label: 'Limpar', handler: () => this.clearSearch(), customColor: { backgroundColor: "#f7a01d" } },
      configButtonNewContact: { label: '+', handler: () => this.newOrAttUser(), customColor: { backgroundColor: "#22bb33" } },
      showButtonClearSearch: false,
    };
  },


  async created() {
    this.showLoading = true;
    const requestUsersApi = async () => {
      await api.post("usuario/pesquisar", {
        termo: ""
      }).then((response) => {
        this.dataUsers = response.data;
      }).catch((err) => {
        showToast("error", "Erro ao buscar usuarios!");
        console.log(err);
      });
    };
    await requestUsersApi();
    this.dataUsers.sort((a, b) => a.id - b.id);
    this.getNumPages(this.dataUsers);
    this.showUsersArray = this.paginateArray(this.dataUsers, this.itemsPerPage, this.activeLink);
    this.showLoading = false;
  },
  methods: {
    swapPage(nextPage) {
      if (nextPage) this.activeLink += 1;
      else this.activeLink -= 1;
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataUsers;
      this.showUsersArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
      this.getNumPages(data);
    },

    activePage(pageNumber) {
      this.activeLink = pageNumber;
      let data = this.showButtonClearSearch ? this.arraySearch : this.dataUsers;
      this.showUsersArray = this.paginateArray(data, this.itemsPerPage, this.activeLink);
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

    searchUsers() {
      this.showButtonClearSearch = true;
      let newArray = [];
      this.dataUsers.forEach((elementArray) => {
        if (this.searchTextValue) {
          if (this.validateObject(elementArray, event.searchValue)) {
            newArray.push(elementArray);
          }
        }
      });
      showToast('success', 'Pesquisa feita com sucesso!');
      this.arraySearch = this.showUsersArray = newArray;
      this.getNumPages(this.showUsersArray);
      this.activePage(1);
    },

    validateObject(object) {
      if (
        object?.cpf?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.dataNascimento?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.email?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.id?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.nome?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.telefone?.toString().toLowerCase().includes(this.searchTextValue) ||
        object?.username?.toString().toLowerCase().includes(this.searchTextValue)) return true;
      return false;
    },

    clearSearch() {
      this.showButtonClearSearch = false;
      this.searchTextValue = "";
      this.arraySearch = [];
      this.getNumPages(this.dataUsers);
      this.activePage(1);
    },

    deleteContact(contact, index) {
      api.delete("contato/remover/" + contact.id).then(() => {
        showToast("success", "Sucesso ao remover contato!");
        this.showUsersArray.splice(1, index);
      }).catch((err) => {
        showToast("error", "Erro ao remover contato!");
        console.log(err);
      });
    },

    newOrAttUser(user) {
      if (user) return this.$router.push(`/usuario/atualizar/${user.id}`);
      return this.$router.push(`/usuario/atualizar/`);
    }
  },
  watch: {
    itemsPerPage() {
      let array = this.showButtonClearSearch ? this.arraySearch : this.dataUsers;
      this.getNumPages(array);
      this.showUsersArray = this.paginateArray(array, this.itemsPerPage, this.activeLink);
    }
  }
}
</script>
<style>
.body {
  padding: 30px 12px;
  height: 100%;
}
</style>