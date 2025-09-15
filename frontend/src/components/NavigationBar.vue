<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">
        <img src="./../assets/logo.png" alt="GuardU Logo" class="nav-logo">GuardU
      </div>

      <!-- Desktop Navigation Links -->
      <div class="nav-links desktop-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/link-check" class="nav-link">Link Check</router-link>
        <router-link to="/library" class="nav-link">Library</router-link>
        <router-link to="/challenge" class="nav-link">Challenge</router-link>
      </div>

      <!-- Desktop Right side buttons -->
      <div class="nav-buttons desktop-nav">
        <div v-if="!isAuthenticated">
          <button @click="goToSignIn" class="btn btn-signin" :disabled="loading">
            {{ loading ? 'Loading...' : 'Sign In' }}
          </button>
          <button @click="goToSignUp" class="btn btn-signup" :disabled="loading">
            {{ loading ? 'Loading...' : 'Sign Up' }}
          </button>
        </div>
        <div v-else class="user-menu">
          <span class="user-email clickable" v-if="userEmail" @click="goToUserCenter">{{ userEmail }}</span>
          <span class="user-email" v-else>Loading...</span>
          <button @click="signOut" class="btn btn-logout">Sign Out</button>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="mobile-menu-btn" :class="{ active: isMobileMenuOpen }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <!-- Mobile Navigation Links -->
        <div class="mobile-nav-links">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">Home</router-link>
          <router-link to="/link-check" class="mobile-nav-link" @click="closeMobileMenu">Link Check</router-link>
          <router-link to="/library" class="mobile-nav-link" @click="closeMobileMenu">Library</router-link>
          <router-link to="/challenge" class="mobile-nav-link" @click="closeMobileMenu">Challenge</router-link>
        </div>

        <!-- Mobile User Section -->
        <div class="mobile-user-section">
          <div v-if="!isAuthenticated">
            <button @click="goToSignIn" class="btn btn-signin mobile-btn" :disabled="loading">
              {{ loading ? 'Loading...' : 'Sign In' }}
            </button>
            <button @click="goToSignUp" class="btn btn-signup mobile-btn" :disabled="loading">
              {{ loading ? 'Loading...' : 'Sign Up' }}
            </button>
          </div>
          <div v-else class="mobile-user-menu">
            <div class="mobile-user-info">
              <span class="mobile-user-email clickable" v-if="userEmail" @click="() => { goToUserCenter(); closeMobileMenu(); }">{{ userEmail }}</span>
              <span class="mobile-user-email" v-else>Loading...</span>
            </div>
            <button @click="signOut" class="btn btn-logout mobile-btn">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavigationBar',
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const userEmail = ref(null)
    const isMobileMenuOpen = ref(false)

    const signIn = async () => {
      router.push('/signin')
    }

    const signOut = async () => {
      try {
        // Clear localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_info')

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

    const goToSignUp = () => {
      router.push('/signup')
      closeMobileMenu()
    }

    const goToSignIn = () => {
      router.push('/signin')
      closeMobileMenu()
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const getUserEmail = () => {
      try {
        const userInfoStr = localStorage.getItem('user_info')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          userEmail.value = userInfo.username || 'User'
        } else {
          userEmail.value = 'User'
        }
      } catch {
        userEmail.value = 'User'
      }
    }

    const checkAuthStatus = () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) {
          isAuthenticated.value = true
          getUserEmail()
        } else {
          isAuthenticated.value = false
          userEmail.value = null
        }
      } catch {
        isAuthenticated.value = false
        userEmail.value = null
      }
    }

    watch(isAuthenticated, (newValue) => {
      if (newValue && !userEmail.value) {
        getUserEmail()
      }
    })

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isAuthenticated,
      loading,
      userEmail,
      isMobileMenuOpen,
      signIn,
      signOut,
      goToUserCenter,
      goToSignUp,
      goToSignIn,
      toggleMobileMenu,
      closeMobileMenu,
    }
  },
}
</script>

<style scoped>
.navbar {
  background: var(--violet-light);
  box-shadow: 0 2px 8px var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0.8rem 8rem;
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
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: var(--violet-sage);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background: var(--violet-dark);
  color: var(--text-light);
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-logo {
  height: 2.8rem;
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
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
  background: var(--violet-sage);
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
  background: var(--violet-medium);
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

.btn-signin {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--violet-medium);
}

.btn-signin:hover:not(:disabled) {
  background: var(--violet-medium);
  color: var(--text-light);
  transform: translateY(-1px);
}

.btn-signup {
  background: var(--violet-dark);
  color: var(--text-light);
  box-shadow: 0 2px 8px var(--shadow-medium);
}

.btn-signup:hover:not(:disabled) {
  background: var(--violet-deep);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-dark);
}

.btn-logout {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--violet-medium);
}

.btn-logout:hover {
  background: var(--violet-medium);
  color: var(--text-light);
  transform: translateY(-1px);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Menu */
/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  position: relative;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 1px;
  transition: all 0.3s ease;
  position: absolute;
}

.hamburger-line:nth-child(1) {
  top: 6px;
}

.hamburger-line:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-line:nth-child(3) {
  bottom: 6px;
}

/* 激活状态 - 形成 × */
.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}

/* 悬停效果 */
.mobile-menu-btn:hover .hamburger-line {
  background: var(--violet-medium);
}

.mobile-menu-btn.active:hover .hamburger-line {
  background: var(--violet-deep);
}

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--violet-ultra-dark);
  border-top: 1px solid var(--border-light);
  box-shadow: 0 4px 12px var(--shadow-medium);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  display: block;
  text-align: center;
}

.mobile-nav-link:hover {
  background: var(--violet-sage);
  border-color: var(--border-light);
  transform: translateY(-1px);
}

.mobile-nav-link.router-link-active {
  background: var(--violet-dark);
  color: var(--text-light);
  border-color: var(--violet-dark);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-user-section {
  border-top: 1px solid var(--border-light);
  padding-top: 1.5rem;
}

.mobile-user-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-user-info {
  display: flex;
  justify-content: center;
}

.mobile-user-email {
  color: var(--violet-ultra-dark);
  font-weight: 500;
  font-size: 1rem;
  background: var(--violet-sage);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-user-email.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-user-email.clickable:hover {
  background: var(--violet-dark);
  color: var(--text-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-btn {
  width: 100%;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .nav-brand {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0.8rem;
  }

  .nav-brand {
    font-size: 1.3rem;
  }

  .mobile-menu-content {
    padding: 1rem;
  }

  .mobile-nav-link {
    font-size: 1rem;
    padding: 0.7rem 0.8rem;
  }

  .mobile-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }
}
</style>
