#!/bin/bash
# ============================================
# KAYAKA-AI Supabase Setup Script
# ============================================
# 
# This script will:
# 1. Create all database tables
# 2. Set up Row Level Security policies
# 3. Create storage bucket for resumes
# 4. Set up triggers
#
# USAGE:
# ./setup-supabase.sh
#
# You'll need your SERVICE ROLE KEY from:
# https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/settings/api
# ============================================

SUPABASE_URL="https://tbzmijcinafbmzjcgcpb.supabase.co"

echo ""
echo "========================================"
echo "   KAYAKA-AI Supabase Setup"
echo "========================================"
echo ""
echo "📋 Get your SERVICE ROLE KEY:"
echo "   1. Go to https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/settings/api"
echo "   2. Click 'Show database password' if needed"
echo "   3. Copy the 'service_role' key (NOT the anon key!)"
echo ""
echo "🔒 Your key is entered securely (hidden input)"
echo ""
read -sp "🔑 Enter SERVICE ROLE key: " SERVICE_ROLE_KEY
echo ""

if [[ ! $SERVICE_ROLE_KEY =~ ^eyJ ]]; then
    echo ""
    echo "❌ Invalid key format. Key should start with 'eyJ'"
    exit 1
fi

echo ""
echo "⏳ Setting up database..."
echo ""

# SQL to execute
read -r -d '' SQL_QUERY << 'EOF'
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own resumes"
  ON resumes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create own resumes"
  ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own resumes"
  ON resumes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own resumes"
  ON resumes FOR DELETE USING (auth.uid() = user_id);

-- JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  job_url TEXT,
  job_board TEXT,
  description TEXT,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn')),
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  recruiter_intent TEXT,
  matching_skills TEXT[],
  missing_skills TEXT[],
  cover_letter TEXT,
  notes TEXT,
  applied_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own applications"
  ON job_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create own applications"
  ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own applications"
  ON job_applications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own applications"
  ON job_applications FOR DELETE USING (auth.uid() = user_id);

-- SMART APPLY PACKS TABLE
CREATE TABLE IF NOT EXISTS smart_apply_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  cover_letter TEXT,
  recruiter_dms JSONB DEFAULT '[]'::jsonb,
  followup_emails JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE smart_apply_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own packs"
  ON smart_apply_packs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create own packs"
  ON smart_apply_packs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own packs"
  ON smart_apply_packs FOR DELETE USING (auth.uid() = user_id);

-- UPDATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- APPLY TRIGGERS
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

-- PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('resumes', 'resumes', false, 5242880)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
CREATE POLICY IF NOT EXISTS "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can view own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
EOF

# Execute SQL via Supabase REST API
RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: tx=commit" \
  -d "{\"query\": $(echo "$SQL_QUERY" | jq -Rs '.')"}")

# Check response
if echo "$RESPONSE" | grep -q "error\|Error\|failed"; then
    echo "❌ Setup failed!"
    echo "Response: $RESPONSE"
    echo ""
    echo "💡 Alternative: Run SQL manually in Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/sql/new"
    exit 1
else
    echo "✅ Database tables created successfully!"
    echo "✅ Row Level Security policies applied!"
    echo "✅ Triggers configured!"
    echo ""
    
    # Verify storage bucket
    BUCKET_RESPONSE=$(curl -s "${SUPABASE_URL}/storage/v1/buckets/resumes" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "apikey: ${SERVICE_ROLE_KEY}")
    
    if echo "$BUCKET_RESPONSE" | grep -q "resumes"; then
        echo "✅ Storage bucket 'resumes' created!"
    else
        echo "⚠️  Storage bucket may need manual creation"
        echo "   Go to Storage → New bucket → Name: resumes → Private"
    fi
    
    echo ""
    echo "========================================"
    echo "   ✅ Setup Complete!"
    echo "========================================"
    echo ""
    echo "🎉 Your Supabase backend is ready!"
    echo ""
    echo "📝 Test it:"
    echo "   1. npm run dev"
    echo "   2. Go to http://localhost:5173/signup"
    echo "   3. Create an account"
    echo "   4. Check Supabase Dashboard → Authentication → Users"
    echo ""
fi
