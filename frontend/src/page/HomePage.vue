<template>
  <div class="home-page">
    <HeroSection
      :isAuthenticated="isAuthenticated"
      :loading="loading"
      @sign-in="signIn"
    />

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="content-container">
        <h2 class="section-title">Explore Our Tools</h2>
        <div class="tools-grid">
                    <div class="tool-card">
            <div class="tool-icon">🔗</div>
            <h3>Link Security Check</h3>
            <p>Check the security of suspicious links to avoid phishing attacks</p>
            <router-link to="/link-check" class="tool-btn">Start Check</router-link>
          </div>

          <div class="tool-card">
            <div class="tool-icon">📚</div>
            <h3>Cybersecurity Library</h3>
            <p>Learn cybersecurity knowledge and improve digital security awareness</p>
            <router-link to="/library" class="tool-btn">Browse Content</router-link>
          </div>

          <div class="tool-card">
            <div class="tool-icon">🧪</div>
            <h3>Cybersecurity Test</h3>
            <p>Assess your cybersecurity knowledge level and get personalized recommendations</p>
            <router-link to="/test" class="tool-btn">Start Test</router-link>
          </div>
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { signInWithRedirect, getCurrentUser } from 'aws-amplify/auth'
import HomeHeroSection from '@/section/HomePage/HomeHeroSection.vue'
import FooterSection from '@/section/HomePage/FooterSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection: HomeHeroSection,
    FooterSection,
  },
  setup() {
    const isAuthenticated = ref(false)
    const loading = ref(false)

    const signIn = async () => {
      try {
        loading.value = true
        await signInWithRedirect({ provider: 'COGNITO' })
      } catch {
        loading.value = false
      }
    }

    const checkAuthStatus = async () => {
      try {
        const maxAttempts = 3

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            await getCurrentUser()
            isAuthenticated.value = true
            return
          } catch {
            if (attempt < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 500))
            }
          }
        }

        isAuthenticated.value = false
              } catch {
          isAuthenticated.value = false
        }
    }

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const hasAuthParams = urlParams.get('code') || urlParams.get('error')

      if (!hasAuthParams) {
        checkAuthStatus()
      }
    })

    return {
      isAuthenticated,
      loading,
      signIn,
    }
  },
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.content-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 50px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.tool-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.tool-card h3 {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.tool-card p {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 25px;
}

.tool-btn {
  display: inline-block;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.tool-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .content-section {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 2rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .tool-card {
    padding: 30px 20px;
  }
}
</style>
