<template>
  <div class="team-section">
    <div class="team-header">
      <h3 class="team-title">Team Management</h3>
      <p class="team-subtitle">Create or join a team to collaborate with friends</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading team information...</p>
    </div>

    <!-- No Team State -->
    <div v-else-if="!currentTeam" class="no-team-state">
      <div class="no-team-content">
        <div class="no-team-icon">👥</div>
        <h4>You're not in a team yet</h4>
        <p>Create a new team or join an existing one to start collaborating with friends!</p>

        <div class="team-actions">
          <button @click="showCreateTeamModal = true" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create Team
          </button>
          <button @click="showJoinTeamModal = true" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7ZM23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Join Team
          </button>
        </div>
      </div>
    </div>

    <!-- Has Team State -->
    <div v-else class="has-team-state">
      <div class="team-info-card">
        <div class="team-info-header">
          <div class="team-details">
            <h4 class="team-name">{{ currentTeam.name }}</h4>
            <p class="team-code">Invite Code: {{ currentTeam.invite_code }}</p>
            <p class="team-created">Created: {{ formatDate(currentTeam.created_at) }}</p>
          </div>
        </div>

        <div class="team-actions">
          <button @click="generateInvite" class="btn btn-primary" :disabled="inviteLoading">
            <svg v-if="!inviteLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div v-else class="btn-spinner"></div>
            Generate Invite
          </button>
          <button @click="showLeaveTeamModal = true" class="btn btn-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Leave Team
          </button>
        </div>
      </div>

      <!-- Invite ID Display -->
      <div v-if="inviteLink" class="invite-link-card">
        <div class="invite-header">
          <h5>Invite ID Generated!</h5>
          <button @click="copyInviteLink" class="copy-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 1H9C8.46957 1 7.96086 1.21071 7.58579 1.58579C7.21071 1.96086 7 2.46957 7 3V15C7 15.5304 7.21071 16.0391 7.58579 16.4142C7.96086 16.7893 8.46957 17 9 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V3C17 2.46957 16.7893 1.96086 16.4142 1.58579C16.0391 1.21071 15.5304 1 15 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Copy ID
          </button>
        </div>
        <div class="invite-link">
          <input
            :value="inviteLink"
            readonly
            class="invite-input"
            ref="inviteInput"
          />
        </div>
        <p class="invite-expires">Share this ID with your friends. Expires in 7 days.</p>
      </div>
    </div>

    <!-- Create Team Modal -->
    <div v-if="showCreateTeamModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h4>Create New Team</h4>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="teamName">Team Name</label>
            <input
              id="teamName"
              v-model="newTeamName"
              type="text"
              placeholder="Enter team name"
              class="form-input"
              :class="{ 'error': teamNameError }"
            />
            <p v-if="teamNameError" class="error-message">{{ teamNameError }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="createTeam" class="btn btn-primary" :disabled="createLoading">
            <div v-if="createLoading" class="btn-spinner"></div>
            Create Team
          </button>
        </div>
      </div>
    </div>

    <!-- Join Team Modal -->
    <div v-if="showJoinTeamModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h4>Join Team</h4>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="inviteCode">Invite ID</label>
            <input
              id="inviteCode"
              v-model="inviteCode"
              type="text"
              placeholder="Enter invite ID (e.g., e32ec0f9-c89c-40d0-8522-9973ad97f9c8)"
              class="form-input"
              :class="{ 'error': inviteCodeError }"
            />
            <p v-if="inviteCodeError" class="error-message">{{ inviteCodeError }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="joinTeam" class="btn btn-primary" :disabled="joinLoading">
            <div v-if="joinLoading" class="btn-spinner"></div>
            Join Team
          </button>
        </div>
      </div>
    </div>

    <!-- Leave Team Modal -->
    <div v-if="showLeaveTeamModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h4>Leave Team</h4>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to leave <strong>{{ currentTeam?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="leaveTeam" class="btn btn-danger" :disabled="leaveLoading">
            <div v-if="leaveLoading" class="btn-spinner"></div>
            Leave Team
          </button>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

// API服务函数 - 直接集成在组件中
const API_BASE_URL = 'https://godo2xgjc9.execute-api.ap-southeast-2.amazonaws.com'

// 获取访问令牌
const getAccessToken = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('No access token found. Please sign in.')
  }
  return token
}

// 创建团队
const createTeamAPI = async (teamName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/team/create/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
      body: JSON.stringify({
        name: teamName
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to create team')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating team:', error)
    throw error
  }
}

// 生成团队邀请
const generateTeamInviteAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/team/invite/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to generate invite')
    }

    return await response.json()
  } catch (error) {
    console.error('Error generating invite:', error)
    throw error
  }
}

// 接受团队邀请
const acceptTeamInviteAPI = async (inviteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/team/invite/${inviteId}/accept/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to accept invite')
    }

    return await response.json()
  } catch (error) {
    console.error('Error accepting invite:', error)
    throw error
  }
}

// 离开团队
const leaveTeamAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/team/leave/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to leave team')
    }

    return await response.json()
  } catch (error) {
    console.error('Error leaving team:', error)
    throw error
  }
}

// 获取当前团队信息 - 通过leaderboard API
const getCurrentTeamAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/my-team/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // 用户没有团队
      }
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to get team info')
    }

    const data = await response.json()
    return data.team // 返回团队信息
  } catch (error) {
    console.error('Error getting team info:', error)
    return null
  }
}

export default {
  name: 'TeamSection',
  setup() {
    const loading = ref(true)
    const currentTeam = ref(null)
    const inviteLink = ref('')
    const message = ref('')
    const messageType = ref('success')

    // Modal states
    const showCreateTeamModal = ref(false)
    const showJoinTeamModal = ref(false)
    const showLeaveTeamModal = ref(false)

    // Form data
    const newTeamName = ref('')
    const inviteCode = ref('')

    // Loading states
    const createLoading = ref(false)
    const joinLoading = ref(false)
    const leaveLoading = ref(false)
    const inviteLoading = ref(false)

    // Error states
    const teamNameError = ref('')
    const inviteCodeError = ref('')

    const loadTeamInfo = async () => {
      try {
        loading.value = true

        // 检查用户是否已登录
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          currentTeam.value = null
          return
        }

        const teamData = await getCurrentTeamAPI()
        currentTeam.value = teamData
      } catch (error) {
        console.error('Error loading team info:', error)
        showMessage('Failed to load team information', 'error')
      } finally {
        loading.value = false
      }
    }

    const createTeam = async () => {
      if (!newTeamName.value.trim()) {
        teamNameError.value = 'Team name is required'
        return
      }

      try {
        createLoading.value = true
        teamNameError.value = ''

        await createTeamAPI(newTeamName.value.trim())

        // 创建团队成功后，重新获取团队信息
        await loadTeamInfo()

        showMessage('Team created successfully!', 'success')
        closeModals()
        newTeamName.value = ''
      } catch (error) {
        teamNameError.value = error.message
      } finally {
        createLoading.value = false
      }
    }

    const generateInvite = async () => {
      try {
        inviteLoading.value = true

        const response = await generateTeamInviteAPI()
        // 显示邀请ID，用户分享给朋友
        inviteLink.value = response.invite_id

        showMessage('Invite ID generated! Share this ID with your friends.', 'success')
      } catch (error) {
        showMessage(error.message, 'error')
      } finally {
        inviteLoading.value = false
      }
    }

    const joinTeam = async () => {
      if (!inviteCode.value.trim()) {
        inviteCodeError.value = 'Invite ID is required'
        return
      }

      try {
        joinLoading.value = true
        inviteCodeError.value = ''

        // 使用邀请ID加入团队
        const inviteId = inviteCode.value.trim()

        await acceptTeamInviteAPI(inviteId)

        // 加入团队成功后，重新获取团队信息
        await loadTeamInfo()

        showMessage('Successfully joined the team!', 'success')
        closeModals()
        inviteCode.value = ''
      } catch (error) {
        inviteCodeError.value = error.message
      } finally {
        joinLoading.value = false
      }
    }

    const leaveTeam = async () => {
      try {
        leaveLoading.value = true

        await leaveTeamAPI()

        // 离开团队成功后，重新获取团队信息（应该返回null）
        await loadTeamInfo()

        inviteLink.value = ''
        showMessage('Successfully left the team', 'success')
        closeModals()
      } catch (error) {
        showMessage(error.message, 'error')
      } finally {
        leaveLoading.value = false
      }
    }

    const copyInviteLink = async () => {
      try {
        await navigator.clipboard.writeText(inviteLink.value)
        showMessage('Invite ID copied to clipboard!', 'success')
      } catch {
        // Fallback for older browsers
        const input = document.querySelector('.invite-input')
        input.select()
        document.execCommand('copy')
        showMessage('Invite ID copied to clipboard!', 'success')
      }
    }

    const closeModals = () => {
      showCreateTeamModal.value = false
      showJoinTeamModal.value = false
      showLeaveTeamModal.value = false
      newTeamName.value = ''
      inviteCode.value = ''
      teamNameError.value = ''
      inviteCodeError.value = ''
    }

    const showMessage = (text, type) => {
      message.value = text
      messageType.value = type
      setTimeout(() => {
        message.value = ''
      }, 5000)
    }

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return 'Unknown date'
      }
    }


    onMounted(() => {
      loadTeamInfo()
    })

    return {
      loading,
      currentTeam,
      inviteLink,
      message,
      messageType,
      showCreateTeamModal,
      showJoinTeamModal,
      showLeaveTeamModal,
      newTeamName,
      inviteCode,
      createLoading,
      joinLoading,
      leaveLoading,
      inviteLoading,
      teamNameError,
      inviteCodeError,
      createTeam,
      generateInvite,
      joinTeam,
      leaveTeam,
      copyInviteLink,
      closeModals,
      formatDate
    }
  }
}
</script>

<style scoped>
.team-section {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 15px var(--shadow-light);
  overflow: hidden;
}

.team-header {
  background: var(--violet-light);
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.team-title {
  margin: 0 0 0.5rem 0;
  color: var(--violet-ultra-dark);
  font-size: 1.5rem;
  font-weight: 700;
}

.team-subtitle {
  margin: 0;
  color: var(--violet-deep);
  font-size: 1rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--violet-sage);
  border-top: 4px solid var(--violet-ultra-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* No Team State */
.no-team-state {
  padding: 2rem 1.5rem;
}

.no-team-content {
  text-align: center;
}

.no-team-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-team-content h4 {
  color: var(--violet-ultra-dark);
  margin-bottom: 0.5rem;
}

.no-team-content p {
  color: var(--violet-deep);
  margin-bottom: 2rem;
}

.team-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Has Team State */
.has-team-state {
  padding: 1.5rem;
}

.team-info-card {
  background: var(--violet-light);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.team-info-header {
  margin-bottom: 1rem;
}

.team-details {
  flex: 1;
}

.team-name {
  margin: 0 0 0.25rem 0;
  color: var(--violet-ultra-dark);
  font-size: 1.25rem;
  font-weight: 700;
}

.team-code {
  margin: 0 0 0.25rem 0;
  color: var(--violet-deep);
  font-size: 0.9rem;
  font-family: monospace;
}

.team-created {
  margin: 0;
  color: var(--violet-deep);
  font-size: 0.9rem;
}

/* Invite Link Card */
.invite-link-card {
  background: #f8f9fa;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 1rem;
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.invite-header h5 {
  margin: 0;
  color: var(--violet-ultra-dark);
}

.copy-btn {
  background: none;
  border: none;
  color: var(--violet-deep);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background: var(--violet-sage);
}

.invite-link {
  margin-bottom: 0.5rem;
}

.invite-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  background: white;
}

.invite-expires {
  margin: 0;
  color: var(--violet-deep);
  font-size: 0.8rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--violet-ultra-dark);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--violet-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.btn-secondary {
  background: var(--violet-sage);
  color: var(--violet-ultra-dark);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--violet-light);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
}

.modal-header h4 {
  margin: 0;
  color: var(--violet-ultra-dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--violet-deep);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid var(--border-light);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--violet-ultra-dark);
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--violet-ultra-dark);
}

.form-input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.warning-text {
  color: #856404;
  background: #fff3cd;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
  margin-top: 1rem;
}

/* Messages */
.message {
  margin: 1rem 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive */
@media (max-width: 768px) {
  .team-actions {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
  }

  .team-info-header {
    text-align: center;
  }
}
</style>
