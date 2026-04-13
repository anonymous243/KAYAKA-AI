import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  console.log("Testing Login...")
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'anonymous24tr@gmail.com',
    password: 'Amar@8722'
  })

  if (loginError) {
    console.error("Login Error:", loginError.message)
    console.log("Attempting Signup...")
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'anonymous24tr@gmail.com',
      password: 'Amar@8722'
    })
    
    if (signupError) {
      console.error("Signup Error:", signupError.message)
    } else {
      console.log("Signup Success:", signupData.user?.id)
    }
  } else {
    console.log("Login Success:", loginData.user?.id)
  }
}

testAuth()
