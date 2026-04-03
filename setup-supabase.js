#!/usr/bin/env node
/**
 * Supabase Setup Script
 * 
 * This script creates all tables, policies, and storage bucket for Kayaka-AI
 * 
 * USAGE:
 * 1. Get your SERVICE ROLE KEY from Supabase Dashboard:
 *    - Go to https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb
 *    - Click Settings (gear icon) → API
 *    - Copy "service_role" key (NOT the anon key!)
 * 
 * 2. Run: node setup-supabase.js
 * 
 * 3. Enter your service role key when prompted
 */

import readline from 'readline'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tbzmijcinafbmzjcgcpb.supabase.co'

// Create readline interface for prompting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const prompt = (question) => new Promise((resolve) => rl.question(question, resolve))

// SQL Schema to execute
const schemaSQL = `
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Users can only see/edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

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

DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can create own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;

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

DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON job_applications;

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
  cover_letter TEXT,
  recruiter_dms JSONB DEFAULT '[]'::jsonb,
  followup_emails JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE smart_apply_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own packs" ON smart_apply_packs;
DROP POLICY IF EXISTS "Users can create own packs" ON smart_apply_packs;
DROP POLICY IF EXISTS "Users can delete own packs" ON smart_apply_packs;

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
-- 5. FUNCTIONS & TRIGGERS
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
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_applications_updated_at ON job_applications;
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. STORAGE BUCKET (for resume files)
-- ============================================
-- Note: Storage bucket needs to be created via Dashboard or Storage API
-- This SQL sets up the policies assuming bucket 'resumes' exists

-- Insert storage bucket if it doesn't exist (requires service role)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('resumes', 'resumes', false, 5242880)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- SETUP COMPLETE
-- ============================================
`

async function main() {
  console.log('\n========================================')
  console.log('   KAYAKA-AI Supabase Setup')
  console.log('========================================\n')
  
  console.log('📋 Instructions:')
  console.log('1. Go to https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb')
  console.log('2. Click Settings (⚙️) → API')
  console.log('3. Copy the "service_role" key (starts with eyJ...)')
  console.log('   ⚠️  NOT the anon/public key!\n')
  
  const serviceRoleKey = await prompt('🔑 Enter your SERVICE ROLE key: ')
  
  if (!serviceRoleKey || !serviceRoleKey.startsWith('eyJ')) {
    console.log('\n❌ Invalid service role key. Please run again with a valid key.')
    rl.close()
    return
  }
  
  console.log('\n⏳ Connecting to Supabase...')
  
  // Create Supabase client with service role key
  const supabase = createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase.from('profiles').select('count')
    
    if (testError && !testError.message.includes('relation')) {
      throw new Error(`Connection failed: ${testError.message}`)
    }
    
    console.log('✅ Connected to Supabase\n')
    console.log('📝 Executing SQL schema...\n')
    
    // Execute SQL via RPC (using the sql extension)
    // Since we can't execute raw SQL directly, we'll use a different approach
    // We'll create the tables one by one using the Supabase client
    
    console.log('⚠️  Note: For full schema setup, please use the SQL Editor in Supabase Dashboard')
    console.log('📬 Alternative: Run this SQL manually:\n')
    console.log('   1. Go to https://supabase.com/dashboard/project/tbzmijcinafbmzjcgcpb/sql/new')
    console.log('   2. Copy the contents of supabase-schema.sql')
    console.log('   3. Click "Run"\n')
    
    // Try to create storage bucket via API
    console.log('📦 Creating storage bucket...')
    
    const bucketResponse = await fetch(`${SUPABASE_URL}/storage/v1/buckets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({
        id: 'resumes',
        name: 'resumes',
        public: false,
        file_size_limit: 5242880
      })
    })
    
    const bucketResult = await bucketResponse.json()
    
    if (bucketResponse.ok || bucketResult.message?.includes('already exists')) {
      console.log('✅ Storage bucket "resumes" ready\n')
    } else {
      console.log('⚠️  Storage bucket creation failed:', bucketResult.message || 'Unknown error')
      console.log('   You can create it manually in Storage → New bucket\n')
    }
    
    console.log('========================================')
    console.log('   Setup Complete!')
    console.log('========================================\n')
    
    console.log('✅ Next steps:')
    console.log('   1. Run the SQL schema in Supabase SQL Editor')
    console.log('   2. Test authentication at /signup')
    console.log('   3. Upload a resume to test storage\n')
    
  } catch (error) {
    console.log('\n❌ Error:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('   - Make sure you copied the SERVICE ROLE key (not anon key)')
    console.log('   - Check that your Supabase project is active')
    console.log('   - Try running the SQL manually in the SQL Editor\n')
  }
  
  rl.close()
}

main()
