#!/bin/bash
# Cloudflare Worker Deployment Script

set -e

echo "🚀 Deploying Kayaka-AI to Cloudflare Workers..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Install with: npm install -g wrangler"
    exit 1
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please login to Cloudflare..."
    wrangler login
fi

# Create D1 database if it doesn't exist
echo "📦 Checking D1 database..."
DB_ID=$(wrangler d1 info kayaka-ai-db --json 2>/dev/null | grep -o '"id":"[^"]*"' | cut -d'"' -f4 || echo "")

if [ -z "$DB_ID" ]; then
    echo "🗄️  Creating D1 database..."
    wrangler d1 create kayaka-ai-db
    echo "⚠️  Update wrangler.toml with the new database_id"
    exit 1
fi

# Apply schema
echo "📋 Applying database schema..."
wrangler d1 execute kayaka-ai-db --file=schema.sql --remote

# Check required secrets
echo "🔒 Checking secrets..."
REQUIRED_SECRETS=("JWT_SECRET" "ENCRYPTION_KEY" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "GITHUB_CLIENT_ID" "GITHUB_CLIENT_SECRET" "RAZORPAY_KEY_ID" "RAZORPAY_KEY_SECRET" "FRONTEND_URL")

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! wrangler secret list | grep -q "$secret"; then
        echo "⚠️  Missing secret: $secret"
        echo "   Set with: wrangler secret put $secret"
    fi
done

# Deploy worker
echo "🚀 Deploying worker..."
wrangler deploy

echo "✅ Deployment complete!"
echo "📝 Next steps:"
echo "   1. Update VITE_CLOUDFLARE_WORKER_URL in Vercel"
echo "   2. Configure OAuth redirect URIs"
echo "   3. Test authentication flow"
