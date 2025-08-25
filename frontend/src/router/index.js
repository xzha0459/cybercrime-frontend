import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../page/HomePage.vue'
import CallbackPage from "../page/CallbackPage.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: CallbackPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
