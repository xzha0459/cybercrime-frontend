<template>
  <div class="waterfall-chart-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading financial loss data...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error loading data: {{ error }}</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <div v-else class="chart-wrapper">
      <div class="chart-header">
        <div class="filter-section">
          <label for="crime-type-filter" class="filter-label">Select Crime Type:</label>
          <select
            id="crime-type-filter"
            v-model="selectedCrimeType"
            @change="updateChart"
            class="filter-select"
          >
            <option
              v-for="type in availableCrimeTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>
      </div>
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'WaterfallChart',
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const chartData = ref(null)
    const selectedCrimeType = ref('all')
    const availableCrimeTypes = ref([])

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

        // 处理数据
        chartData.value = processData(rawData)

        // 保存原始数据供瀑布图使用
        chartData.value.originalRawData = rawData

        // 获取可用的犯罪类型
        availableCrimeTypes.value = chartData.value.cybercrimeTypes

        // 设置默认选择的犯罪类型
        if (availableCrimeTypes.value.length > 0) {
          selectedCrimeType.value = availableCrimeTypes.value[0]
        }

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

    // Process and normalize the data for waterfall chart
    const processData = (rawData) => {
      // 检查数据中实际存在的值
      const actualCrimeTypes = [...new Set(rawData.map(item => item.cybercrime))]
      const actualDimensions = [...new Set(rawData.map(item => item.median_type))]

      // 创建数据映射
      const dataMap = {}

      // 使用实际存在的犯罪类型
      actualCrimeTypes.forEach(type => {
        dataMap[type] = {}
        actualDimensions.forEach(dimension => {
          dataMap[type][dimension] = 0
        })
      })

      // 填充实际数据
      rawData.forEach(item => {
        if (item.cybercrime && item.median_type && typeof item.value === 'number') {
          if (!dataMap[item.cybercrime]) {
            dataMap[item.cybercrime] = {}
          }
          dataMap[item.cybercrime][item.median_type] = item.value
        }
      })

      return {
        cybercrimeTypes: actualCrimeTypes,
        lossDimensions: actualDimensions,
        rawData: dataMap
      }
    }

    // Initialize ECharts waterfall chart
    const initChart = () => {
      if (!chartRef.value || !chartData.value) {
        return
      }

      const { cybercrimeTypes } = chartData.value

      if (!cybercrimeTypes || !cybercrimeTypes.length) {
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

    // 优化的瀑布图数据处理逻辑
    const createWaterfallData = (crimeType, rawData) => {
      // 从原始数据中提取特定犯罪类型的数据
      const crimeData = rawData.filter(item => item.cybercrime === crimeType)

      // 提取各个维度的值
      const directLoss = crimeData.find(item => item.median_type === 'Median amount directly lost')?.value || 0
      const consequences = crimeData.find(item => item.median_type === 'Median amount spent on consequences')?.value || 0
      const recovered = crimeData.find(item => item.median_type === 'Median amount recovered')?.value || 0

      // 瀑布图数据结构
      const waterfallSteps = [
        {
          name: 'Initial',
          value: 0,
          type: 'start',
          color: '#95A5A6',
          cumulative: 0
        },
        {
          name: 'Direct Loss',
          value: directLoss,
          type: 'loss',
          color: '#E74C3C',
          cumulative: directLoss
        },
        {
          name: 'Additional Costs',
          value: consequences,
          type: 'loss',
          color: '#E67E22',
          cumulative: directLoss + consequences
        },
        {
          name: 'Amount Recovered',
          value: -recovered, // 负值表示减少
          type: 'recovery',
          color: '#27AE60',
          cumulative: directLoss + consequences - recovered
        },
        {
          name: 'Net Loss',
          value: directLoss + consequences - recovered,
          type: 'final',
          color: '#8E44AD',
          cumulative: directLoss + consequences - recovered
        }
      ]

      return waterfallSteps
    }

    // ECharts 瀑布图配置
    const createWaterfallOption = (waterfallData, crimeType) => {
      // 准备数据数组
      const categories = waterfallData.map(item => item.name)
      const values = []
      const colors = []

      // 计算瀑布图的正确位置
      waterfallData.forEach((item, index) => {
        if (index === 0) {
          // 起始点
          values.push(0)
        } else if (item.type === 'final') {
          // 最终值显示累计总额
          values.push(item.cumulative)
        } else {
          // 中间步骤：显示变化量
          values.push(item.value)
        }
        colors.push(item.color)
      })

      return {
        backgroundColor: 'transparent',
        title: {
          text: `${crimeType} - Financial Impact Flow`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'transparent',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: function(params) {
            const dataIndex = params[0].dataIndex
            const step = waterfallData[dataIndex]

            let content = `<div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #3498db;">${step.name}</div>`

            if (step.type === 'start') {
              content += `<div>Starting point: $0</div>`
            } else if (step.type === 'final') {
              content += `<div>Final net loss: $${Math.abs(step.cumulative).toLocaleString()}</div>`
            } else {
              content += `<div>Amount: $${Math.abs(step.value).toLocaleString()}</div>
                         <div>Running total: $${step.cumulative.toLocaleString()}</div>`
            }

            content += `</div>`
            return content
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            fontSize: 12,
            color: '#34495e',
            rotate: 0
          },
          axisLine: {
            lineStyle: {
              color: '#bdc3c7'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Amount ($)',
          nameTextStyle: {
            color: '#34495e',
            fontSize: 12
          },
          axisLabel: {
            color: '#34495e',
            fontSize: 11,
            formatter: function(value) {
              return '$' + Math.abs(value).toLocaleString()
            }
          },
          axisLine: {
            lineStyle: {
              color: '#bdc3c7'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ecf0f1'
            }
          }
        },
        series: [{
          name: 'Financial Flow',
          type: 'bar',
          data: values.map((value, index) => {
            const step = waterfallData[index]
            return {
              value: value,
              itemStyle: {
                color: step.color
              },
              // 添加标签显示具体金额
              label: {
                show: true,
                position: value >= 0 ? 'top' : 'bottom',
                formatter: function() {
                  if (step.type === 'start') return ''
                  return step.type === 'recovery'
                    ? `-$${Math.abs(step.value).toLocaleString()}`
                    : `$${Math.abs(step.value).toLocaleString()}`
                },
                fontSize: 11,
                fontWeight: 'bold',
                color: '#2c3e50'
              }
            }
          }),
          barWidth: '50%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }

    // Update chart when filter changes
    const updateChart = () => {
      if (chartInstance.value && chartData.value) {
        const crimeType = selectedCrimeType.value

        // 需要从原始API数据中获取，而不是处理后的数据
        const originalRawData = chartData.value.originalRawData || []
        const waterfallData = createWaterfallData(crimeType, originalRawData)
        const option = createWaterfallOption(waterfallData, crimeType)

        chartInstance.value.setOption(option)
      }
    }


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
      selectedCrimeType,
      availableCrimeTypes,
      fetchData,
      updateChart
    }
  }
}
</script>

<style scoped>
.waterfall-chart-container {
  width: 100%;
  height: 600px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.waterfall-chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c);
  border-radius: 16px 16px 0 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  position: relative;
  z-index: 1;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(52, 152, 219, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #e74c3c;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.error p {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
}

.retry-btn {
  margin-top: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(135deg, #2980b9, #1f618d);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.chart-title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  color: #34495e;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.filter-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-select:hover {
  border-color: #3498db;
}

.chart {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .waterfall-chart-container {
    height: 550px;
    padding: 20px;
  }

  .chart {
    height: 450px;
  }

  .chart-title {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .waterfall-chart-container {
    height: 500px;
    padding: 16px;
    border-radius: 12px;
  }

  .chart {
    height: 400px;
  }

  .chart-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-select {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .waterfall-chart-container {
    height: 450px;
    padding: 12px;
  }

  .chart {
    height: 350px;
  }

  .chart-title {
    font-size: 14px;
    margin-bottom: 12px;
  }
}
</style>
