<template>
  <div class="infographic-page">
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Cybercrime Infographic</h1>
        <p class="page-subtitle">Explore real-time cybercrime data through interactive visualizations and charts</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <section class="infographic-section">
          <div class="section-content">
            <!-- Financial Impact Comparison Grouped Bar Chart -->
            <GroupedBarChart />

            <!-- Cybercrime Victimization Rate Heatmap by Age Group -->
            <HeatmapChart />
          </div>
        </section>
      </div>
    </div>
    <FooterSection />
  </div>
</template>

<script>

// import RadarChart from '@/components/Visualization/Radarchart.vue'
import GroupedBarChart from '@/components/Visualization/GroupedBarChart.vue'
import HeatmapChart from '@/components/Visualization/Heatmap.vue'
import FooterSection from '../section/HomePage/FooterSection.vue'

export default {
  name: 'InfographicSection',
  components: {
    // RadarChart,
    GroupedBarChart,
    HeatmapChart,
    FooterSection
  },
  data() {
    return {
      // Keep loading state for child components
      loading: false
    }
  }
}
</script>

<style scoped>
.infographic-page {
  background-color: var(--violet-light);
}

.page-header {
  background: var(--violet-dark);
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
  max-width: 1000px;
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

.infographic-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.section-content {
  /* 保持原有的内容样式 */
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

  .infographic-section {
    padding: 0;
  }
}
</style>
