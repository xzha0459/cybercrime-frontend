<template>
  <div class="heatmap-section">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h3>Cybercrime Victimization Rate by Age Group</h3>
          <p>Heatmap visualization showing victimization rates across different age groups and crime types</p>
        </div>
        <div class="download-section">
          <button @click="exportChart" class="download-btn" :disabled="loading || error">
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

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h4>Data Loading Failed</h4>
      <p>Unable to fetch data, please try again later</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <div v-else class="content">
      <!-- Main ECharts Visualization -->
      <div class="chart-container">
        <div ref="chartRef" class="main-chart"></div>
        <div class="data-source">
          <p>Sourced from: © Commonwealth of Australia, Australian Institute of Criminology (AIC)</p>
        </div>
      </div>

      <!-- Insights Panel -->
      <div v-if="insights" class="insights-panel">
        <h4>Data Insights Analysis</h4>

        <!-- Key Statistics -->
        <div class="insight-section">
          <h5 class="section-title">Key Figures Summary</h5>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ getHighestRate() }}%</div>
              <div class="stat-label">Young people's cybercrime victimization rate</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getOnlineHarassmentRate() }}%</div>
              <div class="stat-label">Young people's online harassment victimization rate</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getFraudScamsRate() }}%</div>
              <div class="stat-label">65+ group fraud and scams victimization rate</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getRiskRatio() }}x</div>
              <div class="stat-label">Young vs elderly overall victimization rate difference</div>
            </div>
          </div>
        </div>

        <!-- Key Findings -->
        <div class="insight-section">
          <h5 class="section-title">Key Findings</h5>
          <div class="key-findings">
            <div class="finding-item">
              <strong>"Age is a significant factor in cybercrime vulnerability"</strong>
            </div>
            <div class="finding-item">
              "18-34 age group has the highest victimization rates across all crime types"
            </div>
            <div class="finding-item">
              "Online fraud affects all age groups, but young people's victimization rate is 4x higher than elderly"
            </div>
          </div>
        </div>

        <!-- Age Group Analysis -->
        <div class="insight-section">
          <h5 class="section-title">Age Group Characteristics</h5>
          <div class="age-analysis">
            <div class="age-group">
              <h6 class="age-title">18 – 34: High-Risk Group</h6>
              <ul>
                <li>Highest victimization rates across all crime types</li>
                <li>Particularly vulnerable to online harassment and identity crime</li>
                <li>Likely causes: More frequent online activity and social media usage</li>
              </ul>
            </div>
            <div class="age-group">
              <h6 class="age-title">35 – 64: Medium Risk</h6>
              <ul>
                <li>Relatively balanced victimization patterns</li>
                <li>Malware and identity crime are main threats</li>
              </ul>
            </div>
            <div class="age-group">
              <h6 class="age-title">65+: Relatively Safer</h6>
              <ul>
                <li>Lowest overall victimization rates</li>
                <li>Still need attention for fraud protection</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Recommendations -->
        <div class="insight-section">
          <h5 class="section-title">Action Recommendations</h5>
          <div class="recommendations">
            <div class="recommendation-item">
              <strong>Young People:</strong> Strengthen privacy settings, be cautious with social sharing
            </div>
            <div class="recommendation-item">
              <strong>Middle-aged:</strong> Regularly update security software, identify phishing emails
            </div>
            <div class="recommendation-item">
              <strong>Elderly:</strong> Improve fraud awareness, verify suspicious contacts
            </div>
          </div>
        </div>

        <!-- Trend Analysis -->
        <div class="insight-section">
          <h5 class="section-title">Trend Analysis</h5>
          <div class="trend-analysis">
            <h6>"Digital Native Paradox"</h6>
            <p>Although young people are more familiar with technology, their high-frequency online activities and risky behaviors make them the primary targets of cybercrime. There is a complex relationship between age and cybersecurity awareness.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'HeatmapChart',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    autoFetch: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const chartData = ref(null)
    const insights = ref(null)

    // 数据处理函数
    const processHeatmapData = (rawData) => {
      if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        return { ageGroups: [], crimeTypes: [], dataMatrix: [], maxValue: 0 }
      }

      const ageGroups = ['18 – 34', '35 – 64', '65+', 'All ages']
      const crimeTypes = [
        'Malware',
        'Identity crime and misuse',
        'Fraud and scams',
        'Online abuse and harassment',
        'Any cybercrime (all)'
      ]

      const dataMatrix = []

      ageGroups.forEach((age, ageIndex) => {
        crimeTypes.forEach((crime, crimeIndex) => {
          const dataPoint = rawData.find(item =>
            item &&
            item.age === age &&
            item.main_type === crime &&
            item.prevalence_2024 !== undefined &&
            item.prevalence_2024 !== null
          )

          const value = dataPoint ? parseFloat(dataPoint.prevalence_2024) : 0
          const validValue = isNaN(value) ? 0 : Math.max(0, value)

          dataMatrix.push([crimeIndex, ageIndex, validValue])
        })
      })

      const maxValue = Math.max(...dataMatrix.map(item => item[2]), 0)
      return { ageGroups, crimeTypes, dataMatrix, maxValue }
    }

    // ECharts配置生成
    const createHeatmapOption = (processedData) => {
      const { ageGroups, crimeTypes, dataMatrix, maxValue } = processedData

      return {
        tooltip: {
          show: false
        },

        grid: {
          left: '5%',
          right: '10%',
          top: '15%',
          bottom: '10%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          data: crimeTypes.slice(),
          axisLabel: {
            fontSize: 11,
            color: '#34495e',
            interval: 0,
            rotate: 0,
            formatter: function(value) {
              if (!value) return ''
              if (value.length > 12) {
                const words = value.split(' ')
                if (words.length > 1) {
                  const mid = Math.ceil(words.length / 2)
                  return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ')
                }
              }
              return value
            }
          },
          splitArea: { show: true },
          axisLine: { lineStyle: { color: '#bdc3c7' } },
          axisTick: { lineStyle: { color: '#bdc3c7' } }
        },

        yAxis: {
          type: 'category',
          data: ageGroups.slice(),
          axisLabel: {
            fontSize: 12,
            color: '#34495e',
            fontWeight: 'bold'
          },
          splitArea: { show: true },
          axisLine: { lineStyle: { color: '#bdc3c7' } },
          axisTick: { lineStyle: { color: '#bdc3c7' } }
        },

        visualMap: {
          min: 0,
          max: Math.max(maxValue, 1),
          calculable: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          itemWidth: 20,
          itemHeight: 140,
          textStyle: { color: '#34495e', fontSize: 11 },
          inRange: {
            color: [
              '#ffffff', '#f0f4ff', '#e1ecff', '#c7d9ff',
              '#a8c8ff', '#7db3ff', '#5299ff', '#2d66cc', '#1a3d99'
            ]
          }
        },

        series: [{
          name: 'Victimization Rate',
          type: 'heatmap',
          data: dataMatrix,
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000000',
            formatter: function(params) {
              if (!params || !params.value || !Array.isArray(params.value) || params.value.length < 3) {
                return '0%'
              }
              const value = params.value[2]
              return value > 0 ? `${value.toFixed(1)}%` : '0%'
            }
          },
          itemStyle: {
            borderColor: 'transparent',
            borderWidth: 0
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)',
              borderColor: 'transparent'
            }
          }
        }]
      }
    }

    // 图表初始化
    const initHeatmapChart = async (rawData) => {
      if (!chartRef.value || !rawData) {
        return
      }

      try {
        const processedData = processHeatmapData(rawData)

        if (!processedData || !processedData.dataMatrix || !processedData.dataMatrix.length) {
          return
        }

        const container = chartRef.value
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
          setTimeout(() => initHeatmapChart(rawData), 100)
          return
        }

        if (chartInstance.value) {
          chartInstance.value.dispose()
          chartInstance.value = null
        }

        await nextTick()

        chartInstance.value = echarts.init(container, null, {
          renderer: 'canvas',
          useDirtyRect: false,
          width: container.offsetWidth,
          height: container.offsetHeight
        })

        const option = createHeatmapOption(processedData)
        chartInstance.value.setOption(option, {
          notMerge: true,
          replaceMerge: ['series'],
          silent: true
        })

        insights.value = generateHeatmapInsights(processedData)

      } catch (error) {
        console.error('Error initializing chart:', error)
        error.value = 'Chart initialization failed: ' + error.message
      }
    }

    // 生成洞察
    const generateHeatmapInsights = (processedData) => {
      const { ageGroups, crimeTypes, dataMatrix } = processedData

      if (dataMatrix.length === 0) {
        return null
      }

      const maxRiskPoint = dataMatrix.reduce((max, current) =>
        current[2] > max[2] ? current : max
      )

      const minRiskPoint = dataMatrix.reduce((min, current) =>
        current[2] < min[2] ? current : min
      )

      return {
        highestRisk: {
          crime: crimeTypes[maxRiskPoint[0]],
          age: ageGroups[maxRiskPoint[1]],
          rate: maxRiskPoint[2]
        },
        lowestRisk: {
          crime: crimeTypes[minRiskPoint[0]],
          age: ageGroups[minRiskPoint[1]],
          rate: minRiskPoint[2]
        }
      }
    }

    // API数据获取
    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null

        const response = await fetch(`${API_BASE_URL}/infographics/victimisation/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const rawData = await response.json()

        if (!Array.isArray(rawData) || rawData.length === 0) {
          throw new Error('No data received from API')
        }

        chartData.value = rawData

        await nextTick()

        setTimeout(() => {
          initHeatmapChart(rawData)
        }, 100)

      } catch (err) {
        console.error('Error details:', err)
        error.value = err.message || 'Failed to fetch data'
      } finally {
        loading.value = false
      }
    }

    // 统计函数
    const getHighestRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        return '0.0'
      }

      const youngAnyCrime = chartData.value.find(item =>
        item.age === '18 – 34' &&
        item.main_type === 'Any cybercrime (all)' &&
        item.prevalence_2024 !== undefined &&
        item.prevalence_2024 !== null
      )

      if (youngAnyCrime) {
        return youngAnyCrime.prevalence_2024.toFixed(1)
      }

      return '0.0'
    }

    const getOnlineHarassmentRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        return '0.0'
      }

      const youngHarassment = chartData.value.find(item =>
        item.age === '18 – 34' && item.main_type === 'Online abuse and harassment'
      )

      if (youngHarassment) {
        return youngHarassment.prevalence_2024.toFixed(1)
      }

      return '0.0'
    }

    const getFraudScamsRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        return '0.0'
      }

      const elderlyFraud = chartData.value.find(item =>
        item.age === '65+' && item.main_type === 'Fraud and scams'
      )

      if (elderlyFraud) {
        return elderlyFraud.prevalence_2024.toFixed(1)
      }

      return '0.0'
    }

    const getRiskRatio = () => {
      if (!chartData.value || chartData.value.length === 0) {
        return '0.0'
      }

      const youngCrimes = chartData.value.filter(item => item.age === '18 – 34')
      const youngAvgRate = youngCrimes.length > 0
        ? youngCrimes.reduce((sum, item) => sum + (item.prevalence_2024 || 0), 0) / youngCrimes.length
        : 0

      const oldCrimes = chartData.value.filter(item =>
        item.age === '65+' || item.age === '65 +' || item.age === '65+ years'
      )
      const oldAvgRate = oldCrimes.length > 0
        ? oldCrimes.reduce((sum, item) => sum + (item.prevalence_2024 || 0), 0) / oldCrimes.length
        : 0

      if (oldAvgRate > 0) {
        return (youngAvgRate / oldAvgRate).toFixed(1)
      }

      return '0.0'
    }

    // 导出图表
    const exportChart = () => {
      if (chartInstance.value) {
        const url = chartInstance.value.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        })

        const link = document.createElement('a')
        link.download = 'heatmap-chart.png'
        link.href = url
        link.click()
      }
    }

    // 数据监听
    watch(() => props.data, (newData) => {
      if (newData && newData.length > 0) {
        chartData.value = newData
        nextTick(() => {
          setTimeout(() => {
            initHeatmapChart(newData)
          }, 50)
        })
      }
    }, { immediate: true })

    // 窗口大小调整处理
    const handleResize = () => {
      if (!chartInstance.value || loading.value || error.value || !chartRef.value || !chartData.value) {
        return
      }

      try {
        if (chartInstance.value.isDisposed && chartInstance.value.isDisposed()) {
          return
        }

        const container = chartRef.value
        if (!container || container.offsetWidth === 0 || container.offsetHeight === 0) {
          return
        }

        chartInstance.value.resize({
          width: container.offsetWidth,
          height: container.offsetHeight,
          silent: true
        })

      } catch (error) {
        console.error('Chart resize error:', error)
        if (chartData.value && chartData.value.length > 0) {
          setTimeout(() => {
            try {
              initHeatmapChart(chartData.value)
            } catch (reinitError) {
              console.error('Failed to reinitialize chart:', reinitError)
            }
          }, 100)
        }
      }
    }

    let resizeTimer = null

    const debouncedResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }

      resizeTimer = setTimeout(() => {
        handleResize()
      }, 200)
    }

    // 组件生命周期
    onMounted(async () => {
      if (props.autoFetch) {
        await fetchData()
      }
      window.addEventListener('resize', debouncedResize)
    })

    onUnmounted(() => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
        resizeTimer = null
      }

      if (chartInstance.value) {
        try {
          chartInstance.value.off()
          chartInstance.value.dispose()
        } catch (e) {
          console.warn('Error disposing chart on unmount:', e)
        }
        chartInstance.value = null
      }

      window.removeEventListener('resize', debouncedResize)
    })

    return {
      chartRef,
      loading,
      error,
      insights,
      fetchData,
      exportChart,
      getHighestRate,
      getOnlineHarassmentRate,
      getFraudScamsRate,
      getRiskRatio
    }
  }
}
</script>

<style scoped>
.heatmap-section {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  font-family: inherit;
}

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
  background: var(--violet-ultra-dark);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.download-btn:hover:not(:disabled) {
  background: var(--violet-dark);
}

.download-btn:disabled {
  background: var(--violet-sage);
  cursor: not-allowed;
  opacity: 0.6;
}

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
  border-top: 3px solid var(--violet-dark);
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

.error-state h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--violet-ultra-dark);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.retry-btn:hover {
  background: var(--violet-dark);
}

.content {
  display: flex;
  flex-direction: column;
}

.chart-container {
  background: var(--text-light);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.main-chart {
  width: 100%;
  height: 500px;
  min-height: 400px;
  position: relative;
  overflow: hidden;
}

.data-source {
  text-align: center;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border-light);
  margin-top: 0.5rem;
}

.data-source p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Analysis Panel Container */
.insights-panel {
  background: transparent;
  border-radius: 0;
  padding: 2rem 0;
}

.insights-panel h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

/* Insight Section Container */
.insight-section {
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: var(--violet-dark);
  border-radius: 8px;
}

.section-title {
  margin: 0 0 1rem 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Key Figures Summary Section */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--violet-light);
  color: var(--text-primary);
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.3;
}

/* Key Findings Section */
.key-findings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.finding-item {
  padding: 1rem;
  background: var(--violet-light);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Age Group Characteristics Section */
.age-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.age-group {
  padding: 1.5rem;
  background: var(--violet-light);
  border-radius: 8px;
}

.age-title {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.age-group ul {
  margin: 0;
  padding-left: 1rem;
}

.age-group li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Action Recommendations Section */
.recommendations {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-item {
  padding: 1rem;
  background: var(--violet-light);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Trend Analysis Section */
.trend-analysis {
  padding: 1.5rem;
  background: var(--violet-light);
  border-radius: 8px;
}

.trend-analysis h6 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.trend-analysis p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .heatmap-section {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .title-section {
    text-align: center;
  }

  .main-chart {
    height: 400px;
    min-height: 350px;
  }

  .insights-panel {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .age-analysis {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-chart {
    height: 350px;
    min-height: 300px;
  }

  .chart-container {
    padding: 1rem;
  }
}
</style>
