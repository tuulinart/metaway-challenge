import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap';
import store from './store';
import { vMaska } from "maska/vue"
createApp(App).directive("maska", vMaska).use(store).use(router).mount('#app');
