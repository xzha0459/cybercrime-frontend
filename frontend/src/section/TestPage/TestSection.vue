<template>
  <div class="test-page">


    <!-- Test Progress Indicator -->
    <div class="progress-section" v-if="currentStep > 0">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(currentStep / totalQuestions) * 100}%` }"></div>
      </div>
      <p class="progress-text">Question {{ currentStep }} / {{ totalQuestions }}</p>
    </div>

    <!-- Test Content Area -->
    <div class="test-content">
      <!-- Welcome Page -->
              <div v-if="currentStep === 0" class="welcome-section">
          <div class="welcome-card">

          <!-- Loading State -->
          <div v-if="loading" class="loading-section">
            <div class="loading-spinner"></div>
            <p>{{ loadingMessage }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-section">
            <div class="error-icon">⚠️</div>
            <p class="error-message">Failed to load questions: {{ error }}</p>
            <button @click="loadQuestions" class="retry-btn">Retry</button>
          </div>

          <!-- Category Selection -->
          <div class="category-selection">
            <h3>Choose Test Category</h3>
            <div class="category-options">
              <div
                v-for="category in availableCategories"
                :key="category.value"
                class="category-option"
                :class="{ 'selected': selectedCategory === category.value }"
                @click="selectCategory(category.value)"
              >
                <div class="category-icon">{{ category.icon }}</div>
                <div class="category-info">
                  <h4>{{ category.label }}</h4>
                  <p>{{ category.description }}</p>
                  <span class="question-count">{{ category.questionCount }} questions</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Test Info -->
          <div v-if="selectedCategory" class="test-info">
            <div class="info-item">
              <span class="info-label">Selected Category:</span>
              <span class="info-value">{{ getCategoryLabel(selectedCategory) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Test Duration:</span>
              <span class="info-value">About {{ Math.ceil(totalQuestions / 2) }}-{{ Math.ceil(totalQuestions / 1.5) }} minutes</span>
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
            :disabled="loading || !selectedCategory"
          >
            {{ loading ? 'Loading...' : !selectedCategory ? 'Please Select a Category' : 'Start Test' }}
          </button>
        </div>
      </div>

      <!-- Question Page -->
      <div v-else-if="currentStep <= totalQuestions" class="question-section">
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

      <!-- Results Page -->
      <div v-else class="results-section">
        <div class="results-header">
          <div class="results-icon">🎉</div>
          <h2>Test Completed!</h2>
          <p>Congratulations on completing the cybersecurity knowledge test</p>
        </div>

          <div class="score-section">
            <div class="overall-score">
              <p class="score-label">Overall Score</p>
              <div class="score-circle">
                <span class="score-number">{{ Math.round((correctAnswers / totalQuestions) * 100) }}</span>
                <span class="score-percent">%</span>
              </div>

            </div>

            <div class="score-breakdown" v-if="selectedCategory === 'mixed'">
              <h3>Detailed Score Analysis</h3>
              <div class="category-scores">
                <div class="category-item">
                  <span class="category-name">Password Security</span>
                  <div class="category-bar">
                    <div class="category-fill" :style="{ width: getCategoryScore('Password Security') + '%' }"></div>
                  </div>
                  <span class="category-score">{{ getCategoryScore('Password Security') }}%</span>
                </div>
                <div class="category-item">
                  <span class="category-name">Cyber Harassment</span>
                  <div class="category-bar">
                    <div class="category-fill" :style="{ width: getCategoryScore('Cyber Harassment') + '%' }"></div>
                  </div>
                  <span class="category-score">{{ getCategoryScore('Cyber Harassment') }}%</span>
                </div>
                <div class="category-item">
                  <span class="category-name">Privacy Protection</span>
                  <div class="category-bar">
                    <div class="category-fill" :style="{ width: getCategoryScore('Privacy Protection') + '%' }"></div>
                  </div>
                  <span class="category-score">{{ getCategoryScore('Privacy Protection') }}%</span>
                </div>
                <div class="category-item">
                  <span class="category-name">Cyber Scam</span>
                  <div class="category-bar">
                    <div class="category-fill" :style="{ width: getCategoryScore('Cyber Scam') + '%' }"></div>
                  </div>
                  <span class="category-score">{{ getCategoryScore('Cyber Scam') }}%</span>
                </div>
              </div>
            </div>
          </div>

                      <div class="feedback-section">
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
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'TestSection',
  setup() {
    const currentStep = ref(0)
    const selectedAnswer = ref(null)
    const correctAnswers = ref(0)
    const totalQuestions = ref(15)
    const questions = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedCategory = ref('')
    const loadingMessage = ref('Loading test questions...')

    // Track category scores for mixed test
    const categoryScores = ref({
      'Cyber Harassment': { correct: 0, total: 0 },
      'Cyber Scam': { correct: 0, total: 0 },
      'Password Security': { correct: 0, total: 0 },
      'Privacy Protection': { correct: 0, total: 0 },
      'Social Media Security': { correct: 0, total: 0 }
    })

    // Available categories - updated to match your API categories
    const availableCategories = ref([
      {
        value: 'Cyber Harassment',
        label: 'Cyber Harassment',
        description: 'Test your knowledge about identifying and handling cyber harassment',
        icon: '🛡️',
        questionCount: 15
      },
      {
        value: 'Cyber Scam',
        label: 'Cyber Scam',
        description: 'Learn to identify and avoid various cyber scams and fraudulent activities',
        icon: '🎣',
        questionCount: 15
      },
      {
        value: 'Privacy Protection',
        label: 'Privacy Protection',
        description: 'Learn about protecting personal information and data privacy',
        icon: '🔐',
        questionCount: 15
      },
      {
        value: 'mixed',
        label: 'Mixed Categories',
        description: 'Comprehensive test covering all cybersecurity areas',
        icon: '🎯',
        questionCount: 25
      }
    ])

    // API configuration
    const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

    // Category selection function
    const selectCategory = (category) => {
      selectedCategory.value = category
      if (category === 'mixed') {
        totalQuestions.value = 25
      } else {
        totalQuestions.value = 15
      }
      // Reset questions when category changes
      questions.value = []
      currentStep.value = 0
      selectedAnswer.value = null
      correctAnswers.value = 0
    }

    // Get category label
    const getCategoryLabel = (categoryValue) => {
      const category = availableCategories.value.find(cat => cat.value === categoryValue)
      return category ? category.label : ''
    }

    // Calculate category score percentage
    const getCategoryScore = (categoryName) => {
      const score = categoryScores.value[categoryName]
      if (score.total === 0) return 0
      return Math.round((score.correct / score.total) * 100)
    }

    // Updated API call function
    const fetchRandomQuestions = async (category, count) => {
      try {
        loading.value = true
        error.value = null
        loadingMessage.value = `Loading ${count} questions...`

        let url = `${API_BASE_URL}/quizzes/random/?count=${count}`

        // 如果不是混合类别，添加category参数
        if (category !== 'mixed') {
          url += `&category=${encodeURIComponent(category)}`
        }

        console.log(`Fetching questions from:`, url)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('API response:', data)

        // 处理单个问题或问题数组
        const questions = Array.isArray(data) ? data : [data]

        return questions
      } catch (err) {
        console.error('Error fetching questions:', err)
        error.value = err.message
        throw err
      } finally {
        loading.value = false
      }
    }

    // Updated question processing function
    const processQuestions = (apiQuestions) => {
      console.log('Processing questions:', apiQuestions)

      if (!Array.isArray(apiQuestions)) {
        console.log('Converting single question to array')
        apiQuestions = [apiQuestions]
      }

      if (apiQuestions.length === 0) {
        console.log('No questions to process')
        return []
      }

      const processed = apiQuestions.map((question, index) => {
        console.log('Processing question:', question)

        // 从API响应中提取选项
        const options = question.options && Array.isArray(question.options)
          ? question.options.map((option, idx) => {
              // 如果选项是对象格式 {text: "...", is_answer: true/false}
              if (typeof option === 'object' && option.text) {
                return {
                  text: option.text,
                  isCorrect: option.is_answer === true
                }
              }
              // 如果选项是简单字符串格式
              return {
                text: option,
                isCorrect: idx === 0 // 暂时设第一个为正确答案，需要根据实际API调整
              }
            })
          : []

        // 查找正确答案的索引
        let correctAnswerIndex = options.findIndex(opt => opt.isCorrect)

        // 如果没有找到标记的正确答案，默认设置第一个为正确答案
        if (correctAnswerIndex === -1 && options.length > 0) {
          correctAnswerIndex = 0
          options[0].isCorrect = true
        }

        const processedQuestion = {
          id: question.id || `q_${index}`,
          title: question.question_text || `Question ${index + 1}`,
          description: `Category: ${question.category || 'Cybersecurity'}`,
          options: options.map(opt => opt.text),
          correct: correctAnswerIndex,
          category: question.category || 'General',
          explanation: question.explanation || ''
        }

        console.log('Processed question:', processedQuestion)
        return processedQuestion
      })

      console.log('All processed questions:', processed)
      return processed
    }

    // Updated load questions function
    const loadQuestions = async () => {
      if (!selectedCategory.value) return

      try {
        console.log('Loading questions for category:', selectedCategory.value)
        console.log('Question count:', totalQuestions.value)

        const apiQuestions = await fetchRandomQuestions(selectedCategory.value, totalQuestions.value)
        console.log('Raw API questions:', apiQuestions)

        const processedQuestions = processQuestions(apiQuestions)
        console.log('Processed questions:', processedQuestions)

        questions.value = processedQuestions

        // 确保totalQuestions反映实际获取的问题数量
        if (processedQuestions.length > 0) {
          totalQuestions.value = processedQuestions.length
        }

        console.log('Questions loaded successfully. Count:', questions.value.length)
      } catch (err) {
        console.error('Failed to load questions:', err)
        error.value = `Failed to load questions: ${err.message}`
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
      if (!selectedCategory.value) {
        console.log('No category selected')
        return
      }

      console.log('Starting test with category:', selectedCategory.value)
      console.log('Current questions count:', questions.value.length)

      if (questions.value.length === 0) {
        console.log('No questions loaded, loading now...')
        loadQuestions().then(() => {
          console.log('Questions loaded, starting test. Count:', questions.value.length)
          if (questions.value.length > 0) {
            currentStep.value = 1
            selectedAnswer.value = null
            correctAnswers.value = 0
          } else {
            console.log('No questions available after loading')
          }
        }).catch(err => {
          console.error('Error in startTest:', err)
        })
      } else {
        console.log('Questions already loaded, starting test directly')
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

      if (selectedAnswer.value === currentQuestion.value.correct) {
        correctAnswers.value++

        // Track category scores for mixed test
        if (selectedCategory.value === 'mixed' && currentQuestion.value.category) {
          const category = currentQuestion.value.category
          if (categoryScores.value[category]) {
            categoryScores.value[category].correct++
          }
        }
      }

      // Track total questions per category for mixed test
      if (selectedCategory.value === 'mixed' && currentQuestion.value.category) {
        const category = currentQuestion.value.category
        if (categoryScores.value[category]) {
          categoryScores.value[category].total++
        }
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

    const getPerformanceFeedback = () => {
      const percentage = (correctAnswers.value / totalQuestions.value) * 100
      if (percentage >= 90) {
        return 'Excellent! You have a strong understanding of cybersecurity principles.'
      } else if (percentage >= 75) {
        return 'Good job! You have solid cybersecurity knowledge with room for improvement.'
      } else if (percentage >= 60) {
        return 'Fair performance. Consider reviewing cybersecurity best practices.'
      } else {
        return 'There is significant room for improvement. We recommend additional cybersecurity training.'
      }
    }

    const retakeTest = () => {
      currentStep.value = 0
      selectedAnswer.value = null
      correctAnswers.value = 0
      questions.value = []
      error.value = null

      // Reset category scores
      Object.keys(categoryScores.value).forEach(category => {
        categoryScores.value[category].correct = 0
        categoryScores.value[category].total = 0
      })
    }



    // Don't auto-load on mount, wait for user selection
    onMounted(() => {
      // Remove auto-load
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
      selectedCategory,
      availableCategories,
      loadingMessage,
      selectCategory,
      getCategoryLabel,
      getCategoryScore,
      startTest,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      retakeTest,
      loadQuestions,
      getPerformanceFeedback
    }
  }
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: var(--forest-light);
  padding: 0;
}

.progress-section {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
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
  color: var(--forest-light);
  font-weight: 500;
  margin: 0;
}

.test-content {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
}

.welcome-card {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px;
}

.category-selection {
  margin-bottom: 30px;
}

.category-selection h3 {
  color: var(--forest-dark);
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-align: center;
}

.category-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.category-option {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid var(--forest-sage);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.category-option:hover {
  border-color: var(--forest-medium);
  background: var(--forest-light);
  transform: translateY(-2px);
}

.category-option.selected {
  border-color: var(--forest-medium);
  background: var(--forest-light);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 2.5rem;
  margin-right: 15px;
  min-width: 40px;
}

.category-info h4 {
  color: var(--forest-dark);
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.category-info p {
  color: var(--forest-deep);
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.question-count {
  color: var(--forest-medium);
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 12px;
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
  max-width: 1200px;
  margin: 0 auto;
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
  background: rgba(255, 255, 255, 0.8);
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
  max-width: 1200px;
  margin: 0 auto;
}



.results-header {
  text-align: center;
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
  margin-bottom: 30px;
}

.overall-score {
  text-align: center;
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
  margin-right: 8px;
}

.score-percent {
  font-size: 1.5rem;
  font-weight: 600;
}

.score-label {
  color: var(--forest-dark);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
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

.feedback-content {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 25px;
  border-left: 4px solid var(--forest-medium);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
}

.feedback-content p {
  color: var(--forest-dark);
  margin: 0 0 20px 0;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.6;
}

.feedback-list {
  color: var(--forest-deep);
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.feedback-list li {
  margin-bottom: 12px;
  line-height: 1.6;
  position: relative;
  padding-left: 25px;
  font-size: 1.2rem;
}

.feedback-list li::before {
  content: '✓';
  color: var(--forest-medium);
  font-weight: bold;
  font-size: 1rem;
  position: absolute;
  left: 0;
  top: 0;
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
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retake-btn {
  background: var(--forest-dark);
  color: var(--forest-light);
}

.retake-btn:hover {
  background: var(--forest-deep);
}



@media (max-width: 768px) {
  .test-page {
    padding: 10px;
  }

  .test-content {
    padding: 20px;
  }

  .welcome-card {
    padding: 20px;
  }

  .category-options {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .category-option {
    padding: 15px;
  }

  .category-icon {
    font-size: 2rem;
    margin-right: 10px;
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
    margin-right: 6px;
  }

  .score-percent {
    font-size: 1.2rem;
  }
}
</style>
