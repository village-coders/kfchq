import React, { useMemo } from 'react';
import {
  Building2,
  Store,
  Package,
  Award,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useHq } from '../../context/HqContext';

export default function OverviewScreen() {
  const {
    franchisees,
    stores,
    products,
    requests,
    isLoading,
    setActiveScreen,
    setSelectedFranchiseName,
    setShowProductModal,
    setShowFranchiseModal,
    setShowStoreModal
  } = useHq();

  const certifiedCount = useMemo(
    () => stores.filter((s) => s.halalCertified || s.status === 'Passed').length,
    [stores]
  );

  const topFranchises = useMemo(() => {
    const counts = new Map();
    stores.forEach((s) => {
      const f = s.franchisee || 'Independent';
      const entry = counts.get(f) || { name: f, total: 0, certified: 0 };
      entry.total += 1;
      if (s.halalCertified || s.status === 'Passed') entry.certified += 1;
      counts.set(f, entry);
    });
    return Array.from(counts.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [stores]);

  const kpis = [
    {
      label: 'Franchisee List',
      value: franchisees.length || topFranchises.length,
      icon: Building2,
      accent: 'bg-rose-50 text-[#c8102e]',
      target: 'FRANCHISEE_LIST'
    },
    {
      label: 'Store List',
      value: stores.length,
      icon: Store,
      accent: 'bg-stone-100 text-stone-800',
      target: 'STORE_LIST'
    },
    {
      label: 'Product List',
      value: products.length,
      icon: Package,
      accent: 'bg-amber-50 text-amber-700',
      target: 'PRODUCT_LIST'
    },
    {
      label: 'Certificates',
      value: certifiedCount,
      icon: Award,
      accent: 'bg-emerald-50 text-emerald-700',
      target: 'CERTIFICATES'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Obsidian Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0f1117] via-[#171a24] to-[#261219] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -right-14 -top-14 w-64 h-64 rounded-full bg-[#c8102e]/25 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 -bottom-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/10 border border-white/15 px-3 py-1 rounded-full text-amber-300 mb-3">
              KFC National Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Franchise Network, Products &amp; Halal Certification
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Monitor every franchise partner, inspect stores under each group, review approved Halal products &amp; certificates, and submit new product or franchise requests directly to HFA Admin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="px-4 py-3 rounded-2xl bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Request New Product</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFranchiseModal(true)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Request New Franchise</span>
            </button>
            <button
              type="button"
              onClick={() => setShowStoreModal(true)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Store className="w-4 h-4 text-emerald-300" />
              <span>Request New Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => setActiveScreen(kpi.target)}
              className="group text-left bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#c8102e] transition-colors" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-14 h-8 bg-stone-200 rounded-lg animate-pulse" />
                ) : (
                  kpi.value
                )}
              </div>
              <div className="text-xs font-semibold text-stone-500 mt-1">{kpi.label}</div>
            </button>
          );
        })}
      </div>

      {/* Two-Column Split: Top Franchises + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Franchise Partners */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Franchise Partners</h3>
              <p className="text-xs text-stone-500">Click any franchise to view its stores</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('FRANCHISEE_LIST')}
              className="text-xs font-bold text-[#c8102e] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="h-14 rounded-2xl bg-stone-100 animate-pulse" />
              ))
            ) : (
              topFranchises.map((f) => {
                const pct = f.total > 0 ? Math.round((f.certified / f.total) * 100) : 0;
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={() => {
                      setSelectedFranchiseName(f.name);
                      setActiveScreen('FRANCHISEE_LIST');
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border border-stone-100 hover:border-rose-200 hover:bg-rose-50/30 flex items-center justify-between gap-3 transition-all cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-stone-900 truncate">{f.name}</div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {f.total} Store{f.total !== 1 ? 's' : ''} &bull; {f.certified} Certified ({pct}%)
                      </div>
                    </div>
                    <div className="w-24 hidden sm:block">
                      <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#c8102e] to-amber-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Recent HQ Requests */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Recent Requests</h3>
              <p className="text-xs text-stone-500">Product &amp; franchise submissions</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveScreen('PRODUCT_REQUESTS')}
              className="text-xs font-bold text-[#c8102e] hover:underline cursor-pointer"
            >
              All Requests
            </button>
          </div>

          <div className="space-y-3">
            {requests.slice(0, 5).map((r, idx) => (
              <div
                key={r._id || r.id || idx}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c8102e]">
                    {r.requestType || 'Request'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {r.status === 'Approved' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {r.status || 'Pending'}
                  </span>
                </div>
                <div className="text-sm font-bold text-stone-900 truncate">
                  {r.productName || r.franchisee || r.storeName}
                </div>
                <div className="text-[11px] text-stone-500 flex items-center justify-between">
                  <span>{r.productCategory ? `Category: ${r.productCategory}` : r.franchisee}</span>
                  <span>{r.date || ''}</span>
                </div>
              </div>
            ))}
            {!isLoading && requests.length === 0 && (
              <div className="py-8 text-center text-xs text-stone-500">
                No requests submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
