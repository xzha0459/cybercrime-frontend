// 认证工具函数

// JWT token解析函数
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

// 检查token是否过期
function isTokenExpired(token) {
  if (!token) return true

  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

// 自动登出函数
function autoLogout() {
  try {
    // 清除所有认证相关的localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_info')

    // 刷新页面或跳转到登录页
    window.location.href = '/signin'

    console.log('User automatically logged out due to token expiration')
  } catch (error) {
    console.error('Error during auto logout:', error)
    // 如果出错，至少清除localStorage
    localStorage.clear()
    window.location.href = '/signin'
  }
}

// 检查并处理token过期
export function checkTokenExpiration() {
  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  // 如果两个token都过期了，自动登出
  if (isTokenExpired(accessToken) && isTokenExpired(refreshToken)) {
    autoLogout()
    return false
  }

  // 如果access token过期但refresh token还有效，可以尝试刷新
  if (isTokenExpired(accessToken) && !isTokenExpired(refreshToken)) {
    console.log('Access token expired, refresh token still valid')
    // 这里可以添加token刷新逻辑
    // 暂时先登出，后续可以实现token刷新
    autoLogout()
    return false
  }

  return true
}

// 获取有效的access token
export function getValidAccessToken() {
  const accessToken = localStorage.getItem('access_token')

  if (!accessToken || isTokenExpired(accessToken)) {
    // 检查refresh token
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken || isTokenExpired(refreshToken)) {
      autoLogout()
      return null
    }

    // 如果refresh token有效但access token过期，暂时登出
    // 后续可以实现token刷新逻辑
    autoLogout()
    return null
  }

  return accessToken
}

// 设置定时检查token过期
let tokenCheckInterval = null

export function startTokenExpirationCheck() {
  // 清除现有的定时器
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
  }

  // 立即检查一次
  checkTokenExpiration()

  // 每30秒检查一次token过期
  tokenCheckInterval = setInterval(() => {
    checkTokenExpiration()
  }, 30000) // 30秒
}

export function stopTokenExpirationCheck() {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
    tokenCheckInterval = null
  }
}

// 在API请求前检查token
export function checkTokenBeforeRequest() {
  return checkTokenExpiration()
}
