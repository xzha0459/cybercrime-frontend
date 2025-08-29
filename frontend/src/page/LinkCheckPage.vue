<template>
  <div class="link-check-page">
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
}

.page-content {
  padding: 0;
}

.container {
  max-width: 2000px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}
</style>

