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
                <h3 class="username">{{ userInfo.username || userInfo.email || 'User' }}</h3>
                <p class="email">{{ userInfo.email || 'No email available' }}</p>
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
import {
  getCurrentUser,
  fetchUserAttributes,
} from 'aws-amplify/auth'

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

        const user = await getCurrentUser()
        isAuthenticated.value = true

        // Get user attributes
        const attributes = await fetchUserAttributes()

        // Try to get additional user info from localStorage (if available)
        let localUserInfo = null
        try {
          const storedUsers = localStorage.getItem('registeredUsers')
          if (storedUsers) {
            const users = JSON.parse(storedUsers)
            // Find user by email or username
            localUserInfo = users.find(u =>
              u.email === attributes.email ||
              u.email === attributes['custom:email'] ||
              u.username === user.username
            )
          }
        } catch (localError) {
          console.warn('Could not load local user info:', localError)
        }

        // Combine AWS attributes with local user info
        userInfo.value = {
          username: localUserInfo?.username || user.username || 'User',
          email: attributes.email || attributes['custom:email'] || user.username || 'No email available',
          age: localUserInfo?.age || null,
          createdAt: localUserInfo?.createdAt || new Date().toISOString(),
          testCount: localUserInfo?.testCount || 0,
          linkChecks: localUserInfo?.linkChecks || 0,
          libraryVisits: localUserInfo?.libraryVisits || 0,
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
      router.push('/')
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
  color: var(--forest-dark, #2c5530);
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
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--forest-dark, #2c5530);
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--forest-dark, #2c5530);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(44, 85, 48, 0.3);
}

.user-details {
  flex: 1;
}

.username {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--forest-dark, #2c5530);
}

.email {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

.age, .member-since {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #888;
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
  color: var(--forest-dark, #2c5530);
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.btn-signin {
  background: var(--forest-dark, #2c5530);
  color: white;
  padding: 0.75rem 2rem;
}

.btn-signin:hover {
  background: var(--forest-deep, #1e3a22);
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
