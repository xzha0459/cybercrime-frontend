import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../page/HomePage.vue'
import CallbackPage from '../page/CallbackPage.vue'
import LinkCheckPage from '../page/LinkCheckPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/callback',
    name: 'Callback',
    component: CallbackPage,
  },
  {
    path: '/link-check',
    name: 'LinkCheck',
    component: LinkCheckPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
