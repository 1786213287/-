import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ibdsfvftkeqhzvwcpjlp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZHNmdmZ0a2VxaHp2d2NwamxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTk4NTgsImV4cCI6MjA5NjczNTg1OH0.Jv3dPj236LATr561lNY9GTXCqmisvOwj-XtkVCwxuRA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TOKEN_KEY = 'closet_auth_token';

// 保存登录状态
export function saveAuth(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

// 获取当前 token
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// 清除登录状态
export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!getToken();
}

// 邮箱注册
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.rpc('register_user', {
    p_email: email,
    p_password: password,
  });
  if (error) throw new Error(error.message);
  // 注册成功自动保存 token
  saveAuth(data.auth_token);
  return data;
}

// 邮箱登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.rpc('login_user', {
    p_email: email,
    p_password: password,
  });
  if (error) throw new Error(error.message);
  saveAuth(data.auth_token);
  return data;
}

// 登出
export async function signOut() {
  const token = getToken();
  if (token) {
    await supabase.rpc('logout_user', { p_token: token });
  }
  clearAuth();
}