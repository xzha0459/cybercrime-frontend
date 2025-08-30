<template>
  <div class="callback-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>{{ debugMessage }}</p>
    </div>
    <div v-else-if="error" class="error">
      <h2>Authentication Error</h2>
      <p>{{ error }}</p>
      <div class="error-details">
        <details>
          <summary>Technical Details</summary>
          <pre>{{ errorDetails }}</pre>
        </details>
      </div>
      <button @click="goHome" class="btn-home">Back to Home</button>
    </div>
    <div v-else class="success">
      <h2>Authentication Successful!</h2>
      <p>Redirecting to home page...</p>

      <!-- 添加Token显示区域 -->
      <div v-if="tokens" class="token-info">
        <details>
          <summary>🔑 View Tokens (Click to expand)</summary>
          <div class="token-display">
            <div class="token-section">
              <h4>Access Token:</h4>
              <textarea readonly :value="tokens.accessToken" class="token-textarea"></textarea>
            </div>
            <div class="token-section">
              <h4>ID Token:</h4>
              <textarea readonly :value="tokens.idToken" class="token-textarea"></textarea>
            </div>
            <div class="token-section" v-if="tokens.refreshToken">
              <h4>Refresh Token:</h4>
              <textarea readonly :value="tokens.refreshToken" class="token-textarea"></textarea>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth'

const router = useRouter()
const loading = ref(true)
const error = ref(null)
const errorDetails = ref('')
const debugMessage = ref('Starting...')
const tokens = ref(null) // 添加tokens状态

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  try {
    debugMessage.value = 'Checking URL parameters...'

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('code')
    const state = urlParams.get('state')
    const errorParam = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    console.log('OAuth Callback received:', {
      code: authCode ? authCode.substring(0, 10) + '...' : 'Missing',
      state: state ? state.substring(0, 10) + '...' : 'Missing',
      error: errorParam,
      error_description: errorDescription,
      fullURL: window.location.href,
    })

    if (errorParam) {
      throw new Error(`OAuth Error: ${errorParam} - ${errorDescription || 'No description'}`)
    }

    if (!authCode) {
      throw new Error('Authorization code missing from callback URL')
    }

    debugMessage.value = 'Authorization code received, processing...'

    // 让Amplify有足够时间处理OAuth回调
    // Amplify v6会自动处理token交换
    debugMessage.value = 'Waiting for token exchange...'
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // ===== 添加获取Token的代码 =====
    debugMessage.value = 'Fetching tokens...'

    try {
      // 确保用户已登录
      const currentUser = await getCurrentUser()
      console.log('当前用户:', currentUser)

      // 获取认证会话和tokens
      const session = await fetchAuthSession()
      console.log('认证会话:', session)

      if (session.tokens) {
        const tokenData = {
          accessToken: session.tokens.accessToken?.toString(),
          idToken: session.tokens.idToken?.toString(),
          refreshToken: session.tokens.refreshToken?.toString()
        }

        // 保存到组件状态中显示
        tokens.value = tokenData

        // 在控制台打印token信息
        console.log('=== 🔑 TOKEN信息 ===')
        console.log('Access Token:', tokenData.accessToken)
        console.log('ID Token:', tokenData.idToken)
        console.log('Refresh Token:', tokenData.refreshToken)
        console.log('================')

        debugMessage.value = 'Tokens retrieved successfully!'
      } else {
        console.warn('未找到tokens')
        debugMessage.value = 'Tokens not found in session'
      }
    } catch (tokenError) {
      console.error('获取tokens失败:', tokenError)
      debugMessage.value = 'Failed to retrieve tokens, but authentication may still be successful'
    }
    // ===== Token获取代码结束 =====

    debugMessage.value = 'Authentication complete, redirecting...'
    loading.value = false

    // 跳转到首页（延长时间让用户有机会查看tokens）
    setTimeout(() => {
      router.replace('/')
    }, 10000) // 改为10秒让用户有时间查看

  } catch (err) {
    console.error('Callback processing error:', err)
    error.value = err.message || 'Authentication processing failed'
    errorDetails.value = JSON.stringify(
      {
        message: err.message,
        stack: err.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    )
    loading.value = false

    // 10秒后自动跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 10000)
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background: var(--bg-primary, #f5f5f0);
  padding: 2rem;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(45, 58, 45, 0.1);
  background: var(--forest-sage, #d4d4c4);
  max-width: 600px;
  width: 100%;
  min-height: 200px;
}

.error,
.success {
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(45, 58, 45, 0.1);
  background: var(--forest-sage, #d4d4c4);
  max-width: 800px; /* 增加宽度以容纳token */
  width: 100%;
}

.loading h2,
.error h2,
.success h2 {
  color: var(--forest-dark, #2d3a2d);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.loading p,
.error p,
.success p {
  color: var(--forest-deep, #5a6b5a);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

/* Token显示样式 */
.token-info {
  margin-top: 2rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--forest-medium, #8b9a8b);
}

.token-info summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--forest-dark, #2d3a2d);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.token-display {
  margin-top: 1rem;
}

.token-section {
  margin-bottom: 1.5rem;
}

.token-section h4 {
  color: var(--forest-dark, #2d3a2d);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.token-textarea {
  width: 100%;
  height: 120px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  background: #f8f9fa;
  resize: vertical;
  word-break: break-all;
}

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(45, 58, 45, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
}

.error-details {
  margin: 1rem 0;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--forest-dark, #2d3a2d);
}

.error-details pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--forest-sage, #d4d4c4);
  border-top: 4px solid var(--forest-dark, #2d3a2d);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  background: var(--forest-light, #f5f5f0);
  border: 1px solid #dc3545;
}

.success {
  background: var(--forest-light, #f5f5f0);
  border: 2px solid var(--forest-medium, #8b9a8b);
}

.btn-home {
  padding: 0.8rem 2rem;
  background: var(--forest-dark, #2d3a2d);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-home:hover {
  background: var(--forest-deep, #5a6b5a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 58, 45, 0.2);
}
</style>
