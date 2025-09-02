import './assets/main.css'

import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import App from './App.vue'
import router from './router'

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_PinIZguLj',
      userPoolClientId: '6eopmiug221gqqqusddeocrf3d',
      loginWith: {
        oauth: {
          domain: 'ap-southeast-2pinizgulj.auth.ap-southeast-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [
            'http://localhost:5173/callback',
            'https://cybercrime-frontend.vercel.app/callback',
            'https://guardu.org/callback'
          ],
          redirectSignOut: [
            'http://localhost:5173/',
            'https://cybercrime-frontend.vercel.app/',
            'https://guardu.org/'
          ],
          responseType: 'code',
          providers: ['COGNITO']
        },
      },
      userAttributes: {
        email: {
          required: true,
        }
      }
    },
  },
}

Amplify.configure(amplifyConfig)

const app = createApp(App)
app.use(router)
app.mount('#app')
