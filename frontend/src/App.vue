<template>
  <div id="app">
    <NavigationBar v-if="!isAuthPage" />

    <router-view />
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue'

export default {
  name: 'App',
  components: {
    NavigationBar,
  },
  computed: {
    isAuthPage() {
      return this.$route.path === '/signup' || this.$route.path === '/signin'
    }
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
