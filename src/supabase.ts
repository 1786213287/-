import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ibdsfvftkeqhzvwcpjlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZHNmdmZ0a2VxaHp2d2NwamxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTk4NTgsImV4cCI6MjA5NjczNTg1OH0.Jv3dPj236LATr561lNY9GTXCqmisvOwj-XtkVCwxuRA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 获取当前用户
export function getCurrentUser() {
  return supabase.auth.getUser();
}

// 监听登录状态变化
export function onAuthChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// 邮箱注册
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// 邮箱登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// 登出
export async function signOut() {
  await supabase.auth.signOut();
}
