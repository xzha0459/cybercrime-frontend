<template>
  <div class="team-info-section">
    <div class="team-info-container">
      <h2 class="section-title">Team Information</h2>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading team information...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="alert alert-danger">
          <h6 class="alert-heading">Error loading team information:</h6>
          <p>{{ error }}</p>
          <button @click="retryLoad" class="btn btn-retry">
            Try Again
          </button>
        </div>
      </div>

      <!-- No Team State -->
      <div v-else-if="!currentTeam" class="no-team-state">
        <div class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>Not in a Team</h3>
          <p>You're not currently part of any team. Join a team to collaborate with friends!</p>
          <router-link to="/community" class="btn btn-primary">
            Go to Community
          </router-link>
        </div>
      </div>

      <!-- Has Team State -->
      <div v-else class="has-team-state">
        <div class="team-card">
          <div class="team-header">
            <div class="team-details">
              <h3 class="team-name">{{ currentTeam.name }}</h3>
              <p class="team-code">Invite Code: {{ currentTeam.invite_code }}</p>
            </div>
          </div>

          <div class="team-info">
            <div class="info-item">
              <span class="info-label">Captain:</span>
              <span class="info-value">{{ currentTeam.created_by }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Created:</span>
              <span class="info-value">{{ formatDate(currentTeam.created_at) }}</span>
            </div>
          </div>

          <div class="team-actions">
            <router-link to="/community" class="btn btn-primary">
              Manage Team
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

// API服务函数 - 直接集成在组件中
const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

// 获取访问令牌
const getAccessToken = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('No access token found. Please sign in.')
  }
  return token
}

// 获取当前团队信息 - 通过leaderboard API
const getCurrentTeamAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/my-team/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // 用户没有团队
      }
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to get team info')
    }

    const data = await response.json()
    return data.team // 返回团队信息
  } catch (error) {
    console.error('Error getting team info:', error)
    throw error
  }
}

export default {
  name: 'TeamInfoSection',
  setup() {
    const loading = ref(true)
    const currentTeam = ref(null)
    const error = ref(null)

    const loadTeamInfo = async () => {
      try {
        loading.value = true
        error.value = null

        // Check if user is authenticated
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          currentTeam.value = null
          return
        }

        currentTeam.value = await getCurrentTeamAPI()
      } catch (err) {
        console.error('Error loading team info:', err)
        error.value = 'Failed to load team information. Please try again.'
        currentTeam.value = null
      } finally {
        loading.value = false
      }
    }

    const retryLoad = () => {
      loadTeamInfo()
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

    onMounted(() => {
      loadTeamInfo()
    })

    return {
      loading,
      currentTeam,
      error,
      retryLoad,
      formatDate
    }
  }
}
</script>

<style scoped>
.team-info-section {
  padding: 2rem 0;
}

.team-info-container {
  max-width: 1600px;
  margin: 0 auto;
}

.section-title {
  color: var(--violet-ultra-dark);
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
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

/* No Team State */
.no-team-state {
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

/* Has Team State */
.has-team-state {
  max-width: 600px;
  margin: 0 auto;
}

.team-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 15px var(--shadow-light);
  padding: 2rem;
}

.team-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.team-details {
  flex: 1;
}

.team-name {
  margin: 0 0 0.25rem 0;
  color: var(--violet-ultra-dark);
  font-size: 1.5rem;
  font-weight: 700;
}

.team-code {
  margin: 0;
  color: var(--violet-deep);
  font-size: 0.9rem;
  font-family: monospace;
}

.team-info {
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--violet-deep);
  font-weight: 600;
}

.info-value {
  color: var(--violet-ultra-dark);
}

.team-actions {
  text-align: center;
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

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--violet-ultra-dark);
  color: white;
}

.btn-primary:hover {
  background: var(--violet-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .team-info-container {
    padding: 0 1rem;
  }

  .team-card {
    padding: 1.5rem;
  }

  .team-header {
    text-align: center;
  }

  .team-name {
    font-size: 1.25rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
