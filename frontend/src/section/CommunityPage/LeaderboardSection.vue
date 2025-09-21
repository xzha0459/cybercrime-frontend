<template>
  <div class="leaderboard-section">
    <div class="container">
      <h2 class="section-title">🏆 Leaderboard</h2>
      <p class="section-subtitle">Top performers in cybersecurity challenges</p>

      <div class="leaderboard-container">
        <div class="leaderboard-header">
          <div class="rank-header">Rank</div>
          <div class="user-header">User</div>
          <div class="score-header">Score</div>
          <div class="badges-header">Badges</div>
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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LeaderboardSection',
  setup() {
    const leaderboardData = ref([
      {
        id: 1,
        name: 'Alex Chen',
        level: 15,
        score: 2847,
        badges: ['🔒', '🛡️', '⚡']
      },
      {
        id: 2,
        name: 'Sarah Kim',
        level: 14,
        score: 2756,
        badges: ['🔒', '🛡️']
      },
      {
        id: 3,
        name: 'Mike Johnson',
        level: 13,
        score: 2634,
        badges: ['🔒', '⚡']
      },
      {
        id: 4,
        name: 'Emma Wilson',
        level: 12,
        score: 2456,
        badges: ['🔒']
      },
      {
        id: 5,
        name: 'David Lee',
        level: 11,
        score: 2234,
        badges: ['🛡️']
      },
      {
        id: 6,
        name: 'Lisa Zhang',
        level: 10,
        score: 2156,
        badges: ['⚡']
      },
    ])

    return {
      leaderboardData
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
  grid-template-columns: 80px 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
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
  grid-template-columns: 80px 1fr 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light, #f0f0f0);
  transition: background-color 0.2s ease;
}

.leaderboard-item:hover {
  background: var(--violet-sage, #f8f6ff);
}

.leaderboard-item.top-three {
  background: linear-gradient(135deg, #fff8e1, #fff3c4);
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
  background: var(--violet-dark, #6b46c1);
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
  color: var(--violet-dark, #6b46c1);
}

.badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 1.2rem;
  padding: 0.25rem;
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
}
</style>
