<template>
    <div class="content" v-if="show">
        <div class="add-user__container--grid">
            <div></div>
            <div class="pb-5">
                <div class="title-box">
                    <div class="row border-bottom-0 pb-0">
                        <div class="div-col-title text-start col-xxl-6 col-xl-6 col-lg-6 col-12">
                            <p class="title mb-0">Usuário</p>
                        </div>
                        <div class="div-col-back text-start col-xxl-6 col-xl-6  col-lg-6 col-12">
                            <DynamicButton :buttonConfig="configButtonBack" />
                        </div>
                    </div>
                </div>
                <div class="portal-body__add-annoucement-card--bigger-padding">
                    <div class="mb-3">
                        <div class="row">

                            <div class="text-start col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-user__input-label d-block mb-1" for="name">Nome</label>
                                <input class="w-100 " type="text" id="name" v-model="user.usuario.nome"
                                    autocomplete="off" />
                            </div>

                            <div class="text-start col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-user__input-label d-block mb-1" for="role">Tipo do usuário</label>
                                <select :disabled="labelButton == 'Criar' ? false : true" class="form-select" id="role"
                                    v-model="user.tipos[0]">
                                    <option value="ROLE_USER">Usuário</option>
                                    <option value="ROLE_ADMIN">Administrador</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="text-start col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-user__input-label d-block mb-1" for="cpf">CPF</label>
                                <input class="w-100 " type="tel" id="cpf" v-maska="'###.###.###-##'"
                                    v-model="user.usuario.cpf" autocomplete="off" />
                                <span v-if="user.usuario.cpf.length > 1 && user.usuario.cpf.length < 14"
                                    class="span_warning">Preencha o
                                    dado corretamente!</span>
                            </div>

                            <div class="margin-bottom text-start col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-user__input-label d-block mb-1" for="phone">Telefone</label>
                                <input class="w-100 " type="tel" id="phone" v-maska="'(##) #####-####'"
                                    v-model="user.usuario.telefone" autocomplete="off" />
                                <span v-if="user.usuario.telefone.length > 1 && user.usuario.telefone.length < 14"
                                    class="span_warning">Preencha o dado
                                    corretamente!</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="text-start col-xxl-6 col-xl-6 col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-user__input-label d-block mb-1" for="email">E-mail</label>
                                <input class="w-100 " type="email" id="email" v-model="user.usuario.email"
                                    autocomplete="off" />
                                <span v-if="user.usuario.email.length > 2 && !this.validEmail(user.usuario.email)"
                                    class="span_warning">Preencha o dado corretamente!</span>
                            </div>

                            <div class="text-start col-xxl-6 col-xl-6 col-lg-6 col-12">
                                <label class="add-user__input-label d-block mb-1" for="birthDate">Data de
                                    Nascimento</label>
                                <input class="w-100 px-2" type="date" id="birthDate"
                                    v-model="user.usuario.dataNascimento" autocomplete="off" />
                            </div>
                        </div>
                    </div>

                    <div class="mb-5">
                        <div class="row">
                            <div class="text-start col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-user__input-label d-block mb-1" for="username">Usuário</label>
                                <input class="w-100 " type="text" id="username" v-model="user.usuario.username"
                                    autocomplete="off" />
                            </div>

                            <div class="text-start col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-user__input-label d-block mb-1" for="password">Senha</label>
                                <input class="w-100 " type="password" id="password" v-model="user.usuario.password"
                                    autocomplete="off" />
                                <span
                                    v-if="user.usuario.password.length > 2 && !this.validPassword(user.usuario.password)"
                                    class="span_warning">Preencha o dado corretamente!</span>
                                <br>
                                <span class="span_recommendation">A senha precisa conter 8 caracteres e ao menos 1
                                    número!</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button @click="saveUser()" class="mt-30 save-button" type="submit"
                            :disabled="!this.validForm()">
                            {{ labelButton }}
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
import api from "@/services/api.ts";
import { showToast } from "../utils/utils.js";
export default {
    inheritAttrs: false,
    name: 'ChangeOrAddUser',
    components: {
        LoadingComponent,
        DynamicButton
    },
    data() {
        return {
            showLoading: false,
            user: {
                tipos: [],
                usuario: {
                    cpf: '',
                    dataNascimento: '',
                    email: "",
                    nome: "",
                    password: "",
                    telefone: "",
                    username: ""
                },
            },
            configButtonBack: { label: 'Voltar', handler: () => this.$router.go(-1), customColor: { backgroundColor: "#c71e06" } },
            show: false,
            labelButton: '',
        };
    },
    async created() {
        this.showLoading = true;
        if (this.$route?.params?.id) {
            await this.searchUserByID(this.$route?.params?.id);
            this.labelButton = 'Atualizar';
        } else this.labelButton = 'Criar';
        this.showLoading = false;
        this.show = true;
    },

    methods: {

        async searchUserByID(id) {
            await api.get(`usuario/buscar/${id}`).then((response) => {
                this.user = response.data.object;
                this.user.usuario.password = "";
                console.log(this.user);
            }).catch((err) => {
                showToast("error", "Erro ao buscar usuario!");
                console.log(err);
            });
        },

        saveUser() {
            this.showLoading = true;
            if (this.$route?.params?.id) this.user.usuario.id = this.$route?.params?.id;
            api.post(`usuario/salvar`, this.user).then(() => {
                let message = this.$route?.params?.id ? 'Sucesso ao alterar usuário!' : 'Sucesso ao criar Usuário';
                showToast("success", message).then(() => {
                    this.showLoading = false;
                    this.$router.go(-1);
                });
            }).catch(() => {
                showToast("error", "Erro ao criar usuario!").then(() => this.showLoading = false);
            });
        },

        validForm() {
            console.log(this.user.usuario.telefone.length);
            let valid = false;
            if (this.user.tipos.length <= 0) valid = false;
            else if (!this.user.usuario.nome) valid = false;
            else if (!this.user.usuario.cpf && this.user.usuario.cpf.length < 14) valid = false;
            else if (!this.user.usuario.dataNascimento) valid = false;
            else if (!this.validEmail(this.user.usuario.email)) valid = false;
            else if (!this.validPassword(this.user.usuario.password)) valid = false;
            else if (!this.user.usuario.telefone && this.user.usuario.telefone.length < 14) valid = false;
            else if (!this.user.usuario.username) valid = false;
            else valid = true;
            return valid;
        },

        validPassword(pass) {
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            return regex.test(pass);
        },

        validEmail(email) {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; //eslint-disable-line
            return regex.test(email);
        }
    }
}
</script>
<style scoped>
.content {
    height: 92%;
    padding: 30px 50px;
}

.title-box {
    font-weight: bold;

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

select {
    cursor: pointer;
    font-size: 14px;
    height: 48px;
    letter-spacing: 0px;
    color: #818e94;
    padding-top: 10px;
    padding-bottom: 10px;
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

.span_warning {
    font-size: 11px;
    color: #cc3300;
    font-weight: bold;
    text-align: start;
}

.span_recommendation {
    font-size: 10px;
    color: #4f4f4f;
    font-weight: bold;
    text-align: start;
}
</style>