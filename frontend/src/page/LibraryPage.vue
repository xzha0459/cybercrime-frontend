<template>
  <div class="library-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Educational Library</h1>
        <p class="page-subtitle">Access cybersecurity videos, articles, and infographics to enhance your digital safety knowledge</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <!-- US 3.1 Section - Resource -->
        <ResourceSection />

        <!-- US 3.2 Section - Infographic -->
        <InfographicSection />
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script>
import ResourceSection from '../section/LibraryPage/ResourceSection.vue'
import InfographicSection from '../section/LibraryPage/InfographicSection.vue'
import FooterSection from '../section/HomePage/FooterSection.vue'

export default {
  name: 'LibraryPage',
  components: {
    ResourceSection,
    InfographicSection,
    FooterSection
  }
}
</script>

<style scoped>
.library-page {
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
  max-width: 700px;
  margin: 0 auto;
}

.page-content {
  padding: 4rem 0;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 8rem;
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
