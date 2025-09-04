<template>
  <div class="economic-loss-section">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h3>Financial Damage vs Victimization Frequency by Crime Type</h3>
          <p>Economic damage versus population impact rates for key cybercrime types</p>
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
      <p>Unable to fetch data, please try again later</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <div v-else class="content">
      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-group">
          <label>Display Mode:</label>
          <select v-model="displayMode" @change="updateChart">
            <option value="combo">Combined Chart</option>
            <option value="loss_only">Economic Loss Only</option>
            <option value="rate_only">Victimization Rate Only</option>
          </select>
        </div>

      </div>

      <!-- Main ECharts Visualization -->
      <div class="chart-container">
        <v-chart
          class="main-chart"
          :option="chartOption"
          :autoresize="true"
        />
      </div>

      <!-- Summary Statistics -->
      <div class="summary-grid">
        <div class="summary-card high-impact">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="metric-value">${{ totalLoss.toFixed(1) }}M</div>
            <div class="metric-label">Total Economic Loss</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="metric-value">{{ averageVictimRate.toFixed(2) }}%</div>
            <div class="metric-label">Average Victimization Rate</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="metric-value">{{ mostDangerous.name }}</div>
            <div class="metric-label">Highest Victimization Rate</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div class="card-content">
            <div class="metric-value">{{ costliestCrime.name }}</div>
            <div class="metric-label">Highest Economic Loss</div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  name: 'EconomicLossVisualization',
  components: {
    VChart
  },
  data() {
    return {
      loading: true,
      hasError: false,
      chartData: [],
      displayMode: 'combo' // 'combo', 'loss_only', 'rate_only'
    }
  },
  computed: {
    chartOption() {
      if (!this.chartData.length) return {}

      const sortedData = this.getSortedData()
      const categories = sortedData.map(d => d.name)
      const lossData = sortedData.map(d => d.loss)
      const rateData = sortedData.map(d => d.victimRate)

      const series = []

      // 根据显示模式配置series
      if (this.displayMode === 'combo' || this.displayMode === 'loss_only') {
        series.push({
          name: 'Economic Loss',
          type: 'bar',
          yAxisIndex: 0,
          data: lossData,
          barWidth: '40%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#10b981' },
                { offset: 1, color: '#047857' }
              ]
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '${c}M',
            fontSize: 11
          }
        })
      }

      if (this.displayMode === 'combo' || this.displayMode === 'rate_only') {
        series.push({
          name: 'Victimization Rate',
          type: 'line',
          yAxisIndex: this.displayMode === 'combo' ? 1 : 0,
          data: rateData,
          lineStyle: {
            width: 5,
            color: '#8b5cf6'
          },
          itemStyle: {
            color: '#8b5cf6',
            borderColor: '#f5f5f0',
            borderWidth: 2
          },
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              return params.value.toFixed(2) + '%';
            },
            fontSize: 11,
            color: '#8b5cf6'
          }
        })
      }

      const yAxis = []
      if (this.displayMode === 'combo') {
        yAxis.push(
          {
            type: 'value',
            name: 'Economic Loss (M$)',
            position: 'left',
            axisLabel: { formatter: '${value}M' },
            splitLine: { show: false }
          },
          {
            type: 'value',
            name: 'Victimization Rate (%)',
            position: 'right',
            axisLabel: { formatter: (value) => value.toFixed(2) + '%' },
            splitLine: { show: false }
          }
        )
      } else if (this.displayMode === 'loss_only') {
        yAxis.push({
          type: 'value',
          name: 'Economic Loss (M$)',
          axisLabel: { formatter: '${value}M' }
        })
      } else {
        yAxis.push({
          type: 'value',
          name: 'Victimization Rate (%)',
          axisLabel: { formatter: (value) => value.toFixed(2) + '%' }
        })
      }

      return {
        title: {
          text: this.getChartTitle(),
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2d3a2d'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
                      formatter: (params) => {
              let result = `<div style="text-align: left;"><strong>${params[0].name}</strong><br/>`
              params.forEach(param => {
                const icon = param.seriesName === 'Economic Loss' ? '💰' : '📊'
                const unit = param.seriesName === 'Economic Loss' ? 'M$' : '%'
                const value = param.seriesName === 'Economic Loss' ? param.value.toFixed(1) : param.value.toFixed(2)
                result += `${icon} ${param.seriesName}: <strong>${value}${unit}</strong><br/>`
              })
              result += '</div>'
              return result
            }
        },
        legend: {
          data: series.map(s => s.name),
          top: '10%',
          textStyle: { fontSize: 12 }
        },
        grid: {
          top: '20%',
          left: '10%',
          right: '10%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 10
          }
        },
        yAxis,
        series,
        animation: true,
        animationDuration: 1000
      }
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
        prev.victimRate > current.victimRate ? prev : current,
        this.chartData[0] || { name: 'N/A' })
    },

    costliestCrime() {
      return this.chartData.reduce((prev, current) =>
        prev.loss > current.loss ? prev : current,
        this.chartData[0] || { name: 'N/A' })
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.hasError = false

      try {
        const baseURL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

        const [financialResponse, victimResponse] = await Promise.all([
          fetch(`${baseURL}/infographics/financial-losses/`),
          fetch(`${baseURL}/infographics/victimisation/`)
        ])

        if (!financialResponse.ok || !victimResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const [financialData, victimData] = await Promise.all([
          financialResponse.json(),
          victimResponse.json()
        ])

        this.processData(financialData, victimData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        this.hasError = true
      } finally {
        this.loading = false
      }
    },

    downloadChart() {
      try {
        // 获取图表容器的 HTML 内容
        const chartContainer = this.$el.querySelector('.content')
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
            link.download = 'economic-loss-analysis.png'
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

    processData(financialData, victimData) {
      const dataMap = new Map()

      // 处理经济损失数据
      financialData.forEach(item => {
        const type = this.normalizeCrimeType(item.cybercrime)
        if (!type || type === 'any_cybercrime') return

        if (!dataMap.has(type)) {
          dataMap.set(type, {
            name: type,
            shortName: this.getShortName(type),
            loss: 0,
            victimRates: [],
            sampleCount: 0
          })
        }

        dataMap.get(type).loss += (item.value || 0)
      })

      // 处理受害率数据
      victimData.forEach(item => {
        const type = this.normalizeCrimeType(item.main_type)
        if (!type || type === 'any_cybercrime') return

        if (!dataMap.has(type)) {
          dataMap.set(type, {
            name: type,
            shortName: this.getShortName(type),
            loss: 0,
            victimRates: [],
            sampleCount: 0
          })
        }

        const data = dataMap.get(type)
        if (item.prevalence_2024 && item.prevalence_2024 > 0) {
          data.victimRates.push(item.prevalence_2024)
          data.sampleCount++
        }
      })

      // 计算最终数据
      this.chartData = Array.from(dataMap.values())
        .filter(item => item.loss > 0 || item.victimRates.length > 0)
        .map(item => ({
          name: this.getDisplayName(item.name),
          shortName: item.shortName,
          loss: item.loss,
          victimRate: item.victimRates.length > 0
            ? item.victimRates.reduce((a, b) => a + b, 0) / item.victimRates.length
            : 0,
          sampleSize: item.sampleCount
        }))
        .filter(item => item.loss > 0 && item.victimRate > 0) // 只显示有完整数据的类型

      console.log('Processed chart data:', this.chartData)
    },

    normalizeCrimeType(type) {
      if (!type) return null

      const normalized = type.toLowerCase().trim()

      if (normalized.includes('any cybercrime') || normalized.includes('all')) {
        return 'any_cybercrime'
      } else if (normalized.includes('online abuse') || normalized.includes('harassment')) {
        return 'online_abuse'
      } else if (normalized.includes('malware') || normalized.includes('virus')) {
        return 'malware'
      } else if (normalized.includes('identity') || normalized.includes('personal information')) {
        return 'identity_crime'
      } else if (normalized.includes('fraud') || normalized.includes('scam')) {
        return 'fraud_scams'
      } else if (normalized.includes('hacking') || normalized.includes('unauthorized access')) {
        return 'hacking'
      } else if (normalized.includes('privacy') || normalized.includes('data breach')) {
        return 'privacy_breach'
      }

      return null
    },

    getDisplayName(key) {
      const names = {
        'online_abuse': 'Online Abuse & Harassment',
        'malware': 'Malware Attacks',
        'identity_crime': 'Identity Crime',
        'fraud_scams': 'Fraud & Scams',
        'hacking': 'Hacking',
        'privacy_breach': 'Privacy Breach'
      }
      return names[key] || key
    },

    getShortName(key) {
      const shortNames = {
        'online_abuse': 'Abuse',
        'malware': 'Malware',
        'identity_crime': 'Identity',
        'fraud_scams': 'Fraud',
        'hacking': 'Hacking',
        'privacy_breach': 'Privacy'
      }
      return shortNames[key] || key.substring(0, 8)
    },

    getSortedData() {
      return [...this.chartData].sort((a, b) => b.loss - a.loss)
    },

    getChartTitle() {
      const titles = {
        'combo': 'Economic Loss vs Victimization Rate by Crime Type',
        'loss_only': 'Economic Loss by Crime Type',
        'rate_only': 'Victimization Rate by Crime Type'
      }
      return titles[this.displayMode]
    },



    updateChart() {
      // 触发响应式更新
      this.$nextTick(() => {
        // Chart will automatically update due to reactive data
      })
    }
  }
}
</script>

<style scoped>
.economic-loss-section {
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

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: var(--text-secondary);
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

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
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
}

.filter-controls {
  display: flex;
  justify-content: center;
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

.chart-container {
  background: var(--text-light);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.main-chart {
  height: 450px;
  width: 100%;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;

}

.summary-card {
  background: var(--text-light);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow-light);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  text-align: center;
}


.summary-card.high-impact {
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-sage) 100%);
  border-color: var(--forest-medium);
}

.card-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--forest-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .economic-loss-section {
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

  .title-section h3 {
    font-size: 1.5rem;
  }

  .title-section p {
    font-size: 0.9rem;
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

  .main-chart {
    height: 350px;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .metric-value {
    font-size: 1.2rem;
  }


}

@media (max-width: 480px) {

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .summary-card {
    padding: 0.8rem;
  }

  .metric-value {
    font-size: 1.1rem;
  }

  .metric-label {
    font-size: 0.8rem;
  }

  .main-chart {
    height: 280px;
  }


}
</style>
