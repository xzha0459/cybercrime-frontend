import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../page/HomePage.vue'
import LinkCheckPage from '../page/LinkCheckPage.vue'
import LibraryPage from '../page/LibraryPage.vue'
import ChallengePage from '../page/ChallengePage.vue'
import UserCenterPage from '../page/UserCenterPage.vue'
import SignUpPage from '../page/SignUpPage.vue'
import SignInPage from '../page/SignInPage.vue'
import VideoPage from '../page/VideoPage.vue'
import PrivacyPolicyPage from '../page/PrivacyPolicyPage.vue'

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
    path: '/challenge',
    name: 'Challenge',
    component: ChallengePage,
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
  {
    path: '/video/:id',
    name: 'Video',
    component: VideoPage,
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
