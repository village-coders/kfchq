import React, { useState } from 'react';
import { Crown, User, Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useHqAuth } from '../../context/HqAuthContext';

export default function HqLoginScreen() {
  const { login } = useHqAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const res = await login({ username, password });
    setIsSubmitting(false);
    if (!res.success) {
      setError(res.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Crimson & Gold Executive Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#c8102e]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="w-full max-w-[430px] relative z-10 bg-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c8102e] via-rose-500 to-amber-500" />

        <div className="p-7 sm:p-9">
          {/* Header Logos */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c8102e] to-[#8f0b20] flex items-center justify-center shadow-lg shadow-rose-950/30">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <img src="/hfa-logo.png" alt="Halal Food Authority" className="h-12 w-auto object-contain" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-rose-50 text-[#c8102e] mb-2">
              KFC Headquarters Portal
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">KFC LOGIN</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">Enter Details to Login</p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="hq-username" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Your Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  id="hq-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter KFC HQ username"
                  className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hq-password" className="block text-xs font-semibold text-stone-700 mb-1.5">
                Your Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  id="hq-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowHelp((prev) => !prev)}
                className="text-xs font-semibold text-[#c8102e] hover:underline cursor-pointer"
              >
                Forget password ?
              </button>
            </div>

            {showHelp && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                KFC Headquarters accounts are managed exclusively by <strong>HFA Admin</strong>. Please contact your HFA Operations Administrator to reset your password or request access.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#c8102e] to-[#a60d26] hover:from-[#a60d26] hover:to-[#87091d] text-white font-bold text-sm shadow-lg shadow-rose-950/20 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized KFC Headquarters Personnel Only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
