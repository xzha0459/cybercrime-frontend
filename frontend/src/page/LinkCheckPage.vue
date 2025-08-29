<template>
  <div class="link-check-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Link Safety Checker</h1>
        <p class="page-subtitle">Verify the safety of links before visiting websites</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- US 1.1 Section -->
        <LinkSafetySection />
      </div>
    </div>
  </div>
</template>

<script>
import LinkSafetySection from '../section/LinkCheckPage/LinkSafetySection.vue'

export default {
  name: 'LinkCheckPage',
  components: {
    LinkSafetySection
  }
}
</script>

<style scoped>
.link-check-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.page-header {
  background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-deep) 100%);
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
  max-width: 600px;
  margin: 0 auto;
}

.page-content {
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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
}
</style>

