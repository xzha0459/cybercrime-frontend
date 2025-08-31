<template>
  <div class="user-center">
    <div class="user-info">
      <div class="email-display">
        {{ userEmail }}
      </div>
      <button class="sign-out-btn" @click="handleSignOut">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCenterPage',
  data() {
    return {
      userEmail: 'hezitt0925@gmail.com'
    }
  },
  methods: {
    handleSignOut() {
      // 这里可以添加退出登录的逻辑
      console.log('用户退出登录')
      // 可以跳转到登录页面或首页
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.user-center {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
  border-bottom: 1px solid #ddd;
}

.email-display {
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 6px;
  color: #333;
  font-size: 14px;
  min-width: 200px;
}

.sign-out-btn {
  background-color: white;
  border: 1px solid #666;
  color: #333;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.sign-out-btn:hover {
  background-color: #f0f0f0;
}
</style>
