import './assets/main.css'

import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import App from './App.vue'
import router from './router'

// 使用新配置的SPA App Client
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: 'ap-southeast-2',
      userPoolId: 'ap-southeast-2_FihNVwkM9',
      userPoolClientId: '4blte24rqnnd6g2hvbtpbj6p38', // 新的SPA Client ID
      // SPA类型不需要 userPoolClientSecret，这很重要！
      loginWith: {
        oauth: {
          domain: 'ap-southeast-2fihnvwkm9.auth.ap-southeast-2.amazoncognito.com',
          scopes: ['openid', 'email', 'phone'], // 匹配你选择的scopes
          redirectSignIn: ['http://localhost:5173/callback'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code',
        },
      },
    },
  },
}

console.log('=== AMPLIFY CONFIGURATION DEBUG ===')
console.log('Full config:', JSON.stringify(amplifyConfig, null, 2))
console.log('OAuth domain:', amplifyConfig.Auth.Cognito.loginWith.oauth.domain)
console.log('User Pool ID:', amplifyConfig.Auth.Cognito.userPoolId)
console.log('Client ID:', amplifyConfig.Auth.Cognito.userPoolClientId)
console.log('Redirect Sign In:', amplifyConfig.Auth.Cognito.loginWith.oauth.redirectSignIn)
console.log('Scopes:', amplifyConfig.Auth.Cognito.loginWith.oauth.scopes)
console.log('===========================================')

Amplify.configure(amplifyConfig)

const app = createApp(App)
app.use(router)
app.mount('#app')
