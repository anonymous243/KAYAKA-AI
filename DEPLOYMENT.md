# KAYAKA-AI Deployment Guide

## Production Checklist

### ✅ Pre-Deployment Checks

- [ ] All lint errors fixed (`npm run lint` passes)
- [ ] All tests passing (`npm run test:run` passes)
- [ ] Build successful (`npm run build` completes without errors)
- [ ] `.env` file configured with production values
- [ ] Supabase database schema applied
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] OAuth providers configured in Supabase Dashboard
- [ ] Razorpay account configured (if using payments)

### 🚀 Deployment Options

#### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`

4. **Custom Domain (Optional):**
   - Add your domain in Vercel Dashboard
   - Update DNS records as instructed

#### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables:**
   - Go to Netlify Dashboard > Site Settings > Environment Variables
   - Add production environment variables

#### Option 3: Manual Deployment (Any Static Host)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to your hosting provider:**
   - AWS S3 + CloudFront
   - DigitalOcean App Platform
   - Firebase Hosting
   - GitHub Pages

### 🔧 Backend Deployment (Optional)

The backend server (`server/index.js`) is optional and provides:
- Job scraping via Puppeteer
- AI resume parsing via Gemini API
- Smart Apply pack generation
- Razorpay payment integration

#### Deploy Backend to Heroku:

1. **Install Heroku CLI**

2. **Login and Create App:**
   ```bash
   heroku login
   heroku create kayaka-ai-backend
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set GEMINI_API_KEY=your-gemini-key
   heroku config:set RAZORPAY_KEY_ID=your-razorpay-key
   heroku config:set RAZORPAY_KEY_SECRET=your-razorpay-secret
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Update Frontend:**
   - Set `VITE_API_URL` to your Heroku app URL

### 🔐 Security Checklist

- [ ] **NEVER** commit `.env` files to git
- [ ] Use production Supabase keys (not development)
- [ ] Enable Supabase Row Level Security (RLS) on all tables
- [ ] Use HTTPS only in production
- [ ] Configure CORS properly for backend API
- [ ] Set up rate limiting on backend endpoints
- [ ] Enable Supabase email confirmation for user signup
- [ ] Configure OAuth redirect URLs in Supabase Dashboard
- [ ] Use strong passwords for all service accounts

### 📊 Post-Deployment

1. **Test All Flows:**
   - User signup/login
   - Resume upload anmd parsing
   - Profile editing
   - JD analysis
   - Resume generation
   - Download functionality
   - Job targeting (if backend deployed)
   - Smart Apply pack (if backend deployed)

2. **Monitor Errors:**
   - Check browser console for errors
   - Monitor Supabase logs
   - Check backend server logs (if deployed)

3. **Performance:**
   - Test page load times
   - Check Lighthouse scores
   - Monitor Supabase query performance

### 🔄 Continuous Deployment

#### GitHub Actions (Example):

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run lint
        run: npm run lint
      
      - name: Run tests
        run: npm run test:run
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 🐛 Troubleshooting

**Build Fails:**
- Check Node.js version (use v18+)
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors if using TypeScript

**Supabase Connection Fails:**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check browser console for CORS errors
- Ensure Supabase project is active

**Authentication Issues:**
- Clear browser cache and cookies
- Check OAuth redirect URLs in Supabase Dashboard
- Verify email confirmation is enabled

**Backend API Errors:**
- Ensure backend server is running and accessible
- Check `VITE_API_URL` is set correctly
- Verify backend environment variables

### 📝 Notes

- The frontend is a static SPA and can be hosted anywhere
- Supabase handles all database and authentication needs
- Backend server is optional and only needed for AI features
- All sensitive data should be stored in environment variables
- Use CDN for better performance in production

---

**Last Updated:** April 4, 2026
**Version:** 0.1.0
