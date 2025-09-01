<template>
  <div class="content-section">
    <div class="content-container">
      <h2 class="section-title">Explore Our Tools</h2>
      <div class="tools-grid">
        <div class="tool-card">
          <div class="tool-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <h3>Link Security Check</h3>
          <p>Check the security of suspicious links to avoid phishing attacks</p>
          <router-link to="/link-check" class="tool-btn">Start Check</router-link>
        </div>

        <div class="tool-card">
          <div class="tool-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>Cybersecurity Library</h3>
          <p>Learn cybersecurity knowledge and improve digital security awareness</p>
          <router-link to="/library" class="tool-btn">Browse Content</router-link>
        </div>

        <div class="tool-card">
          <div class="tool-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3>Cybersecurity Test</h3>
          <p>Assess your cybersecurity knowledge level and get personalized recommendations</p>
          <router-link to="/test" class="tool-btn">Start Test</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExploreToolsSection',
}
</script>

<style scoped>
.content-section {
  padding: 60px 20px;
  background: var(--forest-light);
}

.content-container {
  max-width: 1800px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--forest-dark);
  margin-bottom: 60px;
}

.tools-grid {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 50px;
  flex-wrap: wrap;
}

.tool-card {
  background: white;
  border-radius: 24px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 8px 16px var(--shadow-light);
  border: 1px solid var(--border-light);
  flex: 0 1 400px;
  max-width: 400px;
}

.tool-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  background: var(--forest-medium);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--forest-light);
}

.tool-card h3 {
  color: var(--forest-dark);
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 18px;
  line-height: 1.3;
}

.tool-card p {
  color: var(--forest-deep);
  line-height: 1.7;
  margin-bottom: 30px;
  font-size: 1.05rem;
}

.tool-btn {
  display: inline-block;
  background: var(--forest-dark);
  color: var(--forest-light);
  text-decoration: none;
  padding: 15px 35px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  transition: background-color 0.3s ease;
}

.tool-btn:hover {
  background: var(--forest-medium);
}

@media (max-width: 768px) {
  .content-section {
    padding: 80px 20px;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 50px;
  }

  .tools-grid {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    margin-top: 40px;
  }

  .tool-card {
    padding: 40px 30px;
    flex: none;
    width: 100%;
    max-width: 450px;
  }

  .tool-icon {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }

  .tool-card h3 {
    font-size: 1.4rem;
  }

  .tool-btn {
    padding: 14px 30px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .content-section {
    padding: 60px 15px;
  }

  .section-title {
    font-size: 2rem;
  }

  .tool-card {
    padding: 35px 20px;
  }
}
</style>
