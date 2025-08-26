<template>
  <section class="link-safety-section">
    <div class="section-header">
      <h2 class="section-title">Link Safety Check</h2>
      <p class="section-description">
        Check the safety of a link based on URL analysis before visiting the website
      </p>
    </div>

    <div class="section-content">
      <div class="url-input-container">
        <div class="input-group">
          <label for="url-input" class="input-label">Enter URL to check:</label>
          <div class="input-wrapper">
            <input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              class="url-input"
            />
            <button class="check-btn">
              Check Safety
            </button>
          </div>
        </div>
      </div>

      <!-- Results Display -->
      <div class="results-container">
        <div class="result-header">
          <h3>Safety Check Results</h3>
          <span class="result-status safe">
            ✅ Safe
          </span>
        </div>

        <div class="result-details">
          <div class="result-item">
            <strong>URL:</strong> https://example.com
          </div>
          <div class="result-item">
            <strong>Risk Level:</strong>
            <span class="risk-level safe">
              Low
            </span>
          </div>
          <div class="result-item">
            <strong>Analysis:</strong> This URL appears to be safe based on our analysis.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LinkSafetySection'
}
</script>

<style scoped>
.link-safety-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px var(--shadow-light);
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.url-input-container {
  max-width: 600px;
  margin: 0 auto 3rem auto;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
}

.url-input {
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.url-input:focus {
  outline: none;
  border-color: var(--forest-deep);
}

.check-btn {
  padding: 1rem 2rem;
  background: var(--forest-deep);
  color: var(--text-light);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.check-btn:hover {
  background: var(--forest-dark);
}

.results-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px var(--shadow-light);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-light);
}

.result-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
}

.result-status {
  font-weight: 600;
  font-size: 1.125rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.result-status.safe {
  background: #d4edda;
  color: #155724;
}

.result-details {
  margin-bottom: 2rem;
}

.result-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.result-item strong {
  color: var(--text-primary);
}

.risk-level {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-left: 0.5rem;
}

.risk-level.safe {
  background: #d4edda;
  color: #155724;
}

@media (max-width: 768px) {
  .link-safety-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .result-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>

