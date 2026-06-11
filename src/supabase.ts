import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ibdsfvftkeqhzvwcpjlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZHNmdmZ0a2VxaHp2d2NwamxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTk4NTgsImV4cCI6MjA5NjczNTg1OH0.Jv3dPj236LATr561lNY9GTXCqmisvOwj-XtkVCwxuRA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
