<template>
    <div class="content">
        <div class="add-user__container--grid">
            <div></div>
            <div class="pb-5">
                <div class="title-box">
                    <div class="row border-bottom-0 pb-0">
                        <div class="div-col-title col-xxl-6 col-xl-6  col-lg-6 col-12">
                            <p class="title mb-0">Pessoa</p>
                        </div>
                        <div class="div-col-back col-xxl-6 col-xl-6  col-lg-6 col-12">
                            <DynamicButton :buttonConfig="configButtonBack" />
                        </div>
                    </div>
                </div>
                <div class="portal-body__add-annoucement-card--bigger-padding">
                    <div class="mb-3">
                        <label class="add-contact__input-label d-block mb-1" for="name">Nome*</label>
                        <input class="w-100 px-10" type="text" id="name" v-model="contact.pessoa.nome"
                            autocomplete="off" />
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-contact__input-label d-block mb-1" for="cpf">CPF*</label>
                                <input class="w-100 px-10" type="text" id="cpf" maxlength="14"
                                    v-model="contact.pessoa.cpf" autocomplete="off" />
                            </div>

                            <div class="margin-bottom col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-contact__input-label d-block mb-1" for="phone">Telefone</label>
                                <input class="w-100 px-10" type="tel" id="phone" maxlength="13"
                                    v-model="contact.telefone" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col-12">
                                <label class="add-contact__input-label d-block mb-1" for="email">E-mail</label>
                                <input class="w-100 px-10" type="email" id="email" v-model="contact.email"
                                    autocomplete="off" />
                            </div>
                        </div>
                    </div>

                    <span class="title mb-3">Endereço</span>

                    <div class="mb-3">
                        <div class="row">
                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-contact__input-label d-block mb-1" for="cpf">CEP*</label>
                                <input class="w-100 px-10" type="text" id="cpf" maxlength="14"
                                    v-model="contact.pessoa.endereco.cep" autocomplete="off" />
                            </div>

                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-contact__input-label d-block mb-1" for="phone">Estado</label>
                                <input class="w-100 px-10" type="tel" id="phone" maxlength="13"
                                    v-model="contact.pessoa.endereco.estado" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-contact__input-label d-block mb-1" for="cpf">Cidade*</label>
                                <input class="w-100 px-10" type="text" id="cpf" maxlength="14"
                                    v-model="contact.pessoa.endereco.cidade" autocomplete="off" />
                            </div>

                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-contact__input-label d-block mb-1" for="phone">Bairro</label>
                                <input class="w-100 px-10" type="tel" id="phone" maxlength="13"
                                    v-model="contact.pessoa.endereco.bairro" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="row">
                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12 mb-xxl-0 mb-xl-0 mb-lg-0 mb-3">
                                <label class="add-contact__input-label d-block mb-1" for="cpf">Logradouro*</label>
                                <input class="w-100 px-10" type="text" id="cpf" maxlength="14"
                                    v-model="contact.pessoa.endereco.logradouro" autocomplete="off" />
                            </div>

                            <div class="col-xxl-6 col-xl-6  col-lg-6 col-12">
                                <label class="add-contact__input-label d-block mb-1" for="phone">Número</label>
                                <input class="w-100 px-10" type="tel" id="phone" maxlength="13"
                                    v-model="contact.pessoa.endereco.numero" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button @click="saveContact()" class="mt-30 save-button" type="submit"
                            :disabled="this.validForm()">
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
export default {
    name: 'ChangeOrAddContact',
    components: {
        LoadingComponent,
        DynamicButton
    },
    data() {
        return {
            showLoading: false,
            contact: {
                email: '',
                pessoa: {
                    cpf: '',
                    nome: '',
                    endereco: {
                        bairro: '',
                        cep: '',
                        estado: '',
                        cidade: '',
                        logradouro: '',
                        numero: '',
                        pais: '',
                    },
                    foto: {}
                },
                privado: false,
                tag: '',
                telefone: null,
                tipoContato: '',
            },
            configButtonBack: { label: 'Voltar', handler: () => this.$router.go(-1), customColor: { backgroundColor: "#c71e06" } },
        };
    },
    created() {
        if (this.$store.state.contact && Object.keys(this.$store.state.contact).length != 0) this.contact = this.$store.state.contact;
        this.labelButton = this.$store.state.contact ? 'Atualizar' : 'Criar';
    },

    methods: {

        saveContact() {
            console.log('savecontact');
        },

        validForm() {

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

.add-contact__input-label {
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
</style>