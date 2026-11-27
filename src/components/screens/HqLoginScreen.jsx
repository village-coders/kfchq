import React, { useState } from 'react';
import {
  Crown,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Building2,
  Award,
  ClipboardCheck
} from 'lucide-react';
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
    <div className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-br from-[#f8f9fc] via-[#fdf2f4]/60 to-[#eef2f7]">
      {/* Left Executive Gradient Brand Panel */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#0b0e17] via-[#260f1c] to-[#7f0a20] text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#c8102e]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />

        {/* Brand Identity */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center shadow-lg shadow-rose-950/50 ring-1 ring-white/15">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-white">
              KFC HEADQUARTERS
            </div>
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Halal Food Authority
            </div>
          </div>
        </div>

        {/* Executive Value Proposition */}
        <div className="relative z-10 space-y-6 my-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-400 mb-3">
              Executive Portal
            </span>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
              Halal Compliance &amp; Franchise Management
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Centralized executive access to KFC franchise groups, store certifications, HFA audit outcomes, and product approval requests.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: Building2,
                title: 'Franchise & Store Directory',
                desc: 'Monitor certification status across every UK franchise partner.'
              },
              {
                icon: ClipboardCheck,
                title: 'Live HFA Audit Intelligence',
                desc: 'Track passed audits, corrective actions, and L3 critical alerts.'
              },
              {
                icon: Award,
                title: 'Direct HFA Request Workflow',
                desc: 'Submit new franchisee, store, and Halal product applications.'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.07] text-[#f43f5e] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protected by HFA Access Control</span>
          </span>
          <img
            src="/hfa-logo.png"
            alt="HFA"
            className="h-7 w-auto object-contain bg-white rounded-md px-1.5 py-0.5"
          />
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-7 flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <img src="/hfa-logo.png" alt="Halal Food Authority" className="h-10 w-auto object-contain" />
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-rose-950/10 border border-slate-200/80 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#c8102e] via-rose-500 to-amber-500" />

            <div className="p-7 sm:p-9">
              <div className="mb-7">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-rose-50 text-[#c8102e] mb-2.5">
                  KFC Headquarters Portal
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  KFC LOGIN
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter Details to Login
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#c8102e] shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="hq-username"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Your Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="hq-username"
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter KFC HQ username"
                      className="w-full h-11 pl-10 pr-3.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hq-password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Your Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="hq-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
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
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    KFC Headquarters accounts are managed exclusively by <strong>HFA Admin</strong>. Please contact your HFA Operations Administrator to reset your password or provision access.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#c8102e] via-[#dc1e3d] to-[#e11d48] hover:from-[#a60d26] hover:to-[#c8102e] text-white font-bold text-sm shadow-lg shadow-rose-900/25 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer transition-all"
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

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized KFC Headquarters Personnel Only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
