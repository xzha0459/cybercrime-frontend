<template>
  <section class="link-safety-section">
    <div class="background-pattern"></div>

    <div class="main-card">
      <div class="card-content">
        <p class="top-text">Stay safe from suspicious links</p>
        <h1 class="main-title">Is This Link Really Safe?</h1>
        <p class="description">Instantly analyze any link for malware, phishing attempts, and suspicious content.</p>

        <div class="input-button-row">
          <div class="input-container">
            <input
              v-model="inputUrl"
              type="url"
              placeholder="example-url.com"
              class="url-input"
              @keyup.enter="checkUrlSafety"
              :disabled="isLoading"
            />
          </div>
          <button
            class="check-button"
            @click="checkUrlSafety"
            :disabled="isLoading || !inputUrl.trim()"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Checking...' : 'Check URL' }}
          </button>
        </div>

        <p class="footer-text">
          Add your link or paste it from the device's clipboard. Your data is processed by our
          <a href="#" class="privacy-link">privacy policy.</a>
        </p>
      </div>
    </div>

    <div v-if="error" class="error-container">
      <div class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>

    <div v-if="results && !error" class="results-container">
      <div class="result-header">
        <h3>Safety Check Results</h3>
        <span :class="['result-status', results.is_safe ? 'safe' : 'unsafe']">
          {{ results.is_safe ? '✅ Safe' : '❌ Potentially Unsafe' }}
        </span>
      </div>

      <div class="result-details">
        <div class="result-item">
          <strong>Risk Level:</strong>
          <span :class="['risk-level', results.is_safe ? 'safe' : 'unsafe']">
            {{ getRiskLevel() }}
          </span>
        </div>
        <div class="result-item">
          <strong>Analysis:</strong> {{ getAnalysisText() }}
        </div>
        <div v-if="results.blacklisted !== undefined" class="result-item">
          <strong>Blacklisted:</strong>
          <span :class="results.blacklisted ? 'text-danger' : 'text-success'">
            {{ results.blacklisted ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>

      <div v-if="results.details" class="domain-details">
        <h4>Domain Information</h4>
        <div class="detail-grid">
          <div v-if="results.details.domain_name" class="detail-item">
            <strong>Domain:</strong> {{ results.details.domain_name }}
          </div>
          <div v-if="results.details.registrar" class="detail-item">
            <strong>Registrar:</strong> {{ results.details.registrar }}
          </div>
        </div>
      </div>

      <div v-if="results.matches?.length" class="threat-matches">
        <h4>Security Matches</h4>
        <div class="matches-list">
          <div v-for="match in results.matches" :key="match.threatType" class="match-item">
            <strong>Threat Type:</strong> {{ match.threatType }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LinkSafetySection',
  data() {
    return {
      inputUrl: '',
      results: null,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async checkUrlSafety() {
      if (!this.inputUrl.trim()) {
        this.error = 'Please enter a valid URL format (e.g., https://example.com)';
        return;
      }

      try {
        new URL(this.inputUrl.trim());
      } catch {
        this.error = 'Please enter a valid URL format (e.g., https://example.com)';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.results = null;

      try {
        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/validate/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFTOKEN': 'DBAoITRog95H98YQPPDR93kkNCX1ZCfwB8nTPSBX2H16EY3osrdZ6lUoH2dxQniA'
          },
          body: JSON.stringify({ url: this.inputUrl.trim() })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.results = await response.json();
      } catch {
        this.error = 'Please enter a valid URL format (e.g., https://example.com)';
      } finally {
        this.isLoading = false;
      }
    },

    getRiskLevel() {
      if (!this.results) return 'Unknown';
      if (this.results.blacklisted) return 'High';
      if (!this.results.is_safe) return 'Medium';
      if (this.results.matches?.length) return 'Low-Medium';
      return 'Low';
    },

    getAnalysisText() {
      if (!this.results) return 'No analysis available';
      if (this.results.blacklisted) return 'This URL is blacklisted and should be avoided.';
      if (!this.results.is_safe) return 'This URL has been flagged as potentially unsafe. Exercise caution when visiting.';
      if (this.results.matches?.length) return `URL matched security database entries. Review carefully before proceeding.`;
      return 'This URL appears to be safe based on our analysis.';
    }
  }
}
</script>

<style scoped>
.link-safety-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem 2rem;
  min-height: 90vh;
}

.background-pattern {
  height: 40vh;
  background: var(--forest-deep);
  border-radius: 24px;
  z-index: 1;
  margin: 6vh auto 2rem auto;
  width: 100%;
  max-width: 1600px;
}

.main-card {
  position: relative;
  z-index: 2;
  background: var(--forest-light);
  border-radius: 24px;
  padding: 3rem;
  max-width: 1200px;
  width: 100%;
  box-shadow: 0 12px 40px var(--shadow-dark);
  text-align: center;
  margin-top: -35vh;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.top-text {
  font-size: 1.125rem;
  color: var(--forest-medium);
  margin: 0;
  font-weight: 500;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--forest-deep);
  margin: 0;
  line-height: 1.2;
}

.description {
  font-size: 1.25rem;
  color: var(--forest-dark);
  margin: 0 auto;
  max-width: 1000px;
  line-height: 1.5;
}

.input-button-row {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}

.input-container {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.url-input {
  width: 100%;
  min-width: 0;
  padding: 1rem 1.25rem;
  border: 2px solid var(--forest-sage);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;
}

.url-input:focus {
  outline: none;
  border-color: var(--forest-deep);
}

.url-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}



.check-button {
  padding: 1rem 2rem;
  background: var(--forest-deep);
  color: var(--forest-light);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  max-width: 200px;
  justify-content: center;
}

.check-button:hover:not(:disabled) {
  background: var(--forest-dark);
}

.check-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--forest-medium);
  margin: 0;
  line-height: 1.4;
}

.privacy-link {
  color: var(--forest-deep);
  text-decoration: none;
  font-weight: 500;
}

.privacy-link:hover {
  text-decoration: underline;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-container, .results-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin-top: 2rem;
}

.error-message {
  background: var(--forest-light);
  color: var(--forest-deep);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid var(--forest-sage);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px var(--shadow-medium);
}

.error-icon {
  font-size: 1.2rem;
}

.results-container {
  background: var(--forest-light);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-medium);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--forest-sage);
}

.result-header h3 {
  font-size: 1.5rem;
  color: var(--forest-dark);
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

.result-status.unsafe {
  background: #f8d7da;
  color: #721c24;
}

.result-details {
  margin-bottom: 2rem;
}

.result-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--forest-sage);
  border-radius: 8px;
}

.result-item strong {
  color: var(--forest-dark);
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

.risk-level.unsafe {
  background: #f8d7da;
  color: #721c24;
}

.text-danger {
  color: #721c24;
  font-weight: 600;
}

.text-success {
  color: #155724;
  font-weight: 600;
}

.domain-details, .threat-matches {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--forest-sage);
}

.domain-details h4, .threat-matches h4 {
  font-size: 1.25rem;
  color: var(--forest-dark);
  margin-bottom: 1rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  padding: 0.75rem;
  background: var(--forest-sage);
  border-radius: 8px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-item {
  padding: 1rem;
  background: var(--forest-sage);
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

@media (max-width: 768px) {
  .link-safety-section {
    padding: 1rem;
  }

  .main-card {
    padding: 2rem 1.5rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .description {
    font-size: 1.125rem;
  }

  .input-button-row {
    flex-direction: column;
    width: 100%;
  }

  .input-container {
    width: 100%;
  }

  .check-button {
    min-width: auto;
    width: 100%;
    max-width: none;
  }

  .background-pattern {
    height: 75vh;
  }

  .result-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .background-pattern {
    height: 80vh;
  }

  .main-card {
    padding: 1.5rem 1rem;
    margin-top: -1rem;
  }

  .main-title {
    font-size: 1.75rem;
  }
}
</style>
