<template>
  <section class="infographic-section">
    <!-- 修改header结构 -->
    <div class="section-header">
      <h2 class="section-title">Cybersecurity Overview</h2>
      <p class="section-description">
        Here's what happened in the past 28 days - Real-time data insights and threat analysis
      </p>
    </div>

    <div class="section-content">




            <!-- Age Group Cybercrime Victimization Analysis Combo Chart -->
      <div class="combo-chart-section">
        <div class="chart-header">
          <h3 class="chart-title">Age Group Cybercrime Victimization Analysis</h3>
          <p class="chart-description">Comparison of victim case counts and victimization rates across different age groups (2024 data)</p>
          </div>

        <div class="chart-container" v-if="!loading">
                    <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color bar-color"></div>
              <span>Case Count</span>
          </div>
            <div class="legend-item">
              <div class="legend-color line-color"></div>
              <span>Average Victimization Rate (%)</span>
        </div>
      </div>

          <div class="chart-content">
            <!-- Y-axis labels -->
                        <div class="y-axis left-axis">
              <div class="axis-label">Case Count</div>
              <div class="axis-ticks">
                <div v-for="tick in ageGroupLeftAxisTicks" :key="tick" class="tick">{{ tick }}</div>
              </div>
            </div>

            <div class="y-axis right-axis">
              <div class="axis-label">Victimization Rate (%)</div>
              <div class="axis-ticks">
                <div v-for="tick in ageGroupRightAxisTicks" :key="tick" class="tick">{{ tick }}%</div>
            </div>
            </div>

                        <!-- Chart main area -->
            <div class="chart-main">
              <!-- Bar chart -->
              <div class="bars-container">
                <div v-for="(data, index) in ageGroupChartData" :key="'bar-' + index" class="bar-wrapper">
                  <div class="bar"
                       :style="{
                         height: getAgeGroupBarHeight(data.caseCount) + '%',
                         animationDelay: (index * 0.3) + 's'
                       }">
                    <div class="bar-value">{{ data.caseCount }}</div>
          </div>
            </div>
          </div>

              <!-- Line chart -->
              <div class="line-container">
                <svg class="line-chart" viewBox="0 0 500 200">
                  <!-- Grid lines -->
                  <defs>
                    <pattern id="ageGrid" width="100" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" stroke-width="1" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#ageGrid)" />

                  <!-- Line path -->
                  <path :d="ageGroupLinePath"
                        class="line-path"
                        fill="none"
                        stroke="#EF4444"
                        stroke-width="3"/>

                  <!-- Data points -->
                  <circle v-for="(point, index) in ageGroupLinePoints"
                          :key="'point-' + index"
                          :cx="point.x"
                          :cy="point.y"
                          r="6"
                          class="line-point"
                          :style="{ animationDelay: (index * 0.4) + 's' }">
                    <title>{{ ageGroupChartData[index].ageGroup }}: {{ ageGroupChartData[index].avgVictimRate.toFixed(1) }}% victimization rate</title>
                  </circle>
                </svg>
              </div>
        </div>

            <!-- X-axis labels -->
            <div class="x-axis">
              <div v-for="data in ageGroupChartData" :key="data.ageGroup" class="x-label">
                <div class="age-group">{{ data.ageGroup }}</div>
                <div class="age-detail">{{ data.ageDetail }}</div>
            </div>
            </div>
          </div>

                    <!-- Data summary -->
          <div class="chart-summary">
            <div class="summary-item">
              <div class="summary-value">{{ ageGroupTotalCases.toLocaleString() }}</div>
              <div class="summary-label">Total Cases</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ ageGroupOverallAvgRate.toFixed(1) }}%</div>
              <div class="summary-label">Overall Average Victimization Rate</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ ageGroupHighestRiskGroup.ageGroup }}</div>
              <div class="summary-label">Highest Risk Age Group</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ ageGroupMostCasesGroup.ageGroup }}</div>
              <div class="summary-label">Most Cases Age Group</div>
          </div>
        </div>

                    <!-- Detailed data table -->
          <div class="data-table">
            <h4>Detailed Data by Age Group</h4>
            <table>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Case Count</th>
                  <th>Average Victimization Rate (%)</th>
                  <th>Percentage of Total (%)</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in ageGroupSortedChartData" :key="data.ageGroup">
                  <td>
                    <strong>{{ data.ageGroup }}</strong>
                    <br><small>{{ data.ageDetail }}</small>
                  </td>
                  <td>{{ data.caseCount.toLocaleString() }}</td>
                  <td>{{ data.avgVictimRate.toFixed(1) }}%</td>
                  <td>{{ ((data.caseCount / ageGroupTotalCases) * 100).toFixed(1) }}%</td>
                  <td>
                    <span class="risk-badge" :class="getAgeGroupRiskLevel(data.avgVictimRate)">
                      {{ getAgeGroupRiskLevelText(data.avgVictimRate) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

                    <!-- Insights analysis -->
          <div class="insights-section">
            <h4>Data Insights</h4>
            <div class="insights-grid">
              <div class="insight-card">
                <h5>Risk Trends</h5>
                <p>{{ ageGroupRiskTrendInsight }}</p>
            </div>
              <div class="insight-card">
                <h5>Case Distribution</h5>
                <p>{{ ageGroupCaseDistributionInsight }}</p>
          </div>
              <div class="insight-card">
                <h5>Prevention Recommendations</h5>
                <p>{{ ageGroupPreventionRecommendation }}</p>
              </div>
            </div>
          </div>
        </div>

                <div v-else class="loading-state">
          <div class="loading-spinner"></div>
          <p>Analyzing age group data...</p>
            </div>
            </div>

      <!-- Multi-dimensional Cybercrime Victimization Rate Analysis Heatmap -->
      <div class="heatmap-section">
        <div class="header">
          <h3>Multi-dimensional Cybercrime Victimization Rate Analysis</h3>
          <p>Comparison of victimization rates across different demographics in various cybercrime types (2024 data)</p>
        </div>

        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading data...</p>
        </div>

        <div v-else-if="hasError" class="error-state">
          <div class="error-icon">⚠️</div>
          <h4>Data Loading Failed</h4>
          <p>Unable to fetch victimization data, please try again later</p>
          <button @click="fetchVictimisationData" class="retry-btn">Retry</button>
        </div>

        <div v-else class="heatmaps-container">
          <!-- Filter controls -->
          <div class="filter-controls">
            <div class="filter-group">
              <label for="sme-filter">SME Status:</label>
              <select id="sme-filter" v-model="smeFilter" @change="updateHeatmapData">
                <option value="all">All</option>
                <option value="sme_owner">SME Owner</option>
                <option value="non_sme_owner">Non-SME Owner</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="gender-filter">Gender:</label>
              <select id="gender-filter" v-model="genderFilter" @change="updateHeatmapData">
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <!-- Multiple heatmap grid layout -->
          <div class="heatmaps-grid">
            <div v-for="crime in crimeTypes" :key="crime.key" class="heatmap-card">
              <div class="heatmap-header">
                <h4>{{ crime.name }}</h4>
                <p>{{ crime.description }}</p>
              </div>

              <table class="heatmap-table">
                <thead>
                  <tr>
                    <th class="row-header">Demographic Group</th>
                    <th>Victimization Rate (%)</th>
                    <th>Risk Level</th>
                    <th>Percentage (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="group in demographicGroups" :key="group.key">
                    <td class="row-header">{{ group.name }}</td>
                    <td class="heat-cell"
                        :class="getHeatClass(getVictimRate(group.key, crime.key))"
                        :title="`${group.name} victimization rate in ${crime.name}: ${getVictimRate(group.key, crime.key).toFixed(1)}%`">
                      {{ getVictimRate(group.key, crime.key).toFixed(1) }}%
                    </td>
                    <td class="risk-cell">
                      <span class="risk-badge" :class="getRiskLevel(getVictimRate(group.key, crime.key))">
                        {{ getRiskLevelText(getVictimRate(group.key, crime.key)) }}
                      </span>
                    </td>
                    <td class="percentage">{{ getPercentage(group.key, crime.key).toFixed(1) }}%</td>
                  </tr>
                </tbody>
              </table>

              <div class="heatmap-summary">
                <div class="summary-item">
                  <span class="label">Highest Risk:</span>
                  <span class="value">{{ getHighestRiskGroup(crime.key).name }}</span>
                </div>
                <div class="summary-item">
                  <span class="label">Average Victimization Rate:</span>
                  <span class="value">{{ getAverageRate(crime.key).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Global legend -->
          <div class="global-legend">
            <span class="legend-title">Victimization Rate Level:</span>
            <div class="legend-items">
              <div class="legend-item">
                <div class="color-box low"></div>
                <span>Low Risk (0-15%)</span>
              </div>
              <div class="legend-item">
                <div class="color-box medium"></div>
                <span>Medium Risk (15-25%)</span>
              </div>
              <div class="legend-item">
                <div class="color-box high"></div>
                <span>High Risk (25%+)</span>
              </div>
            </div>
          </div>

          <!-- Overall data summary -->
          <div class="overall-summary">
            <h4>Overall Data Summary</h4>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="value">{{ overallHighestRisk.group }}</div>
                <div class="label">Highest Risk Group</div>
              </div>
              <div class="summary-card">
                <div class="value">{{ overallMostDangerous.crime }}</div>
                <div class="label">Most Dangerous Crime Type</div>
              </div>
              <div class="summary-card">
                <div class="value">{{ overallAverage.toFixed(1) }}%</div>
                <div class="label">Overall Average Victimization Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cybercrime Type Analysis Combo Chart -->
      <div class="combo-chart-section">
        <div class="chart-header">
          <h3 class="chart-title">Cybercrime Type Analysis</h3>
          <p class="chart-description">Comparison of economic losses and victimization rates across different crime types</p>
          </div>

        <div class="chart-container" v-if="!loading">
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color line-color"></div>
              <span>Average Victimization Rate (%)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color bar-color"></div>
              <span>Economic Loss (Million USD)</span>
          </div>
        </div>

          <div class="chart-content">
                        <!-- Y-axis labels -->
            <div class="y-axis left-axis">
              <div class="axis-label">Economic Loss (M$)</div>
              <div class="axis-ticks">
                <div v-for="tick in leftAxisTicks" :key="tick" class="tick">{{ tick }}</div>
            </div>
            </div>

            <div class="y-axis right-axis">
              <div class="axis-label">Victimization Rate (%)</div>
              <div class="axis-ticks">
                <div v-for="tick in rightAxisTicks" :key="tick" class="tick">{{ tick }}%</div>
              </div>
            </div>

            <!-- Chart main area -->
            <div class="chart-main">
              <!-- Bar chart -->
              <div class="bars-container">
                <div v-for="(data, index) in chartData" :key="'bar-' + index" class="bar-wrapper">
                  <div class="bar"
                       :style="{
                         height: getBarHeight(data.loss) + '%',
                         animationDelay: (index * 0.2) + 's'
                       }">
                    <div class="bar-value">${{ data.loss }}M</div>
          </div>
                  <div class="bar-label">{{ data.shortName }}</div>
          </div>
        </div>

              <!-- Line chart -->
              <div class="line-container">
                <svg class="line-chart" viewBox="0 0 600 200">
                  <!-- Grid lines -->
                  <defs>
                    <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" stroke-width="1" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  <!-- Line path -->
                  <path :d="linePath"
                        class="line-path"
                        fill="none"
                        stroke="#EF4444"
                        stroke-width="3"/>

                  <!-- Data points -->
                  <circle v-for="(point, index) in linePoints"
                          :key="'point-' + index"
                          :cx="point.x"
                          :cy="point.y"
                          r="6"
                          class="line-point"
                          :style="{ animationDelay: (index * 0.3) + 's' }">
                    <title>{{ chartData[index].name }}: {{ chartData[index].victimRate.toFixed(1) }}%</title>
                  </circle>
                </svg>
            </div>
            </div>

            <!-- X-axis labels -->
            <div class="x-axis">
              <div v-for="data in chartData" :key="data.name" class="x-label">
                {{ data.shortName }}
            </div>
          </div>
        </div>

                    <!-- Data Summary -->
          <div class="chart-summary">
            <div class="summary-item">
              <div class="summary-value">${{ totalLoss.toFixed(1) }}M</div>
              <div class="summary-label">Total Economic Loss</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ averageVictimRate.toFixed(1) }}%</div>
              <div class="summary-label">Average Victimization Rate</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ mostDangerous.name }}</div>
              <div class="summary-label">Highest Risk Type</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">{{ costliestCrime.name }}</div>
              <div class="summary-label">Highest Loss Type</div>
            </div>
          </div>

          <!-- Detailed Data Table -->
          <div class="data-table">
            <h4>Detailed Data</h4>
            <table>
              <thead>
                <tr>
                  <th>Crime Type</th>
                  <th>Victimization Rate (%)</th>
                  <th>Economic Loss (M$)</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in sortedChartData" :key="data.name">
                  <td>{{ data.name }}</td>
                  <td>{{ data.victimRate.toFixed(1) }}%</td>
                  <td>${{ data.loss.toFixed(1) }}M</td>
                  <td>
                    <span class="risk-badge" :class="getComboRiskLevel(data.victimRate, data.loss)">
                      {{ getComboRiskLevelText(data.victimRate, data.loss) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            </div>

        <div v-else class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'InfographicSection',
  data() {
    return {
      loading: true,
      // 年龄组图表数据
      ageGroupChartData: [],
      ageGroupMaxCaseCount: 0,
      ageGroupMaxVictimRate: 0,
      // 热力图数据
      hasError: false,
      rawData: [],
      heatmapData: new Map(),
      crimeTypes: [
        {
          key: 'online_abuse',
          name: 'Online Abuse and Harassment',
          description: 'Victimization from online harassment, cyberbullying and similar behaviors'
        },
        {
          key: 'malware',
          name: 'Malware Attacks',
          description: 'Infection by viruses, trojans and other malicious software'
        },
        {
          key: 'identity_crime',
          name: 'Identity Theft Crime',
          description: 'Criminal activities involving theft of personal identity information'
        },
        {
          key: 'fraud_scams',
          name: 'Fraud and Scams',
          description: 'Various types of online fraud and financial scam activities'
        }
      ],
      demographicGroups: [
        { key: 'age_18_34', name: '18-34 years' },
        { key: 'age_35_64', name: '35-64 years' },
        { key: 'age_65_plus', name: '65+ years' }
      ],
      // 过滤器选项
      smeFilter: 'all', // 'all', 'sme_owner', 'non_sme_owner'
      genderFilter: 'all', // 'all', 'male', 'female'
      // 组合图表数据
      chartData: [],
      maxLoss: 0,
      maxVictimRate: 0
    }
  },
  computed: {
    // 年龄组图表计算属性
    ageGroupLeftAxisTicks() {
      if (this.ageGroupMaxCaseCount === 0) return [0]
      const step = Math.ceil(this.ageGroupMaxCaseCount / 4)
      return Array.from({length: 5}, (_, i) => i * step)
    },
    ageGroupRightAxisTicks() {
      if (this.ageGroupMaxVictimRate === 0) return [0]
      const step = Math.ceil(this.ageGroupMaxVictimRate / 4)
      return Array.from({length: 5}, (_, i) => i * step)
    },
    ageGroupLinePath() {
      if (this.ageGroupLinePoints.length < 2) return 'M 0 0'
      let path = `M ${this.ageGroupLinePoints[0].x} ${this.ageGroupLinePoints[0].y}`
      for (let i = 1; i < this.ageGroupLinePoints.length; i++) {
        const prevPoint = this.ageGroupLinePoints[i - 1]
        const currentPoint = this.ageGroupLinePoints[i]
        const controlPoint1X = prevPoint.x + (currentPoint.x - prevPoint.x) / 3
        const controlPoint2X = currentPoint.x - (currentPoint.x - prevPoint.x) / 3
        path += ` C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${currentPoint.y}, ${currentPoint.x} ${currentPoint.y}`
      }
      return path
    },
    ageGroupLinePoints() {
      const width = 500
      const height = 200
      const padding = 50

      return this.ageGroupChartData.map((data, index) => ({
        x: padding + (index * (width - 2 * padding)) / Math.max(this.ageGroupChartData.length - 1, 1),
        y: height - padding - ((data.avgVictimRate / this.ageGroupMaxVictimRate) * (height - 2 * padding))
      }))
    },
    ageGroupTotalCases() {
      return this.ageGroupChartData.reduce((sum, item) => sum + item.caseCount, 0)
    },
    ageGroupOverallAvgRate() {
      if (this.ageGroupChartData.length === 0) return 0
      const totalRate = this.ageGroupChartData.reduce((sum, item) => sum + (item.avgVictimRate * item.caseCount), 0)
      return totalRate / this.ageGroupTotalCases
    },
    ageGroupHighestRiskGroup() {
      return this.ageGroupChartData.reduce((prev, current) =>
        prev.avgVictimRate > current.avgVictimRate ? prev : current, this.ageGroupChartData[0] || {})
    },
    ageGroupMostCasesGroup() {
      return this.ageGroupChartData.reduce((prev, current) =>
        prev.caseCount > current.caseCount ? prev : current, this.ageGroupChartData[0] || {})
    },
    ageGroupSortedChartData() {
      return [...this.ageGroupChartData].sort((a, b) => b.avgVictimRate - a.avgVictimRate)
    },
    ageGroupRiskTrendInsight() {
      if (this.ageGroupChartData.length < 2) return 'Insufficient data to analyze trends'
      const youngRate = this.ageGroupChartData.find(d => d.ageGroup.includes('18-34'))?.avgVictimRate || 0
      const oldRate = this.ageGroupChartData.find(d => d.ageGroup.includes('65+'))?.avgVictimRate || 0

      if (youngRate > oldRate) {
        return 'Young adults face higher cybersecurity risks and need enhanced digital security education.'
      } else if (oldRate > youngRate) {
        return 'Senior citizens are more vulnerable to cybercrime and require focused protection measures.'
      } else {
        return 'Risk levels are relatively balanced across age groups, requiring comprehensive protection strategies.'
      }
    },
    ageGroupCaseDistributionInsight() {
      if (this.ageGroupChartData.length === 0) return 'No data available'
      const maxCases = this.ageGroupMostCasesGroup
      const percentage = ((maxCases.caseCount / this.ageGroupTotalCases) * 100).toFixed(1)
      return `The ${maxCases.ageGroup} age group accounts for ${percentage}% of cases, making them the primary victims of cybercrime.`
    },
    ageGroupPreventionRecommendation() {
      const highRisk = this.ageGroupHighestRiskGroup
      if (highRisk.ageGroup.includes('18-34')) {
        return 'Recommend strengthening cybersecurity awareness training for young adults, particularly in social media and online shopping security.'
      } else if (highRisk.ageGroup.includes('65+')) {
        return 'Senior citizens need simplified security tools and regular security guidance, with family members providing additional support.'
      } else {
        return 'Middle-aged groups should focus on work-related cybersecurity protection, including email security and password management.'
      }
    },
    // 热力图计算属性
    overallHighestRisk() {
      let maxRate = 0
      let maxGroup = ''

      this.demographicGroups.forEach(group => {
        const avgRate = this.crimeTypes.reduce((sum, crime) => {
          return sum + this.getVictimRate(group.key, crime.key)
        }, 0) / this.crimeTypes.length

        if (avgRate > maxRate) {
          maxRate = avgRate
          maxGroup = group.name
        }
      })

      return { group: maxGroup, rate: maxRate }
    },
    overallMostDangerous() {
      let maxRate = 0
      let maxCrime = ''

      this.crimeTypes.forEach(crime => {
        const avgRate = this.demographicGroups.reduce((sum, group) => {
          return sum + this.getVictimRate(group.key, crime.key)
        }, 0) / this.demographicGroups.length

        if (avgRate > maxRate) {
          maxRate = avgRate
          maxCrime = crime.name
        }
      })

      return { crime: maxCrime, rate: maxRate }
    },
    overallAverage() {
      let total = 0
      let count = 0

      this.demographicGroups.forEach(group => {
        this.crimeTypes.forEach(crime => {
          total += this.getVictimRate(group.key, crime.key)
          count++
        })
      })

      return count > 0 ? total / count : 0
    },

    // 犯罪类型图表计算属性
    leftAxisTicks() {
      if (this.maxLoss === 0) return [0]
      const step = Math.ceil(this.maxLoss / 4)
      return Array.from({length: 5}, (_, i) => i * step)
    },
    rightAxisTicks() {
      if (this.maxVictimRate === 0) return [0]
      const step = Math.ceil(this.maxVictimRate / 4)
      return Array.from({length: 5}, (_, i) => i * step)
    },
    linePath() {
      if (this.linePoints.length < 2) return 'M 0 0'
      let path = `M ${this.linePoints[0].x} ${this.linePoints[0].y}`
      for (let i = 1; i < this.linePoints.length; i++) {
        const prevPoint = this.linePoints[i - 1]
        const currentPoint = this.linePoints[i]
        const controlPoint1X = prevPoint.x + (currentPoint.x - prevPoint.x) / 3
        const controlPoint2X = currentPoint.x - (currentPoint.x - prevPoint.x) / 3
        path += ` C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${currentPoint.y}, ${currentPoint.x} ${currentPoint.y}`
      }
      return path
    },
    linePoints() {
      const width = 600
      const height = 200
      const padding = 40

      return this.chartData.map((data, index) => ({
        x: padding + (index * (width - 2 * padding)) / Math.max(this.chartData.length - 1, 1),
        y: height - padding - ((data.victimRate / this.maxVictimRate) * (height - 2 * padding))
      }))
    },
    totalLoss() {
      return this.chartData.reduce((sum, item) => sum + item.loss, 0)
    },
    averageVictimRate() {
      return this.chartData.length > 0
        ? this.chartData.reduce((sum, item) => sum + item.victimRate, 0) / this.chartData.length
        : 0
    },
    mostDangerous() {
      return this.chartData.reduce((prev, current) =>
        prev.victimRate > current.victimRate ? prev : current, this.chartData[0] || {})
    },
    costliestCrime() {
      return this.chartData.reduce((prev, current) =>
        prev.loss > current.loss ? prev : current, this.chartData[0] || {})
    },
    sortedChartData() {
      return [...this.chartData].sort((a, b) => b.victimRate - a.victimRate)
    }
  },
  mounted() {
    this.fetchAgeGroupData()
    this.fetchComboData()
    this.fetchVictimisationData()
  },
  methods: {
    // 年龄组图表相关方法
    async fetchAgeGroupData() {
      this.loading = true
      try {
        const baseURL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'
        const response = await fetch(`${baseURL}/infographics/victimisation/`)
        const victimData = await response.json()

        this.processAgeGroupData(victimData)
      } catch (error) {
        console.error('获取年龄组数据失败:', error)
        // 使用模拟数据
        this.ageGroupChartData = [
          {
            ageGroup: '18-34',
            ageDetail: 'Young Adults',
            caseCount: 245,
            avgVictimRate: 32.4
          },
          {
            ageGroup: '35-64',
            ageDetail: 'Middle-aged',
            caseCount: 312,
            avgVictimRate: 28.7
          },
          {
            ageGroup: '65+',
            ageDetail: 'Senior Citizens',
            caseCount: 156,
            avgVictimRate: 35.1
          }
        ]
        this.updateAgeGroupMaxValues()
      } finally {
        this.loading = false
      }
    },

    processAgeGroupData(victimData) {
      console.log('Processing victimisation data for age groups:', victimData.length, 'records')

      // 按年龄组分组数据
      const ageGroups = new Map()

      victimData.forEach(item => {
        if (!item.age) return

        // 标准化年龄组
        const age = item.age.toString().trim()
        let ageGroup = 'Unknown'
        let ageDetail = ''

        if (age.includes('18') && age.includes('34')) {
          ageGroup = '18-34'
          ageDetail = 'Young Adults'
        } else if (age.includes('35') && age.includes('64')) {
          ageGroup = '35-64'
          ageDetail = 'Middle-aged'
        } else if (age.includes('65') || age.includes('65+')) {
          ageGroup = '65+'
          ageDetail = 'Senior Citizens'
        } else if (age.includes('All ages')) {
          return // Skip "All ages" records
        }

        if (ageGroup === 'Unknown') return

        if (!ageGroups.has(ageGroup)) {
          ageGroups.set(ageGroup, {
            ageGroup,
            ageDetail,
            caseCount: 0,
            victimRates: [],
            totalVictimRate: 0
          })
        }

        const group = ageGroups.get(ageGroup)
        group.caseCount += 1

        // 收集有效的受害率数据
        if (item.prevalence_2024 && item.prevalence_2024 > 0) {
          group.victimRates.push(item.prevalence_2024)
          group.totalVictimRate += item.prevalence_2024
        }
      })

      // 计算平均受害率并构建最终数据
      this.ageGroupChartData = Array.from(ageGroups.values())
        .map(group => ({
          ...group,
          avgVictimRate: group.victimRates.length > 0
            ? group.totalVictimRate / group.victimRates.length
            : 0
        }))
        .filter(group => group.caseCount > 0)
        .sort((a, b) => {
          // 按年龄顺序排序
          const order = { '18-34': 1, '35-64': 2, '65+': 3 }
          return order[a.ageGroup] - order[b.ageGroup]
        })

      console.log('Processed age group data:', this.ageGroupChartData)
      this.updateAgeGroupMaxValues()
    },

    updateAgeGroupMaxValues() {
      this.ageGroupMaxCaseCount = Math.max(...this.ageGroupChartData.map(d => d.caseCount))
      this.ageGroupMaxVictimRate = Math.max(...this.ageGroupChartData.map(d => d.avgVictimRate))
    },

    getAgeGroupBarHeight(caseCount) {
      return this.ageGroupMaxCaseCount > 0 ? (caseCount / this.ageGroupMaxCaseCount) * 70 : 0
    },

    getAgeGroupRiskLevel(victimRate) {
      if (victimRate >= 30) return 'high'
      if (victimRate >= 20) return 'medium'
      return 'low'
    },

    getAgeGroupRiskLevelText(victimRate) {
      const level = this.getAgeGroupRiskLevel(victimRate)
      return { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }[level]
    },

    // 热力图相关方法
    async fetchVictimisationData() {
      this.loading = true
      this.hasError = false
      try {
        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/infographics/victimisation/')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        this.rawData = data
        this.processHeatmapData()
      } catch (error) {
        console.error('Failed to fetch victimization data:', error)
        this.hasError = true
      } finally {
        this.loading = false
      }
    },

    processHeatmapData() {
      console.log('Processing heatmap data from', this.rawData.length, 'records')

      const dataMap = new Map()

      this.rawData.forEach(record => {
        const groups = this.classifyDemographic(record)
        const crimeType = this.classifyCrime(record.main_type)

        if (crimeType && record.prevalence_2024 > 0) {
          // 应用过滤器
          if (this.passesFilters(record)) {
            groups.forEach(groupKey => {
              // 只处理年龄段数据
              if (groupKey.startsWith('age_')) {
                const key = `${groupKey}_${crimeType}`
                if (!dataMap.has(key)) {
                  dataMap.set(key, [])
                }
                dataMap.get(key).push(record.prevalence_2024)
              }
            })
          }
        }
      })

      // 计算平均值
      this.heatmapData.clear()

      dataMap.forEach((values, key) => {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length
        this.heatmapData.set(key, average)
      })

      console.log('Processed heatmap data:', this.heatmapData)
    },

    classifyDemographic(record) {
      const groups = []

      if (record.age) {
        const age = record.age.toString().trim()
        if (age.includes('18') && age.includes('34')) {
          groups.push('age_18_34')
        } else if (age.includes('35') && age.includes('64')) {
          groups.push('age_35_64')
        } else if (age.includes('65')) {
          groups.push('age_65_plus')
        }
      }

      if (record.sme_status) {
        if (record.sme_status.includes('SME owner')) {
          groups.push('sme_owner')
        } else {
          groups.push('non_sme_owner')
        }
      }

      if (record.gender === 'Male') {
        groups.push('male')
      } else if (record.gender === 'Female') {
        groups.push('female')
      }

      return groups
    },

    classifyCrime(mainType) {
      if (!mainType) return null

      const type = mainType.toLowerCase()
      if (type.includes('online abuse') || type.includes('harassment')) {
        return 'online_abuse'
      } else if (type.includes('malware')) {
        return 'malware'
      } else if (type.includes('identity')) {
        return 'identity_crime'
      } else if (type.includes('fraud') || type.includes('scam')) {
        return 'fraud_scams'
      }

      return null
    },

    getVictimRate(groupKey, crimeKey) {
      const key = `${groupKey}_${crimeKey}`
      return this.heatmapData.get(key) || 0
    },



    getPercentage(groupKey, crimeKey) {
      const victimRate = this.getVictimRate(groupKey, crimeKey)
      const totalVictimRate = this.demographicGroups.reduce((sum, group) => {
        return sum + this.getVictimRate(group.key, crimeKey)
      }, 0)

      return totalVictimRate > 0 ? (victimRate / totalVictimRate) * 100 : 0
    },

    getHeatClass(rate) {
      if (rate >= 25) return 'high'
      if (rate >= 15) return 'medium'
      return 'low'
    },

    getRiskLevel(rate) {
      if (rate >= 25) return 'high'
      if (rate >= 15) return 'medium'
      return 'low'
    },

    getRiskLevelText(rate) {
      const level = this.getRiskLevel(rate)
      return { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }[level]
    },

    getHighestRiskGroup(crimeKey) {
      let maxRate = 0
      let maxGroup = this.demographicGroups[0]

      this.demographicGroups.forEach(group => {
        const rate = this.getVictimRate(group.key, crimeKey)
        if (rate > maxRate) {
          maxRate = rate
          maxGroup = group
        }
      })

      return maxGroup
    },

    getAverageRate(crimeKey) {
      const rates = this.demographicGroups.map(group =>
        this.getVictimRate(group.key, crimeKey)
      ).filter(rate => rate > 0)

      return rates.length > 0 ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0
    },

    // 过滤器相关方法
    passesFilters(record) {
      // SME过滤器
      if (this.smeFilter !== 'all') {
        if (this.smeFilter === 'sme_owner' && !record.sme_status?.includes('SME owner')) {
          return false
        }
        if (this.smeFilter === 'non_sme_owner' && record.sme_status?.includes('SME owner')) {
          return false
        }
      }

      // 性别过滤器
      if (this.genderFilter !== 'all') {
        if (this.genderFilter === 'male' && record.gender !== 'Male') {
          return false
        }
        if (this.genderFilter === 'female' && record.gender !== 'Female') {
          return false
        }
      }

      return true
    },

    updateHeatmapData() {
      this.processHeatmapData()
    },










    // 组合图表相关方法
    async fetchComboData() {
      try {
        const baseURL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

        // 并行调用所有API
        const [financialData, victimData] = await Promise.all([
          fetch(`${baseURL}/infographics/financial-losses/`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
              return res.json()
            })
            .catch(err => {
              console.error('Error fetching financial losses data:', err)
              return []
            }),
          fetch(`${baseURL}/infographics/victimisation/`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
              return res.json()
            })
            .catch(err => {
              console.error('Error fetching victimisation data:', err)
              return []
            })
        ])

        // 处理组合图表数据
        this.processComboData(financialData, victimData)
      } catch (error) {
        console.error('获取组合图表数据失败:', error)
        // 设置默认值
        this.chartData = []
        this.maxLoss = 0
        this.maxVictimRate = 0
      }
    },

    processComboData(financialData, victimData) {
      // 按犯罪类型分组处理数据
      const crimeTypes = new Map()

      // 处理经济损失数据
      financialData.forEach(item => {
        const type = item.cybercrime || 'Unknown'
        // 过滤掉 "Any cybercrime (all)" 数据
        if (type === 'Any cybercrime (all)' || type === 'Unknown') return

        if (!crimeTypes.has(type)) {
          crimeTypes.set(type, {
            name: type,
            shortName: this.getShortName(type),
            loss: 0,
            victimRate: 0,
            victimCount: 0
          })
        }
        crimeTypes.get(type).loss += (item.value || 0)
      })

      // 处理受害率数据
      victimData.forEach(item => {
        const type = item.main_type || 'Unknown'
        // 过滤掉 "Any cybercrime (all)" 数据
        if (type === 'Any cybercrime (all)' || type === 'Unknown') return

        if (!crimeTypes.has(type)) {
          crimeTypes.set(type, {
            name: type,
            shortName: this.getShortName(type),
            loss: 0,
            victimRate: 0,
            victimCount: 0
          })
        }
        const crimeData = crimeTypes.get(type)
        if (item.prevalence_2024 && item.prevalence_2024 > 0) {
          crimeData.victimRate += item.prevalence_2024
          crimeData.victimCount += 1
        }
      })

      // 计算平均受害率并筛选有效数据
      this.chartData = Array.from(crimeTypes.values())
        .filter(item => item.loss > 0 || item.victimCount > 0)
        .map(item => ({
          ...item,
          victimRate: item.victimCount > 0 ? item.victimRate / item.victimCount : 0
        }))
        .slice(0, 6) // 只显示前6种类型

      this.updateMaxValues()
    },

    getShortName(fullName) {
      const shortNames = {
        'Online abuse and harassment': 'Online Abuse',
        'Malware': 'Malware',
        'Identity crime': 'Identity Crime',
        'Fraud and scams': 'Fraud',
        'Hacking': 'Hacking',
        'Privacy breach': 'Privacy Breach'
      }
      return shortNames[fullName] || fullName.substring(0, 6)
    },

    updateMaxValues() {
      this.maxLoss = Math.max(...this.chartData.map(d => d.loss))
      this.maxVictimRate = Math.max(...this.chartData.map(d => d.victimRate))
    },

    getBarHeight(loss) {
      return this.maxLoss > 0 ? (loss / this.maxLoss) * 70 : 0
    },

    getComboRiskLevel(victimRate, loss) {
      if (victimRate > 30 || loss > 300) return 'high'
      if (victimRate > 20 || loss > 150) return 'medium'
      return 'low'
    },

    getComboRiskLevelText(victimRate, loss) {
      const level = this.getComboRiskLevel(victimRate, loss)
      return { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }[level]
    }
  },


}
</script>

<style scoped>
/* 基础样式结构 */
.infographic-section {
  padding: 3rem 0;
  margin-bottom: 3rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
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

/* 热力图样式 */
.heatmap-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
  font-size: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #666;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h4 {
  color: #dc3545;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #0056b3;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.filter-controls {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 150px;
}

.filter-group select:focus {
  outline: none;
  border-color: #007bff;
}

.filter-group select:hover {
  border-color: #007bff;
}

.heatmaps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.heatmap-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.heatmap-header {
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #007bff;
}

.heatmap-header h4 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.heatmap-header p {
  font-size: 0.85rem;
  color: #666;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.heatmap-table th,
.heatmap-table td {
  padding: 0.6rem;
  text-align: center;
  border: 1px solid #ddd;
}

.heatmap-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.row-header {
  text-align: left !important;
  font-weight: 600;
  min-width: 80px;
}

.heat-cell {
  font-weight: 600;
  transition: all 0.2s;
}

.heat-cell:hover {
  transform: scale(1.05);
}

.heat-cell.low {
  background: #d4edda;
  color: #155724;
}

.heat-cell.medium {
  background: #fff3cd;
  color: #856404;
}

.heat-cell.high {
  background: #f8d7da;
  color: #721c24;
}

.risk-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.high {
  background: #f8d7da;
  color: #721c24;
}

.risk-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.risk-badge.low {
  background: #d4edda;
  color: #155724;
}

.heatmap-summary {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.85rem;
}

.summary-item .label {
  color: #666;
  margin-right: 0.5rem;
}

.summary-item .value {
  font-weight: 600;
  color: #007bff;
}

.global-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  font-size: 0.9rem;
}

.legend-title {
  font-weight: 600;
  color: #333;
}

.legend-items {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-box {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.color-box.low { background: #d4edda; }
.color-box.medium { background: #fff3cd; }
.color-box.high { background: #f8d7da; }

.overall-summary {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.overall-summary h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.summary-card .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 0.25rem;
}

.summary-card .label {
  font-size: 0.85rem;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .heatmap-section {
    padding: 1rem;
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .filter-group select {
    min-width: 120px;
  }

  .heatmaps-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .heatmap-card {
    padding: 1rem;
  }

  .heatmap-table {
    font-size: 0.75rem;
  }

  .heatmap-table th,
  .heatmap-table td {
    padding: 0.4rem;
  }

  .legend-items {
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 年龄组图表样式 */
.combo-chart-section {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-medium);
  margin: 2rem 0;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.chart-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.line-color {
  background: #EF4444;
}

.bar-color {
  background: #3B82F6;
}

.chart-content {
  position: relative;
  height: 350px;
  margin: 2rem 0;
}

.y-axis {
  position: absolute;
  height: calc(100% - 3rem);
  width: 60px;
  display: flex;
  flex-direction: column;
  top: 1rem;
}

.left-axis {
  left: 0;
  color: #3B82F6;
}

.right-axis {
  right: 0;
  color: #EF4444;
  align-items: flex-end;
}

.axis-label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.axis-ticks {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 1rem 0;
}

.tick {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.chart-main {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 2rem;
  bottom: 3rem;
}

.bars-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 2rem);
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 1rem;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.bar {
  width: 60px;
  background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 6px 6px 0 0;
  position: relative;
  min-height: 4px;
  animation: barGrow 1.2s ease-out both;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.bar-value {
  position: absolute;
  top: -1.8rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 2rem;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.line-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease-out 0.5s both;
  filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes barGrow {
  from {
    height: 0;
  opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.line-point {
  fill: #EF4444;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  animation: pointAppear 0.6s ease-out both;
}

.line-point:hover {
  r: 8;
  fill: #DC2626;
}

@keyframes pointAppear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
  opacity: 1;
    transform: scale(1);
  }
}

.x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
}

.x-label {
  text-align: center;
  min-width: 80px;
}

.age-group {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.age-detail {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.data-table {
  margin: 2rem 0;
}

.data-table h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.risk-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.high {
  background: #FEE2E2;
  color: #DC2626;
}

.risk-badge.medium {
  background: #FEF3C7;
  color: #D97706;
}

.risk-badge.low {
  background: #DCFCE7;
  color: #16A34A;
}

.insights-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
}

.insights-section h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #3B82F6;
}

.insight-card h5 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.insight-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-light);
  border-top: 3px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 犯罪类型组合图表样式 */
.combo-chart-section {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-medium);
  margin: 2rem 0;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.chart-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.line-color {
  background: #EF4444;
}

.bar-color {
  background: #10B981;
}

.chart-content {
  position: relative;
  height: 350px;
  margin: 2rem 0;
}

.y-axis {
  position: absolute;
  height: calc(100% - 2rem);
  width: 60px;
  display: flex;
  flex-direction: column;
  top: 1rem;
}

.left-axis {
  left: 0;
  color: #10B981;
}

.right-axis {
  right: 0;
  color: #EF4444;
  align-items: flex-end;
}

.axis-label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.axis-ticks {
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 1rem 0;
}

.tick {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.chart-main {
  position: absolute;
  left: 80px;
  right: 80px;
  top: 2rem;
  bottom: 3rem;
}

.bars-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 2rem);
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 0.5rem;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 100%;
  max-width: 60px;
  background: linear-gradient(180deg, #10B981 0%, #059669 100%);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 4px;
  animation: barGrow 1s ease-out both;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.bar-value {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.bar-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.2;
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 2rem;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.line-path {
  stroke-dasharray: 800;
  stroke-dashoffset: 800;
  animation: drawLine 2s ease-out 0.5s both;
  filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes barGrow {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.line-point {
  fill: #EF4444;
  stroke: white;
  stroke-width: 2;
  cursor: pointer;
  animation: pointAppear 0.5s ease-out both;
}

.line-point:hover {
  r: 8;
  fill: #DC2626;
}

@keyframes pointAppear {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
}

.x-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
  max-width: 80px;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.data-table {
  margin-top: 2rem;
}

.data-table h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
}

th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text-primary);
}

.risk-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.high {
  background: #FEE2E2;
  color: #DC2626;
}

.risk-badge.medium {
  background: #FEF3C7;
  color: #D97706;
}

.risk-badge.low {
  background: #DCFCE7;
  color: #16A34A;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-light);
  border-top: 3px solid #10B981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 组合图表响应式设计 */
@media (max-width: 768px) {
  .combo-chart-section {
    padding: 1rem;
  }

  .chart-legend {
    flex-direction: column;
    gap: 1rem;
  }

  .chart-main {
    left: 50px;
    right: 50px;
  }

  .y-axis {
    width: 40px;
  }

  .chart-summary {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 0.8rem;
  }

  th, td {
    padding: 0.5rem;
  }
}
</style>
