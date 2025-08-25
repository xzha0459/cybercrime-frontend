import './assets/main.css'

import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import App from './App.vue'
import router from './router'

Amplify.configure({
  Auth: {
    Cognito: {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_FihNVwkM9',
      userPoolClientId: '4blte24rqnnd6g2hvbtpbj6p38',
      loginWith: {
        oauth: {
          domain: 'ap-southeast-2fihnvwkm9.auth.ap-southeast-2.amazoncognito.com',
          scopes: ['phone', 'email', 'openid'],
          redirectSignIn: ['http://localhost:5173/callback'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(router)
app.mount('#app')
