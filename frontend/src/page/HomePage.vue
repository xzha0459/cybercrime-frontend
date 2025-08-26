<template>
  <div class="home-page">
    <HeroSection
      :isAuthenticated="isAuthenticated"
      :loading="loading"
      @sign-in="signIn"
    />
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
      } catch (error) {
        console.error('Sign in error:', error)
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
      } catch (error) {
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
</style>
