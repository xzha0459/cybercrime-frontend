<template>
  <div class="support-page">
    <div class="container">
      <div class="support-header">
        <h1>Support Center</h1>
        <p>Get help and support for GuardU</p>
      </div>

      <div class="support-content">
        <div class="support-section">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>How do I create an account?</h3>
              <p>Click on "Sign Up" in the navigation bar and follow the registration process.</p>
            </div>
            <div class="faq-item">
              <h3>How do I take a cybersecurity challenge?</h3>
              <p>Go to the Challenge section from the Activity dropdown menu and select a challenge level.</p>
            </div>
            <div class="faq-item">
              <h3>How do I check if a link is safe?</h3>
              <p>Use the Link Check feature from the Activity dropdown menu to analyze any suspicious links.</p>
            </div>
          </div>
        </div>

        <div class="support-section">
          <h2>Contact Us</h2>
          <div class="contact-info">
            <div class="contact-item">
              <h3>Email Support</h3>
              <p>support@guardu.com</p>
            </div>
            <div class="contact-item">
              <h3>Response Time</h3>
              <p>We typically respond within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SupportPage'
}
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.support-header {
  text-align: center;
  margin-bottom: 3rem;
}

.support-header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.support-header p {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

.support-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.support-section {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-light);
}

.support-section h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.faq-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.faq-item h3 {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.faq-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.contact-item {
  margin-bottom: 1.5rem;
}

.contact-item h3 {
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-item p {
  color: var(--text-secondary);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .support-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .container {
    padding: 0 1rem;
  }

  .support-header h1 {
    font-size: 2rem;
  }

  .support-section {
    padding: 1.5rem;
  }
}
</style>
