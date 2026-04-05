# 🚀 QUICK DEPLOYMENT GUIDE

## Deploy Frontend to Vercel & Backend to Render (Both FREE)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Already Done:
- [x] All lint errors fixed (0 errors)
- [x] All tests passing (89 passed)
- [x] Build successful
- [x] Deployment configs created (vercel.json, render.yaml)
- [x] Security configurations in place

### 🔧 You Need to Do:
1. Commit and push code to GitHub
2. Deploy frontend to Vercel
3. Deploy backend to Render
4. Connect them together

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### STEP 1: Push to GitHub

```bash
# In your project directory
git add .
git commit -m "feat: production-ready deployment"
git push origin main
```

**If you don't have a GitHub repo yet:**
```bash
# Create a new repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/kayaka-ai.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy Frontend to Vercel (FREE)

#### Option A: Via Vercel Website (Easiest)

1. **Go to** https://vercel.com/signup
   - Sign up with your GitHub account
   - Choose the **Hobby** plan (FREE forever)

2. **Import Your Repository**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your `kayaka-ai` repo
   - Click "Import"

3. **Configure Build Settings**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   ⚠️ **Note:** Set `VITE_API_URL` after deploying backend (Step 3)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - You'll get a URL like: `https://kayaka-ai.vercel.app`

6. **Custom Domain (Optional)**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS as instructed

#### Option B: Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

### STEP 3: Deploy Backend to Render (FREE)

#### Why Render?
- ✅ Free tier: 750 hours/month (always free for one service)
- ✅ No sleep on free tier
- ✅ Easy GitHub integration
- ✅ Automatic HTTPS

#### Deployment Steps:

1. **Go to** https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `kayaka-ai` repo

3. **Configure Service**
   ```
   Name: kayaka-ai-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: (leave blank)
   Runtime: Node
   Build Command: npm install
   Start Command: node server/index.js
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Environment" and add:
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your-gemini-api-key-here
   RAZORPAY_KEY_ID=rzp_test_your-key-id
   RAZORPAY_KEY_SECRET=your-secret-key
   PORT=10000
   ```

   **Where to get these keys:**
   - **GEMINI_API_KEY:** https://aistudio.google.com/app/apikey (FREE)
   - **RAZORPAY_KEY_ID & SECRET:** https://dashboard.razorpay.com/ (FREE test account)

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - You'll get a URL like: `https://kayaka-ai-backend.onrender.com`

6. **Test Backend**
   Visit: `https://kayaka-ai-backend.onrender.com/api/scrape` (POST)
   
---

### STEP 4: Connect Frontend to Backend

1. **Update Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add or update:
   ```
   VITE_API_URL=https://kayaka-ai-backend.onrender.com/api
   ```
   - Click "Save"

2. **Redeploy Frontend**
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - This applies the new environment variable

---

### STEP 5: Test Everything

#### ✅ Frontend Tests:
1. Visit your Vercel URL
2. Test signup/login
3. Upload a resume
4. Try JD analyzer
5. Generate a resume
6. Download PDF

#### ✅ Backend Tests:
```bash
# Test backend is running
curl -X POST https://kayaka-ai-backend.onrender.com/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.linkedin.com/jobs/view/123456"}'
```

---

## 🔐 SECURITY CHECKLIST

### Environment Variables

**Frontend (Vercel):**
- ✅ `VITE_SUPABASE_URL` - Safe to expose (public URL)
- ✅ `VITE_SUPABASE_ANON_KEY` - Safe (RLS protects data)
- ✅ `VITE_API_URL` - Safe (just a URL)
- ❌ **NEVER** add `VITE_SUPABASE_SERVICE_ROLE_KEY`

**Backend (Render):**
- ✅ `GEMINI_API_KEY` - Secret, never expose to frontend
- ✅ `RAZORPAY_KEY_ID` - Safe (public key)
- ✅ `RAZORPAY_KEY_SECRET` - Secret, keep in backend only
- ✅ `NODE_ENV=production` - Safe

### Supabase Setup

1. **Enable Row Level Security (RLS)**
   - Go to Supabase Dashboard → Authentication → Policies
   - All tables should have RLS enabled (already in schema)

2. **Configure OAuth Providers**
   - Supabase Dashboard → Authentication → Providers
   - Enable Google and/or GitHub
   - Add redirect URLs from Vercel

3. **Run Database Schema**
   - Supabase Dashboard → SQL Editor
   - Paste contents of `supabase-schema.sql`
   - Click "Run"

---

## 🎊 DEPLOYMENT COMPLETE!

### Your URLs:
- **Frontend:** `https://kayaka-ai.vercel.app`
- **Backend:** `https://kayaka-ai-backend.onrender.com`
- **Database:** `https://app.supabase.com`

### Next Steps:
1. ✅ Add custom domain (optional)
2. ✅ Set up monitoring (Vercel Analytics)
3. ✅ Configure error tracking (Sentry)
4. ✅ Set up CI/CD with GitHub Actions
5. ✅ Add rate limiting to backend

---

## 🐛 TROUBLESHOOTING

### Frontend Not Loading
- Check Vercel build logs for errors
- Verify environment variables are set
- Check browser console for Supabase errors

### Backend Not Responding
- Check Render logs for errors
- Verify `GEMINI_API_KEY` is set
- Ensure `PORT=10000` is configured
- Test with curl (see above)

### Supabase Connection Fails
- Verify `VITE_SUPABASE_URL` is correct
- Check browser console for CORS errors
- Ensure database schema is applied

### Authentication Issues
- Clear browser cache
- Check OAuth redirect URLs in Supabase
- Verify email confirmation is enabled

---

## 💰 COST BREAKDOWN

| Service | Plan | Cost |
|---------|------|------|
| **Vercel** | Hobby | FREE |
| **Render** | Free Tier | FREE (750 hrs/mo) |
| **Supabase** | Free Tier | FREE (500MB DB) |
| **Gemini API** | Free Tier | FREE (60 req/min) |
| **Razorpay** | Test Mode | FREE |
| **Total** | | **$0/month** 🎉 |

---

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in Vercel/Render dashboards
3. Check browser console for frontend errors
4. Check service logs in Render dashboard

---

**Last Updated:** April 4, 2026
**Version:** 0.1.0
**Status:** Production Ready ✅
