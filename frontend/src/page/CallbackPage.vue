<template>
  <div class="callback-container">
    <div v-if="loading" class="loading">
      <h2>Processing login...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
    <div v-else-if="error" class="error">
      <h2>Login failed</h2>
      <p>{{ error }}</p>
      <button @click="goHome">Back to Home</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, signInWithRedirect } from 'aws-amplify/auth'

const router = useRouter()
const loading = ref(true)
const error = ref(null)

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  try {
    // 等待Amplify处理OAuth callback
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 检查用户是否已认证
    const user = await getCurrentUser()
    console.log('User authenticated:', user)

    // 认证成功，跳转回首页（不保留历史记录）
    router.replace('/')
  } catch (err) {
    console.error('Callback processing error:', err)
    // 对于注册完成但未登录的情况，直接跳转到登录页（Hosted UI）
    const message = err && err.message ? err.message.toLowerCase() : ''
    if (
      message.includes('authenticated') ||
      message.includes('access') ||
      message.includes('signin')
    ) {
      await signInWithRedirect({ provider: 'COGNITO' })
      return
    }

    error.value = err?.message || 'Authentication failed'
    loading.value = false
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
}

.loading,
.error {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
