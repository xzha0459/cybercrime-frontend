<template>
  <section class="infographic-section">
    <!-- 修改header结构 -->
    <div class="section-header">
      <h2 class="section-title">Data Insights</h2>
      <!-- <p class="section-description">
        Here's what happened in the past 28 days - Real-time data insights and threat analysis
      </p> -->
    </div>

    <div class="section-content">
      <!-- Multi-dimensional Cybercrime Victimization Rate Analysis Heatmap -->
      <TypeRate />

      <!-- Cybercrime Type Analysis Combo Chart -->
      <EconomicLoss />

      <!-- Financial Loss Comparison Radar Chart -->
      <!-- <RadarChart /> -->

      <!-- Financial Loss Waterfall Analysis -->
      <!-- <WaterfallChart /> -->

      <!-- Financial Impact Comparison Grouped Bar Chart -->
      <!-- <GroupedBarChart /> -->
    </div>
  </section>
</template>

<script>
import TypeRate from '@/components/Visualization/TypeRate.vue'
import EconomicLoss from '@/components/Visualization/EconomicLoss.vue'

export default {
  name: 'InfographicSection',
  components: {
    TypeRate,
    'EconomicLoss': EconomicLoss,

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
/* 基础样式结构 */


.section-header {
  text-align: center;
  position: relative;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  /* margin-bottom: 0.25rem; */
}

.section-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .infographic-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
