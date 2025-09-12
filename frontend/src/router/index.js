import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../page/HomePage.vue'
import LinkCheckPage from '../page/LinkCheckPage.vue'
import LibraryPage from '../page/LibraryPage.vue'
import TestPage from '../page/TestPage.vue'
import UserCenterPage from '../page/UserCenterPage.vue'
import SignUpPage from '../page/SignUpPage.vue'
import SignInPage from '../page/SignInPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
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
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
