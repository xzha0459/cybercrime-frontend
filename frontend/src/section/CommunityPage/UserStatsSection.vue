<template>
  <div class="user-stats-section">
    <div class="user-stats-container">
      <!-- Header Section -->
      <div class="section-header">
        <h2 class="main-title">User Stats</h2>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- My Stats Card -->
        <div v-if="myStats && !loading" class="stats-card">
          <div class="card-content">
            <div class="stats-info">
              <div class="user-avatar">{{ myStats.username.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <div class="user-name">{{ myStats.username }}</div>
                <div class="user-level">Level {{ myStats.challenge_level }}</div>
                <!-- Team Name Display -->
                <div v-if="currentTeam" class="team-name-display">
                  <span class="team-icon">👥</span>
                  {{ currentTeam.name }}
                </div>
                <div v-else class="no-team-display">
                  <span class="team-icon">👥</span>
                  Not in a team
                </div>
              </div>
            </div>
            <div class="stats-data">
              <div class="points">{{ myStats.points }} points</div>
              <div class="badges">
                <span v-if="myStats.badge" class="badge">{{ myStats.badge.name }}</span>
                <span v-else class="no-badge">No badges yet</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading...</p>
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

// 获取我的统计数据
const fetchMyStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/me/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch my stats')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching my stats:', error)
    return null
  }
}

export default {
  name: 'UserStatsSection',
  setup() {
    const loading = ref(true)
    const currentTeam = ref(null)
    const myStats = ref(null)


    const loadTeamInfo = async () => {
      try {
        loading.value = true

        // 检查用户是否已登录
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          currentTeam.value = null
          myStats.value = null
          return
        }

        // 获取用户统计数据
        const statsData = await fetchMyStats()
        myStats.value = statsData

        // 尝试获取团队信息，如果失败则设为null
        try {
          const response = await fetch(`${API_BASE_URL}/leaderboard/my-team/`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getAccessToken()}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            currentTeam.value = data.team
          } else {
            currentTeam.value = null
          }
        } catch {
          currentTeam.value = null
        }
      } catch (error) {
        console.error('Error loading team info:', error)
      } finally {
        loading.value = false
      }
    }



    onMounted(() => {
      loadTeamInfo()
    })

    return {
      loading,
      currentTeam,
      myStats
    }
  }
}
</script>

<style scoped>
.user-stats-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
}

.user-stats-container {
  max-width: 100%;
}

.section-header {
  text-align: center;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--violet-dark);
  margin-bottom: 0.5rem;
}


.content-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;

}

.stats-card {
  background: linear-gradient(135deg, var(--violet-light), #f8f4ff);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(139, 69, 19, 0.1);
  order: 1;
}


.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.stats-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--violet-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
  text-align: left;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary, #333);
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.user-level {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}

.stats-data {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.points {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--violet-dark);
}

.badges {
  display: flex;
  align-items: center;
}

.badge {
  background: var(--violet-deep);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.no-badge {
  color: var(--text-secondary, #666);
  font-style: italic;
  font-size: 0.9rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.loading-state .spinner {
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

/* Team Name Display */
.team-name-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--violet-deep);
  font-weight: 500;
}

.no-team-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  font-style: italic;
}

.team-icon {
  font-size: 1rem;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .user-stats-section {
    padding: 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .card-content {
    flex-direction: column;
    text-align: center;
  }

  .stats-data {
    align-items: center;
  }
}
</style>
