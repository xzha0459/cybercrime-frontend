<template>
  <div id="app">
    <NavigationBar v-if="!isAuthPage" />

    <router-view />

    <!-- AI ChatBot -->
    <ChatBot v-if="!isAuthPage && !isChallengePage" />

    <!-- Back to Top Button -->
    <BackToTop />

    <!-- Global Toast -->
    <Toast />
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue'
import ChatBot from '@/components/ChatBot.vue'
import BackToTop from '@/components/BackToTop.vue'
import Toast from '@/components/PopToast.vue'
import { startTokenExpirationCheck, stopTokenExpirationCheck } from '@/utils/auth.js'

export default {
  name: 'App',
  components: {
    NavigationBar,
    ChatBot,
    BackToTop,
    Toast,
  },
  computed: {
    isAuthPage() {
      return this.$route.path === '/signup' || this.$route.path === '/signin'
    },
    isChallengePage() {
      return this.$route.path === '/challenge'
    }
  },
  mounted() {
    // 启动token过期检查
    startTokenExpirationCheck()
  },
  beforeUnmount() {
    // 停止token过期检查
    stopTokenExpirationCheck()
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}
</style>
