<template>
  <div class="challenge-page">
    <!-- 未认证时显示注册提示 -->
    <div v-if="!isAuthenticated" class="auth-required">
      <div class="auth-card">
        <h2>Sign Up Required</h2>
        <p>Please sign up to access the cybersecurity challenges</p>
        <button @click="redirectToSignUp" class="signup-btn">Sign Up</button>
      </div>
    </div>

    <!-- 认证后显示挑战内容 -->
    <div v-else>
      <!-- Module Selection Page -->
      <div v-if="!selectedModule" class="challenge-content">
        <!-- Task 1 Page -->
        <div v-if="currentTask === 0" class="task-section">
          <!-- Progress Indicator -->
          <div class="progress-indicator">
            <div class="progress-steps">
              <div
                v-for="step in 3"
                :key="step"
                class="progress-step"
                :class="{
                  'active': step === 1,
                  'completed': step < 1,
                  'locked': step > 1
                }"
              >
                <div class="step-number">{{ step }}</div>
                <div class="step-line" v-if="step < 3"></div>
              </div>
            </div>
          </div>

          <!-- Task Header -->
          <div class="task-header">
            <h1 class="task-title">Task 1: Network Novice Protection</h1>
            <p class="task-description">
              Users who are new to the online world need to master the most basic security protection knowledge. Through three core modules, build cybersecurity awareness from scratch.
            </p>
          </div>

          <!-- Module Cards -->
          <div class="module-cards">
            <!-- Module 1 -->
            <div class="module-card">
              <div class="module-info">
                <h3 class="module-title">Module 1:<br>Understanding Cyberbullying</h3>
                <p class="module-description">Learn to identify and respond to cyberbullying behavior</p>
              </div>
              <button class="start-module-btn" @click="() => selectModule({ id: 1, name: 'Understanding Cyberbullying', description: 'Learn to identify and respond to cyberbullying behavior', questionCount: 15 })">Start Learning →</button>
            </div>

            <!-- Module 2 -->
            <div class="module-card">
              <div class="module-info">
                <h3 class="module-title">Module 2:<br>Identifying Common Scams</h3>
                <p class="module-description">Master basic scam identification techniques</p>
              </div>
              <button class="start-module-btn" @click="() => selectModule({ id: 2, name: 'Identifying Common Scams', description: 'Master basic scam identification techniques', questionCount: 17 })">Start Learning →</button>
            </div>

            <!-- Module 3 -->
            <div class="module-card">
              <div class="module-info">
                <h3 class="module-title">Module 3:<br>Basic Privacy Protection</h3>
                <p class="module-description">Understand basic methods of personal information protection</p>
              </div>
              <button class="start-module-btn" @click="() => selectModule({ id: 3, name: 'Basic Privacy Protection', description: 'Understand basic methods of personal information protection', questionCount: 13 })">Start Learning →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Module Test Page -->
      <div v-if="selectedModule" class="module-test">

        <!-- Back Button -->
        <div class="test-header">
          <button @click="goBackToModules" class="back-to-modules-btn">← Back to Module Selection</button>
        </div>

        <!-- Test Progress Indicator -->
        <div class="test-progress-section" v-if="currentStep > 0">
          <div class="test-progress-bar">
            <div class="test-progress-fill" :style="{ width: `${(currentStep / testQuestions.length) * 100}%` }"></div>
          </div>
          <p class="test-progress-text">Question {{ currentStep }} / {{ testQuestions.length }}</p>
        </div>

        <!-- Question Page -->
        <div v-if="currentStep > 0 && currentStep <= testQuestions.length" class="question-section">
          <div class="question-card">
            <div class="question-header">
              <h3 class="question-title">{{ currentQuestion.question_text }}</h3>
            </div>

            <div class="options-container">
              <div
                v-for="(option, index) in currentQuestionOptions"
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
                {{ currentStep === testQuestions.length ? 'Complete Test' : 'Next' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Page -->
        <div v-else-if="currentStep > testQuestions.length" class="results-section">
          <div class="results-card">
            <div class="results-header">
              <div class="results-icon">🎉</div>
              <h2>Test Completed!</h2>
              <p>Congratulations on completing the {{ selectedModule.name }} module</p>
            </div>

            <div class="score-section">
              <div class="overall-score">
                <p class="score-label">Your Score</p>
                <div class="score-circle">
                  <span class="score-number">{{ Math.round((correctAnswers / testQuestions.length) * 100) }}</span>
                  <span class="score-percent">%</span>
                </div>
                <p class="score-detail">{{ correctAnswers }} out of {{ testQuestions.length }} correct</p>
              </div>
            </div>

            <div class="results-actions">
              <button @click="retakeTest" class="action-btn retake-btn">Retake Test</button>
              <button @click="goBackToModules" class="action-btn back-btn">Back to Modules</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ChallengeSection',
  emits: ['challenge-status-changed'],
  setup(props, { emit }) {
    const router = useRouter()

    // Authentication state
    const isAuthenticated = ref(false)
    const currentUser = ref(null)

    // Challenge state
    const currentTask = ref(0)
    const selectedModule = ref(null)

    // Test state
    const testQuestions = ref([])
    const currentStep = ref(0) //
    const selectedAnswer = ref(null)
    const correctAnswers = ref(0)
    const userAnswers = ref([])

    // CSV data
    const quizData = ref([])

    // Check user authentication status
    const checkAuthStatus = () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const userInfoStr = localStorage.getItem('user_info')

        if (accessToken && userInfoStr) {
          isAuthenticated.value = true
          currentUser.value = JSON.parse(userInfoStr)
          console.log('User authenticated:', currentUser.value)
        } else {
          isAuthenticated.value = false
          currentUser.value = null
          console.log('User not authenticated: No token found')
        }
      } catch (error) {
        isAuthenticated.value = false
        currentUser.value = null
        console.log('User not authenticated:', error)
      }
    }

    // Redirect to sign up function
    const redirectToSignUp = () => {
      router.push('/signup')
    }

    // Task data
    const taskData = {
      1: {
        title: 'Network Newbie Protection',
        description: 'Learn basic security protection knowledge as you start exploring the online world.',
        modules: [
          {
            id: 1,
            name: 'Understanding Cyber Bullying',
            description: 'Learn to identify and respond to cyberbullying behavior',
            icon: 'shield',
            questionCount: 15,
            difficulty: 'Beginner'
          },
          {
            id: 2,
            name: 'Identifying Common Scams',
            description: 'Master basic techniques for identifying scams',
            icon: 'warning',
            questionCount: 17,
            difficulty: 'Beginner'
          },
          {
            id: 3,
            name: 'Basic Privacy Protection',
            description: 'Learn basic methods for protecting personal information',
            icon: 'lock',
            questionCount: 13,
            difficulty: 'Beginner'
          }
        ]
      },
      2: {
        title: 'Security Awareness Enhancement',
        description: 'Face more complex network threat scenarios as you develop deeper security awareness.',
        modules: [
          {
            id: 4,
            name: 'Deep Threat Analysis',
            description: 'Understand the underlying principles of network threats',
            icon: '🔍',
            questionCount: 13,
            difficulty: 'Intermediate'
          },
          {
            id: 5,
            name: 'Scam Technique Analysis',
            description: 'Analyze the operational mechanisms of complex scams',
            icon: '🧠',
            questionCount: 12,
            difficulty: 'Intermediate'
          },
          {
            id: 6,
            name: 'Technical Protection Application',
            description: 'Learn to use technical tools for protection',
            icon: 'settings',
            questionCount: 10,
            difficulty: 'Intermediate'
          }
        ]
      },
      3: {
        title: 'Security Expert Advancement',
        description: 'Master professional-level security management and compliance knowledge.',
        modules: [
          {
            id: 7,
            name: 'Regulatory Policy Mastery',
            description: 'Understand relevant legal and regulatory requirements',
            icon: '📋',
            questionCount: 10,
            difficulty: 'Advanced'
          },
          {
            id: 8,
            name: 'Organizational Security Management',
            description: 'Learn enterprise-level security strategy development',
            icon: '🏢',
            questionCount: 10,
            difficulty: 'Advanced'
          }
        ]
      }
    }

    // Methods
    const startTask = (taskNumber) => {
      if (taskNumber <= currentTask.value) {
        currentTask.value = taskNumber
        selectedModule.value = null
        // Emit challenge status change when starting a task
        emit('challenge-status-changed', true)
      }
    }

    const selectModule = (module) => {
      selectedModule.value = module
      startModuleTest()
    }

    // Load Excel data
    const loadQuizData = async () => {
      try {
        // For now, let's use the CSV data as fallback since we need to install xlsx library
        const response = await fetch('/quiz.csv')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const csvText = await response.text()

        const lines = csvText.split('\n')
        const headers = lines[0].split(',')

        const data = []
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',')
            const row = {}
            headers.forEach((header, index) => {
              row[header.trim()] = values[index] ? values[index].trim() : ''
            })
            data.push(row)
          }
        }
        quizData.value = data
      } catch (error) {
        console.error('Error loading quiz data:', error)
        // Fallback: create some test data
        quizData.value = [
          {
            id: '1',
            question_text: 'What is cyberbullying?',
            option_a: 'A form of physical bullying',
            option_b: 'Bullying using electronic means',
            option_c: 'Only happens in schools',
            option_d: 'Less harmful than traditional bullying',
            correct_answer: 'Bullying using electronic means',
            module_name: 'Cyber Harassment Basic Recognition'
          },
          {
            id: '2',
            question_text: 'What should you do if you encounter cyberbullying?',
            option_a: 'Ignore it completely',
            option_b: 'Respond aggressively to the bully',
            option_c: 'Report it to a trusted adult or authority',
            option_d: 'Share it with as many people as possible',
            correct_answer: 'Report it to a trusted adult or authority',
            module_name: 'Cyber Harassment Basic Recognition'
          },
          {
            id: '3',
            question_text: 'What is a common characteristic of cyberbullying?',
            option_a: 'It is always done face-to-face',
            option_b: 'It can be done anonymously',
            option_c: 'It only happens in schools',
            option_d: 'It is less harmful than traditional bullying',
            correct_answer: 'It can be done anonymously',
            module_name: 'Cyber Harassment Basic Recognition'
          },
          {
            id: '4',
            question_text: 'What is a common characteristic of imposter scams?',
            option_a: 'They offer large sums of money',
            option_b: 'They impersonate trusted organizations',
            option_c: 'They require immediate payment',
            option_d: 'They are always conducted in person',
            correct_answer: 'They impersonate trusted organizations',
            module_name: 'Common Scam Identification'
          },
          {
            id: '5',
            question_text: 'What is a red flag in a job offer that could indicate a scam?',
            option_a: 'High salary',
            option_b: 'Request for personal financial information',
            option_c: 'Flexible working hours',
            option_d: 'Job description related to your field',
            correct_answer: 'Request for personal financial information',
            module_name: 'Common Scam Identification'
          }
        ]
      }
    }

    // Start module test
    const startModuleTest = () => {
      // For now, use all available questions for any module
      // This ensures we always have questions to test with
      let moduleQuestions = quizData.value

      // Randomly select 5 questions
      const shuffled = [...moduleQuestions].sort(() => 0.5 - Math.random())
      testQuestions.value = shuffled.slice(0, 5)

      // Reset test state
      currentStep.value = 1
      selectedAnswer.value = null
      correctAnswers.value = 0
      userAnswers.value = []
    }

    // Get current question
    const currentQuestion = computed(() => {
      if (currentStep.value > 0 && currentStep.value <= testQuestions.value.length) {
        return testQuestions.value[currentStep.value - 1]
      }
      return null
    })

    // Get current question options
    const currentQuestionOptions = computed(() => {
      if (!currentQuestion.value) return []

      const options = []
      if (currentQuestion.value.option_a) options.push(currentQuestion.value.option_a)
      if (currentQuestion.value.option_b) options.push(currentQuestion.value.option_b)
      if (currentQuestion.value.option_c) options.push(currentQuestion.value.option_c)
      if (currentQuestion.value.option_d) options.push(currentQuestion.value.option_d)
      if (currentQuestion.value.option_e) options.push(currentQuestion.value.option_e)

      return options
    })

    // Select answer
    const selectAnswer = (index) => {
      selectedAnswer.value = index
    }

    // Next question
    const nextQuestion = () => {
      if (selectedAnswer.value === null || !currentQuestion.value) return

      // Check if answer is correct
      const correctAnswerIndex = getCorrectAnswerIndex()
      const isCorrect = selectedAnswer.value === correctAnswerIndex

      if (isCorrect) {
        correctAnswers.value++
      }

      // Store user answer
      userAnswers.value.push({
        questionIndex: currentStep.value - 1,
        selectedAnswer: selectedAnswer.value,
        isCorrect: isCorrect
      })

      // Move to next question or finish test
      if (currentStep.value < testQuestions.value.length) {
        currentStep.value++
        selectedAnswer.value = null
      } else {
        // Test completed
        currentStep.value = testQuestions.value.length + 1
      }
    }

    // Previous question
    const previousQuestion = () => {
      if (currentStep.value > 1) {
        currentStep.value--
        selectedAnswer.value = null
      }
    }

    // Get correct answer index
    const getCorrectAnswerIndex = () => {
      if (!currentQuestion.value) return -1

      const correctAnswer = currentQuestion.value.correct_answer
      const options = currentQuestionOptions.value

      for (let i = 0; i < options.length; i++) {
        if (options[i] === correctAnswer) {
          return i
        }
      }
      return -1
    }

    // Retake test
    const retakeTest = () => {
      if (selectedModule.value) {
        startModuleTest(selectedModule.value)
      }
    }

    const goBack = () => {
      currentTask.value = 0
      selectedModule.value = null
      // Emit challenge status change when going back to main view
      emit('challenge-status-changed', false)
    }

    const goBackToModules = () => {
      selectedModule.value = null
      currentStep.value = 0
      testQuestions.value = []
      selectedAnswer.value = null
      correctAnswers.value = 0
      userAnswers.value = []
    }

    const getTaskTitle = (taskNumber) => {
      return taskData[taskNumber]?.title || ''
    }

    const getTaskDescription = (taskNumber) => {
      return taskData[taskNumber]?.description || ''
    }

    const getTaskModules = (taskNumber) => {
      return taskData[taskNumber]?.modules || []
    }

    // Check authentication on mount
    onMounted(() => {
      checkAuthStatus()
      loadQuizData()
    })

    return {
      // Authentication
      isAuthenticated,
      currentUser,
      checkAuthStatus,
      redirectToSignUp,

      // Challenge state
      currentTask,
      selectedModule,

      // Test state
      testQuestions,
      currentStep,
      selectedAnswer,
      correctAnswers,
      currentQuestion,
      currentQuestionOptions,

      // Methods
      startTask,
      selectModule,
      goBack,
      goBackToModules,
      getTaskTitle,
      getTaskDescription,
      getTaskModules,
      selectAnswer,
      nextQuestion,
      previousQuestion,
      retakeTest
    }
  }
}
</script>

<style scoped>
.challenge-page {
  background: var(--violet-light);
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: var(--violet-ultra-dark);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: var(--violet-ultra-dark);
  font-weight: 500;
  margin: 0;
}

.challenge-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}


/* Progress Indicator */
.progress-indicator {
  margin-bottom: 40px;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.progress-step {
  display: flex;
  align-items: center;
  position: relative;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  background: var(--violet-sage);
  transition: all 0.3s ease;
  z-index: 2;
}

.progress-step.active .step-number {
  background: var(--violet-dark);
}

.progress-step.completed .step-number {
  background: var(--violet-ultra-dark);
}

.progress-step.locked .step-number {
  background: var(--violet-sage);
  opacity: 0.5;
}

.step-line {
  width: 60px;
  height: 3px;
  background: var(--violet-sage);
  margin-left: -1px;
  z-index: 1;
}

.progress-step.active .step-line {
  background: var(--violet-dark);
}

.progress-step.completed .step-line {
  background: var(--violet-ultra-dark);
}

/* Task Section */
.task-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.task-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.task-header {
  text-align: center;
  margin-bottom: 40px;
}

.task-title {
  color: var(--violet-ultra-dark);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.task-description {
  color: var(--violet-deep);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 1000px;
  margin: 0 auto;
}

/* Module Cards */
.module-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.module-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid var(--violet-sage);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.module-card:hover {
  border-color: var(--violet-dark);
}

.module-info {
  flex: 1;
  margin-bottom: 20px;
}

.module-title {
  color: var(--violet-ultra-dark);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.module-description {
  color: var(--violet-deep);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.module-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.question-count {
  color: var(--violet-dark);
  font-weight: 600;
  background: var(--violet-light);
  padding: 4px 8px;
  border-radius: 12px;
}

.difficulty {
  color: var(--violet-deep);
  font-weight: 500;
}

.start-module-btn {
  background: var(--violet-ultra-dark);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.start-module-btn:hover {
  background: var(--violet-dark);
}

.card-graphic {
  flex: 0 0 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.graphic-container {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-icon {
  font-size: 3rem;
  color: var(--violet-dark);
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--violet-dark);
  z-index: 10;
}


/* Module Test */
.module-test {
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  margin-bottom: 2rem;
}

.back-to-modules-btn {
  background: var(--violet-ultra-dark);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.back-to-modules-btn:hover {
  background: var(--violet-dark);
}

.test-progress-text {
  text-align: center;
  color: var(--violet-ultra-dark);
  font-weight: 500;
  margin: 0;
}

.test-content {
  max-width: 1200px;
  margin: 0 auto;
}

.question-section {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.question-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.question-header {
  margin-bottom: 30px;
}

.question-title {
  color: var(--violet-ultra-dark);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.options-container {
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 2px solid var(--violet-sage);
  border-radius: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
}

.option-item:hover {
  border-color: var(--violet-dark);
  background: var(--violet-light);
}

.option-item.selected {
  border-color: var(--violet-ultra-dark);
  background: var(--violet-light);
}

.option-radio {
  margin-right: 15px;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--violet-sage);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-circle.checked {
  border-color: var(--violet-ultra-dark);
  background: var(--violet-ultra-dark);
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
  color: var(--violet-dark);
  font-weight: 600;
  margin-right: 10px;
  min-width: 20px;
}

.option-content {
  color: var(--violet-ultra-dark);
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
  background: var(--violet-light);
  color: var(--violet-deep);
  border: 2px solid var(--violet-sage);
}

.prev-btn:hover {
  background: var(--violet-sage);
  border-color: var(--violet-dark);
}

.next-btn {
  background: var(--violet-ultra-dark);
  color: white;
}

.next-btn:hover:not(:disabled) {
  background: var(--violet-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.next-btn:disabled {
  background: var(--violet-sage);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Results Section */
.results-section {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.results-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
  color: var(--violet-ultra-dark);
  margin-bottom: 10px;
  font-size: 2rem;
}

.results-header p {
  color: var(--violet-deep);
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
  background: linear-gradient(135deg, var(--violet-dark) 0%, var(--violet-ultra-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  position: relative;
  box-shadow: 0 8px 25px var(--shadow-medium);
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
  color: var(--violet-ultra-dark);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.score-detail {
  color: var(--violet-deep);
  font-size: 1rem;
  margin: 0;
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
  background: var(--violet-ultra-dark);
  color: white;
}

.retake-btn:hover {
  background: var(--violet-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-medium);
}

.back-btn {
  background: var(--violet-sage);
  color: var(--violet-deep);
  border: 2px solid var(--violet-dark);
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: var(--violet-dark);
  color: white;
}

.auth-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.signup-btn {
  background: var(--violet-ultra-dark);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--shadow-dark);
}

@media (max-width: 1024px) {
  .module-cards {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .challenge-content {
    padding: 10px;
  }

  .task-card {
    padding: 20px;
  }

  .task-title {
    font-size: 2rem;
  }

  .task-description {
    font-size: 1rem;
  }

  .module-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .module-card {
    padding: 20px;
  }


  .progress-steps {
    flex-wrap: wrap;
    gap: 10px;
  }

  .step-line {
    width: 40px;
  }

}
</style>
