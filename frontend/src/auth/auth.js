import {
  CognitoUserPool
} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'ap-southeast-2_PinIZguLj',           
  ClientId: '6eopmiug221gqqqusddeocrf3d'             
}

const userPool = new CognitoUserPool(poolData)

/**
 * Get ID token (JWT) for Authorization header
 * @returns {Promise<string>} JWT token
 */
export const getIdToken = () => {
  const currentUser = userPool.getCurrentUser()

  return new Promise((resolve, reject) => {
    if (!currentUser) {
      return reject('No user is currently signed in.')
    }

    currentUser.getSession((err, session) => {
      if (err) {
        return reject('Failed to get session: ' + err)
      }

      if (!session.isValid()) {
        return reject('Session is invalid.')
      }

      const token = session.getIdToken().getJwtToken()
      resolve(token)
    })
  })
}

/**
 * Log out the current user
 */
export const logout = () => {
  const user = userPool.getCurrentUser()
  if (user) {
    user.signOut()
  }
}

export { userPool }
