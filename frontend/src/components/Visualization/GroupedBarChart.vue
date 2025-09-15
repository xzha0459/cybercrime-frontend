<template>
  <div class="grouped-bar-section">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h3>Cybercrime Financial Impact Analysis</h3>
          <p>Comprehensive comparison of financial losses across different cybercrime types</p>
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
      <p>Loading financial loss data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h4>Data Loading Failed</h4>
      <p>Unable to fetch data, please try again later</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <div v-else class="content">
      <!-- Chart Controls -->
      <div class="chart-controls">
        <div class="sort-controls">
          <label for="sort-select" class="sort-label">Sort by:</label>
          <select
            id="sort-select"
            v-model="sortBy"
            class="sort-select"
          >
            <option value="none">Original Order</option>
            <option value="direct_loss">Direct Loss (High to Low)</option>
            <option value="additional_costs">Additional Costs (High to Low)</option>
            <option value="amount_recovered">Amount Recovered (High to Low)</option>
            <option value="net_loss">Net Loss (High to Low)</option>
          </select>
        </div>
      </div>

      <!-- Main ECharts Visualization -->
      <div class="chart-container">
        <div ref="chartRef" class="main-chart"></div>
        <div class="data-source">
          <p>Sourced from: © Commonwealth of Australia, Australian Institute of Criminology (AIC)</p>
        </div>
      </div>

      <!-- Insights Panel -->
      <div v-if="insights" class="insights-panel">
        <h4>Financial Impact Analysis</h4>

        <!-- Key Statistics -->
        <div class="insight-section">
          <h5 class="section-title">Key Financial Figures</h5>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${{ getMalwareDirectLoss() }}M</div>
              <div class="stat-label">Malware direct loss amount (highest)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${{ getOnlineAbuseDirectLoss() }}M</div>
              <div class="stat-label">Online abuse median direct loss</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${{ getOnlineAbuseNetLoss() }}M</div>
              <div class="stat-label">Online abuse victims' net loss amount</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">$100M-$350M</div>
              <div class="stat-label">Median loss range across cybercrime types</div>
            </div>
          </div>
        </div>

        <!-- Key Findings -->
        <div class="insight-section">
          <h5 class="section-title">Key Findings</h5>
          <div class="key-findings">
            <div class="finding-item">
              <strong>"Financial impact varies significantly across cybercrime types"</strong>
            </div>
            <div class="finding-item">
              "Identity theft and fraud show the highest financial losses"
            </div>
            <div class="finding-item">
              "Recovery rates are generally low, with most victims unable to recover their losses"
            </div>
          </div>
        </div>

        <!-- Crime Type Analysis -->
        <div class="insight-section">
          <h5 class="section-title">Crime Type Characteristics</h5>
          <div class="crime-analysis">
            <div class="crime-group">
              <h6 class="crime-title">High Financial Impact</h6>
              <ul>
                <li>Identity theft and fraud typically cause the highest direct losses</li>
                <li>Additional costs often exceed direct losses due to recovery efforts</li>
                <li>Low recovery rates compound the financial burden</li>
              </ul>
            </div>
            <div class="crime-group">
              <h6 class="crime-title">Medium Financial Impact</h6>
              <ul>
                <li>Malware and phishing attacks show moderate financial impact</li>
                <li>Recovery efforts may be more successful for these types</li>
              </ul>
            </div>
            <div class="crime-group">
              <h6 class="crime-title">Lower Financial Impact</h6>
              <ul>
                <li>Some cybercrimes have lower direct financial costs</li>
                <li>May still incur significant indirect costs</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Recommendations -->
        <div class="insight-section">
          <h5 class="section-title">Financial Protection Recommendations</h5>
          <div class="recommendations">
            <div class="recommendation-item">
              <strong>Prevention:</strong> Invest in comprehensive cybersecurity measures to prevent initial losses
            </div>
            <div class="recommendation-item">
              <strong>Insurance:</strong> Consider cyber insurance to mitigate financial impact
            </div>
            <div class="recommendation-item">
              <strong>Recovery:</strong> Act quickly to report incidents and begin recovery processes
            </div>
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
  name: 'GroupedBarChart',
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const chartData = ref(null)
    const sortBy = ref('none')
    const insights = ref(null)

    // API base URL - using AWS API Gateway
    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    // Fetch data from API
    const fetchData = async () => {
      try {
        loading.value = true
        error.value = null

        const response = await fetch(`${API_BASE_URL}/infographics/financial-losses/`, {
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

        // 保存原始数据
        chartData.value = rawData

        // 确保DOM更新后再初始化图表
        await nextTick()

        // 添加小延迟确保DOM完全渲染
        setTimeout(() => {
          initChart()
        }, 100)

      } catch (err) {
        console.error('Error details:', err)
        error.value = err.message || 'Failed to fetch data'
      } finally {
        loading.value = false
      }
    }

    // 横向分组柱状图数据处理逻辑
    const processHorizontalGroupedData = (rawData) => {
      // 提取唯一的犯罪类型
      const crimeTypes = [...new Set(rawData.map(item => item.cybercrime))]

      // 定义损失维度
      const lossTypes = [
        'Median amount directly lost',
        'Median amount spent on consequences',
        'Median amount recovered',
        'Median amount lost after recoveries'
      ]

      // 初始化数据映射结构
      const dataMap = {}
      crimeTypes.forEach(crime => {
        dataMap[crime] = {}
        lossTypes.forEach(type => {
          dataMap[crime][type] = 0
        })
      })

      // 填充实际数据
      rawData.forEach(item => {
        if (crimeTypes.includes(item.cybercrime) && lossTypes.includes(item.median_type)) {
          dataMap[item.cybercrime][item.median_type] = item.value
        }
      })

      return { crimeTypes, lossTypes, dataMap }
    }

    // ECharts横向分组柱状图配置
    const createHorizontalGroupedBarOption = (processedData) => {
      const { crimeTypes, lossTypes, dataMap } = processedData

      // 简化标签名称
      const simplifiedLabels = {
        'Median amount directly lost': 'Direct Loss',
        'Median amount spent on consequences': 'Additional Costs',
        'Median amount recovered': 'Amount Recovered',
        'Median amount lost after recoveries': 'Net Loss'
      }

      // 颜色配置
      const colors = {
        'Direct Loss': '#E74C3C',           // 红色 - 直接损失
        'Additional Costs': '#E67E22',      // 橙色 - 额外成本
        'Amount Recovered': '#27AE60',      // 绿色 - 恢复金额
        'Net Loss': '#8E44AD'              // 紫色 - 净损失
      }

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            let result = `<div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
                ${params[0].name}
              </div>`

            params.forEach(param => {
              const value = param.value
              const color = param.color
              result += `
                <div style="margin: 4px 0; display: flex; align-items: center;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 2px; margin-right: 8px;"></span>
                  <span style="color: #34495e;">${param.seriesName}:</span>
                  <span style="font-weight: bold; margin-left: 8px; color: #2c3e50;">$${value.toLocaleString()}</span>
                </div>`
            })

            result += `</div>`
            return result
          }
        },
        legend: {
          data: Object.keys(simplifiedLabels).map(key => simplifiedLabels[key]),
          top: 'bottom',
          itemGap: 20,
          textStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '10%',
          bottom: '20%',
          containLabel: false
        },
        xAxis: {
          type: 'value',
          name: 'Amount ($)',
          nameTextStyle: {
            color: '#666',
            fontSize: 12
          },
          axisLabel: {
            formatter: function(value) {
              if (value >= 1000) {
                return '$' + (value / 1000).toFixed(0) + 'K'
              }
              return '$' + value
            },
            color: '#666'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: crimeTypes,
          axisLabel: {
            fontSize: 12,
            color: '#666',
            // 如果标签太长，可以换行显示
            formatter: function(value) {
              if (value.length > 20) {
                const words = value.split(' ')
                const mid = Math.ceil(words.length / 2)
                return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ')
              }
              return value
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: lossTypes.map(lossType => ({
          name: simplifiedLabels[lossType],
          type: 'bar',
          data: crimeTypes.map(crime => dataMap[crime][lossType]),
          itemStyle: {
            color: colors[simplifiedLabels[lossType]],
            borderRadius: [0, 4, 4, 0] // 右侧圆角
          },
          barMaxWidth: 25, // 控制柱子最大宽度
          label: {
            show: false, // 可以设为true在柱子上显示数值
            position: 'right',
            fontSize: 10,
            formatter: function(params) {
              return '$' + params.value.toLocaleString()
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }))
      }
    }

    // 多维度排序功能
    const sortDataByDimension = (processedData, sortType) => {
      if (sortType === 'none') {
        return processedData
      }

      const { crimeTypes, dataMap } = processedData

      // 定义排序字段映射
      const sortFieldMap = {
        'direct_loss': 'Median amount directly lost',
        'additional_costs': 'Median amount spent on consequences',
        'amount_recovered': 'Median amount recovered',
        'net_loss': 'Median amount lost after recoveries'
      }

      const sortField = sortFieldMap[sortType]
      if (!sortField) {
        return processedData
      }

      // 创建新的数组副本进行排序，避免修改原始数组
      const sortedCrimes = [...crimeTypes].sort((a, b) => {
        const valueA = dataMap[a][sortField] || 0
        const valueB = dataMap[b][sortField] || 0
        return valueB - valueA
      })

      return {
        ...processedData,
        crimeTypes: sortedCrimes
      }
    }

    // Initialize ECharts grouped bar chart
    const initChart = () => {
      if (!chartRef.value || !chartData.value) {
        return
      }

      if (!Array.isArray(chartData.value) || chartData.value.length === 0) {
        error.value = 'No valid data available for visualization'
        return
      }

      // 创建图表实例
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }

      chartInstance.value = echarts.init(chartRef.value)

      // 初始化图表
      updateChart()

      // Handle window resize
      const handleResize = () => {
        if (chartInstance.value) {
          chartInstance.value.resize()
        }
      }
      window.addEventListener('resize', handleResize)
    }

    // Update chart with current data
    const updateChart = () => {
      if (chartInstance.value && chartData.value) {
        let processedData = processHorizontalGroupedData(chartData.value)

        // 根据选择的排序方式排序
        processedData = sortDataByDimension(processedData, sortBy.value)

        const option = createHorizontalGroupedBarOption(processedData)
        chartInstance.value.setOption(option, true)

        // Generate insights
        insights.value = generateFinancialInsights(processedData)
      }
    }

    // Generate insights
    const generateFinancialInsights = (processedData) => {
      const { crimeTypes, dataMap } = processedData

      if (!crimeTypes || crimeTypes.length === 0) {
        return null
      }

      return {
        highestDirectLoss: Math.max(...crimeTypes.map(crime => dataMap[crime]['Median amount directly lost'] || 0)),
        highestNetLoss: Math.max(...crimeTypes.map(crime => dataMap[crime]['Median amount lost after recoveries'] || 0)),
        totalRecovered: crimeTypes.reduce((sum, crime) => sum + (dataMap[crime]['Median amount recovered'] || 0), 0),
        averageRecoveryRate: calculateAverageRecoveryRate(processedData)
      }
    }

    // Calculate average recovery rate
    const calculateAverageRecoveryRate = (processedData) => {
      const { crimeTypes, dataMap } = processedData
      let totalRate = 0
      let validCount = 0

      crimeTypes.forEach(crime => {
        const directLoss = dataMap[crime]['Median amount directly lost'] || 0
        const recovered = dataMap[crime]['Median amount recovered'] || 0

        if (directLoss > 0) {
          totalRate += (recovered / directLoss) * 100
          validCount++
        }
      })

      return validCount > 0 ? (totalRate / validCount).toFixed(1) : '0.0'
    }

    // Statistics functions
    const getMalwareDirectLoss = () => {
      if (!chartData.value || !Array.isArray(chartData.value)) return '0'
      const malwareData = chartData.value.find(item =>
        item.cybercrime === 'Malware' &&
        item.median_type === 'Median amount directly lost'
      )
      return malwareData ? malwareData.value.toLocaleString() : '0'
    }

    const getOnlineAbuseDirectLoss = () => {
      if (!chartData.value || !Array.isArray(chartData.value)) return '0'
      const onlineAbuseData = chartData.value.find(item =>
        item.cybercrime === 'Online abuse and harassment' &&
        item.median_type === 'Median amount directly lost'
      )
      return onlineAbuseData ? onlineAbuseData.value.toLocaleString() : '0'
    }

    const getOnlineAbuseNetLoss = () => {
      if (!chartData.value || !Array.isArray(chartData.value)) return '0'
      const onlineAbuseData = chartData.value.find(item =>
        item.cybercrime === 'Online abuse and harassment' &&
        item.median_type === 'Median amount lost after recoveries'
      )
      return onlineAbuseData ? onlineAbuseData.value.toLocaleString() : '0'
    }

    // Export chart
    const exportChart = () => {
      if (chartInstance.value) {
        const url = chartInstance.value.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        })

        const link = document.createElement('a')
        link.download = 'financial-impact-chart.png'
        link.href = url
        link.click()
      }
    }

    // Watch for sortBy changes
    watch(sortBy, () => {
      updateChart()
    })

    // Lifecycle hooks
    onMounted(() => {
      fetchData()
    })

    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }
      window.removeEventListener('resize', () => {})
    })

    return {
      chartRef,
      loading,
      error,
      sortBy,
      insights,
      fetchData,
      exportChart,
      getMalwareDirectLoss,
      getOnlineAbuseDirectLoss,
      getOnlineAbuseNetLoss
    }
  }
}
</script>

<style scoped>
.grouped-bar-section {
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

.chart-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  background: var(--text-light);
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--violet-dark);
  box-shadow: 0 0 0 2px white;
}

.sort-select:hover {
  border-color: var(--violet-dark);
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

/* Key Financial Figures Section */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--violet-light);
  border-radius: 8px;
  color: var(--text-primary);
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

/* Crime Type Characteristics Section */
.crime-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.crime-group {
  padding: 1.5rem;
  background: var(--violet-light);
  border-radius: 8px;
}

.crime-title {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.crime-group ul {
  margin: 0;
  padding-left: 1rem;
}

.crime-group li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Financial Protection Recommendations Section */
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

@media (max-width: 768px) {
  .grouped-bar-section {
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

  .crime-analysis {
    grid-template-columns: 1fr;
  }

  .chart-controls {
    justify-content: center;
  }

  .sort-controls {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-select {
    min-width: 100%;
    font-size: 0.8rem;
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
