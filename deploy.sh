#!/bin/bash

# ============================================
# KAYAKA-AI Complete Deployment Script
# Frontend: Vercel (Free)
# Backend: Render (Free)
# ============================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════╗"
echo "║   KAYAKA-AI Deployment Script             ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# STEP 1: Check Prerequisites
# ============================================
echo -e "${BLUE}📋 Step 1: Checking prerequisites...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) installed${NC}"
echo -e "${GREEN}✅ npm $(npm -v) installed${NC}"
echo -e "${GREEN}✅ Git $(git --version | awk '{print $3}') installed${NC}"
echo ""

# ============================================
# STEP 2: Install Dependencies
# ============================================
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ============================================
# STEP 3: Run Tests
# ============================================
echo -e "${BLUE}🧪 Step 3: Running tests...${NC}"
npm run test:run
echo -e "${GREEN}✅ All tests passed${NC}"
echo ""

# ============================================
# STEP 4: Build Frontend
# ============================================
echo -e "${BLUE}🔨 Step 4: Building frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# ============================================
# STEP 5: Check Environment Variables
# ============================================
echo -e "${BLUE}🔐 Step 5: Checking environment variables...${NC}"

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo -e "${YELLOW}📝 Please create .env file with:${NC}"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
    echo "   - VITE_API_URL (will be set after backend deployment)"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit..."
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi
echo ""

# ============================================
# STEP 6: Deploy Backend to Render
# ============================================
echo -e "${BLUE}🚀 Step 6: Deploying Backend to Render...${NC}"
echo ""
echo -e "${YELLOW}📋 Instructions:${NC}"
echo "1. Go to https://render.com and sign up (free)"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: kayaka-ai-backend"
echo "   - Region: Oregon (or closest to you)"
echo "   - Branch: main"
echo "   - Root Directory: (leave blank)"
echo "   - Runtime: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: node server/index.js"
echo "   - Instance Type: Free"
echo ""
echo "5. Add Environment Variables:"
echo "   - NODE_ENV=production"
echo "   - GEMINI_API_KEY=your-gemini-api-key"
echo "   - RAZORPAY_KEY_ID=your-razorpay-key-id"
echo "   - RAZORPAY_KEY_SECRET=your-razorpay-key-secret"
echo "   - PORT=10000"
echo ""
echo "6. Click 'Create Web Service'"
echo ""
echo -e "${YELLOW}⏳ Wait for deployment to complete...${NC}"
echo ""
read -p "Enter your Render backend URL (e.g., https://kayaka-ai-backend.onrender.com): " BACKEND_URL

if [ -n "$BACKEND_URL" ]; then
    echo -e "${GREEN}✅ Backend URL saved: $BACKEND_URL${NC}"
    
    # Update .env with backend URL
    if [ -f .env ]; then
        # Remove existing VITE_API_URL if present
        sed -i '/VITE_API_URL/d' .env
        echo "VITE_API_URL=$BACKEND_URL/api" >> .env
        echo -e "${GREEN}✅ Updated .env with VITE_API_URL${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No backend URL provided. You can set it later in .env${NC}"
fi
echo ""

# ============================================
# STEP 7: Deploy Frontend to Vercel
# ============================================
echo -e "${BLUE}🎨 Step 7: Deploying Frontend to Vercel...${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
fi

echo -e "${YELLOW}🔑 Logging into Vercel...${NC}"
vercel login

echo ""
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"

# Deploy to Vercel
if [ -f .env ]; then
    # Deploy with environment variables
    vercel --prod \
        --env VITE_SUPABASE_URL="$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)" \
        --env VITE_SUPABASE_ANON_KEY="$(grep VITE_SUPABASE_ANON_KEY .env | cut -d '=' -f2)" \
        --env VITE_API_URL="$BACKEND_URL/api"
else
    # Deploy without .env
    vercel --prod
fi

echo ""
echo -e "${GREEN}✅ Frontend deployed to Vercel!${NC}"
echo ""

# ============================================
# STEP 8: Post-Deployment
# ============================================
echo -e "${BLUE}🎉 Step 8: Post-Deployment Checklist${NC}"
echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Test your deployed frontend URL"
echo "2. Verify Supabase connection"
echo "3. Test user signup/login"
echo "4. Test resume upload and parsing"
echo "5. Verify backend API is accessible"
echo ""
echo "📝 Important URLs:"
echo "   - Frontend: (check Vercel dashboard)"
echo "   - Backend: $BACKEND_URL"
echo ""
echo "🔐 Environment Variables to Set in Vercel:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - VITE_API_URL=$BACKEND_URL/api"
echo ""
echo "🔐 Environment Variables Set in Render:"
echo "   - NODE_ENV=production"
echo "   - GEMINI_API_KEY"
echo "   - RAZORPAY_KEY_ID"
echo "   - RAZORPAY_KEY_SECRET"
echo "   - PORT=10000"
echo ""
echo -e "${GREEN}🎊 Deployment Complete! 🎊${NC}"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   KAYAKA-AI is now LIVE! 🚀               ║"
echo "╚════════════════════════════════════════════╝"
