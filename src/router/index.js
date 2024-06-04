import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
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
})

export default router
