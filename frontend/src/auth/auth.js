import {
  CognitoUserPool
} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'ap-southeast-2_PinIZguLj',
  ClientId: '6eopmiug221gqqqusddeocrf3d',
}

const userPool = new CognitoUserPool(poolData)

// Get raw ID token (JWT)
export const getIdToken = () => {
  const currentUser = userPool.getCurrentUser()

  return new Promise((resolve, reject) => {
    if (!currentUser) return reject('No user is currently signed in.')

    currentUser.getSession((err, session) => {
      if (err) return reject(err)
      const token = session.getIdToken().getJwtToken()
      resolve(token)
    })
  })
}

// Decode ID token and return payload (claims)
export const getPayloadFromIdToken = async () => {
  try {
    const token = await getIdToken()
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payloadBase64))

    return decodedPayload // e.g. { email: ..., sub: ..., "cognito:username": ..., etc. }
  } catch (err) {
    console.error('Failed to decode token:', err)
    return null
  }
}

export { userPool }
