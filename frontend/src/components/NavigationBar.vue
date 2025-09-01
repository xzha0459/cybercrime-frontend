<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">
        <img src="./../assets/logo.png" alt="GuardU Logo" class="nav-logo">GuardU
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/link-check" class="nav-link">Link Check</router-link>
        <router-link to="/library" class="nav-link">Library</router-link>
        <router-link to="/test" class="nav-link">Test</router-link>
      </div>

      <!-- Right side buttons -->
      <div class="nav-buttons">
        <div v-if="!isAuthenticated">
          <button @click="signIn" class="btn btn-login" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Login' }}
          </button>
        </div>
        <div v-else class="user-menu">
          <span class="user-email clickable" v-if="userEmail" @click="goToUserCenter">{{ userEmail }}</span>
          <span class="user-email" v-else>Loading...</span>
          <button @click="signOut" class="btn btn-logout">Sign Out</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  signInWithRedirect,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth'

export default {
  name: 'NavigationBar',
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const userEmail = ref(null)

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
        userEmail.value = null
        router.push('/')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }

    const goToUserCenter = () => {
      router.push('/user-center')
    }

    const getUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes()
        userEmail.value = attributes.email || attributes['custom:email'] || 'No email available'
      } catch {
        try {
          const user = await getCurrentUser()
          if (user.signInDetails?.loginId && user.signInDetails.loginId.includes('@')) {
            userEmail.value = user.signInDetails.loginId
          } else if (user.username && user.username.includes('@')) {
            userEmail.value = user.username
          } else {
            userEmail.value = user.username || user.userId || 'User'
          }
        } catch {
          userEmail.value = 'Email unavailable'
        }
      }
    }

    const checkAuthStatus = async () => {
      try {
        await getCurrentUser()
        isAuthenticated.value = true
        await getUserEmail()
      } catch {
        isAuthenticated.value = false
        userEmail.value = null
      }
    }

    watch(isAuthenticated, async (newValue) => {
      if (newValue && !userEmail.value) {
        await getUserEmail()
      }
    })

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isAuthenticated,
      loading,
      userEmail,
      signIn,
      signOut,
      goToUserCenter,
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

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: var(--forest-dark);
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: var(--forest-sage);
  color: var(--forest-dark);
}

.nav-link.router-link-active {
  background: var(--forest-medium);
  color: var(--text-light);
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--forest-dark);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-logo {
  height: 2rem;
  width: auto;
  object-fit: contain;
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

.user-email {
  color: var(--forest-dark);
  font-weight: 500;
  font-size: 1rem;
  background: var(--forest-sage);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-email.clickable:hover {
  background: var(--forest-medium);
  color: var(--text-light);
  transform: translateY(-1px);
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

  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
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
    flex-direction: column;
  }

  .user-email {
    font-size: 0.9rem;
    max-width: 150px;
    padding: 0.3rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.8rem;
  }

  .user-menu {
    gap: 0.3rem;
  }

  .user-email {
    font-size: 0.8rem;
    max-width: 120px;
    padding: 0.2rem 0.4rem;
  }

  .btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
