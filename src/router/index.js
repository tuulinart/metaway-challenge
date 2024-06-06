import { createRouter, createWebHashHistory } from 'vue-router'
import { SAVE_TOKEN_STORAGE } from "../utils/utils.js";

const routes = [
  {
    path: '/:catchAll(.*)',
    component: () => import('../views/HomeView.vue')
  },


  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/pessoas',
    name: 'persons',
    component: () => import('../views/PersonsView.vue')
  },
  {
    path: '/contatos',
    name: 'contacts',
    component: () => import('../views/ContactsView.vue')
  },
  {
    path: '/usuarios',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/perfil',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to) => {
  let authToken = JSON.parse(localStorage.getItem(SAVE_TOKEN_STORAGE));
  if (!authToken?.token && to.name !== 'login') return { name: 'login' };
  if (authToken?.token && to.name === 'login') return { name: 'home' }
})

export default router
