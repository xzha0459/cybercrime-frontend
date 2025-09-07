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
              <strong>"Young people face the highest cybercrime risk"</strong>
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

    // 热力图数据处理逻辑 - 适配victimisation API数据结构
    const processHeatmapData = (rawData) => {
      if (!rawData || rawData.length === 0) {
        return {
          ageGroups: [],
          crimeTypes: [],
          dataMatrix: [],
          maxValue: 0
        }
      }

      // 提取年龄组并进行逻辑排序，排除"All respondents"
      const ageGroups = [...new Set(rawData.map(item => item.age))]
        .filter(age => age !== 'All respondents') // 排除"All respondents"
        .sort((a, b) => {
          // 自定义排序：确保年龄组按逻辑顺序排列
          const ageOrder = {
            'All ages': 0,
            '18 – 34': 1,
            '35 – 64': 2,
            '65+': 3
          }
          return (ageOrder[a] || 999) - (ageOrder[b] || 999)
        })

      // 提取犯罪类型并进行逻辑排序
      const crimeTypes = [...new Set(rawData.map(item => item.main_type))].sort((a, b) => {
        // 自定义排序：确保犯罪类型按逻辑顺序排列
        const crimeOrder = {
          'Online abuse and harassment': 0,
          'Malware': 1,
          'Identity crime and misuse': 2,
          'Fraud and scams': 3,
          'Any cybercrime victimization': 4
        }
        return (crimeOrder[a] || 999) - (crimeOrder[b] || 999)
      })

      // 创建数据矩阵
      const dataMatrix = []

      // 遍历每个年龄组和犯罪类型的组合
      ageGroups.forEach((age, ageIndex) => {
        crimeTypes.forEach((crime, crimeIndex) => {
          // 查找对应的受害率数据
          const dataPoint = rawData.find(item =>
            item.age === age &&
            item.main_type === crime
          )

          // 获取受害率值（prevalence_2024字段）
          const prevalenceValue = dataPoint ? (dataPoint.prevalence_2024 || 0) : 0

          // 热力图需要的数据格式：[x, y, value]
          // 调整坐标：X轴为犯罪类型，Y轴为年龄组（从下到上）
          dataMatrix.push([
            crimeIndex,  // X轴索引（犯罪类型）
            ageGroups.length - 1 - ageIndex,  // Y轴索引（年龄组，倒序排列）
            prevalenceValue  // 受害率值
          ])
        })
      })

      return {
        ageGroups: ageGroups.reverse(), // 反转年龄组顺序以匹配Y轴倒序
        crimeTypes,
        dataMatrix,
        maxValue: dataMatrix.length > 0 ? Math.max(...dataMatrix.map(item => item[2])) : 0
      }
    }


    // ECharts热力图配置
    const createHeatmapOption = (processedData) => {
      const { ageGroups, crimeTypes, dataMatrix, maxValue } = processedData

      return {
        tooltip: {
          position: 'top',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: 'transparent',
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: function(params) {
            const [crimeIndex, ageIndex, value] = params.value
            const crime = crimeTypes[crimeIndex]
            const age = ageGroups[ageIndex]

            return `
              <div style="padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 6px; color: #3498db;">
                  ${crime}
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="color: #ecf0f1;">Age Group:</span>
                  <span style="color: #f39c12; font-weight: bold;"> ${age}</span>
                </div>
                <div>
                  <span style="color: #ecf0f1;">Victimization Rate:</span>
                  <span style="color: #e74c3c; font-weight: bold;"> ${value.toFixed(1)}%</span>
                </div>
              </div>
            `
          }
        },
        grid: {
          left: '15%',
          right: '20%',
          top: '15%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: crimeTypes,
          splitArea: {
            show: true
          },
          axisLabel: {
            fontSize: 11,
            rotate: 0,
            margin: 15,
            color: '#34495e',
            interval: 0,
            formatter: function(value) {
              // 处理长标签，智能换行显示
              if (value && value.length > 12) {
                const words = value.split(' ')
                if (words.length > 1) {
                  const mid = Math.ceil(words.length / 2)
                  return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ')
                }
              }
              return value
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#bdc3c7'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#bdc3c7'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: ageGroups,
          splitArea: {
            show: true
          },
          axisLabel: {
            fontSize: 12,
            margin: 20,
            color: '#34495e',
            fontWeight: 'bold',
            formatter: function(value) {
              // 确保年龄组标签完整显示
              return value || ''
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#bdc3c7'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#bdc3c7'
            }
          }
        },
        visualMap: {
          min: 0,
          max: maxValue,
          calculable: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          itemWidth: 25,
          itemHeight: 180,
          textStyle: {
            color: '#34495e',
            fontSize: 11,
            fontWeight: 'bold'
          },
          textGap: 10,
          inRange: {
            color: [
              '#ffffff',  // 白色（0%）
              '#f0f8ff',  // 极浅蓝色
              '#e1f0ff',  // 浅蓝色
              '#cce7ff',  // 中浅蓝色
              '#99d6ff',  // 中蓝色
              '#66c2ff',  // 中深蓝色
              '#3399ff',  // 深蓝色
              '#0066cc',  // 更深蓝色
              '#003d7a'   // 极深蓝色（最高风险）
            ]
          },
          formatter: function(value) {
            return value.toFixed(1) + '%'
          },
          // 添加分段标签
          pieces: [
            { min: 0, max: 10, label: 'Low Risk' },
            { min: 10, max: 30, label: 'Medium Risk' },
            { min: 30, max: 50, label: 'High Risk' },
            { min: 50, max: 100, label: 'Very High Risk' }
          ]
        },
        series: [{
          name: 'Victimization Rate',
          type: 'heatmap',
          data: dataMatrix,
          label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000000',  // 统一使用黑色文字
            formatter: function(params) {
              const value = params.value[2]
              if (value === 0) {
                return '0.0%'
              }
              return value.toFixed(1) + '%'
            }
          },
          itemStyle: {
            borderColor: 'transparent',  // 移除白色边框
            borderWidth: 0,
            borderRadius: 0
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              borderColor: 'transparent',  // 悬停时也移除边框
              borderWidth: 0
            },
            label: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#000000'  // 悬停时也保持黑色文字
            }
          },
          // 添加动画效果
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut'
        }]

      }
    }

    // 可选：添加数据洞察功能
    const generateHeatmapInsights = (processedData) => {
      const { ageGroups, crimeTypes, dataMatrix } = processedData

      if (dataMatrix.length === 0) {
        return null
      }

      // 找出最高风险组合
      const maxRiskPoint = dataMatrix.reduce((max, current) =>
        current[2] > max[2] ? current : max
      )

      // 找出最低风险组合
      const minRiskPoint = dataMatrix.reduce((min, current) =>
        current[2] < min[2] ? current : min
      )

      // 计算每个年龄组的平均风险
      const ageRiskAverage = ageGroups.map((age, ageIndex) => {
        const ageData = dataMatrix.filter(item => item[1] === ageIndex)
        const avgRisk = ageData.reduce((sum, item) => sum + item[2], 0) / ageData.length
        return { age, avgRisk }
      })

      // 计算每种犯罪的平均风险
      const crimeRiskAverage = crimeTypes.map((crime, crimeIndex) => {
        const crimeData = dataMatrix.filter(item => item[0] === crimeIndex)
        const avgRisk = crimeData.reduce((sum, item) => sum + item[2], 0) / crimeData.length
        return { crime, avgRisk }
      })

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
        },
        ageRankings: ageRiskAverage.sort((a, b) => b.avgRisk - a.avgRisk),
        crimeRankings: crimeRiskAverage.sort((a, b) => b.avgRisk - a.avgRisk)
      }
    }

    // 初始化热力图
    const initHeatmapChart = (rawData) => {
      if (!chartRef.value || !rawData) return

      const processedData = processHeatmapData(rawData)
      const option = createHeatmapOption(processedData)

      if (chartInstance.value) {
        chartInstance.value.dispose()
      }

      chartInstance.value = echarts.init(chartRef.value)
      chartInstance.value.setOption(option)

      // 生成洞察（可选）
      insights.value = generateHeatmapInsights(processedData)

      // 添加交互功能
      addHeatmapInteractions(processedData)
    }

    // 可选：添加交互功能
    const addHeatmapInteractions = (processedData) => {
      if (!chartInstance.value) return

      const { ageGroups, crimeTypes } = processedData

      // 点击事件
      chartInstance.value.on('click', function(params) {
        if (params.componentType === 'series') {
          const [crimeIndex, ageIndex, value] = params.value
          const crime = crimeTypes[crimeIndex]
          const age = ageGroups[ageIndex]

          console.log(`Clicked: ${crime} - ${age} (${value.toFixed(1)}%)`)
          // 可以在这里添加更多交互逻辑，比如显示详细信息
        }
      })
    }

    // API base URL - using AWS API Gateway
    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    // 从API获取数据
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

        // 保存原始数据
        chartData.value = rawData

        // 确保DOM更新后再初始化图表
        await nextTick()

        // 添加小延迟确保DOM完全渲染
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


    // 计算关键统计数据 - 直接从原始数据计算
    const getHighestRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for highest rate')
        return '0.0'
      }

      // 找到所有数据中的最高受害率
      const maxRate = Math.max(...chartData.value.map(item => item.prevalence_2024 || 0))
      console.log('Highest rate calculated:', maxRate)
      return maxRate.toFixed(1)
    }

    const getAnyCrimeRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for any crime rate')
        return '0.0'
      }

      console.log('Chart data sample:', chartData.value.slice(0, 3))

      // 查找年轻人的任意网络犯罪受害率
      const youngAnyCrime = chartData.value.find(item =>
        item.age === '18 – 34' && item.main_type === 'Any cybercrime victimization'
      )

      console.log('Young any crime data:', youngAnyCrime)

      if (youngAnyCrime) {
        return youngAnyCrime.prevalence_2024.toFixed(1)
      }

      // 如果没有找到"Any cybercrime victimization"，计算年轻人所有犯罪类型的平均受害率
      const youngCrimes = chartData.value.filter(item => item.age === '18 – 34')
      if (youngCrimes.length > 0) {
        const avgRate = youngCrimes.reduce((sum, item) => sum + (item.prevalence_2024 || 0), 0) / youngCrimes.length
        console.log('Young people average rate:', avgRate)
        return avgRate.toFixed(1)
      }

      return '0.0'
    }

    const getOnlineHarassmentRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for online harassment rate')
        return '0.0'
      }

      // 查找年轻人的网络骚扰受害率
      const youngHarassment = chartData.value.find(item =>
        item.age === '18 – 34' && item.main_type === 'Online abuse and harassment'
      )

      console.log('Young harassment data:', youngHarassment)

      if (youngHarassment) {
        return youngHarassment.prevalence_2024.toFixed(1)
      }

      return '0.0'
    }

    const getFraudScamsRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for fraud and scams rate')
        return '0.0'
      }

      // 查找65+年龄组的诈骗受害率
      const elderlyFraud = chartData.value.find(item =>
        item.age === '65+' && item.main_type === 'Fraud and scams'
      )

      console.log('Elderly fraud data:', elderlyFraud)

      if (elderlyFraud) {
        return elderlyFraud.prevalence_2024.toFixed(1)
      }

      return '0.0'
    }

    const getLowestRate = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for lowest rate')
        return '0.0'
      }

      // 找到所有数据中的最低受害率
      const minRate = Math.min(...chartData.value.map(item => item.prevalence_2024 || 0))
      console.log('Lowest rate calculated:', minRate)
      return minRate.toFixed(1)
    }

    const getRiskRatio = () => {
      if (!chartData.value || chartData.value.length === 0) {
        console.log('No chart data available for risk ratio')
        return '0.0'
      }

      // 计算年轻人的平均受害率
      const youngCrimes = chartData.value.filter(item => item.age === '18 – 34')
      const youngAvgRate = youngCrimes.length > 0
        ? youngCrimes.reduce((sum, item) => sum + (item.prevalence_2024 || 0), 0) / youngCrimes.length
        : 0

      // 计算老年人的平均受害率
      const oldCrimes = chartData.value.filter(item =>
        item.age === '65+' || item.age === '65 +' || item.age === '65+ years'
      )
      const oldAvgRate = oldCrimes.length > 0
        ? oldCrimes.reduce((sum, item) => sum + (item.prevalence_2024 || 0), 0) / oldCrimes.length
        : 0

      console.log('Young average rate:', youngAvgRate)
      console.log('Old average rate:', oldAvgRate)

      if (oldAvgRate > 0) {
        const ratio = (youngAvgRate / oldAvgRate).toFixed(1)
        console.log('Risk ratio calculated:', ratio)
        return ratio
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

    // 监听数据变化
    watch(() => props.data, (newData) => {
      if (newData && newData.length > 0) {
        chartData.value = newData
        nextTick(() => {
          initHeatmapChart(newData)
        })
      }
    }, { immediate: true })

    // 监听图表数据变化
    watch(chartData, (newData) => {
      if (newData && newData.length > 0) {
        nextTick(() => {
          initHeatmapChart(newData)
        })
      }
    })

    // 窗口大小变化处理函数
    const handleResize = () => {
      if (chartInstance.value) {
        chartInstance.value.resize()
      }
    }

    // 组件挂载
    onMounted(async () => {
      if (props.autoFetch) {
        await fetchData()
      }

      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
    })

    // 组件卸载
    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.dispose()
        chartInstance.value = null
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      chartRef,
      loading,
      error,
      insights,
      fetchData,
      exportChart,
      getHighestRate,
      getAnyCrimeRate,
      getOnlineHarassmentRate,
      getFraudScamsRate,
      getLowestRate,
      getRiskRatio
    }
  }
}
</script>

<style scoped>
/* 基础布局 */
.heatmap-section {
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
  box-shadow: 0 2px 8px var(--shadow-light);
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

.error-state h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--forest-dark);
  color: var(--forest-light);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-light);
}

.retry-btn:hover {
  background: var(--forest-medium);
}

/* 内容区域 */
.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.chart-container {
  background: var(--text-light);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px var(--shadow-light);
  border: 1px solid var(--border-light);
}

.main-chart {
  width: 100%;
  height: 500px;
}

.insights-panel {
  background: transparent;
  border-radius: 0;
  padding: 2rem 0;
  box-shadow: none;
  border: none;
}

.insights-panel h4 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.insight-section {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-light);
}

.section-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.key-findings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.finding-item {
  padding: 1rem;
  background: var(--forest-light);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--forest-medium) 0%, var(--forest-deep) 100%);
  color: var(--forest-light);
  border-radius: 8px;
  box-shadow: 0 4px 8px var(--shadow-light);
  border: 1px solid var(--forest-deep);
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

.age-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.age-group {
  padding: 1.5rem;
  background: var(--forest-light);
  border-radius: 8px;
  border: 1px solid var(--border-light);
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

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recommendation-item {
  padding: 1rem;
  background: var(--forest-light);
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.trend-analysis {
  padding: 1.5rem;
  background: var(--forest-light);
  border-radius: 8px;
  border: 1px solid var(--border-light);
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

/* 基础响应式设计 */
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
</style>
