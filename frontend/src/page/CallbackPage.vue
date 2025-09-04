<template>
  <div class="callback-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
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

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const loading = ref(true)
const error = ref(null)
const errorDetails = ref('')
const debugMessage = ref('Starting...')

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
    await new Promise((resolve) => setTimeout(resolve, 2000))

    debugMessage.value = 'Authentication complete, redirecting...'
    loading.value = false

    // 跳转到首页
    setTimeout(() => {
      router.replace('/')
    }, 2000)

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

.error {
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(45, 58, 45, 0.1);
  background: var(--forest-sage, #d4d4c4);
  max-width: 600px;
  width: 100%;
}

.loading h2,
.error h2 {
  color: var(--forest-dark, #2d3a2d);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.loading p,
.error p {
  color: var(--forest-deep, #5a6b5a);
  margin-bottom: 2rem;
  font-size: 1.1rem;
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
