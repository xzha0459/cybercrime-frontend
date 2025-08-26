<template>
  <section class="infographic-section">
    <div class="section-header">
      <h2 class="section-title">Infographics</h2>
      <p class="section-description">
        Visual guides to common online scams and cybersecurity risks - perfect for quick learning
      </p>
    </div>

    <div class="section-content">
      <!-- Infographic Grid -->
      <div class="infographic-grid">
        <!-- Infographic 1 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">📊</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Phishing Scam Red Flags</h3>
            <p class="infographic-description">Visual guide to identify common phishing email warning signs</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">2.3 MB</span>
            </div>
          </div>
        </div>

        <!-- Infographic 2 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">🛡️</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Password Security Checklist</h3>
            <p class="infographic-description">Step-by-step guide to creating and managing secure passwords</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">1.8 MB</span>
            </div>
          </div>
        </div>

        <!-- Infographic 3 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">🔒</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Social Media Privacy Settings</h3>
            <p class="infographic-description">Visual walkthrough of privacy settings for major platforms</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">2.1 MB</span>
            </div>
          </div>
        </div>

        <!-- Infographic 4 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">📱</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Mobile Device Security</h3>
            <p class="infographic-description">Essential security measures for smartphones and tablets</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">1.9 MB</span>
            </div>
          </div>
        </div>

        <!-- Infographic 5 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">💳</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Online Shopping Safety</h3>
            <p class="infographic-description">How to spot fake websites and protect your payment information</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">2.5 MB</span>
            </div>
          </div>
        </div>

        <!-- Infographic 6 -->
        <div class="infographic-card">
          <div class="infographic-preview">
            <div class="preview-image">
              <div class="image-placeholder">🌐</div>
            </div>
            <div class="download-overlay">
              <button class="download-btn">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">Public WiFi Security</h3>
            <p class="infographic-description">Stay safe when using public wireless networks</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">2.0 MB</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  </section>
</template>

<script>
export default {
  name: 'InfographicSection'
}
</script>

<style scoped>
.infographic-section {
  padding: 3rem 0;
  margin-bottom: 3rem;
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

.infographic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.infographic-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px var(--shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.infographic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px var(--shadow-medium);
}

.infographic-preview {
  height: 250px;
  background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-deep) 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.download-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.infographic-card:hover .download-overlay {
  opacity: 1;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--forest-deep);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background: var(--forest-dark);
}

.download-icon {
  font-size: 1.25rem;
}

.infographic-content {
  padding: 1.5rem;
}

.infographic-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.infographic-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.infographic-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.format-option {
  background: var(--forest-medium);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.format-option:hover {
  background: var(--forest-deep);
}

.file-size {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: auto;
}

@media (max-width: 768px) {
  .infographic-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .infographic-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
