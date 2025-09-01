<template>
  <div class="link-check-page">
    <div class="page-content">
      <div class="container">
        <!-- US 1.1 Section -->
        <LinkSafetySection />
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script>
import LinkSafetySection from '../section/LinkCheckPage/LinkSafetySection.vue'
import FooterSection from '../section/HomePage/FooterSection.vue'

export default {
  name: 'LinkCheckPage',
  components: {
    LinkSafetySection,
    FooterSection
  }
}
</script>

<style scoped>
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

