<template>
  <div class="grouped-bar-chart-container">
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
      </div>
      <div ref="chartRef" class="chart"></div>
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
        title: {
          text: 'Cybercrime Financial Impact Comparison',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2c3e50'
          }
        },
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
          left: '20%',
          right: '10%',
          top: '15%',
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
      fetchData
    }
  }
}
</script>

<style scoped>
.grouped-bar-chart-container {
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

.grouped-bar-chart-container::before {
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
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  gap: 12px;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  color: #34495e;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.sort-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.sort-select:hover {
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
  .grouped-bar-chart-container {
    height: 550px;
    padding: 20px;
  }

  .chart {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .grouped-bar-chart-container {
    height: 500px;
    padding: 16px;
    border-radius: 12px;
  }

  .chart {
    height: 400px;
  }

  .chart-header {
    margin-bottom: 16px;
  }

  .sort-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .sort-select {
    min-width: 100%;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .grouped-bar-chart-container {
    height: 450px;
    padding: 12px;
  }

  .chart {
    height: 350px;
  }

  .chart-header {
    margin-bottom: 12px;
  }
}
</style>
