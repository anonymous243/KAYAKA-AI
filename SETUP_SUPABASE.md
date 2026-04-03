# 🔧 Supabase Backend Setup

## Option 1: One-Click Setup Script (Recommended)

Run the setup script from your terminal:

```bash
./setup-supabase.sh
```

The script will:
1. Prompt for your Service Role key (securely hidden)
2. Create all 4 database tables
3. Enable Row Level Security
4. Create storage bucket for resumes
5. Set up all policies and triggers

**Get your Service Role Key:**
1. Go to https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/settings/api
2. Copy the `service_role` key (starts with `eyJ`)
3. Paste when prompted

---

## Option 2: Manual SQL (2 minutes)

If you prefer to do it manually:

### Step 1: Create Tables

1. Go to **SQL Editor**: https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/sql/new
2. Paste this SQL and click **Run**:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT, email TEXT UNIQUE NOT NULL, avatar_url TEXT,
  phone TEXT, location TEXT, linkedin_url TEXT, website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT, email TEXT, phone TEXT, location TEXT, summary TEXT,
  skills TEXT[], experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb, projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  file_url TEXT, file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own resumes" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own resumes" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, company TEXT NOT NULL, location TEXT,
  salary_range TEXT, job_url TEXT, job_board TEXT, description TEXT,
  status TEXT DEFAULT 'saved', match_score INTEGER,
  matching_skills TEXT[], missing_skills TEXT[],
  cover_letter TEXT, notes TEXT,
  applied_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_applications_user_id ON job_applications(user_id);
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS smart_apply_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  cover_letter TEXT, recruiter_dms JSONB DEFAULT '[]'::jsonb,
  followup_emails JSONB DEFAULT '[]'::jsonb, checklist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE smart_apply_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own packs" ON smart_apply_packs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own packs" ON smart_apply_packs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own packs" ON smart_apply_packs FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 2: Create Storage Bucket

1. Go to **Storage**: https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/storage
2. Click **"New bucket"**
3. Name: `resumes`, Public: ❌ **Uncheck**, File size: `5242880`
4. Click **"Create"**

### Step 3: Add Storage Policies

In SQL Editor, run:

```sql
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## ✅ Verify Setup

After setup, test:

```bash
npm run dev
```

1. Go to http://localhost:5173/signup
2. Create an account
3. Check Supabase Dashboard:
   - **Authentication → Users** - should show your user
   - **Table Editor → profiles** - should have your profile
   - **Storage → resumes** - ready for uploads

---

## 🔒 Security Notes

- ✅ Service Role key = Master password (never share, never commit to git)
- ✅ Anon key = Safe for frontend (RLS protects data)
- ✅ All tables have Row Level Security enabled
- ✅ Users can ONLY access their own data
