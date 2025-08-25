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
          scopes: ['openid', 'email'], // 添加profile scope
          redirectSignIn: ['http://localhost:5173/callback'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code',
          // 重要：明确指定这些参数
          providers: ['COGNITO']
        },
      },
      // 添加这个配置
      userAttributes: {
        email: {
          required: true,
        }
      }
    },
  },
}

console.log('=== AMPLIFY CONFIGURATION DEBUG ===')
console.log('Full config:', JSON.stringify(amplifyConfig, null, 2))
console.log('===========================================')

// 重要：确保在配置之前清理任何现有的认证状态
try {
  // 清理localStorage中的Amplify数据
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('amplify')) {
      localStorage.removeItem(key)
    }
  })
} catch (error) {
  console.warn('Failed to clear localStorage:', error)
}

Amplify.configure(amplifyConfig)

const app = createApp(App)
app.use(router)
app.mount('#app')
