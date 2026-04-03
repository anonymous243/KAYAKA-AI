// LinkedIn OAuth Service

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID

// Get the current origin
const getOrigin = () => {
  return window.location.origin
}

// Generate LinkedIn OAuth URL
export const getLinkedInAuthUrl = () => {
  if (!LINKEDIN_CLIENT_ID) {
    console.error('❌ LinkedIn Client ID is not configured!')
    console.error('📝 Please add your VITE_LINKEDIN_CLIENT_ID to .env file')
    alert('LinkedIn OAuth is not configured. Please check console for details.')
    return '#'
  }

  const origin = getOrigin()
  const redirectUri = encodeURIComponent(`${origin}/auth/linkedin/callback`)
  const scope = encodeURIComponent('r_liteprofile r_emailaddress')
  const state = encodeURIComponent('linkedin_auth_' + Date.now())

  const url = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${LINKEDIN_CLIENT_ID}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}&` +
    `state=${state}`

  console.log('💼 LinkedIn OAuth URL:', url)
  console.log('📍 Redirect URI:', `${origin}/auth/linkedin/callback`)
  
  return url
}

// Exchange authorization code for access token
export const exchangeLinkedInCode = async (code, redirectUri) => {
  try {
    // In production, this should be done on your backend for security
    // LinkedIn requires client_secret which should never be exposed in frontend
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: 'YOUR_CLIENT_SECRET_HERE' // ⚠️ This should be on backend!
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get access token')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('❌ Error exchanging LinkedIn code:', error)
    throw error
  }
}

// Get user profile from LinkedIn
export const getLinkedInUserProfile = async (accessToken) => {
  try {
    // Get profile info
    const profileResponse = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile')
    }

    const profile = await profileResponse.json()

    // Get email
    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    })

    let email = ''
    if (emailResponse.ok) {
      const emailData = await emailResponse.json()
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || ''
    }

    // Extract name
    const firstName = profile.firstName?.localized?.en_US || profile.firstName?.localized?.[Object.keys(profile.firstName?.localized || {})[0]] || ''
    const lastName = profile.lastName?.localized?.en_US || profile.lastName?.localized?.[Object.keys(profile.lastName?.localized || {})[0]] || ''
    
    // Extract profile picture
    const picture = profile.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier || ''

    console.log('👤 LinkedIn profile:', { firstName, lastName, email })

    return {
      name: `${firstName} ${lastName}`.trim(),
      email: email,
      picture: picture,
      linkedinId: profile.id
    }
  } catch (error) {
    console.error('❌ Error fetching LinkedIn profile:', error)
    throw error
  }
}

// Handle LinkedIn callback and extract code from URL
export const handleLinkedInCallback = () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const error = params.get('error')
  const state = params.get('state')

  if (error) {
    console.error('❌ LinkedIn OAuth Error:', error)
    console.error('Error details:', params.get('error_description'))
    return null
  }
  
  if (code) {
    console.log('✅ LinkedIn authorization code received')
    return { code, state }
  }
  
  return null
}
