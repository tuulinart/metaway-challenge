<template>
  <div class="container-fluid">
    <div class="row px-3">
      <div class="col-12 px-0">
        <table class="dynamic_table" cellpadding="10" id="table__data">
          <thead>
            <tr class="row_title">
              <th class="title_column" v-for="(title, index) in titlesHeader" :key="index">{{ title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in dataContacts" :key="index" class="row_texts">
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
                  {{ contact.usuario.cpf }}
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
                  <img v-if="contact.privado" class="star_favorite" src="../assets/star-solid.svg">
                  <img v-else class="star_favorite" src="../assets/star-regular.svg">
                </div>
              </td>
              <td class="text_column">
                <div class="p-0 table__title--mobile">
                  Editar
                </div>
              </td>
            </tr>
            <span v-if="dataContacts.length <= 0" class="no_data">Sem dados</span>
          </tbody>
        </table>

        <!-- @if (arrayPages.length > 0) {
        <div class="pagination">
          <button class="button_swap_page" [disabled]="activeLink == pages[0]" (click)="swapPage(false)">
            &lt;
          </button>
          <ul>
            @for (page of pages; track $index) {
            <li class="link" [ngClass]="{
                active_rede_mulher_color:
                  activeLink === page && urlActive.includes(portalTypes.REDE_MULHER),
                active_rj190_color:
                  activeLink === page && urlActive.includes(portalTypes.RJ_190),
                active_rede_escola_color:
                  activeLink === page && urlActive.includes(portalTypes.REDE_ESCOLA)
              }" (click)="activePage(page)">
              {{ page }}
            </li>
            }
          </ul>
          <button class="button_swap_page" [disabled]="activeLink == pages.length" (click)="swapPage(true)">
            &gt;
          </button>
        </div>
        } -->
      </div>
    </div>
  </div>


  <LoadingComponent v-if="showLoading" />
</template>

<script>
import LoadingComponent from "../components/LoadingComponent.vue";
import api from "@/services/api.ts";
// import { USER_INFO_STORAGE } from "../utils/utils.js";
export default {
  name: 'HomeView',
  components: {
    LoadingComponent,
  },
  data() {
    return {
      showLoading: false,
      titlesHeader: ['', 'Id', 'Nome', 'CPF', 'Endereço', 'Email', 'Telefone', 'Favorito', ''],
      dataContacts: []
    };
  },

  async created() {
    this.showLoading = true;
    // let idUser = JSON.parse(localStorage.getItem(USER_INFO_STORAGE)).id;
    let idUser = 1;
    const requestContactsApi = async () => {
      await api.get("contato/listar/" + idUser).then((response) => {
        this.dataContacts = response.data;
      }).catch((err) => {
        console.log(err);
      });
    };
    const requestPhotosApi = async () => {
      for (let index = 0; index < this.dataContacts.length; index++) {
        const contact = this.dataContacts[index];
        await api.get("foto/download/" + contact.usuario.id, {
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
    await requestPhotosApi();
    this.showLoading = false
  }
}
</script>

<style>
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
      padding-top: 10px;
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

.star_favorite{
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

  ul li.active_rj190_color {
    background: #0090ff;
    color: white;
  }

  ul li.active_rede_mulher_color {
    background: #d44e5a;
    color: white;
  }

  ul li.active_rede_escola_color {
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
}

.table__title--mobile {
  @media screen and (max-width: 500px) {
    &:first-child {
      font-size: 14px;
    }

    font-size: 12px;
  }
}
</style>
