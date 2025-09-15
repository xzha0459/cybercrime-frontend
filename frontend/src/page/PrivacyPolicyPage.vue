<template>
  <div class="privacy-policy-page">
    <div class="container">
      <div class="content-wrapper">
        <h1 class="page-title">Privacy Policy</h1>

        <div class="policy-content">
          <div class="policy-section">
            <h2 class="section-title">URL Safety Checker</h2>
            <p class="last-updated">Last updated: September 15, 2025</p>
          </div>

          <div class="policy-section">
            <p class="intro-text">Hey there!</p>
            <p class="intro-text">We know privacy policies can be boring, so we'll keep this short and sweet.</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">What We Do</h3>
            <p>Our URL safety checker helps you stay safe online by analyzing links for malware, phishing attempts, and suspicious content before you click them.</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">What We DON'T Collect</h3>
            <p>We don't collect, store, or track any of your personal information. That means:</p>
            <ul class="no-collect-list">
              <li>No names, emails, or phone numbers</li>
              <li>No browsing history</li>
              <li>No location data</li>
              <li>No cookies or tracking pixels</li>
              <li>No account creation required</li>
            </ul>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">What Happens to Your URLs</h3>
            <p>When you check a URL:</p>
            <ol class="url-process-list">
              <li>We analyze it in real-time for safety</li>
              <li>We give you the results</li>
              <li>We forget about it completely</li>
            </ol>
            <p>Your URLs are processed temporarily just to check if they're safe, then immediately discarded. We don't store them anywhere.</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">How We Keep You Safe</h3>
            <p>We use industry-standard security measures to protect our service, but since we don't collect your data anyway, there's nothing personal to protect!</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">Third Parties</h3>
            <p>We don't share anything with third parties because, well, we don't have anything to share.</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">Changes to This Policy</h3>
            <p>If we ever change this policy (spoiler: we probably won't need to), we'll update the date at the top.</p>
          </div>

          <div class="policy-section">
            <h3 class="subsection-title">Questions?</h3>
            <p>Got questions about our privacy practices? Feel free to reach out - though honestly, there's not much more to explain since we literally collect nothing!</p>
          </div>

          <div class="policy-section highlight-section">
            <p class="highlight-text">We check if your links are safe, then forget they ever existed. Your privacy = protected.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Privacy Policy page component
</script>

<style scoped>
.privacy-policy-page {
  background: var(--bg-primary);
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-wrapper {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--violet-dark);
  margin: 0 0 2rem 0;
  text-align: center;
}

.policy-content {
  line-height: 1.6;
}

.policy-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--violet-dark);
  margin: 0 0 0.5rem 0;
}

.last-updated {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0 0 2rem 0;
}

.intro-text {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.subsection-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--violet-dark);
  margin: 0 0 1rem 0;
}

.policy-section p {
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.no-collect-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.no-collect-list li {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.url-process-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.url-process-list li {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.highlight-section {
  margin-top: 2rem;
  text-align: center;
}

.highlight-text {
  color: var(--violet-dark);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  border-bottom: 3px solid var(--violet-dark);
  display: inline-block;
}

/* Responsive Design */
@media (max-width: 768px) {
  .privacy-policy-page {
    padding: 2rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .content-wrapper {
    padding: 2rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .subsection-title {
    font-size: 1.1rem;
  }
}
</style>
