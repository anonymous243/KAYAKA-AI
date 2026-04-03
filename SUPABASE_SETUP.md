# 🔐 KAYAKA-AI Supabase Setup Guide

## Security Features Implemented

✅ **Row Level Security (RLS)** - Users can ONLY access their own data
✅ **Supabase Auth** - Secure OAuth with Google, GitHub, email/password
✅ **Anon Key Safe** - Frontend uses anon key (safe to expose)
✅ **Service Role Key Protected** - Never expose this key!
✅ **Database Policies** - All tables have strict access controls
✅ **Secure Password Storage** - Bcrypt hashing via Supabase Auth
✅ **JWT Tokens** - Secure session management
✅ **Email Confirmation** - Prevents fake accounts (optional)

---

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"** (free)
3. Sign up with GitHub/Google/email

---

## Step 2: Create New Project

1. Click **"+ New Project"**
2. Fill in:
   - **Name:** `kayaka-ai`
   - **Database Password:** (SAVE THIS! You'll need it later)
   - **Region:** Choose closest to you
3. Click **"Create new project"** (takes 2-3 minutes)

---

## Step 3: Get Your Keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbG...` (starts with `eyJ`)

3. Update your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## Step 4: Set Up Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"+ New Query"**
3. Copy entire contents of `supabase-schema.sql`
4. Paste and click **"Run"**

This creates:
- ✅ `profiles` table with RLS
- ✅ `resumes` table with RLS
- ✅ `job_applications` table with RLS
- ✅ `smart_apply_packs` table with RLS
- ✅ Auto-created profile on signup
- ✅ Auto-updated timestamps

---

## Step 5: Enable OAuth Providers

### Google OAuth:

1. In Supabase Dashboard: **Authentication** → **Providers** → **Google**
2. Toggle **"Enable"**
3. Get credentials from Google Cloud Console:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - **Authorized redirect URI:** 
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** and **Client Secret** to Supabase
4. Click **"Save"**

### GitHub OAuth:

1. In Supabase Dashboard: **Authentication** → **Providers** → **GitHub**
2. Toggle **"Enable"**
3. Get credentials from GitHub:
   - Go to https://github.com/settings/developers
   - Create new OAuth App
   - **Authorization callback URL:**
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
   - Copy **Client ID** and **Client Secret** to Supabase
4. Click **"Save"**

---

## Step 6: Set Up Storage (for Resume Files)

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Create bucket:
   - **Name:** `resumes`
   - **Public:** ❌ Uncheck (private)
   - **File size limit:** `5242880` (5MB)
4. Click **"Create bucket"**

### Add Storage Policies:

1. Click on `resumes` bucket → **Policies** → **New Policy**
2. Create policy for INSERT:
   ```sql
   CREATE POLICY "Users can upload own files"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'resumes' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

3. Create policy for SELECT:
   ```sql
   CREATE POLICY "Users can view own files"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'resumes' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

4. Create policy for DELETE:
   ```sql
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'resumes' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

---

## Step 7: Test Authentication

1. Run your app: `npm run dev`
2. Go to http://localhost:3000/signup
3. Try signing up with:
   - ✅ Email/password
   - ✅ Google
   - ✅ GitHub

4. Check Supabase Dashboard → **Authentication** → **Users**
   - You should see your new user!

---

## Step 8: Test Database Security

Try these in Supabase SQL Editor:

```sql
-- This will work (your own data)
SELECT * FROM profiles WHERE id = auth.uid();

-- This will return EMPTY (can't see other users)
SELECT * FROM profiles;
```

---

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ Service role key NEVER committed to git
- ✅ RLS enabled on all tables
- ✅ Storage bucket is private
- ✅ OAuth redirect URIs are exact matches
- ✅ Email confirmation enabled (optional but recommended)

---

## Troubleshooting

### "Invalid API key"
- Make sure you're using the **anon/public** key, NOT the service role key

### "OAuth provider not found"
- Check that you enabled the provider in Supabase Dashboard
- Verify redirect URIs match EXACTLY

### "Row Level Security policy violation"
- This is GOOD! It means security is working
- Users can only access their own data

### "User not found"
- Check **Authentication** → **Users** in Supabase
- User might need to confirm email first

---

## Next Steps

1. ✅ Test all auth flows
2. ✅ Update resume upload to use Supabase Storage
3. ✅ Connect dashboard to fetch data from Supabase
4. ✅ Add real-time updates for job applications

---

## Important Security Notes

⚠️ **NEVER commit these to git:**
- Service role key
- Database password
- OAuth client secrets

✅ **Safe to commit:**
- Anon/public key
- Project URL
- Frontend code (RLS protects data)

🔒 **Row Level Security is your friend:**
- Even if someone gets your anon key, they can't access other users' data
- All policies use `auth.uid()` to ensure isolation

---

**Questions?** Check Supabase docs: https://supabase.com/docs
