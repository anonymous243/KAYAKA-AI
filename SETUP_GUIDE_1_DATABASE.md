# 🗄️ Database Schema Execution Guide

## Quick Setup (5 Minutes)

### **Step 1: Open Supabase Dashboard**

1. Go to: **https://app.supabase.com**
2. Sign in with your account
3. Select project: **`tbzmijcinafbmzjcgcpb`**

---

### **Step 2: Execute Schema SQL**

1. **Navigate to SQL Editor:**
   - Left sidebar → Click **"SQL Editor"**
   - Click **"New query"** button (top right)

2. **Copy Schema File:**
   - Open file: `supabase-schema.sql` from project root
   - Copy entire content (Ctrl+A, Ctrl+C)

3. **Paste and Execute:**
   - Paste into SQL Editor (Ctrl+V)
   - Click **"Run"** button (bottom right)
   - Wait for success message

4. **Verify Tables Created:**
   - Left sidebar → Click **"Table Editor"**
   - You should see 3 tables:
     - ✅ `profiles`
     - ✅ `resumes`
     - ✅ `job_applications`

---

### **Step 3: Verify RLS Policies**

1. Go to: **Authentication** → **Policies**
2. For each table, verify policies exist:
   - `profiles`: SELECT, INSERT, UPDATE
   - `resumes`: SELECT, INSERT, UPDATE, DELETE
   - `job_applications`: SELECT, INSERT, UPDATE, DELETE

**All policies should say:** "Users can only access their own data"

---

### **Step 4: Test Database Connection**

Open browser console and run:

```javascript
import { supabase } from './src/lib/supabase'

// Test profiles table
const { data, error } = await supabase.from('profiles').select('*').limit(1)
console.log('Database:', error ? '❌ Failed' : '✅ Connected')
```

**Expected Output:** `✅ Connected` (or no error if no data yet)

---

## ✅ Success Checklist

- [ ] SQL executed without errors
- [ ] 3 tables visible in Table Editor
- [ ] RLS policies enabled for all tables
- [ ] No connection errors in console

---

## 🐛 Troubleshooting

### **Error: "relation already exists"**
**Meaning:** Schema already executed ✅
**Action:** Nothing needed, you're good!

### **Error: "permission denied"**
**Solution:** 
1. Go to SQL Editor
2. Run: `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;`
3. Re-run schema SQL

### **Error: "type already exists"**
**Meaning:** Partial schema exists
**Solution:** 
1. Go to SQL Editor
2. Run each CREATE TABLE statement individually
3. Skip ones that error

---

## 🎯 Next Steps

After schema execution:

1. ✅ Test signup flow
2. ✅ Verify profile creation
3. ✅ Test resume upload
4. ✅ Test job application tracking

---

**Time Required:** 5 minutes  
**Difficulty:** Easy  
**Status:** ⏳ Pending
