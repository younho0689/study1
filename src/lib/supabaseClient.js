import { createClient } from '@supabase/supabase-js'

// Vite는 빌드 시 VITE_ 변수를 브라우저 코드에 포함합니다.
// Publishable key만 사용하며, 비밀 키는 절대로 이 파일에 넣지 않습니다.
const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const hasSupabaseConfig = Boolean(url && key)

export const supabase = hasSupabaseConfig
  ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
  : null
