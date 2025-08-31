import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../page/HomePage.vue'
import CallbackPage from '../page/CallbackPage.vue'
import LinkCheckPage from '../page/LinkCheckPage.vue'
import LibraryPage from '../page/LibraryPage.vue'
import TestPage from '../page/TestPage.vue'
import UserCenterPage from '../page/UserCenterPage.vue'

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
  {
    path: '/library',
    name: 'Library',
    component: LibraryPage,
  },
  {
    path: '/test',
    name: 'Test',
    component: TestPage,
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: UserCenterPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
