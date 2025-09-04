<template>
  <div class="TypeRate-section">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h3>Cybercrime Risk Assessment by Demographics</h3>
          <p>Victimization rates and risk levels across age groups for major cybercrime categories</p>
        </div>
        <div class="download-section">
          <button @click="downloadChart" class="download-btn" :disabled="loading || hasError">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download Chart
          </button>
        </div>
      </div>
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

    <div v-else class="visualizations-container">
      <!-- Filter controls -->
      <div class="filter-controls">
        <div class="filter-group">
          <label for="sme-filter">SME Status:</label>
          <select id="sme-filter" v-model="smeFilter" @change="updateVisualization">
            <option value="all">All</option>
            <option value="sme_owner">SME Owner</option>
            <option value="non_sme_owner">Non-SME Owner</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="gender-filter">Gender:</label>
          <select id="gender-filter" v-model="genderFilter" @change="updateVisualization">
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

      </div>

      <!-- Crime Type Cards Grid -->
      <div class="crime-cards-grid">
        <div
          v-for="crime in crimeTypes"
          :key="crime.key"
          class="crime-card"
        >
          <div class="card-header">
            <h4>{{ crime.name }}</h4>
            <p class="card-description">{{ crime.description }}</p>
          </div>

          <div class="card-content">
            <table class="crime-table">
              <thead>
                <tr>
                  <th>Demographic Group</th>
                  <th>Victimization Rate (%)</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ageGroup in demographicGroups" :key="ageGroup.key">
                  <td class="demographic-cell">{{ ageGroup.name }} years</td>
                  <td class="rate-cell" :class="getRateCellClass(getCrimeRate(crime.key, ageGroup.key))">
                    {{ getCrimeRate(crime.key, ageGroup.key).toFixed(1) }}%
                  </td>
                  <td class="risk-cell" :class="getRiskCellClass(getCrimeRate(crime.key, ageGroup.key))">
                    {{ getRiskLevelText(getCrimeRate(crime.key, ageGroup.key)) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="card-summary">
              <div class="summary-item">
                <span class="summary-label">Highest Risk:</span>
                <span class="summary-value">{{ getHighestRiskGroup(crime.key) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Average Victimization Rate:</span>
                <span class="summary-value">{{ getAverageRate(crime.key).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeRateTable',
  data() {
    return {
      loading: true,
      hasError: false,
      rawData: [],
      processedData: [],
      crimeTypes: [
        {
          key: 'online_abuse',
          name: 'Online Abuse',
          description: 'Online harassment and cyberbullying'
        },
        {
          key: 'malware',
          name: 'Malware Attacks',
          description: 'Virus and malicious software infections'
        },
        {
          key: 'identity_crime',
          name: 'Identity Theft',
          description: 'Personal identity information theft'
        },
        {
          key: 'fraud_scams',
          name: 'Fraud & Scams',
          description: 'Online fraud and financial scams'
        }
      ],
      demographicGroups: [
        { key: 'age_18_34', name: '18-34' },
        { key: 'age_35_64', name: '35-64' },
        { key: 'age_65_plus', name: '65+' }
      ],
      smeFilter: 'all',
      genderFilter: 'all'
    }
  },
  computed: {
    // 获取特定犯罪类型和年龄组的受害率
    crimeRatesMap() {
      const map = {}
      this.processedData.forEach(item => {
        const key = `${item.crimeType}_${item.ageGroup}`
        if (!map[key]) {
          map[key] = []
        }
        map[key].push(item.rate)
      })

      // 计算平均值
      Object.keys(map).forEach(key => {
        const rates = map[key]
        map[key] = rates.reduce((a, b) => a + b, 0) / rates.length
      })

      return map
    }
  },
  mounted() {
    this.fetchVictimisationData()
  },
  methods: {
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
        this.processData()
      } catch (error) {
        console.error('Failed to fetch victimization data:', error)
        this.hasError = true
      } finally {
        this.loading = false
      }
    },

    downloadChart() {
      try {
        // 获取图表容器的 HTML 内容
        const chartContainer = this.$el.querySelector('.visualizations-container')
        if (!chartContainer) {
          console.error('Chart container not found')
          return
        }

        // 使用 html2canvas 将图表转换为图片
        import('html2canvas').then(html2canvas => {
          html2canvas.default(chartContainer, {
            backgroundColor: '#ffffff',
            scale: 2, // 提高图片质量
            useCORS: true,
            allowTaint: true
          }).then(canvas => {
            // 创建下载链接
            const link = document.createElement('a')
            link.download = 'cybercrime-risk-assessment.png'
            link.href = canvas.toDataURL('image/png')

            // 触发下载
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }).catch(error => {
            console.error('Error generating chart image:', error)
            alert('Failed to download chart. Please try again.')
          })
        }).catch(error => {
          console.error('Error loading html2canvas:', error)
          alert('Download feature not available. Please try again later.')
        })
      } catch (error) {
        console.error('Download error:', error)
        alert('Failed to download chart. Please try again.')
      }
    },

    processData() {
      const processedMap = new Map()

      this.rawData.forEach(record => {
        if (!this.passesFilters(record)) return

        const ageGroup = this.classifyAge(record.age)
        const crimeType = this.classifyCrime(record.main_type)

        if (ageGroup && crimeType && record.prevalence_2024 > 0) {
          const key = `${ageGroup}_${crimeType}_${record.gender || 'all'}_${record.sme_status || 'all'}`

          if (!processedMap.has(key)) {
            processedMap.set(key, {
              ageGroup,
              crimeType,
              gender: record.gender,
              smeStatus: record.sme_status,
              rates: [],
              count: 0
            })
          }

          const item = processedMap.get(key)
          item.rates.push(record.prevalence_2024)
          item.count++
        }
      })

      this.processedData = Array.from(processedMap.values()).map(item => ({
        ...item,
        rate: item.rates.reduce((a, b) => a + b, 0) / item.rates.length,
        sampleSize: item.count
      }))

      console.log('Processed data for ECharts:', this.processedData)
    },

    classifyAge(age) {
      if (!age) return null
      const ageStr = age.toString().trim()

      if (ageStr.includes('18') && ageStr.includes('34')) {
        return 'age_18_34'
      } else if (ageStr.includes('35') && ageStr.includes('64')) {
        return 'age_35_64'
      } else if (ageStr.includes('65')) {
        return 'age_65_plus'
      }

      return null
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

    passesFilters(record) {
      // SME过滤
      if (this.smeFilter !== 'all') {
        if (this.smeFilter === 'sme_owner' && !record.sme_status?.includes('SME owner')) {
          return false
        }
        if (this.smeFilter === 'non_sme_owner' && record.sme_status?.includes('SME owner')) {
          return false
        }
      }

      // 性别过滤
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



    getCrimeTypeName(key) {
      const crime = this.crimeTypes.find(c => c.key === key)
      return crime ? crime.name : key
    },

    getAgeGroupName(key) {
      const group = this.demographicGroups.find(g => g.key === key)
      return group ? group.name : key
    },

    getRiskLevel(rate) {
      if (rate >= 22) return 'high'
      if (rate >= 15) return 'medium'
      return 'low'
    },

    getRiskLevelText(rate) {
      const level = this.getRiskLevel(rate)
      return { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' }[level]
    },

    getRiskClass(rate) {
      return `risk-${this.getRiskLevel(rate)}`
    },

    onTableClick(params) {
      if (params.data) {
        const [x, y, value] = params.data
        console.log('Clicked cell:', { x, y, value })
        // 可以在这里添加点击事件处理
      }
    },

    updateVisualization() {
      this.processData()
    },

    // 获取特定犯罪类型和年龄组的受害率
    getCrimeRate(crimeType, ageGroup) {
      const key = `${crimeType}_${ageGroup}`
      return this.crimeRatesMap[key] || 0
    },



    // 获取最高风险组
    getHighestRiskGroup(crimeType) {
      let maxRate = 0
      let maxGroup = ''

      this.demographicGroups.forEach(group => {
        const rate = this.getCrimeRate(crimeType, group.key)
        if (rate > maxRate) {
          maxRate = rate
          maxGroup = `${group.name} years`
        }
      })

      return maxGroup || 'N/A'
    },

    // 获取平均受害率
    getAverageRate(crimeType) {
      const rates = this.demographicGroups.map(group =>
        this.getCrimeRate(crimeType, group.key)
      ).filter(rate => rate > 0)

      if (rates.length === 0) return 0
      return rates.reduce((a, b) => a + b, 0) / rates.length
    },

    // 获取受害率单元格的样式类
    getRateCellClass(rate) {
      if (rate >= 22) return 'rate-high'
      if (rate >= 15) return 'rate-medium'
      return 'rate-low'
    },

    // 获取风险等级单元格的样式类
    getRiskCellClass(rate) {
      if (rate >= 22) return 'risk-high'
      if (rate >= 15) return 'risk-medium'
      return 'risk-low'
    }
  }
}
</script>

<style scoped>
/* 基础布局 */
.TypeRate-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  font-family: inherit;
}

/* 头部样式 */
.header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.title-section {
  flex: 1;
  text-align: left;
}

.title-section h3 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.title-section p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.download-section {
  flex-shrink: 0;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--forest-dark);
  color: var(--forest-light);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.download-btn:hover:not(:disabled) {
  background: var(--forest-medium);
}

.download-btn:disabled {
  background: var(--forest-sage);
  cursor: not-allowed;
  opacity: 0.6;
}

/* 加载和错误状态 */
.loading, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 3rem;
  color: var(--text-secondary);
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-light);
  border-top: 3px solid var(--forest-medium);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: var(--forest-medium);
  color: var(--text-light);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: var(--forest-deep);
  transform: translateY(-1px);
}

/* 过滤器控件 */
.filter-controls {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-group select {
  padding: 0.6rem 1rem;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
  color: var(--text-primary);
}

.filter-group select:focus {
  outline: none;
  border-color: var(--forest-medium);
  box-shadow: 0 0 0 3px var(--shadow-light);
}

.filter-group select:hover {
  border-color: var(--forest-medium);
}

/* 卡片网格 */
.crime-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.crime-card {
  background: var(--text-light);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow-light);
  border: 1px solid var(--border-light);
  overflow: hidden;
  transition: all 0.3s ease;
}


.card-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.card-header h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.card-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

/* 表格样式 */
.crime-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.crime-table th {
  background: var(--bg-secondary);
  padding: 0.8rem 0.6rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-light);
  font-size: 0.85rem;
}

.crime-table td {
  padding: 0.7rem 0.6rem;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.85rem;
}

.demographic-cell {
  font-weight: 500;
  color: var(--text-primary);
}

.rate-cell, .risk-cell {
  font-weight: 600;
  text-align: center;
}

.percentage-cell {
  text-align: center;
  color: var(--text-secondary);
}

/* 风险等级样式 - 合并重复代码 */
.rate-cell.rate-high, .risk-cell.risk-high {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.rate-cell.rate-medium, .risk-cell.risk-medium {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.rate-cell.rate-low, .risk-cell.risk-low {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* 卡片摘要 */
.card-summary {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 0.9rem;
  color: var(--forest-medium);
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .TypeRate-section {
    padding: 1rem;
    margin: 1rem 0;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .title-section {
    text-align: center;
  }

  .download-section {
    align-self: center;
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-group select {
    min-width: 120px;
  }

  .crime-cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .crime-table {
    font-size: 0.8rem;
  }

  .crime-table th,
  .crime-table td {
    padding: 0.5rem 0.4rem;
  }

  .card-summary {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .header h3 {
    font-size: 1.4rem;
  }

  .header p {
    font-size: 0.9rem;
  }



  .card-header,
  .card-content {
    padding: 1rem;
  }

  .crime-table {
    font-size: 0.75rem;
  }

  .crime-table th,
  .crime-table td {
    padding: 0.4rem 0.3rem;
  }
}
</style>
