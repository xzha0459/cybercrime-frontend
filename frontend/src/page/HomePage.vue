<template>
  <div class="home-page">
    <HeroSection
      :isAuthenticated="isAuthenticated"
      :loading="loading"
      @sign-in="signIn"
      @sign-out="signOut"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithRedirect, signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth'
import HomeHeroSection from '@/section/HomePage/HomeHeroSection.vue'

export default {
  name: 'HomePage',
  components: {
    HeroSection: HomeHeroSection,
  },
  setup() {
    const router = useRouter()
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

    const signOut = async () => {
      try {
        await amplifySignOut()
        isAuthenticated.value = false
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }

    const checkAuthStatus = async () => {
      try {
        // 给Amplify更多时间处理OAuth回调
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
          try {
            const user = await getCurrentUser()
            console.log('User is authenticated:', user)
            isAuthenticated.value = true
            return
          } catch (error) {
            attempts++
            console.log(`Auth check attempt ${attempts}/${maxAttempts}`)

            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1000))
            }
          }
        }

        console.log('User not authenticated after all attempts')
        isAuthenticated.value = false
      } catch (error) {
        console.error('Auth check error:', error)
        isAuthenticated.value = false
      }
    }

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isAuthenticated,
      loading,
      signIn,
      signOut,
    }
  },
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
