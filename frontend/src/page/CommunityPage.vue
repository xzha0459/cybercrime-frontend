<template>
  <div class="community-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Community</h1>
        <p class="page-subtitle">Connect with fellow cybersecurity enthusiasts, compete in challenges, and climb the leaderboard</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="community-grid">
          <div class="leaderboard-section">
            <LeaderboardSection />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeaderboardSection from '../section/CommunityPage/LeaderboardSection.vue'

export default {
  name: 'CommunityPage',
  components: {
    LeaderboardSection
  }
}
</script>

<style scoped>
.community-page {
  background-color: var(--violet-light);
}

.page-header {
  background: var(--violet-dark);
  color: var(--text-light);
  padding: 4rem 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px var(--shadow-dark);
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

.page-content {
  padding: 4rem 0;
}

.container {
  max-width: 100%;
  margin: 0 auto;
}

.community-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.leaderboard-section {
  order: 1;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .container {
    padding: 0 1rem;
  }

  .community-grid {
    gap: 1.5rem;
  }
}
</style>
