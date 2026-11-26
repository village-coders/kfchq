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
  ClipboardList,
  Snowflake,
  Thermometer,
  Box,
  ChevronRight,
  FilePlus2,
  AlertTriangle
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
      { key: 'passed', value: stats.passedAudits, color: '#10b981' },
      { key: 'otherFail', value: stats.otherFailed, color: '#f59e0b' },
      { key: 'l3Fail', value: stats.l3Failed, color: '#c8102e' },
      { key: 'pending', value: stats.pendingAudits, color: '#cbd5e1' }
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
    <div className="space-y-6">
      {/* Executive Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>{todayLabel}</span>
            <span className="text-slate-300">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              HFA Live Governance Sync
            </span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {hqUser?.fullName?.split(' ')[0] || hqUser?.username || 'Executive'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            National overview of KFC franchise partners, Halal certification coverage, audit compliance, and active submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFranchiseModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Franchisee</span>
          </button>
          <button
            type="button"
            onClick={() => setShowStoreModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Add Store</span>
          </button>
          <button
            type="button"
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0b0e14] hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#f43f5e]" />
            <span>Request New Product</span>
          </button>
        </div>
      </div>

      {/* Primary 4-Column Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Franchisees */}
        <button
          type="button"
          onClick={() => setActiveScreen('FRANCHISEE_LIST')}
          className="group text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Franchisee Groups
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#c8102e] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-14 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                franchiseCount
              )}
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 group-hover:text-[#c8102e] transition-colors">
              Directory
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Avg. stores / group</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {franchiseCount > 0 ? (stats.totalStores / franchiseCount).toFixed(1) : '0.0'}
            </span>
          </div>
        </button>

        {/* KPI 2: Stores & Certification */}
        <button
          type="button"
          onClick={() => setActiveScreen('STORE_LIST')}
          className="group text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Registered Stores
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                stats.totalStores
              )}
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 tabular-nums">
              {stats.certRate}% Certified
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stats.certRate}%` }}
              />
            </div>
          </div>
        </button>

        {/* KPI 3: Audit Pass Rate */}
        <button
          type="button"
          onClick={() => setActiveScreen('AUDIT_LIST')}
          className="group text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Audit Pass Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                `${stats.passRate}%`
              )}
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 group-hover:text-[#c8102e] transition-colors">
              {audits.length} Audits
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-semibold tabular-nums">
              {stats.passedAudits} Passed
            </span>
            <span className="text-rose-700 font-semibold tabular-nums">
              {stats.totalFailed} Failed
            </span>
          </div>
        </button>

        {/* KPI 4: Approved Products */}
        <button
          type="button"
          onClick={() => setActiveScreen('PRODUCT_LIST')}
          className="group text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Approved Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-slate-100 rounded-lg animate-pulse" />
              ) : (
                products.length
              )}
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 group-hover:text-[#c8102e] transition-colors">
              Catalogue
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
            <span>Frz {stats.prodCats.Frozen}</span>
            <span className="text-slate-300">&bull;</span>
            <span>Chl {stats.prodCats.Chilled}</span>
            <span className="text-slate-300">&bull;</span>
            <span>Amb {stats.prodCats.Ambient}</span>
          </div>
        </button>
      </div>

      {/* Analytics Bento Row: Audit Compliance Breakdown + Certification & Request Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Audit Compliance Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Audit Compliance Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live breakdown of HFA field inspection outcomes across the KFC estate
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('AUDIT_LIST')}
              className="text-xs font-semibold text-[#c8102e] hover:text-[#a60d26] inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Inspect Audits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Crisp SVG Donut */}
            <div className="sm:col-span-5 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
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
                          stroke={seg.color}
                          strokeWidth="14"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          strokeLinecap="butt"
                        />
                      ) : null
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {isLoading ? '—' : `${stats.passRate}%`}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                    Pass Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Outcome Metric Tiles */}
            <div className="sm:col-span-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveScreen('PASSED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-slate-50/80 hover:bg-emerald-50/60 border border-slate-200/70 hover:border-emerald-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-slate-600">Passed</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-1.5">
                  {stats.passedAudits}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Compliant stores
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('FAILED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-slate-50/80 hover:bg-amber-50/60 border border-slate-200/70 hover:border-amber-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[11px] font-semibold text-slate-600">Other Fail</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-1.5">
                  {stats.otherFailed}
                </div>
                <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                  Corrective action
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('FAILED_AUDITS')}
                className="text-left p-3.5 rounded-xl bg-slate-50/80 hover:bg-rose-50/60 border border-slate-200/70 hover:border-rose-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c8102e]" />
                  <span className="text-[11px] font-semibold text-slate-600">L3 Critical</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-1.5">
                  {stats.l3Failed}
                </div>
                <div className="text-[11px] text-[#c8102e] font-medium mt-0.5">
                  Immediate review
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveScreen('AUDIT_LIST')}
                className="text-left p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-600">In Progress</span>
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
              <span className="font-semibold text-slate-700">Approved Product Portfolio</span>
              <span className="text-slate-500 tabular-nums">{products.length} total SKUs</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-sky-500 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Frozen / products.length) * 100 : 0}%`
                }}
              />
              <div
                className="bg-teal-500 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Chilled / products.length) * 100 : 0}%`
                }}
              />
              <div
                className="bg-amber-500 h-full"
                style={{
                  width: `${products.length ? (stats.prodCats.Ambient / products.length) * 100 : 0}%`
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2.5 text-[11px] font-medium text-slate-600 tabular-nums">
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
          {/* Obsidian Certification Card */}
          <div className="rounded-2xl bg-[#0b0e14] text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#c8102e]/25 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  Halal Certification Status
                </span>
                <button
                  type="button"
                  onClick={() => setActiveScreen('CERTIFICATES')}
                  className="text-[11px] font-semibold text-slate-300 hover:text-white inline-flex items-center gap-0.5 cursor-pointer"
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
                  <p className="text-xs text-slate-400 mt-0.5">
                    Active HFA Halal certificates across UK stores
                  </p>
                </div>
                <span className="text-xl font-extrabold text-emerald-400 tabular-nums">
                  {stats.certRate}%
                </span>
              </div>

              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c8102e] via-amber-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${stats.certRate}%` }}
                />
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Under Review / Pending</span>
                <span className="font-semibold text-white tabular-nums">
                  {stats.underReviewStores} store{stats.underReviewStores !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Request Pipeline Card */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">HFA Request Pipeline</h3>
                <p className="text-[11px] text-slate-500">
                  Submissions sent from KFC HQ to HFA Admin
                </p>
              </div>
              {stats.reqSummary.pending > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 tabular-nums">
                  {stats.reqSummary.pending} Pending
                </span>
              )}
            </div>

            <div className="space-y-2">
              {[
                {
                  label: 'Franchisee Requests',
                  count: stats.reqSummary.franchise,
                  screen: 'FRANCHISEE_REQUESTS',
                  icon: Building2,
                  tone: 'text-amber-600 bg-amber-50'
                },
                {
                  label: 'Store Requests',
                  count: stats.reqSummary.store,
                  screen: 'STORE_REQUESTS',
                  icon: Store,
                  tone: 'text-emerald-600 bg-emerald-50'
                },
                {
                  label: 'Product Requests',
                  count: stats.reqSummary.product,
                  screen: 'PRODUCT_REQUESTS',
                  icon: FilePlus2,
                  tone: 'text-[#c8102e] bg-rose-50'
                }
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    key={row.label}
                    type="button"
                    onClick={() => setActiveScreen(row.screen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${row.tone}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      {row.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 tabular-nums">
                      {row.count}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top Franchisee Partners
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by store footprint &bull; Click any partner to inspect stores
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('FRANCHISEE_LIST')}
              className="text-xs font-semibold text-[#c8102e] hover:underline cursor-pointer shrink-0"
            >
              View All ({franchiseCount})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-5">Franchisee</th>
                  <th className="py-2.5 px-3 text-right">Stores</th>
                  <th className="py-2.5 px-3 text-right">Certified</th>
                  <th className="py-2.5 px-5 w-40">Coverage</th>
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
                  topFranchises.map((f) => {
                    const pct = f.total > 0 ? Math.round((f.certified / f.total) * 100) : 0;
                    return (
                      <tr
                        key={f.name}
                        onClick={() => {
                          setSelectedFranchiseName(f.name);
                          setActiveScreen('FRANCHISEE_LIST');
                        }}
                        className="group hover:bg-slate-50/90 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-5">
                          <div className="font-semibold text-slate-900 group-hover:text-[#c8102e] transition-colors truncate max-w-[230px]">
                            {f.name}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-700 tabular-nums">
                          {f.total}
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-700 font-semibold tabular-nums">
                          {f.certified}
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct >= 80
                                    ? 'bg-emerald-500'
                                    : pct >= 50
                                    ? 'bg-amber-500'
                                    : 'bg-[#c8102e]'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 tabular-nums w-8 text-right">
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

        {/* Recent Activity Feed with Tabbed Switcher (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200/70">
              <button
                type="button"
                onClick={() => setActivityTab('AUDITS')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activityTab === 'AUDITS'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Audits
              </button>
              <button
                type="button"
                onClick={() => setActivityTab('REQUESTS')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  activityTab === 'REQUESTS'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
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
                      className="w-full text-left px-5 py-3 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPass
                              ? 'bg-emerald-50 text-emerald-600'
                              : isL3
                              ? 'bg-rose-50 text-[#c8102e]'
                              : 'bg-amber-50 text-amber-600'
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
                          <div className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate">
                            {a.storeName || 'KFC Store'}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {a.auditor || 'HFA Auditor'} &bull; {a.auditDate || 'Recent'}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
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
                  className="w-full text-left px-5 py-3 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8102e]">
                        {r.requestType || 'Request'}
                      </span>
                      <span className="text-[10px] text-slate-400">{r.date || ''}</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate mt-0.5">
                      {r.productName || r.franchisee || r.storeName}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 shrink-0">
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

          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() =>
                setActiveScreen(activityTab === 'AUDITS' ? 'AUDIT_LIST' : 'PRODUCT_REQUESTS')
              }
              className="text-xs font-semibold text-slate-600 hover:text-[#c8102e] inline-flex items-center gap-1 cursor-pointer"
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
