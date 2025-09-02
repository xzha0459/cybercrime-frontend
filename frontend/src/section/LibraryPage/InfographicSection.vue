<template>
  <section class="infographic-section">
    <!-- 修改header结构 -->
    <div class="section-header">
      <h2 class="section-title">网络安全概览</h2>
      <p class="section-description">
        以下是过去28天里发生的情况 - 实时数据洞察和威胁分析
      </p>
    </div>

    <div class="section-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="infographic-grid">
        <div v-for="i in 5" :key="i" class="infographic-card loading-card">
          <div class="infographic-preview loading-preview">
            <div class="loading-shimmer"></div>
          </div>
          <div class="infographic-content">
            <div class="loading-line title"></div>
            <div class="loading-line description"></div>
            <div class="loading-line meta"></div>
          </div>
        </div>
      </div>

      <div v-else class="infographic-grid dashboard-grid">

        <!-- 卡片1: 经济损失总额 -->
        <div class="infographic-card stat-card">
          <div class="infographic-preview loss-preview">
            <div class="stat-display">
              <div class="stat-number">{{ formatNumber(dashboardData.totalLoss.value, 'currency') }}</div>
              <div class="stat-label">网络犯罪经济损失总额</div>
              <div class="stat-sublabel">2023-2024年度</div>
            </div>
            <canvas ref="lossChart" class="mini-chart"></canvas>
            <div class="download-overlay">
              <button class="download-btn" @click="downloadChart('loss')">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">经济损失总额</h3>
            <p class="infographic-description">所有网络犯罪类型造成的经济损失汇总</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">实时数据</span>
            </div>
          </div>
        </div>

        <!-- 卡片2: 网络犯罪受害率 -->
        <div class="infographic-card stat-card">
          <div class="infographic-preview victim-preview">
            <div class="stat-display">
              <div class="stat-number">{{ formatNumber(dashboardData.victimRate.value, 'percentage') }}</div>
              <div class="stat-label">18-34岁受害率</div>
              <div class="stat-sublabel">青年群体 2024年</div>
            </div>
            <canvas ref="victimChart" class="mini-chart"></canvas>
            <div class="download-overlay">
              <button class="download-btn" @click="downloadChart('victim')">
                <span class="download-icon">⬇️</span>
                Download
              </button>
            </div>
          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">青年群体受害率</h3>
            <p class="infographic-description">18-34岁年龄段网络犯罪受害率统计</p>
            <div class="infographic-meta">
              <span class="format-option">PNG</span>
              <span class="format-option">PDF</span>
              <span class="file-size">实时数据</span>
            </div>
          </div>
        </div>

        <!-- 卡片3: 安全行为采用率 -->
        <div class="infographic-card stat-card">
          <div class="infographic-preview security-preview">
            <div class="stat-display">
              <div class="stat-number">{{ formatNumber(dashboardData.securityAdoption.value, 'percentage') }}</div>
              <div class="stat-label">整体安全意识得分</div>
              <div class="stat-sublabel">2024年数据</div>
            </div>
            <canvas ref="securityChart" class="mini-chart"></canvas>

          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">安全行为采用率</h3>
            <p class="infographic-description">用户安全防护行为的整体采用情况</p>
            <div class="infographic-meta">

              <span class="file-size">实时数据</span>
            </div>
          </div>
        </div>

        <!-- 卡片4: VPN使用普及率 -->
        <div class="infographic-card stat-card">
          <div class="infographic-preview vpn-preview">
            <div class="stat-display">
              <div class="stat-number">{{ formatNumber(dashboardData.vpnUsage.value, 'percentage') }}</div>
              <div class="stat-label">VPN使用普及率</div>
              <div class="stat-sublabel">2024年数据</div>
            </div>
            <canvas ref="vpnChart" class="mini-chart"></canvas>

          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">VPN使用率</h3>
            <p class="infographic-description">虚拟专用网络在用户中的使用普及情况</p>
            <div class="infographic-meta">

              <span class="file-size">实时数据</span>
            </div>
          </div>
        </div>

        <!-- 卡片5: 受害案例总数 -->
        <div class="infographic-card stat-card">
          <div class="infographic-preview cases-preview">
            <div class="stat-display">
              <div class="stat-number">{{ formatNumber(dashboardData.totalCases.value, 'number') }}</div>
              <div class="stat-label">受害案例总数</div>
              <div class="stat-sublabel">统计记录</div>
            </div>
            <canvas ref="casesChart" class="mini-chart"></canvas>

          </div>
          <div class="infographic-content">
            <h3 class="infographic-title">案例统计总数</h3>
            <p class="infographic-description">数据库中记录的网络犯罪案例总量</p>
            <div class="infographic-meta">

              <span class="file-size">实时数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'InfographicSection',
  data() {
    return {
      loading: true,
      dashboardData: {
        totalLoss: { value: 0, trend: [] },
        victimRate: { value: 0, trend: [] },
        securityAdoption: { value: 0, trend: [] },
        vpnUsage: { value: 0, trend: [] },
        totalCases: { value: 0, trend: [] }
      },
      charts: {}
    }
  },
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const baseURL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

        // 并行调用所有API
        const [financialData, behaviorData, victimData] = await Promise.all([
          fetch(`${baseURL}/infographics/financial-losses/`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
              return res.json()
            })
            .catch(err => {
              console.error('Error fetching financial losses data:', err)
              return []
            }),
          fetch(`${baseURL}/infographics/online-behaviours/`)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
              return res.json()
            })
            .catch(err => {
              console.error('Error fetching online behaviours data:', err)
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

        // 处理各项数据
        const totalLoss = this.processTotalLoss(financialData)
        const victimRate = this.processVictimRate(victimData)
        const securityAdoption = this.processSecurityAdoption(behaviorData)
        const vpnUsage = this.processVpnUsage(behaviorData)
        const totalCases = this.processTotalCases(victimData)

        this.dashboardData = {
          totalLoss,
          victimRate,
          securityAdoption,
          vpnUsage,
          totalCases
        }

        this.$nextTick(() => {
          this.createCharts()
        })
      } catch (error) {
        console.error('获取数据失败:', error)
        // 设置默认值
        this.dashboardData = {
          totalLoss: { value: 0, trend: [] },
          victimRate: { value: 0, trend: [] },
          securityAdoption: { value: 0, trend: [] },
          vpnUsage: { value: 0, trend: [] },
          totalCases: { value: 0, trend: [] }
        }
      } finally {
        this.loading = false
      }
    },

    // 处理经济损失总额
    processTotalLoss(data) {
      if (!data || data.length === 0) {
        return { value: 0, trend: [] }
      }

      // 计算总损失
      const totalLoss = data.reduce((sum, item) => sum + (item.value || 0), 0)

      // 生成趋势数据（各类犯罪类型的损失分布）
      const trend = data.slice(0, 8).map(item => item.value || 0)

      return {
        value: totalLoss,
        trend: trend
      }
    },

    // 处理总体受害率
    processVictimRate(data) {
      if (!data || data.length === 0) {
        return { value: 0, trend: [] }
      }

      // 计算2024年平均受害率
      const validRates = data
        .map(item => item.prevalence_2024)
        .filter(rate => rate !== null && rate !== undefined && rate > 0)

      const avgRate = validRates.length > 0
        ? validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length
        : 0

      // 生成趋势数据
      const trend = data.slice(0, 8).map(item => item.prevalence_2024 || 0)

      return {
        value: avgRate,
        trend: trend
      }
    },
    // 处理整体安全行为采用率
    processSecurityAdoption(data) {
      if (!data || data.length === 0) {
        return { value: 0, trend: [] }
      }

      // 计算2024年平均安全行为采用率
      const validAdoption = data
        .map(item => item.adjusted_2024)
        .filter(rate => rate !== null && rate !== undefined && rate > 0)

      const avgAdoption = validAdoption.length > 0
        ? validAdoption.reduce((sum, rate) => sum + rate, 0) / validAdoption.length
        : 0

      // 生成趋势数据
      const trend = data.slice(0, 8).map(item => item.adjusted_2024 || 0)

      return {
        value: avgAdoption,
        trend: trend
      }
    },

    // 处理VPN使用率
    processVpnUsage(data) {
      if (!data || data.length === 0) {
        return { value: 0, trend: [] }
      }

      // 筛选VPN相关的行为数据
      const vpnData = data.filter(item =>
        item.variable && item.variable.toLowerCase().includes('vpn')
      )

      if (vpnData.length === 0) {
        return { value: 0, trend: [] }
      }

      // 计算VPN使用率
      const validVpnRates = vpnData
        .map(item => item.adjusted_2024)
        .filter(rate => rate !== null && rate !== undefined && rate >= 0)

      const avgVpnUsage = validVpnRates.length > 0
        ? validVpnRates.reduce((sum, rate) => sum + rate, 0) / validVpnRates.length
        : 0

      // 生成趋势数据
      const trend = vpnData.slice(0, 6).map(item => item.adjusted_2024 || 0)

      return {
        value: avgVpnUsage,
        trend: trend
      }
    },

    // 处理受害案例总数
    processTotalCases(data) {
      if (!data || data.length === 0) {
        return { value: 0, trend: [] }
      }

      // 案例总数就是数据记录的数量
      const totalCases = data.length

      // 生成趋势数据（按犯罪类型分组的案例数量）
      const crimeTypes = {}
      data.forEach(item => {
        const type = item.main_type || 'Unknown'
        crimeTypes[type] = (crimeTypes[type] || 0) + 1
      })

      const trend = Object.values(crimeTypes).slice(0, 8)

      return {
        value: totalCases,
        trend: trend
      }
    },

    createCharts() {
      this.createBarChart('lossChart', this.dashboardData.totalLoss.trend, '#F97316')
      this.createLineChart('victimChart', this.dashboardData.victimRate.trend, '#EF4444')
      this.createLineChart('securityChart', this.dashboardData.securityAdoption.trend, '#3B82F6')
      this.createLineChart('vpnChart', this.dashboardData.vpnUsage.trend, '#8B5CF6')
      this.createBarChart('casesChart', this.dashboardData.totalCases.trend, '#10B981')
    },

    createLineChart(ref, data, color) {
      const ctx = this.$refs[ref]
      if (!ctx) {
        console.warn(`Canvas element not found for ref: ${ref}`)
        return
      }

      if (this.charts[ref]) {
        this.charts[ref].destroy()
      }

      this.charts[ref] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, i) => i),
          datasets: [{
            data: data,
            borderColor: color,
            backgroundColor: color + '20',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      })
    },

    createBarChart(ref, data, color) {
      const ctx = this.$refs[ref]
      if (!ctx) {
        console.warn(`Canvas element not found for ref: ${ref}`)
        return
      }

      if (this.charts[ref]) {
        this.charts[ref].destroy()
      }

      this.charts[ref] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((_, i) => `类型${i + 1}`),
          datasets: [{
            data: data,
            backgroundColor: data.map((_, i) => color + (100 - i * 10).toString(16)),
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      })
    },

    formatNumber(num, type = 'default') {
      if (type === 'currency') {
        return num >= 1 ? `$${num.toFixed(1)}M` : `$${(num * 1000).toFixed(0)}K`
      }
      if (type === 'percentage') {
        return `${num.toFixed(1)}%`
      }
      if (type === 'number') {
        return num.toLocaleString()
      }
      return num.toLocaleString()
    },


  },

  beforeUnmount() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy()
    })
  }
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

/* 网格布局 */
.infographic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.dashboard-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* 卡片样式 */
.infographic-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px var(--shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}



.infographic-preview {
  height: 250px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 不同类型的卡片背景色 */
.loss-preview {
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
}

.victim-preview {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
}

.security-preview {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
}

.vpn-preview {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
}

.cases-preview {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

/* 统计显示样式 */
.stat-display {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  color: white;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  opacity: 0.9;
}

.stat-sublabel {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.7;
}

/* 迷你图表样式 */
.mini-chart {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  height: 60px;
  opacity: 0.8;
}

/* 下载功能样式 */
.download-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}



.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--forest-deep);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}



.download-icon {
  font-size: 1.25rem;
}

/* 内容区域样式 */
.infographic-content {
  padding: 1.5rem;
}

.infographic-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.infographic-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.infographic-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.format-option {
  background: var(--forest-medium);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}



.file-size {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: auto;
}

/* 加载状态样式 */
.loading-card {
  pointer-events: none;
}

.loading-preview {
  background: linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%);
}

.loading-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

.loading-line {
  height: 1rem;
  background: #E5E7EB;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  animation: pulse 1.5s infinite;
}

.loading-line.title {
  width: 80%;
  height: 1.5rem;
}

.loading-line.description {
  width: 100%;
}

.loading-line.meta {
  width: 60%;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .infographic-section {
    padding: 2rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .infographic-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
