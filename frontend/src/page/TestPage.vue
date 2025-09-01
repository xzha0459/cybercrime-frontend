<template>
  <div class="test-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Cybersecurity Knowledge Test</h1>
        <p class="page-subtitle">Assess your cybersecurity habits and discover areas for improvement</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- Test Section -->
        <TestSection @test-status-changed="handleTestStatusChanged" />
      </div>
    </div>

    <!-- Footer only shows when authenticated and test is not active -->
    <FooterSection v-if="isAuthenticated && !isTestActive" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getCurrentUser } from 'aws-amplify/auth'
import TestSection from '../section/TestPage/TestSection.vue'
import FooterSection from '../section/HomePage/FooterSection.vue'

export default {
  name: 'TestPage',
  components: {
    TestSection,
    FooterSection
  },
  setup() {
    const isAuthenticated = ref(false)
    const isTestActive = ref(false)

    const checkAuthStatus = async () => {
      try {
        await getCurrentUser()
        isAuthenticated.value = true
      } catch {
        isAuthenticated.value = false
      }
    }

    const handleTestStatusChanged = (isActive) => {
      isTestActive.value = isActive
    }

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isAuthenticated,
      isTestActive,
      handleTestStatusChanged
    }
  }
}
</script>

<style scoped>
.test-page {
  background-color: var(--bg-primary);
}

.page-header {
  background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-deep) 100%);
  color: var(--text-light);
  padding: 4rem 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px var(--shadow-dark);
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

.page-content {
  padding: 0;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 8rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .container {
    padding: 0 1rem;
  }
}
</style>
