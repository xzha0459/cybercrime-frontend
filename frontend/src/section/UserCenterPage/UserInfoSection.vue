<template>
  <div class="user-info-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <h2 class="text-center mb-4">User Information</h2>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading user information...</p>
          </div>

          <!-- User Info Display -->
          <div v-else-if="isAuthenticated && userInfo" class="user-info-display">
            <div class="user-profile">
              <div class="user-avatar">
                {{ getUserInitial() }}
              </div>
              <div class="user-details">
                <h3 class="username">{{ userInfo.username || 'User' }}</h3>
                <p v-if="userInfo.age" class="age">Age: {{ userInfo.age }}</p>
                <p v-if="userInfo.createdAt" class="member-since">
                  Member since: {{ formatDate(userInfo.createdAt) }}
                </p>
              </div>
            </div>




          </div>

          <!-- Not Authenticated State -->
          <div v-else-if="!isAuthenticated" class="not-authenticated">
            <div class="empty-state">
              <div class="empty-icon">🔒</div>
              <h3>Not Signed In</h3>
              <p>Please sign in to view your user information.</p>
              <button @click="goToSignIn" class="btn btn-signin">
                Sign In
              </button>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="authError" class="error-state">
            <div class="alert alert-danger">
              <h6 class="alert-heading">Error loading user information:</h6>
              <p>{{ authError }}</p>
              <button @click="retryLoad" class="btn btn-retry">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserInfoSection',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const isAuthenticated = ref(false)
    const userInfo = ref(null)
    const authError = ref(null)

    const checkAuthStatus = async () => {
      try {
        loading.value = true
        authError.value = null

        // Check if user has access token
        const accessToken = localStorage.getItem('access_token')
        const userInfoStr = localStorage.getItem('user_info')

        if (!accessToken || !userInfoStr) {
          isAuthenticated.value = false
          userInfo.value = null
          return
        }

        // Parse user info from localStorage
        const storedUserInfo = JSON.parse(userInfoStr)

        isAuthenticated.value = true
        userInfo.value = {
          username: storedUserInfo.username || 'User',
          email: storedUserInfo.email || 'No email available',
          age: storedUserInfo.age || null,
          createdAt: storedUserInfo.date_joined || new Date().toISOString(),
          testCount: 0,
          linkChecks: 0,
          libraryVisits: 0,
        }

      } catch (error) {
        console.error('Error checking auth status:', error)
        isAuthenticated.value = false
        userInfo.value = null
        authError.value = 'Failed to load user information. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const getUserInitial = () => {
      if (!userInfo.value) return '?'
      const name = userInfo.value.username || userInfo.value.email
      return name.charAt(0).toUpperCase()
    }

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Unknown date'
      }
    }



    const goToSignIn = () => {
      router.push('/signin')
    }

    const retryLoad = () => {
      checkAuthStatus()
    }

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      loading,
      isAuthenticated,
      userInfo,
      authError,
      getUserInitial,
      formatDate,
      goToSignIn,
      retryLoad,
    }
  },
}
</script>

<style scoped>
.user-info-section {
  padding: 2rem 0;
}

.user-info-section h2 {
  color: var(--violet-ultra-dark);
  font-weight: 700;
  margin-bottom: 2rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--violet-sage);
  border-top: 4px solid var(--violet-ultra-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--violet-light) 0%, var(--violet-sage) 100%);
  border-radius: 12px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 15px var(--shadow-light);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--violet-ultra-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 4px 15px var(--shadow-medium);
}

.user-details {
  flex: 1;
}

.username {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--violet-ultra-dark);
}

.age, .member-since {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--violet-deep);
}





/* Not Authenticated State */
.not-authenticated {
  text-align: center;
  padding: 3rem 0;
}

.empty-state {
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--violet-ultra-dark);
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--violet-deep);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.btn-signin {
  background: var(--violet-ultra-dark);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-signin:hover {
  background: var(--violet-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

/* Error State */
.error-state {
  padding: 2rem;
}

.alert {
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-heading {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-retry {
  background: #dc3545;
  color: white;
  margin-top: 1rem;
}

.btn-retry:hover {
  background: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-profile {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .user-avatar {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }

  .username {
    font-size: 1.5rem;
  }




}

@media (max-width: 480px) {
  .user-profile {
    padding: 1rem;
  }


}
</style>
