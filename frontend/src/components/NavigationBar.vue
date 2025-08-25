<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">CyberSafe</div>

      <!-- Right side buttons -->
      <div class="nav-buttons">
        <div v-if="!isAuthenticated">
          <button @click="signIn" class="btn btn-login" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </div>
        <div v-else class="user-menu">
          <span class="welcome-text">Welcome back!</span>
          <button @click="signOut" class="btn btn-logout">Sign Out</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithRedirect, signOut as amplifySignOut, getCurrentUser } from 'aws-amplify/auth'

export default {
  name: 'NavigationBar',
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
        router.push('/')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }

    // dashboard 相关已移除

    const checkAuthStatus = async () => {
      try {
        await getCurrentUser()
        isAuthenticated.value = true
      } catch {
        isAuthenticated.value = false
      }
    }

    onMounted(() => {
      checkAuthStatus()

      // 初始检查一次
      getCurrentUser()
        .then(() => {
          isAuthenticated.value = true
        })
        .catch(() => {
          isAuthenticated.value = false
        })
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
.navbar {
  background: var(--forest-light);
  box-shadow: 0 2px 8px var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-light);
}

.nav-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem 8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--forest-dark);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

.user-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.welcome-text {
  color: var(--forest-dark);
  font-weight: 500;
  font-size: 1rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.btn-login {
  background: var(--forest-dark);
  color: var(--text-light);
  box-shadow: 0 2px 8px var(--shadow-medium);
}

.btn-login:hover:not(:disabled) {
  background: var(--forest-deep);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-dark);
}

.btn-logout {
  background: transparent;
  color: var(--forest-dark);
  border: 2px solid var(--forest-medium);
}

.btn-logout:hover {
  background: var(--forest-medium);
  color: var(--text-light);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .nav-brand {
    font-size: 1.5rem;
  }

  .user-menu {
    gap: 0.5rem;
  }
}
</style>
