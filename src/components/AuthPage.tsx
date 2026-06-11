import React, { useState } from 'react';
import { Shirt, Mail, Lock, Loader2 } from 'lucide-react';
import { signIn, signUp } from '../supabase';
import { motion } from 'motion/react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('请填写邮箱和密码');
      return;
    }
    if (password.length < 6) {
      setError('密码至少 6 位');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
        onAuthSuccess();
      } else {
        await signUp(email.trim(), password);
        setSuccessMsg('注册成功！请检查邮箱确认链接，然后返回登录。（如未收到邮件，可直接尝试登录）');
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen bg-[#05020a] text-white flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center px-8 py-12"
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Shirt size={32} className="text-purple-400" />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight">数码衣橱</h1>
          <p className="text-sm text-white/40 mt-1">你的云端时尚管理中心</p>
        </div>

        {/* Form Card */}
        <div className="w-full glass-panel rounded-squircle p-6 border border-white/10 space-y-5">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                isLogin ? 'text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/70'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                !isLogin ? 'text-white border-b-2 border-purple-500' : 'text-white/40 hover:text-white/70'
              }`}
            >
              注册
            </button>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="bg-green-950/30 border border-green-500/30 rounded-xl p-3 text-sm text-green-300">
              {successMsg}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">邮箱</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 pl-10 pr-4 py-3 rounded-2xl text-sm border border-white/10 text-white focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/60">密码</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="password"
                  placeholder="至少 6 位"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 pl-10 pr-4 py-3 rounded-2xl text-sm border border-white/10 text-white focus:border-purple-500/50 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.35)]"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                isLogin ? '进入我的衣橱' : '创建账户'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
