import React, { useMemo, useState } from 'react';
import {
  Building2,
  Store,
  Package,
  Award,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Snowflake,
  Thermometer,
  Box,
  ChevronRight,
  FilePlus2,
  AlertTriangle,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useHq } from '../../context/HqContext';
import { useHqAuth } from '../../context/HqAuthContext';

export default function OverviewScreen() {
  const {
    franchisees,
    stores,
    audits,
    products,
    requests,
    isLoading,
    setActiveScreen,
    setSelectedFranchiseName,
    setShowProductModal,
    setShowFranchiseModal,
    setShowStoreModal
  } = useHq();
  const { hqUser } = useHqAuth();
  const [activityTab, setActivityTab] = useState('AUDITS');

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  const stats = useMemo(() => {
    const totalStores = stores.length;
    const certifiedStores = stores.filter((s) => s.halalCertified || s.status === 'Passed').length;
    const certRate = totalStores > 0 ? Math.round((certifiedStores / totalStores) * 100) : 0;

    let passedAudits = 0;
    let otherFailed = 0;
    let l3Failed = 0;
    let pendingAudits = 0;
    audits.forEach((a) => {
      if (a.category === 'Passed') passedAudits += 1;
      else if (a.category === 'L3 Critical Fail') l3Failed += 1;
      else if (a.category === 'Other Fail') otherFailed += 1;
      else pendingAudits += 1;
    });
    const evaluatedAudits = passedAudits + otherFailed + l3Failed;
    const passRate = evaluatedAudits > 0 ? Math.round((passedAudits / evaluatedAudits) * 100) : 0;

    const prodCats = { Frozen: 0, Chilled: 0, Ambient: 0 };
    products.forEach((p) => {
      const c = p.category || 'Ambient';
      if (prodCats[c] !== undefined) prodCats[c] += 1;
      else prodCats.Ambient += 1;
    });

    const reqSummary = { franchise: 0, store: 0, product: 0, pending: 0 };
    requests.forEach((r) => {
      const t = String(r.requestType || '').toLowerCase();
      if (t.includes('product')) reqSummary.product += 1;
      else if (t.includes('franchise')) reqSummary.franchise += 1;
      else reqSummary.store += 1;
      if (!['approved', 'rejected'].includes(String(r.status || '').toLowerCase())) {
        reqSummary.pending += 1;
      }
    });

    return {
      totalStores,
      certifiedStores,
      underReviewStores: Math.max(0, totalStores - certifiedStores),
      certRate,
      passedAudits,
      otherFailed,
      l3Failed,
      totalFailed: otherFailed + l3Failed,
      pendingAudits,
      evaluatedAudits,
      passRate,
      prodCats,
      reqSummary
    };
  }, [stores, audits, products, requests]);

  const topFranchises = useMemo(() => {
    const counts = new Map();
    stores.forEach((s) => {
      const f = (s.franchisee || 'Independent').trim();
      const entry = counts.get(f) || { name: f, total: 0, certified: 0 };
      entry.total += 1;
      if (s.halalCertified || s.status === 'Passed') entry.certified += 1;
      counts.set(f, entry);
    });
    return Array.from(counts.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 7);
  }, [stores]);

  const franchiseCount = franchisees.length || topFranchises.length;

  // SVG Donut Geometry (r = 54, circumference = 339.29)
  const donut = useMemo(() => {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const total = Math.max(1, audits.length);
    const segs = [
      { key: 'passed', value: stats.passedAudits, stroke: 'url(#grad-emerald)' },
      { key: 'otherFail', value: stats.otherFailed, stroke: 'url(#grad-amber)' },
      { key: 'l3Fail', value: stats.l3Failed, stroke: 'url(#grad-crimson)' },
      { key: 'pending', value: stats.pendingAudits, stroke: '#cbd5e1' }
    ];
    let offset = 0;
    return segs.map((s) => {
      const len = (s.value / total) * circ;
      const item = { ...s, dashArray: `${len} ${circ - len}`, dashOffset: -offset };
      offset += len;
      return item;
    });
  }, [audits.length, stats.passedAudits, stats.otherFailed, stats.l3Failed, stats.pendingAudits]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Executive Gradient Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d111d] via-[#2a101d] to-[#980c25] text-white p-5 sm:p-7 shadow-xl shadow-rose-950/15">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-rose-500/30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-24 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 top-1/2 w-48 h-48 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/12 backdrop-blur-md border border-white/15 text-amber-200">
                <Sparkles className="w-3 h-3 text-amber-300" />
                KFC Headquarters Portal
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                HFA Live Sync
              </span>
              <span className="text-rose-100/75 hidden sm:inline">{todayLabel}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 leading-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent">
                {hqUser?.fullName?.split(' ')[0] || hqUser?.username || 'Executive'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/80 mt-1.5 leading-relaxed">
              Monitor KFC franchise groups, track Halal certification coverage and audit outcomes, and submit new store, franchisee, or product applications directly to HFA.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 w-full xl:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowFranchiseModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate">Add Franchisee</span>
            </button>
            <button
              type="button"
              onClick={() => setShowStoreModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="truncate">Add Store</span>
            </button>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Request New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary 4-Column Vibrant Gradient-Accented KPI Cards (2x2 on Mobile, 4-col on XL) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Franchisees */}
        <button
          type="button"
          onClick={() => setActiveScreen('FRANCHISEE_LIST')}
          className="group relative overflow-hidden text-left bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-rose-900/10 hover:-translate-y-0.5 transition-all cursor-pointer min-w-0"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c8102e] via-rose-500 to-pink-500" />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Franchisees
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#c8102e] to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-7 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                franchiseCount
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-bold text-[#c8102e] group-hover:translate-x-0.5 transition-transform">
              Directory
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
            <span className="truncate">Avg / group</span>
            <span className="font-bold text-slate-800 tabular-nums shrink-0">
              {franchiseCount > 0 ? (stats.totalStores / franchiseCount).toFixed(1) : '0.0'} stores
            </span>
          </div>
        </button>

        {/* KPI 2: Stores & Certification */}
        <button
          type="button"
          onClick={() => setActiveScreen('STORE_LIST')}
          className="group relative overflow-hidden text-left bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-0.5 transition-all cursor-pointer min-w-0"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500" />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Stores
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/25">
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-7 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                stats.totalStores
              )}
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/70 tabular-nums shrink-0">
              {stats.certRate}%
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${stats.certRate}%` }}
              />
            </div>
          </div>
        </button>

        {/* KPI 3: Audit Pass Rate */}
        <button
          type="button"
          onClick={() => setActiveScreen('AUDIT_LIST')}
          className="group relative overflow-hidden text-left bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-0.5 transition-all cursor-pointer min-w-0"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Pass Rate
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-7 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                `${stats.passRate}%`
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              {audits.length} Audits
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-emerald-700 font-bold tabular-nums">
              {stats.passedAudits} Pass
            </span>
            <span className="text-rose-600 font-bold tabular-nums">
              {stats.totalFailed} Fail
            </span>
          </div>
        </button>

        {/* KPI 4: Approved Products */}
        <button
          type="button"
          onClick={() => setActiveScreen('PRODUCT_LIST')}
          className="group relative overflow-hidden text-left bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-0.5 transition-all cursor-pointer min-w-0"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              Products
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-7 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                products.length
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              Catalogue
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-600 tabular-nums">
            <span className="text-sky-700">F:{stats.prodCats.Frozen}</span>
            <span className="text-teal-700">C:{stats.prodCats.Chilled}</span>
            <span className="text-amber-700">A:{stats.prodCats.Ambient}</span>
          </div>
        </button>
      </div>

      {/* Analytics Bento Row: Audit Compliance Breakdown + Certification & Request Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Audit Compliance Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#c8102e]" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Audit Compliance Distribution
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live breakdown of HFA field inspection outcomes across the KFC estate
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('AUDIT_LIST')}
              className="text-xs font-bold text-[#c8102e] hover:text-[#a60d26] inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Inspect Audits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Multi-Stop Gradient SVG Donut */}
            <div className="sm:col-span-5 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 drop-shadow-sm">
                  <defs>
                    <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                    <linearGradient id="grad-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e11d48" />
                      <stop offset="100%" stopColor="#9f1239" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="15"
                  />
                  {audits.length > 0 &&
                    donut.map((seg) =>
                      seg.value > 0 ? (
                        <circle
                          key={seg.key}
                          cx="70"
                          cy="70"
                          r="54"
                          fill="none"
                          stroke={seg.stroke}
                          strokeWidth="15"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          strokeLinecap="butt"
                        />
                      ) : null
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tabular-nums leading-none">
                    {isLoading ? '—' : `${stats.passRate}%`}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    Pass Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Gradient-Tinted Outcome Metric Tiles */}
            <div className="sm:col-span-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveScreen('PASSED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 hover:from-emerald-100/80 hover:to-teal-100/60 border border-emerald-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <span className="text-[11px] font-bold text-emerald-900">Passed</span>
                </div>
                <div className="text-xl font-extrabold text-emerald-950 tabular-nums mt-1.5">
                  {stats.passedAudits}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Compliant stores
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('FAILED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-gradient-to-br from-amber-50/90 to-orange-50/50 hover:from-amber-100/80 hover:to-orange-100/60 border border-amber-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                  <span className="text-[11px] font-bold text-amber-900">Other Fail</span>
                </div>
                <div className="text-xl font-extrabold text-amber-950 tabular-nums mt-1.5">
                  {stats.otherFailed}
                </div>
                <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                  Corrective action
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('FAILED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-gradient-to-br from-rose-50/90 to-pink-50/50 hover:from-rose-100/80 hover:to-pink-100/60 border border-rose-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#c8102e] to-rose-500" />
                  <span className="text-[11px] font-bold text-rose-900">L3 Critical</span>
                </div>
                <div className="text-xl font-extrabold text-rose-950 tabular-nums mt-1.5">
                  {stats.l3Failed}
                </div>
                <div className="text-[11px] text-[#c8102e] font-medium mt-0.5">
                  Immediate review
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('AUDIT_LIST')}
                className="text-left p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/70 hover:from-slate-100 hover:to-slate-200/60 border border-slate-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-[11px] font-bold text-slate-700">In Progress</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-1.5">
                  {stats.pendingAudits}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Awaiting sign-off
                </div>
              </button>
            </div>
          </div>

          {/* Product Category Composition Bar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800">Approved Product Portfolio</span>
              <span className="text-slate-500 font-semibold tabular-nums">{products.length} total SKUs</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              <div
                className="bg-gradient-to-r from-sky-400 to-blue-600 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Frozen / products.length) * 100 : 0}%`
                }}
              />
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Chilled / products.length) * 100 : 0}%`
                }}
              />
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Ambient / products.length) * 100 : 0}%`
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-[11px] font-semibold text-slate-600 tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <Snowflake className="w-3.5 h-3.5 text-sky-600" />
                Frozen: <strong className="text-slate-900">{stats.prodCats.Frozen}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                Chilled: <strong className="text-slate-900">{stats.prodCats.Chilled}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-amber-600" />
                Ambient: <strong className="text-slate-900">{stats.prodCats.Ambient}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Certification Coverage + Submission Pipeline (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Rich Gradient Certification Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0e1320] via-[#1c1328] to-[#0d2e26] text-white p-5 sm:p-6 shadow-lg shadow-slate-950/15 relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 rounded-full bg-emerald-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-12 w-36 h-36 rounded-full bg-[#c8102e]/25 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <Award className="w-4 h-4" />
                  Halal Certification Status
                </span>
                <button
                  type="button"
                  onClick={() => setActiveScreen('CERTIFICATES')}
                  className="text-[11px] font-semibold text-emerald-200 hover:text-white inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Registry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-extrabold tabular-nums">
                    {isLoading ? '—' : stats.certifiedStores}
                    <span className="text-base font-medium text-slate-400">
                      {' '}
                      / {stats.totalStores}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Active HFA Halal certificates across UK stores
                  </p>
                </div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent tabular-nums">
                  {stats.certRate}%
                </span>
              </div>

              <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e11d48] via-amber-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${stats.certRate}%` }}
                />
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>Under Review / Pending</span>
                <span className="font-bold text-amber-300 tabular-nums">
                  {stats.underReviewStores} store{stats.underReviewStores !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Request Pipeline Card */}
          <div className="flex-1 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">HFA Request Pipeline</h3>
                <p className="text-[11px] text-slate-500">
                  Submissions sent from KFC HQ to HFA Admin
                </p>
              </div>
              {stats.reqSummary.pending > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200 tabular-nums">
                  {stats.reqSummary.pending} Pending
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {[
                {
                  label: 'Franchisee Requests',
                  count: stats.reqSummary.franchise,
                  screen: 'FRANCHISEE_REQUESTS',
                  icon: Building2,
                  iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/20'
                },
                {
                  label: 'Store Requests',
                  count: stats.reqSummary.store,
                  screen: 'STORE_REQUESTS',
                  icon: Store,
                  iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                },
                {
                  label: 'Product Requests',
                  count: stats.reqSummary.product,
                  screen: 'PRODUCT_REQUESTS',
                  icon: FilePlus2,
                  iconBg: 'bg-gradient-to-br from-[#c8102e] to-rose-500 text-white shadow-rose-500/20'
                }
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    key={row.label}
                    type="button"
                    onClick={() => setActiveScreen(row.screen)}
                    className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/70 hover:bg-gradient-to-r hover:from-rose-50/60 hover:to-amber-50/40 border border-slate-200/70 hover:border-rose-200/80 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-3 text-xs font-bold text-slate-800">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${row.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {row.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 tabular-nums">
                      {row.count}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#c8102e] group-hover:translate-x-0.5 transition-all" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Executive Grid: Franchisee Leaderboard Table + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Franchisee Compliance Leaderboard (7 cols) */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-50 via-white to-rose-50/40 border-b border-slate-200/70 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Top Franchisee Partners
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by store footprint &bull; Click any partner to inspect stores
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('FRANCHISEE_LIST')}
              className="text-xs font-bold text-[#c8102e] hover:underline cursor-pointer shrink-0"
            >
              View All ({franchiseCount})
            </button>
          </div>

          {/* Mobile Stacked Partner Cards (zero horizontal scroll) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-4 space-y-2.5">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : topFranchises.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No franchisee records available.
              </div>
            ) : (
              topFranchises.map((f, idx) => {
                const pct = f.total > 0 ? Math.round((f.certified / f.total) * 100) : 0;
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      setSelectedFranchiseName(f.name);
                      setActiveScreen('FRANCHISEE_LIST');
                    }}
                    className="w-full text-left px-4 py-3.5 hover:bg-rose-50/40 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#c8102e] to-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-900 truncate">
                          {f.name}
                        </span>
                      </span>
                      <span className="text-xs font-extrabold text-slate-700 tabular-nums shrink-0">
                        {pct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                      <span>{f.total} Stores</span>
                      <span className="text-emerald-700 font-bold">{f.certified} Certified</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 80
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : pct >= 50
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-gradient-to-r from-[#c8102e] to-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Desktop/Tablet Structured Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-5">Franchisee</th>
                  <th className="py-2.5 px-3 text-right">Stores</th>
                  <th className="py-2.5 px-3 text-right">Certified</th>
                  <th className="py-2.5 px-5 w-44">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((n) => (
                    <tr key={n}>
                      <td colSpan={4} className="py-3.5 px-5">
                        <div className="h-5 rounded-md bg-slate-100 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : topFranchises.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-xs text-slate-500">
                      No franchisee records available.
                    </td>
                  </tr>
                ) : (
                  topFranchises.map((f, idx) => {
                    const pct = f.total > 0 ? Math.round((f.certified / f.total) * 100) : 0;
                    const rankClass =
                      idx === 0
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                        : idx === 1
                        ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-white'
                        : idx === 2
                        ? 'bg-gradient-to-br from-rose-500 to-[#c8102e] text-white'
                        : 'bg-slate-100 text-slate-600';
                    return (
                      <tr
                        key={f.name}
                        onClick={() => {
                          setSelectedFranchiseName(f.name);
                          setActiveScreen('FRANCHISEE_LIST');
                        }}
                        className="group hover:bg-gradient-to-r hover:from-rose-50/40 hover:to-transparent transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-lg text-[11px] font-extrabold flex items-center justify-center shrink-0 ${rankClass}`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 group-hover:text-[#c8102e] transition-colors truncate max-w-[210px]">
                              {f.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-700 tabular-nums">
                          {f.total}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-700 font-bold tabular-nums">
                          {f.certified}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 80
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : pct >= 50
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'bg-gradient-to-r from-[#c8102e] to-rose-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-700 tabular-nums w-8 text-right">
                              {pct}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed with Gradient Tabbed Switcher (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-rose-50/40 border-b border-slate-200/70 flex items-center justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActivityTab('AUDITS')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activityTab === 'AUDITS'
                    ? 'bg-gradient-to-r from-[#c8102e] to-[#e11d48] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Audits
              </button>
              <button
                type="button"
                onClick={() => setActivityTab('REQUESTS')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activityTab === 'REQUESTS'
                    ? 'bg-gradient-to-r from-[#c8102e] to-[#e11d48] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Requests
              </button>
            </div>
          </div>

          <div className="flex-1 divide-y divide-slate-100">
            {activityTab === 'AUDITS' ? (
              audits.length === 0 && !isLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No recent audit records found.
                </div>
              ) : (
                audits.slice(0, 6).map((a, idx) => {
                  const isPass = a.category === 'Passed';
                  const isL3 = a.category === 'L3 Critical Fail';
                  return (
                    <button
                      key={a._id || a.id || idx}
                      type="button"
                      onClick={() => setActiveScreen('AUDIT_LIST')}
                      className="w-full text-left px-4 sm:px-5 py-3 hover:bg-rose-50/30 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                            isPass
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                              : isL3
                              ? 'bg-gradient-to-br from-[#c8102e] to-rose-600'
                              : 'bg-gradient-to-br from-amber-500 to-orange-500'
                          }`}
                        >
                          {isPass ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isL3 ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                            {a.storeName || 'KFC Store'}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {a.auditor || 'HFA Auditor'} &bull; {a.auditDate || 'Recent'}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isPass
                            ? 'bg-emerald-100 text-emerald-800'
                            : isL3
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {a.category || 'Pending'}
                      </span>
                    </button>
                  );
                })
              )
            ) : requests.length === 0 && !isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No requests submitted yet.
              </div>
            ) : (
              requests.slice(0, 6).map((r, idx) => (
                <button
                  key={r._id || r.id || idx}
                  type="button"
                  onClick={() => setActiveScreen('PRODUCT_REQUESTS')}
                  className="w-full text-left px-4 sm:px-5 py-3 hover:bg-rose-50/30 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8102e]">
                        {r.requestType || 'Request'}
                      </span>
                      <span className="text-[10px] text-slate-400">{r.date || ''}</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-900 truncate mt-0.5">
                      {r.productName || r.franchisee || r.storeName}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 shrink-0">
                    {r.status === 'Approved' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {r.status || 'Pending'}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-rose-50/30 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setActiveScreen(activityTab === 'AUDITS' ? 'AUDIT_LIST' : 'PRODUCT_REQUESTS')
              }
              className="text-xs font-bold text-[#c8102e] hover:text-[#a60d26] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>
                {activityTab === 'AUDITS' ? 'Open Full Audit List' : 'Open All Requests'}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
