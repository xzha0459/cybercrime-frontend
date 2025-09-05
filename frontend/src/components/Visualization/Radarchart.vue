<template>
  <div class="radar-chart-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading financial loss data...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Error loading data: {{ error }}</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <div class="chart-wrapper">
      <h3 class="chart-title">Cybercrime Financial Loss Comparison</h3>
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'RadarChart',
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const chartData = ref(null)

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

    // Process and normalize the data for radar chart
    const processData = (rawData) => {
      // 检查数据中实际存在的值
      const actualCrimeTypes = [...new Set(rawData.map(item => item.cybercrime))]
      const actualDimensions = [...new Set(rawData.map(item => item.median_type))]

      // 创建数据映射
      const dataMap = {}

      // 使用实际存在的犯罪类型，而不是硬编码
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

      // 计算最大值用于标准化
      const maxValues = {}
      actualDimensions.forEach(dimension => {
        maxValues[dimension] = Math.max(
          ...actualCrimeTypes.map(type => dataMap[type][dimension] || 0)
        )
      })

      // 标准化数据
      const normalizedData = {}
      actualCrimeTypes.forEach(type => {
        normalizedData[type] = {}
        actualDimensions.forEach(dimension => {
          const maxVal = maxValues[dimension]
          normalizedData[type][dimension] = maxVal > 0
            ? Math.round((dataMap[type][dimension] / maxVal) * 100)
            : 0
        })
      })

      return {
        cybercrimeTypes: actualCrimeTypes, // 使用实际的犯罪类型
        lossDimensions: actualDimensions,  // 使用实际的维度
        normalizedData,
        rawData: dataMap
      }
    }

    // Initialize ECharts radar chart
    const initChart = () => {
      if (!chartRef.value || !chartData.value) {
        return
      }

      const { cybercrimeTypes, lossDimensions, normalizedData } = chartData.value

      if (!cybercrimeTypes || !cybercrimeTypes.length || !lossDimensions || !lossDimensions.length) {
        error.value = 'No valid data available for visualization'
        return
      }

      // 创建图表实例
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }

      chartInstance.value = echarts.init(chartRef.value)

      // 准备系列数据
      const seriesData = cybercrimeTypes.map(type => ({
        name: type,
        value: lossDimensions.map(dimension => normalizedData[type][dimension] || 0),
        itemStyle: {
          color: getColorForType(type)
        }
      }))

      // 图表配置
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const { name, value, dataIndex } = params
            const dimension = lossDimensions[dataIndex]
            const rawValue = chartData.value.rawData[name][dimension] || 0
            return `
              <div style="text-align: left;">
                <strong>${name}</strong><br/>
                <strong>${dimension}:</strong> $${rawValue.toLocaleString()}<br/>
                <strong>Normalized:</strong> ${value}%
              </div>
            `
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          data: cybercrimeTypes,
          textStyle: {
            fontSize: 11
          }
        },
        radar: {
          indicator: lossDimensions.map(dimension => ({
            name: formatDimensionName(dimension),
            max: 100,
            min: 0
          })),
          name: {
            textStyle: {
              fontSize: 10,
              color: '#666'
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(250, 250, 250, 0.1)', 'rgba(200, 200, 200, 0.1)']
            }
          }
        },
        series: [{
          name: 'Financial Loss',
          type: 'radar',
          data: seriesData,
          areaStyle: {
            opacity: 0.2
          },
          lineStyle: {
            width: 2
          },
          symbolSize: 4
        }]
      }

      // Set chart option
      chartInstance.value.setOption(option)

      // Handle window resize
      const handleResize = () => {
        if (chartInstance.value) {
          chartInstance.value.resize()
        }
      }
      window.addEventListener('resize', handleResize)
    }

    // 辅助函数
    const formatDimensionName = (dimension) => {
      return dimension
        .replace('Median amount ', '')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/(.{15})/g, "$1\n") // 长文本换行
    }

    // 颜色映射改进
    const getColorForType = (type) => {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
      ]

      // 为每个类型分配一个固定颜色
      const index = chartData.value?.cybercrimeTypes?.indexOf(type) || 0
      return colors[index % colors.length] || '#95A5A6'
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
      fetchData
    }
  }
}
</script>

<style scoped>
.radar-chart-container {
  width: 100%;
  height: 600px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
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
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #2980b9;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.chart {
  width: 100%;
  height: 500px;
}

/* Responsive design */
@media (max-width: 768px) {
  .radar-chart-container {
    height: 500px;
    padding: 10px;
  }

  .chart {
    height: 400px;
  }
}
</style>
