<template>
  <div class="test-page">
    <div class="test-container">
              <!-- Page Title -->
        <div class="test-header">
          <h1 class="test-title">Cybersecurity Knowledge Test</h1>
          <p class="test-subtitle">Assess your cybersecurity habits and discover areas for improvement</p>
        </div>

        <!-- Test Progress Indicator -->
        <div class="progress-section" v-if="currentStep > 0">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(currentStep / totalQuestions) * 100}%` }"
            ></div>
          </div>
          <p class="progress-text">Question {{ currentStep }} / {{ totalQuestions }}</p>
        </div>

        <!-- Test Content Area -->
        <div class="test-content">
          <!-- Welcome Page -->
          <div v-if="currentStep === 0" class="welcome-section">
            <div class="welcome-card">
              <div class="welcome-icon">🔒</div>
              <h2>Welcome to the Cybersecurity Test</h2>
              <p>This test will help you understand your current cybersecurity knowledge level and identify areas for improvement.</p>

              <!-- Loading State -->
              <div v-if="loading" class="loading-section">
                <div class="loading-spinner"></div>
                <p>Loading test questions...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="error-section">
                <div class="error-icon">⚠️</div>
                <p class="error-message">Failed to load questions: {{ error }}</p>
                <button @click="loadQuestions" class="retry-btn">Retry</button>
              </div>

              <!-- Normal State -->
              <div v-else class="test-info">
                <div class="info-item">
                  <span class="info-label">Test Duration:</span>
                  <span class="info-value">About 10-15 minutes</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Number of Questions:</span>
                  <span class="info-value">{{ totalQuestions }} questions</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Test Type:</span>
                  <span class="info-value">Multiple Choice</span>
                </div>
              </div>

              <button
                @click="startTest"
                class="start-btn"
                :disabled="loading || questions.length === 0"
              >
                {{ loading ? 'Loading...' : questions.length === 0 ? 'No Questions Available' : 'Start Test' }}
              </button>
            </div>
          </div>

          <!-- Question Page -->
          <div v-else-if="currentStep <= totalQuestions" class="question-section">
            <div class="question-card">
              <div class="question-header">
                <h3 class="question-title">{{ currentQuestion.title }}</h3>
                <p class="question-description" v-if="currentQuestion.description">
                  {{ currentQuestion.description }}
                </p>
              </div>

              <div class="options-container">
                <div
                  v-for="(option, index) in currentQuestion.options"
                  :key="index"
                  class="option-item"
                  :class="{ 'selected': selectedAnswer === index }"
                  @click="selectAnswer(index)"
                >
                  <div class="option-radio">
                    <div class="radio-circle" :class="{ 'checked': selectedAnswer === index }"></div>
                  </div>
                  <div class="option-text">
                    <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
                    <span class="option-content">{{ option }}</span>
                  </div>
                </div>
              </div>

              <div class="question-actions">
                <button
                  v-if="currentStep > 1"
                  @click="previousQuestion"
                  class="nav-btn prev-btn"
                >
                  Previous
                </button>
                <button
                  @click="nextQuestion"
                  class="nav-btn next-btn"
                  :disabled="selectedAnswer === null"
                >
                  {{ currentStep === totalQuestions ? 'Complete Test' : 'Next' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Results Page -->
          <div v-else class="results-section">
            <div class="results-card">
              <div class="results-header">
                <div class="results-icon">🎉</div>
                <h2>Test Completed!</h2>
                <p>Congratulations on completing the cybersecurity knowledge test</p>
              </div>

              <div class="score-section">
                <div class="overall-score">
                  <div class="score-circle">
                    <span class="score-number">{{ Math.round((correctAnswers / totalQuestions) * 100) }}</span>
                    <span class="score-percent">%</span>
                  </div>
                  <p class="score-label">Overall Score</p>
                </div>

                <div class="score-breakdown">
                  <h3>Detailed Score Analysis</h3>
                  <div class="category-scores">
                    <div class="category-item">
                      <span class="category-name">Password Security</span>
                      <div class="category-bar">
                        <div class="category-fill" style="width: 85%"></div>
                      </div>
                      <span class="category-score">85%</span>
                    </div>
                    <div class="category-item">
                      <span class="category-name">Phishing Detection</span>
                      <div class="category-bar">
                        <div class="category-fill" style="width: 70%"></div>
                      </div>
                      <span class="category-score">70%</span>
                    </div>
                    <div class="category-item">
                      <span class="category-name">Data Protection</span>
                      <div class="category-bar">
                        <div class="category-fill" style="width: 90%"></div>
                      </div>
                      <span class="category-score">90%</span>
                    </div>
                    <div class="category-item">
                      <span class="category-name">Social Media Security</span>
                      <div class="category-bar">
                        <div class="category-fill" style="width: 75%"></div>
                      </div>
                      <span class="category-score">75%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="feedback-section">
                <h3>Personalized Recommendations</h3>
                <div class="feedback-content">
                  <p>Based on your test results, we recommend focusing on the following areas:</p>
                  <ul class="feedback-list">
                    <li>Improve your ability to identify phishing emails</li>
                    <li>Strengthen your social media privacy settings</li>
                    <li>Regularly update passwords and use strong passwords</li>
                  </ul>
                </div>
              </div>

              <div class="results-actions">
                <button @click="retakeTest" class="action-btn retake-btn">Retake Test</button>
                <button @click="goHome" class="action-btn home-btn">Back to Home</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'TestPage',
  setup() {
    const currentStep = ref(0)
    const selectedAnswer = ref(null)
    const correctAnswers = ref(0)
    const totalQuestions = ref(10)
    const questions = ref([])
    const loading = ref(false)
    const error = ref(null)

    // API配置
    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    /**
     * Fetch random questions
     * @param {number} count - Number of questions
     * @returns {Promise<Array>} Returns array of questions
     */
    const fetchRandomQuestions = async (count = 10) => {
      try {
        loading.value = true
        error.value = null

        const response = await fetch(`${API_BASE_URL}/quizzes/random/?count=${count}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
      } catch (err) {
        console.error('Error fetching questions:', err)
        error.value = err.message
        throw err
      } finally {
        loading.value = false
      }
    }

    /**
     * Process question data and convert to internal format
     * @param {Array} apiQuestions - Array of questions returned by API
     */
    const processQuestions = (apiQuestions) => {
      if (!Array.isArray(apiQuestions)) {
        console.error('Questions data is not an array')
        return []
      }

            return apiQuestions.map((question, index) => {
        // Find the index of the correct answer
        let correctAnswerIndex = 0
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option, idx) => {
            if (option.is_answer === true) {
              correctAnswerIndex = idx
            }
          })
        }

        return {
          id: question.id || index,
          title: question.question_text || `Question ${index + 1}`,
          description: `Category: ${question.category || 'Cybersecurity'}`,
          options: question.options ? question.options.map(opt => opt.text || 'Option') : ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: correctAnswerIndex,
          category: question.category || 'Cybersecurity',
          explanation: question.explanation || ''
        }
      })
    }

    /**
     * Load test questions
     */
    const loadQuestions = async () => {
      try {
        const apiQuestions = await fetchRandomQuestions(totalQuestions.value)
        const processedQuestions = processQuestions(apiQuestions)
        questions.value = processedQuestions
        totalQuestions.value = processedQuestions.length
      } catch (err) {
        console.error('Failed to load questions:', err)
        // If API fails, use default questions
        questions.value = []
        totalQuestions.value = 0
      }
    }

    const currentQuestion = computed(() => {
      if (currentStep.value > 0 && currentStep.value <= totalQuestions.value && questions.value.length > 0) {
        return questions.value[currentStep.value - 1]
      }
      return null
    })

    const startTest = () => {
      if (questions.value.length === 0) {
        // If no questions available, try to reload
        loadQuestions().then(() => {
          if (questions.value.length > 0) {
            currentStep.value = 1
            selectedAnswer.value = null
            correctAnswers.value = 0
          }
        })
      } else {
        currentStep.value = 1
        selectedAnswer.value = null
        correctAnswers.value = 0
      }
    }

    const selectAnswer = (index) => {
      selectedAnswer.value = index
    }

    const nextQuestion = () => {
      if (selectedAnswer.value === null || !currentQuestion.value) return

      // Check if the answer is correct
      if (selectedAnswer.value === currentQuestion.value.correct) {
        correctAnswers.value++
      }

      if (currentStep.value < totalQuestions.value) {
        currentStep.value++
        selectedAnswer.value = null
      } else {
        currentStep.value = totalQuestions.value + 1
      }
    }

    const previousQuestion = () => {
      if (currentStep.value > 1) {
        currentStep.value--
        selectedAnswer.value = null
      }
    }

    const retakeTest = () => {
      currentStep.value = 0
      selectedAnswer.value = null
      correctAnswers.value = 0
              // Reload questions
        loadQuestions()
    }

    const goHome = () => {
      // 这里可以添加路由跳转逻辑
      console.log('返回首页')
    }

    // Load questions when page mounts
    onMounted(() => {
      loadQuestions()
    })

    return {
      currentStep,
      selectedAnswer,
      correctAnswers,
      totalQuestions,
      currentQuestion,
      questions,
      loading,
      error,
      startTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      retakeTest,
      goHome,
      loadQuestions
    }
  }
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--forest-sage) 25%, var(--forest-medium) 50%, var(--forest-deep) 75%, var(--forest-dark) 100%);
  padding: 20px;
}

.test-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.test-header {
  background: var(--forest-dark);
  color: var(--forest-light);
  padding: 40px 30px;
  text-align: center;
}

.test-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.test-subtitle {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.progress-section {
  padding: 20px 30px;
  background: var(--forest-light);
  border-bottom: 1px solid var(--forest-sage);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--forest-sage);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: var(--forest-medium);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: var(--forest-deep);
  font-weight: 500;
  margin: 0;
}

.test-content {
  padding: 30px;
}

.welcome-section {
  text-align: center;
}

.welcome-card {
  max-width: 500px;
  margin: 0 auto;
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.welcome-card h2 {
  color: var(--forest-dark);
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.welcome-card p {
  color: var(--forest-deep);
  line-height: 1.6;
  margin-bottom: 30px;
}

.test-info {
  background: var(--forest-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: var(--forest-deep);
  font-weight: 500;
}

.info-value {
  color: var(--forest-dark);
  font-weight: 600;
}

.start-btn {
  background: var(--forest-dark);
  color: var(--forest-light);
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px var(--shadow-medium);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-dark);
}

.start-btn:disabled {
  background: var(--forest-sage);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-section {
  text-align: center;
  margin: 20px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--forest-sage);
  border-top: 4px solid var(--forest-medium);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-section p {
  color: var(--forest-deep);
  margin: 0;
}

.error-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: var(--forest-light);
  border-radius: 12px;
  border: 1px solid var(--forest-sage);
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.error-message {
  color: var(--forest-deep);
  margin: 0 0 15px 0;
  font-weight: 500;
}

.retry-btn {
  background: var(--forest-deep);
  color: var(--forest-light);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--forest-dark);
}

.question-section {
  max-width: 600px;
  margin: 0 auto;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.question-header {
  margin-bottom: 30px;
}

.question-title {
  color: var(--forest-dark);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.question-description {
  color: var(--forest-deep);
  margin: 0;
  font-size: 0.95rem;
}

.options-container {
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 2px solid var(--forest-sage);
  border-radius: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: var(--forest-medium);
  background: var(--forest-light);
}

.option-item.selected {
  border-color: var(--forest-medium);
  background: var(--forest-light);
}

.option-radio {
  margin-right: 15px;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--forest-sage);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-circle.checked {
  border-color: var(--forest-medium);
  background: var(--forest-medium);
}

.radio-circle.checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.option-text {
  display: flex;
  align-items: flex-start;
  flex: 1;
}

.option-label {
  color: var(--forest-medium);
  font-weight: 600;
  margin-right: 10px;
  min-width: 20px;
}

.option-content {
  color: var(--forest-dark);
  line-height: 1.5;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prev-btn {
  background: var(--forest-light);
  color: var(--forest-deep);
}

.prev-btn:hover {
  background: var(--forest-sage);
}

.next-btn {
  background: var(--forest-dark);
  color: var(--forest-light);
}

.next-btn:hover:not(:disabled) {
  background: var(--forest-deep);
}

.next-btn:disabled {
  background: var(--forest-sage);
  cursor: not-allowed;
}

.results-section {
  max-width: 700px;
  margin: 0 auto;
}

.results-card {
  text-align: center;
}

.results-header {
  margin-bottom: 40px;
}

.results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.results-header h2 {
  color: var(--forest-dark);
  margin-bottom: 10px;
  font-size: 2rem;
}

.results-header p {
  color: var(--forest-deep);
  font-size: 1.1rem;
}

.score-section {
  margin-bottom: 40px;
}

.overall-score {
  margin-bottom: 30px;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: var(--forest-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--forest-light);
  position: relative;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
}

.score-percent {
  font-size: 1.5rem;
  font-weight: 600;
  position: absolute;
  top: 50%;
  right: 25%;
  transform: translateY(-50%);
}

.score-label {
  color: var(--forest-dark);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.score-breakdown {
  text-align: left;
}

.score-breakdown h3 {
  color: var(--forest-dark);
  margin-bottom: 20px;
  text-align: center;
}

.category-scores {
  background: var(--forest-light);
  border-radius: 12px;
  padding: 20px;
}

.category-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.category-item:last-child {
  margin-bottom: 0;
}

.category-name {
  width: 120px;
  color: var(--forest-dark);
  font-weight: 500;
  font-size: 0.9rem;
}

.category-bar {
  flex: 1;
  height: 8px;
  background: var(--forest-sage);
  border-radius: 4px;
  margin: 0 15px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  background: var(--forest-medium);
  border-radius: 4px;
}

.category-score {
  width: 40px;
  color: var(--forest-dark);
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
}

.feedback-section {
  text-align: left;
  margin-bottom: 40px;
}

.feedback-section h3 {
  color: var(--forest-dark);
  margin-bottom: 15px;
  text-align: center;
}

.feedback-content {
  background: var(--forest-light);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid var(--forest-medium);
}

.feedback-content p {
  color: var(--forest-dark);
  margin: 0 0 15px 0;
  font-weight: 500;
}

.feedback-list {
  color: var(--forest-deep);
  margin: 0;
  padding-left: 20px;
}

.feedback-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.results-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retake-btn {
  background: var(--forest-light);
  color: var(--forest-deep);
}

.retake-btn:hover {
  background: var(--forest-sage);
}

.home-btn {
  background: var(--forest-dark);
  color: var(--forest-light);
}

.home-btn:hover {
  background: var(--forest-deep);
}

@media (max-width: 768px) {
  .test-page {
    padding: 10px;
  }

  .test-title {
    font-size: 2rem;
  }

  .test-content {
    padding: 20px;
  }

  .question-card {
    padding: 20px;
  }

  .option-item {
    padding: 12px 15px;
  }

  .results-actions {
    flex-direction: column;
  }

  .score-circle {
    width: 120px;
    height: 120px;
  }

  .score-number {
    font-size: 2.5rem;
  }
}
</style>
