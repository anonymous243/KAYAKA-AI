# Cloudflare D1 + Workers Deployment Guide

## Architecture Overview

```
Frontend (Vercel)
    ↓
Cloudflare Workers (API + Auth + Database)
    ↓
Cloudflare D1 (SQLite Database)
```

## Setup Steps

### 1. Create D1 Database

```bash
# Create the database
wrangler d1 create kayaka-ai-db

# Note the database_id from the output
# Update wrangler.toml with the actual database_id
```

### 2. Apply Database Schema

```bash
# Apply the schema to your D1 database
wrangler d1 execute kayaka-ai-db --file=cloudflare-worker/schema.sql

# For production
wrangler d1 execute kayaka-ai-db --file=cloudflare-worker/schema.sql --env production
```

### 3. Set Environment Secrets

```bash
# Generate secure keys
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For ENCRYPTION_KEY

# Set secrets
wrangler secret put JWT_SECRET
wrangler secret put ENCRYPTION_KEY
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put RAZORPAY_KEY_ID
wrangler secret put RAZORPAY_KEY_SECRET
wrangler secret put GEMINI_API_KEY
wrangler secret put FRONTEND_URL
```

### 4. Deploy Worker

```bash
# Deploy to staging
wrangler deploy

# Deploy to production
wrangler deploy --env production
```

### 5. Update Frontend .env

Add to your Vercel environment variables:

```env
VITE_CLOUDFLARE_WORKER_URL=https://kayaka-ai-api.your-subdomain.workers.dev
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXX
```

### 6. Configure OAuth Providers

#### Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Set Authorized redirect URIs:
   - `https://your-vercel-app.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)

#### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Authorization callback URL:
   - `https://your-vercel-app.vercel.app/auth/github/callback`
   - `http://localhost:5173/auth/github/callback` (for development)

## Security Features

### End-to-End Encryption
- All sensitive data encrypted client-side before transmission
- Uses AES-256-GCM via Web Crypto API
- Encryption key stored securely in localStorage
- Server never sees plaintext sensitive data

### JWT Authentication
- Stateless JWT tokens with 7-day expiry
- HMAC-SHA256 signature
- Token revocation support via session blacklist
- Secure HTTP-only cookies option available

### Payment Security
- Razorpay handles payment processing
- Server verifies payment signatures
- Payment records encrypted in database
- Audit trail for all transactions

## Database Schema

- `users` - User accounts from OAuth
- `profiles` - Subscription and plan data
- `resumes` - Encrypted resume storage
- `payments` - Payment audit trail
- `sessions` - JWT token blacklist

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/callback` | No | OAuth callback handler |
| GET | `/api/profile` | Yes | Get user profile |
| PUT | `/api/profile` | Yes | Update profile |
| POST | `/api/resume` | Yes | Save encrypted resume |
| GET | `/api/resume` | Yes | Get resume data |
| POST | `/api/create-order` | Yes | Create Razorpay order |
| POST | `/api/verify-payment` | Yes | Verify payment |
| GET | `/health` | No | Health check |

## Monitoring

```bash
# View logs
wrangler tail

# Check database
wrangler d1 execute kayaka-ai-db --command="SELECT * FROM users LIMIT 5;"
```

## Troubleshooting

### CORS Issues
- Ensure FRONTEND_URL secret is set correctly
- Check Vercel URL matches allowed origin

### Auth Failures
- Verify OAuth client IDs and secrets
- Check redirect URIs match exactly
- Review worker logs with `wrangler tail`

### Database Errors
- Ensure schema is applied
- Check database_id in wrangler.toml
- Verify D1 binding in worker

## Migration from Supabase

1. Deploy Cloudflare Worker and D1
2. Update frontend .env variables
3. Users will automatically create accounts on next login
4. Existing data can be migrated via SQL scripts
5. Test all features before removing Supabase

## Cost Comparison

| Service | Supabase | Cloudflare |
|---------|----------|------------|
| Database | Free: 500MB | Free: 10GB |
| Auth | Free: 50k MAU | Free (custom) |
| API | N/A | Free: 100k req/day |
| Bandwidth | Free: 5GB | Free: 100k req/day |
| **Total Free Tier** | **Good** | **Excellent** |
