<template>
  <div class="team-info-section">
    <div class="section-header">
      <h2 class="section-title">Team Management</h2>
    </div>
    <div class="team-info-container">

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading team information...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="alert alert-danger">
          <h6 class="alert-heading">Error loading team information:</h6>
          <p>{{ error }}</p>
          <button @click="retryLoad" class="btn btn-retry">
            Try Again
          </button>
        </div>
      </div>

      <!-- No Team State -->
      <div v-else-if="!currentTeam" class="no-team-state">
        <div class="empty-state-card card-base">
          <h3 class="no-team-title">
            <span class="no-team-icon">👥</span>
            Not in a Team
          </h3>
          <p>You're not currently part of any team. Create a new team or join an existing one to start collaborating with friends!</p>
          <div class="team-actions no-team-actions">
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
        <div class="team-card card-base">
          <div class="team-content">
            <h3 class="team-name">You are in: {{ currentTeam.name }}</h3>
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

          <!-- Team Members Section -->
          <div class="team-members-section">
            <div class="members-header">
              <h4 class="members-title">Team Members</h4>
            </div>

            <!-- Members List -->
            <div v-if="teamMembers.length > 0" class="members-list">
              <div
                v-for="(member, index) in teamMembers"
                :key="member.username"
                class="member-card"
              >
                <div class="member-rank">{{ index + 1 }}</div>
                <div class="member-avatar">{{ member.username.charAt(0).toUpperCase() }}</div>
                <div class="member-info">
                  <div class="member-main-info">
                    <h5 class="member-username">{{ member.username }}</h5>
                    <div class="member-stats">
                      <span class="member-points">{{ member.points }} points</span>
                      <span class="member-level">Level {{ member.challenge_level }}</span>
                      <div v-if="member.badge" class="member-badge">
                        <span class="badge-name">{{ member.badge.name }}</span>
                      </div>
                      <div v-else class="no-badge">No badge yet</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Members State -->
            <div v-else class="no-members">
              <p>No team members found.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite ID Display -->
      <div v-if="inviteLink" class="invite-card">
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
          <h3>Create New Team</h3>
          <button @click="closeModals" class="close-btn">&times;</button>
        </div>
        <div class="modal-content">
          <input
            v-model="newTeamName"
            placeholder="Enter team name"
            class="modal-input"
            @keyup.enter="createTeam"
          />
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="createTeam" class="btn btn-primary" :disabled="createTeamLoading">
            <div v-if="createTeamLoading" class="btn-spinner"></div>
            <span v-else>Create</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Join Team Modal -->
    <div v-if="showJoinTeamModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Join Team</h3>
          <button @click="closeModals" class="close-btn">&times;</button>
        </div>
        <div class="modal-content">
          <input
            v-model="joinInviteId"
            placeholder="Enter invite ID"
            class="modal-input"
            @keyup.enter="joinTeam"
          />
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="joinTeam" class="btn btn-primary" :disabled="joinTeamLoading">
            <div v-if="joinTeamLoading" class="btn-spinner"></div>
            <span v-else>Join</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Leave Team Confirmation Modal -->
    <div v-if="showLeaveTeamModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Leave Team</h3>
          <button @click="closeModals" class="close-btn">&times;</button>
        </div>
        <div class="modal-content">
          <p>Are you sure you want to leave "{{ currentTeam ? currentTeam.name : 'this team' }}"?</p>
        </div>
        <div class="modal-footer">
          <button @click="closeModals" class="btn btn-secondary">Cancel</button>
          <button @click="leaveTeam" class="btn btn-danger" :disabled="leaveTeamLoading">
            <div v-if="leaveTeamLoading" class="btn-spinner"></div>
            <span v-else>Leave</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="['toast', toast.type]">
      {{ toast.message }}
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
    throw error
  }
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
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(errorData.detail || `Failed to accept invite: ${response.status}`)
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
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
      throw new Error(errorData.detail || `Failed to leave team: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error leaving team:', error)
    throw error
  }
}

// 获取团队用户列表
const getTeamMembersAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/my-team/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // 用户没有团队
      }
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to get team members')
    }

    const data = await response.json()
    return data.leaderboard || [] // 返回用户列表
  } catch (error) {
    console.error('Error getting team members:', error)
    throw error
  }
}

export default {
  name: 'TeamInfoSection',
  setup() {
    const loading = ref(true)
    const currentTeam = ref(null)
    const teamMembers = ref([])
    const error = ref(null)

    // Modal states
    const showCreateTeamModal = ref(false)
    const showJoinTeamModal = ref(false)
    const showLeaveTeamModal = ref(false)

    // Form states
    const newTeamName = ref('')
    const joinInviteId = ref('')
    const inviteLink = ref('')

    // Loading states
    const createTeamLoading = ref(false)
    const joinTeamLoading = ref(false)
    const leaveTeamLoading = ref(false)
    const inviteLoading = ref(false)

    // Toast notification
    const toast = ref({ show: false, message: '', type: '' })

    const loadTeamInfo = async () => {
      try {
        loading.value = true
        error.value = null

        // Check if user is authenticated
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          currentTeam.value = null
          return
        }

        currentTeam.value = await getCurrentTeamAPI()

        // 如果有团队，加载团队成员
        if (currentTeam.value) {
          await loadTeamMembers()
        }
      } catch (err) {
        console.error('Error loading team info:', err)
        error.value = 'Failed to load team information. Please try again.'
        currentTeam.value = null
      } finally {
        loading.value = false
      }
    }

    const loadTeamMembers = async () => {
      try {
        const members = await getTeamMembersAPI()
        teamMembers.value = members || []
      } catch (err) {
        console.error('Error loading team members:', err)
        teamMembers.value = []
      }
    }

    const retryLoad = () => {
      loadTeamInfo()
    }


    const showMessage = (message, type) => {
      toast.value.show = true
      toast.value.message = message
      toast.value.type = type
      setTimeout(() => {
        toast.value.show = false
      }, 3000)
    }

    const createTeam = async () => {
      if (!newTeamName.value) {
        showMessage('Team name cannot be empty', 'error')
        return
      }
      createTeamLoading.value = true
      try {
        await createTeamAPI(newTeamName.value)
        showMessage('Team created successfully!', 'success')
        closeModals()
        await loadTeamInfo()
      } catch (error) {
        console.error('Error creating team:', error)
        showMessage(error.message || 'Failed to create team', 'error')
      } finally {
        createTeamLoading.value = false
      }
    }

    const generateInvite = async () => {
      inviteLoading.value = true
      try {
        const data = await generateTeamInviteAPI()
        inviteLink.value = data.invite_id
        showMessage('Invite ID generated and copied to clipboard!', 'success')
        await navigator.clipboard.writeText(data.invite_id)
      } catch (error) {
        console.error('Error generating invite:', error)
        showMessage(error.message || 'Failed to generate invite', 'error')
      } finally {
        inviteLoading.value = false
      }
    }

    const copyInviteLink = async () => {
      if (inviteLink.value) {
        try {
          await navigator.clipboard.writeText(inviteLink.value)
          showMessage('Invite ID copied to clipboard!', 'success')
        } catch (err) {
          console.error('Failed to copy invite ID:', err)
          showMessage('Failed to copy invite ID', 'error')
        }
      }
    }

    const joinTeam = async () => {
      if (!joinInviteId.value) {
        showMessage('Invite ID cannot be empty', 'error')
        return
      }
      joinTeamLoading.value = true
      try {
        await acceptTeamInviteAPI(joinInviteId.value)
        showMessage('Successfully joined team!', 'success')
        closeModals()
        await loadTeamInfo()

        // Show toast for friend invitation reward
        setTimeout(() => {
          window.showActivityToast()
        }, 1000)
      } catch (error) {
        console.error('Error joining team:', error)
        showMessage(error.message || 'Failed to join team', 'error')
      } finally {
        joinTeamLoading.value = false
      }
    }

    const leaveTeam = async () => {
      leaveTeamLoading.value = true
      try {
        await leaveTeamAPI()
        showMessage('Successfully left team!', 'success')
        closeModals()
        await loadTeamInfo()
      } catch (error) {
        console.error('Error leaving team:', error)
        showMessage(error.message || 'Failed to leave team', 'error')
      } finally {
        leaveTeamLoading.value = false
      }
    }

    const closeModals = () => {
      showCreateTeamModal.value = false
      showJoinTeamModal.value = false
      showLeaveTeamModal.value = false
      newTeamName.value = ''
      joinInviteId.value = ''
    }

    onMounted(() => {
      loadTeamInfo()
    })

    return {
      loading,
      currentTeam,
      teamMembers,
      error,
      retryLoad,
      loadTeamMembers,
      showCreateTeamModal,
      showJoinTeamModal,
      showLeaveTeamModal,
      newTeamName,
      joinInviteId,
      inviteLink,
      createTeamLoading,
      joinTeamLoading,
      leaveTeamLoading,
      inviteLoading,
      toast,
      createTeam,
      generateInvite,
      copyInviteLink,
      joinTeam,
      leaveTeam,
      closeModals
    }
  }
}
</script>

<style scoped>
.team-info-section {
  padding: 0 0 2rem 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.team-info-container {
  max-width: 1200px;
  margin: 0 auto;
}


/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 0;
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
  text-align: center;
  padding: 0;
}

/* Common Card Styles */
.card-base {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 15px var(--shadow-light);
  padding: 2rem;
}

.empty-state-card {
  max-width: 1200px;
  margin: 0 auto;
}

.no-team-title {
  color: var(--violet-ultra-dark);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.no-team-icon {
  font-size: 1.5rem;
}

.empty-state-card p {
  color: var(--violet-deep);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.no-team-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Has Team State */
.has-team-state {
  max-width: 1200px;
  margin: 0 auto;
}


.team-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.team-name {
  margin: 0;
  color: var(--violet-ultra-dark);
  font-size: 1.5rem;
  font-weight: 700;
}

.team-actions {
  display: flex;
  gap: 1rem;
}

/* Error State */
.error-state {
  padding: 2rem;
}

.alert {
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.alert-heading {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-retry {
  background: #dc3545;
  color: white;
  margin-top: 1rem;
}

.btn-retry:hover {
  background: #c82333;
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
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--violet-ultra-dark);
  color: white;
}

.btn-primary:hover {
  background: var(--violet-dark);
}

.btn-secondary {
  background: transparent;
  color: var(--violet-dark);
  border: 2px solid var(--violet-dark);
}

.btn-secondary:hover {
  background: var(--violet-dark);
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  background: #dc2626;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--violet-light);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--violet-dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--violet-deep);
}

.modal-content {
  padding: 1.5rem;
  text-align: center;
}

.modal-input {
  width: calc(100% - 2rem);
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-primary);
}

.modal-input:focus {
  border-color: var(--violet-deep);
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-light);
  background: var(--bg-primary);
}

/* Invite Card Styles */
.invite-card {
  background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(34, 197, 94, 0.2);
  margin-top: 1rem;
}

.invite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.invite-header h5 {
  margin: 0;
  color: #059669;
  font-size: 1rem;
}

.copy-btn {
  background: #10b981;
  color: #059669;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s ease;
}

.copy-btn:hover {
  background: #047857;
}

.invite-link {
  margin-bottom: 0.75rem;
}

.invite-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #047857;
  border-radius: 8px;
  background: #f0fdf4;
  font-family: monospace;
  font-size: 0.9rem;
  color: #059669;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.invite-expires {
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
  text-align: right;
  margin: 0;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  opacity: 0;
  animation: slideIn 0.3s forwards, fadeOut 0.3s 2.7s forwards;
}

.toast.success {
  background-color: #059669;
}

.toast.error {
  background-color: #dc2626;
}

@keyframes slideIn {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 20px;
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .team-info-container {
    padding: 0 1rem;
  }

  .team-card {
    padding: 1.5rem;
  }

  .team-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .team-name {
    font-size: 1.25rem;
  }

  .team-actions {
    justify-content: center;
  }

  .empty-state-card {
    padding: 1.5rem;
  }

  .no-team-title {
    font-size: 1.25rem;
  }
}

/* Team Members Section */
.team-members-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.members-header {
  margin-bottom: 0.5rem;
}

.members-title {
  color: var(--violet-ultra-dark);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}


.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: var(--violet-light);
  border: 1px solid var(--violet-sage);
  border-radius: 8px;
}

.member-rank {
  width: 32px;
  height: 32px;
  color: var(--violet-ultra-dark);;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.member-avatar {
  width: 42px;
  height: 42px;
  background: var(--violet-ultra-dark);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin-right: 1rem;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-main-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.member-username {
  color: var(--violet-ultra-dark);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.member-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.member-points,
.member-level {
  color: var(--violet-deep);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.badge-name {
  background: var(--violet-sage);
  color: var(--violet-ultra-dark);
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.no-badge {
  color: var(--violet-sage);
  font-size: 0.75rem;
  font-style: italic;
  white-space: nowrap;
}

.no-members {
  text-align: center;
  padding: 2rem;
  color: var(--violet-deep);
  background: var(--violet-light);
  border-radius: 12px;
  border: 1px solid var(--violet-sage);
}

/* Responsive Design */
@media (max-width: 768px) {

  .member-card {
    padding: 0.75rem;
  }

  .member-rank {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
    margin-right: 0.75rem;
  }

  .member-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    margin-right: 0.75rem;
  }

  .member-main-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .member-stats {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .member-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
