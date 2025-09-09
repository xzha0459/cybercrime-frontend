<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">Learn, Assess, Protect</h1>
        <h1 class="hero-title">Your Digital Journey Starts Here</h1>
        <p class="hero-subtitle">FOSTERING DIGITAL CITIZENSHIP FOR YOUNG AUSTRALIANS</p>

        <!-- 未登录状态 -->
        <div v-if="!isAuthenticated" class="auth-actions">
          <button @click="$emit('sign-in')" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'SIGNING IN...' : 'EXPLORE TOOLS' }}
          </button>
        </div>

        <!-- 已登录状态 -->
        <div v-else class="authenticated-actions">
          <p class="welcome-message">Welcome back! Ready to continue your journey?</p>
          <div class="action-buttons">
            <button @click="scrollToContent" class="btn btn-primary">EXPLORE CONTENT</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeHeroSection',
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['sign-in'],
  methods: {
    scrollToContent() {
      const contentElement = document.querySelector('.content-section')
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
}
</script>

<style scoped>
.hero-section {
  background: var(--bg-primary);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
}

.hero-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 90vh;
  padding: 2rem 8rem;
}

.hero-content {
  text-align: left;
  max-width: 900px;
  width: 100%;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px var(--shadow-dark);
  line-height: 1.2;
}

/* >=768px */
@media (min-width: 768px) {
  .hero-title {
    white-space: nowrap;
  }
}

/* <768px  */
@media (max-width: 767px) {
  .hero-title {
    font-size: 2.8rem;
    white-space: normal;
    line-height: 1.3;
  }

  .hero-container {
    padding: 1rem;
  }
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.4;
}

.auth-actions,
.authenticated-actions {
  margin-top: 2rem;
}

.welcome-message {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: var(--violet-light);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 180px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--violet-dark);
  color: var(--text-light);
  box-shadow: 0 4px 15px var(--shadow-medium);
  transition: background-color 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--violet-medium);
}



@media (max-width: 767px) {
  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    min-width: 160px;
  }
}
</style>
