import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpvvmoplfmmmgiewesjh.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdnZtb3BsZm1tbWdpZXdlc2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTkyMjUsImV4cCI6MjA3OTAzNTIyNX0.Zr5vvnU_h3ERbxZ5DCF-fn5N0RLMUa74Ef5v8cOSSqk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


