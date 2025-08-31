<template>
  <!-- 测试历史区域 -->
  <div class="test-history-section">
    <div class="section-header">
      <h2>Test History</h2>
      <div class="stats-summary">
        <div class="stat-item">
          <span class="stat-number">{{ totalTests }}</span>
          <span class="stat-label">Total Tests</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ averageScore }}%</span>
          <span class="stat-label">Average Score</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading your test history...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadTestHistory" class="retry-btn">Retry</button>
    </div>

    <!-- 测试记录列表 -->
    <div v-else-if="testAttempts.length > 0" class="test-list">
      <div
        v-for="attempt in testAttempts"
        :key="attempt.id"
        class="test-card"
        @click="viewTestDetails(attempt)"
      >
        <div class="test-header">
          <div class="test-info">
            <h3>{{ getCategoryDisplayName(attempt.category) }}</h3>
            <p class="test-date">{{ formatDate(attempt.finished_at) }}</p>
          </div>
          <div class="test-score" :class="getScoreClass(attempt.accuracy_pct)">
            {{ getFormattedScore(attempt.accuracy_pct) }}%
          </div>
        </div>

        <div class="test-details">
          <div class="detail-row">
            <span>Questions: {{ attempt.correct_count }}/{{ attempt.total_questions }}</span>
            <span>Duration: {{ calculateDuration(attempt.started_at, attempt.finished_at) }}</span>
          </div>

          <!-- 进度条 -->
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: Math.min(attempt.accuracy_pct, 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无测试记录 -->
    <div v-else class="no-tests">
      <p>No test records found</p>
      <router-link to="/test" class="take-test-btn">Take Your First Test</router-link>
    </div>
  </div>

  <!-- 测试详情模态框 -->
  <div v-if="selectedAttempt" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Test Details</h3>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <div class="modal-body">
        <div class="test-summary">
          <div class="summary-row">
            <span>Category:</span>
            <span>{{ getCategoryDisplayName(selectedAttempt.category) }}</span>
          </div>
          <div class="summary-row">
            <span>Score:</span>
            <span>{{ getFormattedScore(selectedAttempt.accuracy_pct) }}%</span>
          </div>
          <div class="summary-row">
            <span>Correct Answers:</span>
            <span>{{ selectedAttempt.correct_count }}/{{ selectedAttempt.total_questions }}</span>
          </div>
          <div class="summary-row">
            <span>Date:</span>
            <span>{{ formatDate(selectedAttempt.finished_at) }}</span>
          </div>
        </div>

        <!-- 如果有详细答案信息 -->
        <div v-if="selectedAttempt.quiz_question_attempts" class="questions-detail">
          <h4>Question Details</h4>
          <div
            v-for="(qa, index) in selectedAttempt.quiz_question_attempts"
            :key="index"
            class="question-item"
          >
            <div class="question-header">
              <span class="question-number">Q{{ index + 1 }}</span>
              <span class="answer-result" :class="qa.is_correct ? 'correct' : 'incorrect'">
                {{ qa.is_correct ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <p class="user-answer">Your answer: Option {{ String.fromCharCode(65 + qa.chosen_answer) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAuthSession } from 'aws-amplify/auth'

export default {
  name: 'TestHistorySection',
  data() {
    return {
      testAttempts: [],
      loading: true,
      error: null,
      selectedAttempt: null
    }
  },
  computed: {
    totalTests() {
      return this.testAttempts.length
    },
    averageScore() {
      if (this.testAttempts.length === 0) return 0

      const validAttempts = this.testAttempts.filter(attempt =>
        attempt.accuracy_pct !== null &&
        attempt.accuracy_pct !== undefined &&
        !isNaN(attempt.accuracy_pct)
      )

      if (validAttempts.length === 0) return 0

      const total = validAttempts.reduce((sum, attempt) => sum + Number(attempt.accuracy_pct), 0)
      return Math.round(total / validAttempts.length)
    }
  },
  async mounted() {
    await this.loadTestHistory()
  },
  methods: {
    // 获取ID Token
    async getIdToken() {
      try {
        const session = await fetchAuthSession()
        return session.tokens?.idToken?.toString()
      } catch (error) {
        console.error('Error getting ID token:', error)
        throw error
      }
    },

    // 加载测试历史
    async loadTestHistory() {
      try {
        this.loading = true
        this.error = null

        const response = await fetch('https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/quizzes/attempts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await this.getIdToken()}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to load test history: ${response.status}`)
        }

        const data = await response.json()
        // 只显示已完成的测试 (有finished_at的记录)
        this.testAttempts = (Array.isArray(data) ? data : [])
          .filter(attempt => attempt.finished_at)
          .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at)) // 按时间倒序

      } catch (error) {
        console.error('Error loading test history:', error)
        this.error = 'Failed to load test history. Please try again.'
      } finally {
        this.loading = false
      }
    },

    // 查看测试详情
    async viewTestDetails(attempt) {
      try {
        const response = await fetch(`https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com/quizzes/attempts/${attempt.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await this.getIdToken()}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          this.selectedAttempt = await response.json()
        } else {
          this.selectedAttempt = attempt // 如果无法获取详情，使用基本信息
        }
      } catch (error) {
        console.error('Error loading test details:', error)
        this.selectedAttempt = attempt
      }
    },

    // 关闭模态框
    closeModal() {
      this.selectedAttempt = null
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // 计算测试时长
    calculateDuration(startTime, endTime) {
      if (!startTime || !endTime) return 'N/A'
      const start = new Date(startTime)
      const end = new Date(endTime)
      const diffInMinutes = Math.round((end - start) / (1000 * 60))
      return `${diffInMinutes} min`
    },

    // 获取分数样式类
    getScoreClass(accuracy) {
      if (!accuracy) return 'poor'
      const percentage = accuracy * 100
      if (percentage >= 90) return 'excellent'
      if (percentage >= 75) return 'good'
      if (percentage >= 60) return 'fair'
      return 'poor'
    },

    // 获取类别显示名称
    getCategoryDisplayName(category) {
      if (!category || category === 'null' || category === 'undefined') {
        return 'Mixed Categories'
      }
      return category
    },

    // 获取正确格式的分数
    getFormattedScore(accuracyPct) {
      if (accuracyPct === null || accuracyPct === undefined || isNaN(accuracyPct)) return 0
      return Math.round(Number(accuracyPct))
    }
  }
}
</script>

<style scoped>
/* 测试历史样式 */
.test-history-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--forest-sage);
}

.section-header h2 {
  margin: 0;
  color: var(--forest-dark);
  font-size: 1.8rem;
  font-weight: 600;
}

.stats-summary {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  background: var(--forest-light);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid var(--forest-sage);
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: var(--forest-medium);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: var(--forest-deep);
  font-weight: 500;
}

.test-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--forest-sage);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.test-card:hover {
  background: var(--forest-light);
  border-color: var(--forest-medium);
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.test-info h3 {
  margin: 0 0 8px 0;
  color: var(--forest-dark);
  font-size: 18px;
  font-weight: 600;
}

.test-date {
  margin: 0;
  color: var(--forest-deep);
  font-size: 13px;
  font-weight: 500;
}

.test-score {
  font-size: 20px;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.test-score.excellent { background: #d4edda; color: #155724; }
.test-score.good { background: #cce5ff; color: #004085; }
.test-score.fair { background: #fff3cd; color: #856404; }
.test-score.poor { background: #f8d7da; color: #721c24; }

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--forest-deep);
  margin-bottom: 12px;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--forest-sage);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: var(--forest-medium);
  border-radius: 4px;
}

.loading, .error, .no-tests {
  text-align: center;
  padding: 40px 20px;
  color: var(--forest-deep);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  margin: 20px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--forest-sage);
  border-top: 4px solid var(--forest-medium);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn, .take-test-btn {
  background: var(--forest-dark);
  color: var(--forest-light);
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 15px;
  font-weight: 600;
  box-shadow: 0 4px 15px var(--shadow-medium);
}

.retry-btn:hover, .take-test-btn:hover {
  background: var(--forest-deep);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--forest-sage);
}

.modal-header h3 {
  color: var(--forest-dark);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--forest-deep);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--forest-dark);
  background: var(--forest-light);
}

.test-summary {
  margin-bottom: 25px;
  background: var(--forest-light);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--forest-sage);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.summary-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.summary-row span:first-child {
  font-weight: 600;
  color: var(--forest-deep);
}

.summary-row span:last-child {
  font-weight: 600;
  color: var(--forest-dark);
}

.questions-detail h4 {
  margin: 25px 0 15px 0;
  color: var(--forest-dark);
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--forest-sage);
}

.question-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid var(--forest-sage);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.question-number {
  font-weight: bold;
  background: var(--forest-medium);
  color: var(--forest-light);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.answer-result.correct {
  color: #28a745;
  font-weight: bold;
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.answer-result.incorrect {
  color: #dc3545;
  font-weight: bold;
  background: rgba(220, 53, 69, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.user-answer {
  margin: 0;
  font-size: 13px;
  color: var(--forest-deep);
  font-weight: 500;
}
</style>
