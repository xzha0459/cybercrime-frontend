<template>
  <div class="leaderboard-section">
    <div class="container">
      <h2 class="section-title">Leaderboard</h2>
      <p class="section-subtitle">Top 10 performers in cybersecurity challenges</p>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading leaderboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Failed to Load Leaderboard</h3>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button @click="loadData" class="retry-btn">Try Again</button>
          <router-link v-if="error.includes('sign in')" to="/signin" class="signin-btn">Sign In</router-link>
        </div>
      </div>

      <!-- Leaderboard Content -->
      <div v-else class="leaderboard-container">
        <div class="leaderboard-header">
          <div class="rank-header">Rank</div>
          <div class="user-header">User</div>
          <div class="score-header">Points</div>
          <div class="badges-header">Title</div>
        </div>

        <div class="leaderboard-list">
          <div
            v-for="(user, index) in leaderboardData"
            :key="user.id"
            class="leaderboard-item"
            :class="{ 'top-three': index < 3 }"
          >
            <div class="rank">
              <span v-if="index === 0" class="rank-icon">🥇</span>
              <span v-else-if="index === 1" class="rank-icon">🥈</span>
              <span v-else-if="index === 2" class="rank-icon">🥉</span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </div>

            <div class="user-info">
              <div class="user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-level">Level {{ user.level }}</div>
              </div>
            </div>

            <div class="score">{{ user.score }}</div>

            <div class="badges">
              <span
                v-for="badge in user.badges"
                :key="badge"
                class="badge"
              >
                {{ badge }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- My Stats Section -->
      <div v-if="myStats && !loading && !error" class="my-stats-section">
        <h3 class="my-stats-title">Your Stats</h3>
        <div class="my-stats-card">
          <div class="my-stats-info">
            <div class="my-avatar">{{ myStats.username.charAt(0).toUpperCase() }}</div>
            <div class="my-details">
              <div class="my-name">{{ myStats.username }}</div>
              <div class="my-level">Level {{ myStats.challenge_level }}</div>
            </div>
          </div>
          <div class="my-score">{{ myStats.points }} points</div>
          <div class="my-badges">
            <span v-if="myStats.badge" class="my-badge">{{ myStats.badge.name }}</span>
            <span v-else class="no-badge">No badges yet</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'LeaderboardSection',
  setup() {
    const leaderboardData = ref([])
    const myStats = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    // 获取全局排行榜数据
    const fetchGlobalLeaderboard = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          throw new Error('No access token found')
        }

        const response = await fetch(`${API_BASE_URL}/leaderboard/global/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data')
        }
        const data = await response.json()
        return data
      } catch (err) {
        console.error('Error fetching global leaderboard:', err)
        throw err
      }
    }

    // 获取我的统计数据
    const fetchMyStats = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          return null
        }

        const response = await fetch(`${API_BASE_URL}/leaderboard/me/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch my stats')
        }
        const data = await response.json()
        return data
      } catch (err) {
        console.error('Error fetching my stats:', err)
        return null
      }
    }

    // 格式化排行榜数据
    const formatLeaderboardData = (data) => {
      let usersArray = []

      // 如果data有leaderboard属性且为数组
      if (data && data.leaderboard && Array.isArray(data.leaderboard)) {
        usersArray = data.leaderboard
      }
      // 如果data本身就是数组
      else if (Array.isArray(data)) {
        usersArray = data
      }
      // 如果是单个用户对象，转换为数组格式
      else if (data && typeof data === 'object' && data.username) {
        usersArray = [data]
      }
      else {
        console.error('Unexpected data format:', typeof data, data)
        return []
      }

      // return usersArray.map((user, index) => ({
      //   id: index + 1,
      //   name: user.username,
      //   level: user.challenge_level,
      //   score: user.points,
      //   badges: user.badge ? [user.badge.name] : []
      // }))
      return usersArray.slice(0, 10).map((user, index) => ({
         id: index + 1,
         name: user.username,
         level: user.challenge_level,
         score: user.points,
         badges: user.badge ? [user.badge.name] : []
       }))
    }

    // 加载数据
    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        // 检查是否有访问令牌
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          error.value = 'Please sign in to view the leaderboard'
          return
        }

        // 并行获取全局排行榜和我的统计数据
        const [globalData, myData] = await Promise.all([
          fetchGlobalLeaderboard(),
          fetchMyStats()
        ])

        console.log('API Response - globalData:', globalData)
        console.log('API Response - myData:', myData)

        leaderboardData.value = formatLeaderboardData(globalData)
        myStats.value = myData

      } catch (err) {
        if (err.message === 'No access token found') {
          error.value = 'Please sign in to view the leaderboard'
        } else {
          error.value = 'Failed to load leaderboard data'
        }
        console.error('Error loading data:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      leaderboardData,
      myStats,
      loading,
      error,
      loadData
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #333);
}

.section-subtitle {
  text-align: center;
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
}

.leaderboard-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 100px 1fr 100px 150px;
  gap: 2rem;
  padding: 1rem 2rem;
  background: var(--violet-dark);
  font-weight: 600;
  color: white;
}

.leaderboard-list {
  max-height: 500px;
  overflow-y: auto;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: 100px 1fr 100px 150px;
  gap: 2rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light)
}

.leaderboard-item:hover {
  background: var(--violet-sage, #f8f6ff);
}


.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.rank-icon {
  font-size: 1.5rem;
}

.rank-number {
  font-size: 1.2rem;
  color: var(--text-secondary, #666);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--violet-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary, #333);
}

.user-level {
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--violet-dark);
}

.badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.badge {
  background: var(--violet-deep);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
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
  border-top: 4px solid var(--violet-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary, #666);
  font-size: 1.1rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 0;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: var(--text-primary, #333);
  margin-bottom: 0.5rem;
}

.error-state p {
  color: var(--text-secondary, #666);
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: var(--violet-dark);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--violet-deep);
  transform: translateY(-1px);
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.signin-btn {
  background: var(--violet-sage);
  color: var(--violet-dark);
  border: 2px solid var(--violet-dark);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.signin-btn:hover {
  background: var(--violet-dark);
  color: white;
  transform: translateY(-1px);
}

/* My Stats Section */
.my-stats-section {
  margin-top: 2rem;
}

.my-stats-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary, #333);
  text-align: center;
  margin-bottom: 1rem;
}

.my-stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.my-stats-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.my-avatar {
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

.my-details {
  display: flex;
  flex-direction: column;
}

.my-name {
  font-weight: 600;
  color: var(--text-primary, #333);
  font-size: 1.1rem;
}

.my-level {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}

.my-score {
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--violet-dark);
}

.my-badges {
  display: flex;
  align-items: center;
}

.my-badge {
  background: var(--violet-deep);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-block;
}

.no-badge {
  color: var(--text-secondary, #666);
  font-style: italic;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }

  .leaderboard-header,
  .leaderboard-item {
    grid-template-columns: 60px 1fr 80px 100px;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .rank-icon {
    font-size: 1.2rem;
  }

  /* My Stats Responsive */
  .my-stats-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .my-stats-info {
    justify-content: center;
  }

  .my-score {
    font-size: 1.1rem;
  }
}
</style>
