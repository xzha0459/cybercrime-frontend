<template>
  <div class="signup-container">
    <div class="signup-card">
      <!-- 步骤指示器 -->
      <div class="step-indicator">
        <div
          v-for="step in 3"
          :key="step"
          :class="['step', { active: currentStep >= step, completed: currentStep > step }]"
        >
          <div class="step-number">{{ step }}</div>
          <div class="step-label">
            {{ step === 1 ? '扫描二维码' : step === 2 ? '输入验证码' : '恢复短语' }}
          </div>
        </div>
      </div>

      <!-- 步骤1: 2FA设置和二维码 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">创建新账户</h2>
        <p class="step-description">请下载Google Authenticator并扫描二维码开始注册</p>

        <div class="totp-setup">
          <!-- 下载提示 -->
          <div class="download-prompt">
            <div class="app-icon">📱</div>
            <h3>下载Google Authenticator</h3>
            <p>请在您的手机上安装Google Authenticator应用</p>
            <div class="download-links">
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" class="download-link">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
              </a>
              <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" class="download-link">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
              </a>
            </div>
          </div>

          <!-- 二维码和手动输入 -->
          <div class="qr-section">
            <div class="qr-container">
              <canvas ref="qrCanvas" class="qr-code"></canvas>
              <button @click="initiateSignup" class="btn-secondary btn-small" :disabled="isLoading">
                {{ isLoading ? '生成中...' : '生成二维码' }}
              </button>
            </div>

            <div class="manual-input" v-if="signupResponse?.totp_secret">
              <h4>或手动输入密钥</h4>
              <div class="secret-container">
                <code class="secret-code">{{ signupResponse.totp_secret }}</code>
                <button @click="copyTOTPSecret" class="btn-secondary btn-small">复制</button>
              </div>
            </div>
          </div>

          <div v-if="errors.signup" class="error-message">
            {{ errors.signup }}
          </div>

          <div class="next-step" v-if="canProceedToVerification">
            <button @click="nextStep" class="btn-primary">
              我已设置完成，下一步
            </button>
          </div>
        </div>
      </div>


      <!-- 步骤2: 验证码输入 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">输入验证码</h2>
        <p class="step-description">请在Google Authenticator中输入6位验证码</p>

        <div class="verification-form">
          <div class="code-input-container">
            <input
              v-model="verificationCode"
              @input="handleVerificationCodeInput"
              type="text"
              placeholder="000000"
              maxlength="6"
              class="code-input"
              :disabled="isVerifying"
            />
            <div class="code-hint">请输入6位数字验证码</div>
          </div>

          <div v-if="errors.verification" class="error-message">
            {{ errors.verification }}
          </div>

          <div class="verification-actions">
            <button @click="previousStep" class="btn-secondary">上一步</button>
            <button
              @click="verifyTOTPCode"
              class="btn-primary"
              :disabled="!isValidVerificationCode || isVerifying"
            >
              <span v-if="isVerifying">验证中...</span>
              <span v-else>验证并继续</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 步骤3: 恢复短语 -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-title">保存恢复短语</h2>
        <p class="step-description">请安全保存此恢复短语，用于账户恢复</p>

        <div class="recovery-phrase-section">
          <div class="warning-box">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <strong>重要提示：</strong>
              <ul>
                <li>请将恢复短语保存在安全的地方</li>
                <li>不要与他人分享此短语</li>
                <li>如果丢失此短语，将无法恢复账户</li>
              </ul>
            </div>
          </div>

          <div class="phrase-container">
            <div class="phrase-words">
              <div
                v-for="(word, index) in recoveryWords"
                :key="index"
                class="phrase-word"
              >
                {{ index + 1 }}. {{ word }}
              </div>
            </div>
            <button @click="copyRecoveryPhrase" class="btn-secondary">复制恢复短语</button>
          </div>

          <div class="completion-actions">
            <button @click="previousStep" class="btn-secondary">上一步</button>
            <button @click="completeSignup" class="btn-primary">
              完成注册并自动登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'SignUp',
  data() {
    return {
      // 当前步骤：1-扫描二维码, 2-输入验证码, 3-恢复短语
      currentStep: 1,

      // 从 API 返回的注册数据
      signupResponse: null,

      // 用户输入的6位验证码
      verificationCode: '',

      // 状态控制
      isLoading: false,
      isVerifying: false,

      // 错误信息
      errors: {
        signup: '',
        verification: ''
      }
    }
  },

  computed: {
    // 将恢复短语分割成单词数组
    recoveryWords() {
      if (!this.signupResponse?.recovery_phrase) return []
      return this.signupResponse.recovery_phrase.split(' ')
    },

    // 检查是否可以进行验证步骤
    canProceedToVerification() {
      return this.signupResponse &&
             this.signupResponse.otp_uri &&
             this.signupResponse.totp_secret
    },

    // 检查验证码是否有效（6位数字）
    isValidVerificationCode() {
      return /^\d{6}$/.test(this.verificationCode)
    }
  },

  methods: {
    // 第一步：调用注册API生成二维码
    async initiateSignup() {
      this.isLoading = true
      this.errors.signup = ''

      try {
        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/users/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}) // 空body，后端自动生成用户名
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Registration failed')
        }

        // 保存API返回的数据
        this.signupResponse = await response.json()

        // 生成二维码
        await this.generateQRCode()

        console.log('Signup initiated successfully:', {
          username: this.signupResponse.username,
          hasOtpUri: !!this.signupResponse.otp_uri,
          hasSecret: !!this.signupResponse.totp_secret,
          hasRecoveryPhrase: !!this.signupResponse.recovery_phrase
        })

      } catch (error) {
        console.error('Signup failed:', error)
        this.errors.signup = error.message
      } finally {
        this.isLoading = false
      }
    },

    // 生成二维码
    async generateQRCode() {
      if (!this.signupResponse?.otp_uri) return

      try {
        const canvas = this.$refs.qrCanvas
        if (canvas) {
          await QRCode.toCanvas(canvas, this.signupResponse.otp_uri, {
            width: 200,
            margin: 2
          })
        }
      } catch (error) {
        console.error('QR code generation failed:', error)
      }
    },

    // 重新生成二维码（重新调用注册API）
    async regenerateQR() {
      await this.initiateSignup()
    },


    // 进入下一步
    nextStep() {
      if (this.currentStep === 1 && this.canProceedToVerification) {
        this.currentStep = 2
      }
    },

    // 处理验证码输入
    handleVerificationCodeInput() {
      // 只允许数字，最多6位
      this.verificationCode = this.verificationCode.replace(/\D/g, '').slice(0, 6)
      this.errors.verification = ''
    },

    // 验证TOTP代码
    async verifyTOTPCode() {
      if (!this.isValidVerificationCode) return

      this.isVerifying = true
      this.errors.verification = ''

      try {
        // 模拟验证成功（因为后端没有验证端点）
        // 在实际应用中，这里应该调用验证API
        console.log('Verifying TOTP code:', this.verificationCode)

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 验证成功，进入恢复短语步骤
        this.currentStep = 3

      } catch (error) {
        console.error('TOTP verification failed:', error)
        this.errors.verification = '验证码无效，请重试'
      } finally {
        this.isVerifying = false
      }
    },


    // 复制到剪贴板
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        // 简单的成功提示
        alert('已复制到剪贴板！')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        // 降级处理：创建临时输入框
        this.fallbackCopyToClipboard(text)
      }
    },

    // 降级的复制方法
    fallbackCopyToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        alert('已复制到剪贴板！')
      } catch (err) {
        console.error('Fallback copy failed:', err)
      }
      document.body.removeChild(textArea)
    },

    // 复制TOTP密钥
    async copyTOTPSecret() {
      if (this.signupResponse?.totp_secret) {
        await this.copyToClipboard(this.signupResponse.totp_secret)
      }
    },

    // 复制恢复短语
    async copyRecoveryPhrase() {
      if (this.signupResponse?.recovery_phrase) {
        await this.copyToClipboard(this.signupResponse.recovery_phrase)
      }
    },

    // 完成注册并自动登录
    async completeSignup() {
      console.log('Signup completed successfully')

      try {
        // 自动登录用户
        await this.autoLogin()
      } catch (error) {
        console.error('Auto login failed:', error)
        // 如果自动登录失败，跳转到登录页面
        this.$router.push('/signin')
      }
    },

    // 自动登录
    async autoLogin() {
      if (!this.signupResponse?.username) {
        throw new Error('No username available for auto login')
      }

      try {
        // 调用登录API
        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/users/signin/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.signupResponse.username,
            code: this.verificationCode // 使用用户刚输入的验证码
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Auto login failed')
        }

        const result = await response.json()
        console.log('Auto login successful:', result)

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

        // 登录成功，跳转到用户中心
        this.$router.push('/user-center')

      } catch (error) {
        console.error('Auto login error:', error)
        throw error
      }
    },

    // 返回上一步
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    // 重置表单
    resetForm() {
      this.signupResponse = null
      this.verificationCode = ''
      this.currentStep = 1
      this.errors = {
        signup: '',
        verification: ''
      }
    }
  },

  // 组件挂载时的初始化
  mounted() {
    console.log('SignUp component mounted')
    // 自动生成二维码
    this.initiateSignup()
  },

  // 组件销毁前的清理
  beforeUnmount() {
    console.log('SignUp component unmounting')
  }
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
}

.step-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: #667eea;
  color: white;
}

.step.completed .step-number {
  background: #4caf50;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

/* 步骤内容 */
.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.step-description {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

/* 表单样式 */
.signup-form {
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
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

/* 按钮样式 */
.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
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

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

/* 2FA设置样式 */
.totp-setup {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.download-prompt {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #667eea;
}

.app-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.download-prompt h3 {
  margin-bottom: 8px;
  color: #333;
}

.download-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.download-link img {
  height: 40px;
}

.qr-section {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-code {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.manual-input {
  flex: 1;
}

.manual-input h4 {
  margin-bottom: 12px;
  color: #333;
}

.secret-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.secret-code {
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  flex: 1;
  word-break: break-all;
}

/* 验证码输入 */
.verification-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.code-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.code-input {
  font-size: 24px;
  text-align: center;
  letter-spacing: 8px;
  padding: 16px;
  width: 200px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.code-input:focus {
  outline: none;
  border-color: #667eea;
}

.code-hint {
  color: #666;
  font-size: 14px;
}

.verification-actions {
  display: flex;
  gap: 16px;
}

/* 恢复短语样式 */
.recovery-phrase-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.warning-box {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
}

.warning-icon {
  font-size: 24px;
}

.warning-text ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.warning-text li {
  margin-bottom: 4px;
  color: #856404;
}

.phrase-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phrase-words {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.phrase-word {
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  border: 1px solid #e0e0e0;
}

.completion-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 错误信息 */
.error-message {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .signup-card {
    padding: 20px;
    margin: 10px;
  }

  .qr-section {
    flex-direction: column;
    align-items: center;
  }

  .download-links {
    flex-direction: column;
    align-items: center;
  }

  .phrase-words {
    grid-template-columns: 1fr;
  }

  .verification-actions,
  .completion-actions {
    flex-direction: column;
  }
}
</style>
