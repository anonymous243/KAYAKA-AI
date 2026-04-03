-- ============================================
-- KAYAKA-AI Database Schema
-- Security: Row Level Security (RLS) enabled
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends Supabase auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  
  -- Subscription details
  plan TEXT DEFAULT 'free',
  razorpay_customer_id TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Users can only see/edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. RESUMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Parsed resume data
  name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  summary TEXT,
  skills TEXT[],
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- File storage
  file_url TEXT,
  file_name TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- RLS: Users can only access their own resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Job details
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  job_url TEXT,
  job_board TEXT,
  description TEXT,
  
  -- Application tracking
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn')),
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  recruiter_intent TEXT,
  
  -- AI analysis
  matching_skills TEXT[],
  missing_skills TEXT[],
  cover_letter TEXT,
  notes TEXT,
  
  -- Dates
  applied_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);

-- RLS: Users can only access their own applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. SMART APPLY PACKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS smart_apply_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  
  -- Generated content
  cover_letter TEXT,
  recruiter_dms JSONB DEFAULT '[]'::jsonb,
  followup_emails JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE smart_apply_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own packs"
  ON smart_apply_packs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own packs"
  ON smart_apply_packs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own packs"
  ON smart_apply_packs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed')),
  plan_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. STORAGE BUCKETS (for resume files)
-- ============================================
-- Run this in Supabase Dashboard → Storage

-- CREATE BUCKET: resumes (private)
-- Policy: Users can only upload/view their own files
-- INSERT: (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
-- SELECT: (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
-- UPDATE: (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
-- DELETE: (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])

-- ============================================
-- SECURITY NOTES
-- ============================================
-- ✅ All tables have RLS enabled
-- ✅ Users can ONLY access their own data
-- ✅ auth.uid() is used for all policies
-- ✅ Service role key required to bypass RLS (keep it secret!)
-- ✅ Anon key is safe for frontend use
-- ✅ Database functions use SECURITY DEFINER where needed
