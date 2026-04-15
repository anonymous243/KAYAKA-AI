/**
 * Kayaka-AI Cloudflare Worker
 * Production-grade API with OAuth, JWT, and E2E encryption
 */

// ==========================================
// CRYPTOGRAPHY & ENCRYPTION
// ==========================================

// Generate secure random ID
function generateId() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// SHA-256 hash for token storage
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
}

// AES-256-GCM Encryption
async function encrypt(text, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    'AES-GCM',
    false,
    ['encrypt']
  );
  
  // Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );
  
  // Combine IV + ciphertext
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  // Return base64
  return btoa(String.fromCharCode(...result));
}

async function decrypt(encryptedBase64, key) {
  const encoder = new TextEncoder();
  const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  
  // Extract IV and ciphertext
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  
  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    'AES-GCM',
    false,
    ['decrypt']
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  
  return new TextDecoder().decode(decrypted);
}

// ==========================================
// JWT TOKEN MANAGEMENT
// ==========================================

// Simple JWT implementation
async function signJWT(payload, secret, expiresIn = '7d') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  
  // Parse expiry
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  let exp = now + 7 * 24 * 60 * 60; // default 7 days
  if (match) {
    const [, value, unit] = match;
    const multipliers = { d: 86400, h: 3600, m: 60, s: 1 };
    exp = now + parseInt(value) * multipliers[unit];
  }
  
  const tokenPayload = { ...payload, iat: now, exp };
  
  const base64Header = btoa(JSON.stringify(header)).replace(/=/g, '');
  const base64Payload = btoa(JSON.stringify(tokenPayload)).replace(/=/g, '');
  
  const signatureInput = `${base64Header}.${base64Payload}`;
  const signature = await signHMAC(signatureInput, secret);
  
  return `${signatureInput}.${signature}`;
}

async function verifyJWT(token, secret) {
  const [base64Header, base64Payload, signature] = token.split('.');
  
  const expectedSignature = await signHMAC(`${base64Header}.${base64Payload}`, secret);
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }
  
  const payload = JSON.parse(atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/')));
  
  // Check expiry
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired');
  }
  
  return payload;
}

async function signHMAC(message, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ==========================================
// OAUTH PROVIDERS
// ==========================================

async function handleGoogleOAuth(env, code) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: `${env.FRONTEND_URL}/auth/callback`,
    grant_type: 'authorization_code'
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  
  if (!response.ok) {
    throw new Error('Google OAuth failed');
  }
  
  const data = await response.json();
  
  // Get user info
  const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${data.access_token}` }
  });
  
  if (!userInfo.ok) {
    throw new Error('Failed to fetch Google user profile');
  }
  
  const profile = await userInfo.json();
  
  return {
    provider: 'google',
    providerId: profile.sub,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.picture
  };
}

async function handleGitHubOAuth(env, code) {
  const tokenUrl = 'https://github.com/login/oauth/access_token';
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${env.FRONTEND_URL}/auth/github/callback`
    })
  });
  
  if (!response.ok) {
    throw new Error('GitHub OAuth failed');
  }
  
  const data = await response.json();
  
  // Get user info
  const userInfo = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!userInfo.ok) {
    throw new Error('Failed to fetch GitHub user profile');
  }
  
  const profile = await userInfo.json();
  
  // Get email (GitHub may have multiple emails)
  const emails = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  let email = profile.email;
  if (emails.ok) {
    const emailList = await emails.json();
    const primary = emailList.find(e => e.primary && e.verified);
    email = primary?.email || email;
  }
  
  return {
    provider: 'github',
    providerId: String(profile.id),
    email,
    name: profile.name || profile.login,
    avatarUrl: profile.avatar_url
  };
}

// ==========================================
// DATABASE HELPERS
// ==========================================

async function findOrCreateUser(db, userData) {
  // Check if user exists
  const existing = await db.prepare(
    'SELECT * FROM users WHERE provider = ? AND provider_id = ?'
  ).bind(userData.provider, userData.providerId).first();
  
  if (existing) {
    // Update user info
    await db.prepare(
      'UPDATE users SET email = ?, name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(userData.email, userData.name, userData.avatarUrl, existing.id).run();
    
    return existing;
  }
  
  // Create new user
  const userId = generateId();
  
  await db.batch([
    db.prepare(
      'INSERT INTO users (id, email, name, avatar_url, provider, provider_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, userData.email, userData.name, userData.avatarUrl, userData.provider, userData.providerId),
    
    db.prepare(
      'INSERT INTO profiles (id, plan, subscription_status) VALUES (?, ?, ?)'
    ).bind(userId, 'free', 'inactive')
  ]);
  
  return { id: userId, email: userData.email, name: userData.name };
}

async function getProfile(db, userId) {
  return await db.prepare(
    'SELECT plan, subscription_status, subscription_id, current_period_end FROM profiles WHERE id = ?'
  ).bind(userId).first();
}

async function updateProfile(db, userId, updates) {
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  
  return await db.prepare(
    `UPDATE profiles SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  ).bind(...values, userId).run();
}

// ==========================================
// CORS & REQUEST HANDLING
// ==========================================

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.FRONTEND_URL || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(globalThis.env),
      ...extraHeaders
    }
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    
    // Check if token is blacklisted
    const tokenHash = await sha256(token);
    const session = await env.DB.prepare(
      'SELECT * FROM sessions WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP'
    ).bind(tokenHash).first();
    
    if (session) {
      return null; // Token revoked
    }
    
    return payload;
  } catch {
    return null;
  }
}

// ==========================================
// ROUTE HANDLERS
// ==========================================

async function handleAuthCallback(request, env) {
  const { provider, code } = await request.json();
  
  if (!provider || !code) {
    return errorResponse('Provider and authorization code required', 400);
  }
  
  try {
    // Get user profile from OAuth provider
    let userData;
    if (provider === 'google') {
      userData = await handleGoogleOAuth(env, code);
    } else if (provider === 'github') {
      userData = await handleGitHubOAuth(env, code);
    } else {
      return errorResponse('Unsupported provider', 400);
    }
    
    // Find or create user in database
    const user = await findOrCreateUser(env.DB, userData);
    
    // Get profile
    const profile = await getProfile(env.DB, user.id);
    
    // Generate JWT token
    const token = await signJWT(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      '7d'
    );
    
    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: userData.provider
      },
      profile: {
        plan: profile?.plan || 'free',
        status: profile?.subscription_status || 'inactive'
      },
      token
    });
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return errorResponse('Authentication failed', 500);
  }
}

async function handleGetProfile(request, env, user) {
  const profile = await getProfile(env.DB, user.userId);
  
  if (!profile) {
    return errorResponse('Profile not found', 404);
  }
  
  return jsonResponse({
    plan: profile.plan || 'free',
    status: profile.subscription_status || 'inactive',
    subscriptionId: profile.subscription_id,
    currentPeriodEnd: profile.current_period_end
  });
}

async function handleUpdateProfile(request, env, user) {
  const updates = await request.json();
  
  try {
    await updateProfile(env.DB, user.userId, updates);
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse('Failed to update profile', 500);
  }
}

async function handleSaveResume(request, env, user) {
  const { encryptedData } = await request.json();
  
  if (!encryptedData) {
    return errorResponse('Encrypted resume data required', 400);
  }
  
  try {
    const resumeId = generateId();
    
    await env.DB.prepare(
      'INSERT INTO resumes (id, user_id, encrypted_resume) VALUES (?, ?, ?)'
    ).bind(resumeId, user.userId, encryptedData).run();
    
    return jsonResponse({ success: true, resumeId });
  } catch (error) {
    console.error('Save resume error:', error);
    return errorResponse('Failed to save resume', 500);
  }
}

async function handleGetResume(request, env, user) {
  const url = new URL(request.url);
  const resumeId = url.searchParams.get('id');
  
  try {
    let resume;
    
    if (resumeId) {
      resume = await env.DB.prepare(
        'SELECT * FROM resumes WHERE id = ? AND user_id = ?'
      ).bind(resumeId, user.userId).first();
    } else {
      resume = await env.DB.prepare(
        'SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1'
      ).bind(user.userId).first();
    }
    
    if (!resume) {
      return errorResponse('Resume not found', 404);
    }
    
    return jsonResponse({ encryptedData: resume.encrypted_resume });
  } catch (error) {
    console.error('Get resume error:', error);
    return errorResponse('Failed to retrieve resume', 500);
  }
}

async function handleCreateOrder(request, env, user) {
  const { amount, currency, planName } = await request.json();
  
  if (!amount) {
    return errorResponse('Amount required', 400);
  }
  
  try {
    // Create Razorpay order
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}_${user.userId.substring(0, 8)}`,
        notes: {
          planName,
          userId: user.userId
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Razorpay order creation failed');
    }
    
    const order = await response.json();
    
    // Store payment record
    const paymentId = generateId();
    await env.DB.prepare(
      'INSERT INTO payments (id, user_id, razorpay_order_id, amount, currency, plan, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(paymentId, user.userId, order.id, amount, currency || 'INR', planName, 'pending').run();
    
    return jsonResponse(order);
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse('Failed to create payment order', 500);
  }
}

async function handleVerifyPayment(request, env, user) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, amount } = await request.json();
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return errorResponse('Missing payment verification details', 400);
  }
  
  try {
    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.RAZORPAY_KEY_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(text));
    const generatedSignature = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');
    
    if (generatedSignature !== razorpay_signature) {
      return errorResponse('Invalid payment signature', 400);
    }
    
    // Update payment status
    await env.DB.prepare(
      'UPDATE payments SET razorpay_payment_id = ?, razorpay_signature = ?, status = ? WHERE razorpay_order_id = ?'
    ).bind(razorpay_payment_id, razorpay_signature, 'success', razorpay_order_id).run();
    
    // Update user profile
    await updateProfile(env.DB, user.userId, {
      plan: planName.toLowerCase(),
      subscription_status: 'active',
      subscription_id: razorpay_order_id
    });
    
    return jsonResponse({ status: 'success', message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verify payment error:', error);
    return errorResponse('Payment verification failed', 500);
  }
}

// ==========================================
// MAIN REQUEST HANDLER
// ==========================================

export default {
  async fetch(request, env, ctx) {
    // Store env globally for CORS
    globalThis.env = env;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) });
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
      // Public routes
      if (path === '/api/auth/callback' && request.method === 'POST') {
        return await handleAuthCallback(request, env);
      }
      
      // Health check
      if (path === '/health' || path === '/api/health') {
        return jsonResponse({ status: 'healthy', timestamp: new Date().toISOString() });
      }
      
      // Protected routes (require authentication)
      const user = await authenticate(request, env);
      
      if (!user && path.startsWith('/api/')) {
        return errorResponse('Authentication required', 401);
      }
      
      // Profile routes
      if (path === '/api/profile' && request.method === 'GET') {
        return await handleGetProfile(request, env, user);
      }
      
      if (path === '/api/profile' && request.method === 'PUT') {
        return await handleUpdateProfile(request, env, user);
      }
      
      // Resume routes
      if (path === '/api/resume' && request.method === 'POST') {
        return await handleSaveResume(request, env, user);
      }
      
      if (path === '/api/resume' && request.method === 'GET') {
        return await handleGetResume(request, env, user);
      }
      
      // Payment routes
      if (path === '/api/create-order' && request.method === 'POST') {
        return await handleCreateOrder(request, env, user);
      }
      
      if (path === '/api/verify-payment' && request.method === 'POST') {
        return await handleVerifyPayment(request, env, user);
      }
      
      // Not found
      return errorResponse('Route not found', 404);
      
    } catch (error) {
      console.error('Unhandled error:', error);
      return errorResponse('Internal server error', 500);
    }
  }
};
