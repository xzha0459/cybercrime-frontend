<template>
  <section class="content-analysis-section">
    <div class="section-header">
      <h2 class="section-title">Content Analysis</h2>
      <p class="section-description">
        Analyze webpage content for suspicious text, forms, and potential threats when you explicitly request it
      </p>
    </div>

    <div class="section-content">
      <!-- Extension Status -->
      <div class="extension-status">
        <div class="status-indicator">
          <div class="status-dot active"></div>
          <span class="status-text">
            Extension Active
          </span>
        </div>
        <p class="status-description">
          Content analysis is available on this page. Click "Analyze Content" to perform a scan.
        </p>
      </div>

      <!-- Analysis Controls -->
      <div class="analysis-controls">
        <div class="control-group">
          <button class="analyze-btn">
            <span class="btn-icon">🔍</span>
            Analyze Content
          </button>
          <p class="control-note">
            This will perform a one-time scan of the current page content
          </p>
        </div>
      </div>

      <!-- Analysis Results -->
      <div class="analysis-results">
        <div class="results-header">
          <h3>Content Analysis Results</h3>
          <span class="scan-timestamp">
            Scanned at: 2:30:45 PM
          </span>
        </div>

        <!-- Security Score -->
        <div class="security-score">
          <div class="score-circle excellent">
            <span class="score-number">85</span>
            <span class="score-label">/100</span>
          </div>
          <div class="score-details">
            <h4>Security Score</h4>
            <p>Excellent - Very low risk detected</p>
          </div>
        </div>

        <!-- Issues Found -->
        <div class="issues-section">
          <h4>Issues Found: 0</h4>

          <div class="no-issues">
            <div class="success-icon">✅</div>
            <p>No suspicious content detected. This page appears to be safe.</p>
          </div>
        </div>

        <!-- Scan Summary -->
        <div class="scan-summary">
          <h4>Scan Summary</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Text Analyzed:</span>
              <span class="summary-value">3,245 characters</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Forms Detected:</span>
              <span class="summary-value">2</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Links Found:</span>
              <span class="summary-value">15</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Scan Duration:</span>
              <span class="summary-value">1,250ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContentAnalysisSection'
}
</script>

<style scoped>
.content-analysis-section {
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
  max-width: 700px;
  margin: 0 auto;
}

.extension-status {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 2px 12px var(--shadow-light);
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--forest-muted);
  transition: background-color 0.3s ease;
}

.status-dot.active {
  background: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.4);
}

.status-text {
  font-weight: 600;
  color: var(--text-primary);
}

.status-description {
  color: var(--text-secondary);
  margin: 0;
}

.analysis-controls {
  text-align: center;
  margin-bottom: 3rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.analyze-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: var(--forest-deep);
  color: var(--text-light);
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-medium);
}

.analyze-btn:hover {
  background: var(--forest-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-dark);
}

.btn-icon {
  font-size: 1.25rem;
}

.control-note {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.analysis-results {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px var(--shadow-light);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-light);
}

.results-header h3 {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin: 0;
}

.scan-timestamp {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.security-score {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.score-circle.excellent { background: #28a745; }

.score-number {
  font-size: 1.5rem;
  line-height: 1;
}

.score-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.score-details h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.score-details p {
  margin: 0;
  color: var(--text-secondary);
}

.issues-section {
  margin-bottom: 2rem;
}

.issues-section h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.no-issues {
  text-align: center;
  padding: 2rem;
  background: #d4edda;
  border-radius: 8px;
  color: #155724;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.scan-summary {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.scan-summary h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 6px;
}

.summary-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .content-analysis-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .security-score {
    flex-direction: column;
    text-align: center;
  }

  .results-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>

