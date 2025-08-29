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
              v-model="inputUrl"
              type="url"
              placeholder="https://example.com"
              class="url-input"
              @keyup.enter="checkUrlSafety"
              :disabled="isLoading"
            />
            <button 
              class="check-btn"
              @click="checkUrlSafety"
              :disabled="isLoading || !inputUrl.trim()"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              {{ isLoading ? 'Checking...' : 'Check Safety' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-container">
        <div class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </div>

      <!-- Results Display -->
      <div v-if="results && !error" class="results-container">
        <div class="result-header">
          <h3>Safety Check Results</h3>
          <span :class="['result-status', getStatusClass()]">
            {{ getStatusIcon() }} {{ getStatusText() }}
          </span>
        </div>

        <div class="result-details">
          <div class="result-item">
            <strong>URL:</strong> {{ results.url }}
          </div>
          <div class="result-item">
            <strong>Risk Level:</strong>
            <span :class="['risk-level', getRiskLevelClass()]">
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

        <!-- Domain Details -->
        <div v-if="results.details" class="domain-details">
          <h4 class="details-title">Domain Information</h4>
          <div class="detail-grid">
            <div v-if="results.details.domain_name" class="detail-item">
              <strong>Domain:</strong> {{ results.details.domain_name }}
            </div>
            <div v-if="results.details.registrar" class="detail-item">
              <strong>Registrar:</strong> {{ results.details.registrar }}
            </div>
            <div v-if="results.details.name_servers && results.details.name_servers.length" class="detail-item">
              <strong>Name Servers:</strong>
              <ul class="name-servers-list">
                <li v-for="server in results.details.name_servers" :key="server">{{ server }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Threat Matches -->
        <div v-if="results.matches && results.matches.length" class="threat-matches">
          <h4 class="details-title">Security Matches</h4>
          <div class="matches-list">
            <div v-for="(match, index) in results.matches" :key="index" class="match-item">
              <div class="match-header">
                <strong>Threat Type:</strong> {{ match.threatType }}
              </div>
              <div class="match-details">
                <span><strong>Platform:</strong> {{ match.platformType }}</span>
                <span><strong>Entry Type:</strong> {{ match.threatEntryType }}</span>
              </div>
            </div>
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
        this.error = 'Please enter a valid URL';
        return;
      }

      // Basic URL validation
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
          body: JSON.stringify({
            url: this.inputUrl.trim()
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.results = data;
      } catch (err) {
        this.error = `Failed to check URL safety: ${err.message}`;
        console.error('API Error:', err);
      } finally {
        this.isLoading = false;
      }
    },

    getStatusClass() {
      if (!this.results) return '';
      return this.results.is_safe ? 'safe' : 'unsafe';
    },

    getStatusIcon() {
      if (!this.results) return '';
      return this.results.is_safe ? '✅' : '❌';
    },

    getStatusText() {
      if (!this.results) return 'Unknown';
      return this.results.is_safe ? 'Safe' : 'Potentially Unsafe';
    },

    getRiskLevelClass() {
      if (!this.results) return '';
      return this.results.is_safe ? 'safe' : 'unsafe';
    },

    getRiskLevel() {
      if (!this.results) return 'Unknown';
      
      if (this.results.blacklisted) return 'High';
      if (!this.results.is_safe) return 'Medium';
      if (this.results.matches && this.results.matches.length > 0) return 'Low-Medium';
      return 'Low';
    },

    getAnalysisText() {
      if (!this.results) return 'No analysis available';
      
      if (this.results.blacklisted) {
        return 'This URL is blacklisted and should be avoided.';
      }
      
      if (!this.results.is_safe) {
        return 'This URL has been flagged as potentially unsafe. Exercise caution when visiting.';
      }
      
      if (this.results.matches && this.results.matches.length > 0) {
        const threatTypes = this.results.matches.map(m => m.threatType).join(', ');
        return `URL matched security database entries: ${threatTypes}. Review carefully before proceeding.`;
      }
      
      return 'This URL appears to be safe based on our analysis.';
    }
  }
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

.url-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check-btn:hover:not(:disabled) {
  background: var(--forest-dark);
}

.check-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.error-container {
  max-width: 800px;
  margin: 0 auto 2rem auto;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1.2rem;
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
  border-top: 1px solid var(--border-light);
}

.details-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.detail-grid {
  display: grid;
  gap: 1rem;
}

.detail-item {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.name-servers-list {
  margin: 0.5rem 0 0 1rem;
  padding: 0;
}

.name-servers-list li {
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.match-header {
  margin-bottom: 0.5rem;
}

.match-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
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

  .match-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>