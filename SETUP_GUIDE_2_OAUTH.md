# 🔐 OAuth Provider Setup Guide

## Overview

Configure Google and GitHub OAuth for one-click authentication.

**Time Required:** 15-20 minutes  
**Difficulty:** Medium  
**Status:** ⏳ Pending

---

## Part 1: Google OAuth Setup

### **Step 1: Create Google Cloud Project**

1. Go to: **https://console.cloud.google.com**
2. Click **"Select a project"** → **"New Project"**
3. Project name: `KAYAKA-AI`
4. Click **"Create"**

### **Step 2: Enable Google+ API**

1. In Google Cloud Console, go to: **APIs & Services** → **Library**
2. Search for: **"Google+ API"**
3. Click on it → **"Enable"**

### **Step 3: Create OAuth Credentials**

1. Go to: **APIs & Services** → **Credentials**
2. Click: **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure **OAuth consent screen**:
   - User Type: **External**
   - App name: **KAYAKA-AI**
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**
   - Scopes: Skip (default is fine)
   - Test users: Add your email
   - Click **"Save and Continue"**

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `KAYAKA-AI Web Client`
   
5. **Add Authorized redirect URIs:**
   ```
   https://tbzmijcinafbmzjcgcpb.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```

6. Click **"Create"**

7. **Copy credentials:**
   - Client ID: `xxxxxxxx-xxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxxxxxxxxxx`

### **Step 4: Configure in Supabase**

1. Go to: **https://app.supabase.com**
2. Select project: `tbzmijcinafbmzjcgcpb`
3. Go to: **Authentication** → **Providers**
4. Find **Google** → Toggle **Enable**
5. Paste credentials:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
6. **Redirect URL** (auto-filled):
   ```
   https://tbzmijcinafbmzjcgcpb.supabase.co/auth/v1/callback
   ```
7. Click **"Save"**

---

## Part 2: GitHub OAuth Setup

### **Step 1: Create GitHub OAuth App**

1. Go to: **https://github.com/settings/developers**
2. Click: **"New OAuth App"** (or **"Register a new application"**)
3. Fill in details:
   - **Application name:** `KAYAKA-AI`
   - **Homepage URL:** `http://localhost:3000` (or your production URL)
   - **Authorization callback URL:**
     ```
     https://tbzmijcinafbmzjcgcpb.supabase.co/auth/v1/callback
     ```
   - **Application description:** AI-powered resume optimization
   - **Website:** (optional) your website URL

4. Click **"Register application"**

### **Step 2: Get Client Credentials**

1. After registration, you'll see:
   - **Client ID:** `Iv1.xxxxxxxxxxxx`
   - Click **"Generate a new client secret"**
   - **Client Secret:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **⚠️ Important:** Copy the client secret immediately - you can't see it again!

### **Step 3: Configure in Supabase**

1. Go to: **https://app.supabase.com**
2. Select project: `tbzmijcinafbmzjcgcpb`
3. Go to: **Authentication** → **Providers**
4. Find **GitHub** → Toggle **Enable**
5. Paste credentials:
   - **Client ID:** (from GitHub)
   - **Client Secret:** (from GitHub)
6. Click **"Save"**

---

## Part 3: Test OAuth Login

### **Test Google Login**

1. Go to: `http://localhost:3000/login`
2. Click **"Continue with Google"**
3. Select your Google account
4. Should redirect to: `/dashboard`
5. Check browser console for any errors

### **Test GitHub Login**

1. Go to: `http://localhost:3000/login`
2. Click **"Continue with GitHub"**
3. Authorize application
4. Should redirect to: `/dashboard`
5. Check browser console for any errors

---

## 🐛 Troubleshooting

### **Error: "redirect_uri_mismatch"**

**Cause:** Redirect URL doesn't match exactly  
**Solution:**
1. Check Supabase → Authentication → Providers
2. Verify redirect URL matches exactly:
   ```
   https://tbzmijcinafbmzjcgcpb.supabase.co/auth/v1/callback
   ```
3. Check Google/GitHub OAuth app settings
4. Ensure all redirect URIs are added

### **Error: "Invalid client secret"**

**Solution:**
1. Double-check you copied the entire secret
2. For GitHub, generate a new secret if needed
3. For Google, ensure you're using Client Secret, not API Key

### **Error: "Access blocked" (Google)**

**Cause:** App not verified  
**Solution:**
1. In Google Cloud Console → OAuth consent screen
2. Add your email to **Test users**
3. Or submit for verification (for production)

### **OAuth works in development but not production**

**Solution:**
1. Add production URL to OAuth app settings:
   - Google: Add to **Authorized redirect URIs**
   - GitHub: Add to **Authorization callback URL**
2. Update in Supabase provider settings

---

## ✅ Verification Checklist

### **Google OAuth**
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Redirect URIs added (3 URLs)
- [ ] Configured in Supabase
- [ ] Test login successful

### **GitHub OAuth**
- [ ] GitHub OAuth app created
- [ ] Client ID copied
- [ ] Client Secret generated and copied
- [ ] Callback URL added
- [ ] Configured in Supabase
- [ ] Test login successful

### **Supabase Configuration**
- [ ] Google provider enabled
- [ ] GitHub provider enabled
- [ ] Both providers saved without errors
- [ ] Redirect URL matches

---

## 🔒 Security Best Practices

1. **Never commit client secrets to git**
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Use different apps for dev/prod**
   - Create separate OAuth apps for production
   - Keep credentials separate

3. **Rotate secrets periodically**
   - Generate new secrets every 6-12 months
   - Update in Supabase immediately

4. **Restrict redirect URIs**
   - Only add URLs you control
   - Remove old/unused URLs

5. **Monitor OAuth usage**
   - Check Google Cloud Console logs
   - Check GitHub OAuth app analytics

---

## 📊 Expected Results

After successful setup:

```
✅ Login page shows:
   - "Continue with Google" button
   - "Continue with GitHub" button

✅ Clicking buttons:
   - Opens OAuth popup
   - User authorizes
   - Redirects to dashboard
   - User session created

✅ Supabase Dashboard:
   - Authentication → Users
   - Shows new users from OAuth
```

---

## 🎯 Next Steps

After OAuth setup:

1. ✅ Test both providers
2. ✅ Verify user creation in Supabase
3. ✅ Test redirect flow
4. ✅ Add production URLs when ready
5. ✅ Update privacy policy with OAuth info

---

**Last Updated:** March 27, 2026  
**Status:** ⏳ Pending Setup  
**Time Required:** 15-20 minutes
