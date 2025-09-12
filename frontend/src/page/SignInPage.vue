<template>
  <div class="signin-container">
    <div class="signin-card">
      <div class="signin-header">
        <h1 class="signin-title">登录到 GuardU</h1>
        <p class="signin-description">请输入您的用户名和Google Authenticator验证码</p>
      </div>

      <form @submit.prevent="handleSignIn" class="signin-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="signinData.username"
            type="text"
            placeholder="请输入用户名"
            required
            :disabled="isLoading"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="code">验证码</label>
          <input
            id="code"
            v-model="signinData.code"
            @input="handleCodeInput"
            type="text"
            placeholder="000000"
            maxlength="6"
            required
            :disabled="isLoading"
            class="form-input code-input"
          />
          <div class="code-hint">请输入Google Authenticator中的6位验证码</div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="!isFormValid || isLoading"
        >
          <span v-if="isLoading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="signin-footer">
        <p class="signup-link">
          还没有账户？
          <router-link to="/signup" class="link">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SignIn',
  setup() {
    const router = useRouter()

    // 响应式数据
    const signinData = ref({
      username: '',
      code: ''
    })

    const isLoading = ref(false)
    const errorMessage = ref('')

    // 计算属性
    const isFormValid = computed(() => {
      return signinData.value.username.trim() !== '' &&
             /^\d{6}$/.test(signinData.value.code)
    })

    // 方法
    const handleCodeInput = () => {
      // 只允许数字，最多6位
      signinData.value.code = signinData.value.code.replace(/\D/g, '').slice(0, 6)
      errorMessage.value = ''
    }

    const handleSignIn = async () => {
      if (!isFormValid.value) return

      isLoading.value = true
      errorMessage.value = ''

      try {
        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/users/signin/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: signinData.value.username.trim(),
            code: signinData.value.code
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '登录失败')
        }

        const result = await response.json()
        console.log('Sign in successful:', result)

        // 保存token到localStorage
        if (result.access_token) {
          localStorage.setItem('access_token', result.access_token)
        }
        if (result.refresh_token) {
          localStorage.setItem('refresh_token', result.refresh_token)
        }

        // 保存用户信息
        if (result.user) {
          localStorage.setItem('user_info', JSON.stringify(result.user))
        }

        // 登录成功，跳转到首页或用户中心
        router.push('/user-center')

      } catch (error) {
        console.error('Sign in failed:', error)
        errorMessage.value = error.message || '登录失败，请检查用户名和验证码'
      } finally {
        isLoading.value = false
      }
    }

    return {
      signinData,
      isLoading,
      errorMessage,
      isFormValid,
      handleCodeInput,
      handleSignIn
    }
  }
}
</script>

<style scoped>
.signin-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signin-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 400px;
  width: 100%;
}

.signin-header {
  text-align: center;
  margin-bottom: 30px;
}

.signin-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.signin-description {
  color: #666;
  font-size: 16px;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.code-input {
  text-align: center;
  letter-spacing: 8px;
  font-size: 18px;
  font-weight: 600;
}

.code-hint {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  text-align: center;
}

.btn-primary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  text-align: center;
  font-size: 14px;
}

.signin-footer {
  margin-top: 30px;
  text-align: center;
}

.signup-link {
  color: #666;
  font-size: 14px;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .signin-card {
    padding: 20px;
    margin: 10px;
  }

  .signin-title {
    font-size: 24px;
  }

  .form-input {
    padding: 10px 14px;
    font-size: 14px;
  }

  .code-input {
    font-size: 16px;
    letter-spacing: 6px;
  }
}
</style>
