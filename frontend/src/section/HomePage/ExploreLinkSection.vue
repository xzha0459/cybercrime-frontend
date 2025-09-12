<template>
  <div class="explore-link-section">
    <div class="section-container">
      <div class="card-content">
        <div class="left-column">
          <h2 class="card-title">Link Security Check</h2>
          <p class="card-description">
            Check the security of suspicious links to avoid phishing attacks and protect yourself from malicious websites, identity theft, and financial fraud. Our advanced scanning technology analyzes URLs in real-time to detect potential threats before you click.
          </p>
        </div>
        <div class="right-column">
          <div class="features">
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
              </svg>
              <span class="feature-text">Real-time Detection</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span class="feature-text">Multiple Security Checks</span>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span class="feature-text">Privacy Protection</span>
            </div>
          </div>
          <router-link to="/link-check" class="check-button">
            check now
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExploreLinkSection',
}
</script>

<style scoped>
.link-check-section {
  padding: 0;
  background: var(--violet-light);
  min-height: 40vh;
  display: flex;
  align-items: center;
}

.section-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.card-content {
  display: flex;
  width: 100%;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 100px;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 100px;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--violet-dark);
  margin: 0;
  line-height: 1.2;
}

.card-description {
  font-size: 1.1rem;
  color: var(--violet-dark);
  margin: 15px 0 0 0;
  line-height: 1.4;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  width: 20px;
  height: 20px;
  color: var(--violet-medium);
  flex-shrink: 0;
}

.feature-text {
  font-size: 0.95rem;
  color: var(--violet-dark);
  font-weight: 500;
}

.check-button {
  display: inline-block;
  background: var(--violet-dark);
  color: var(--text-light);
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-button:hover {
  background: var(--violet-medium);
  color: var(--text-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .link-check-section {
    min-height: 40vh;
  }

  .section-container {
    padding: 0 15px;
  }

  .card-content {
    flex-direction: column;
    gap: 40px;
  }

  .left-column {
    flex: none;
    min-height: 80px;
    padding: 15px;
  }

  .right-column {
    flex: none;
    gap: 15px;
    padding: 15px;
  }

  .card-title {
    font-size: 1.6rem;
  }

  .card-description {
    font-size: 1rem;
  }

  .features {
    gap: 10px;
    margin-bottom: 15px;
  }

  .feature-text {
    font-size: 0.9rem;
  }

  .check-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 0 10px;
  }

  .card-title {
    font-size: 1.4rem;
  }

  .card-description {
    font-size: 0.95rem;
  }
}
</style>
