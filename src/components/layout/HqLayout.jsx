import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Building2,
  Store,
  ClipboardList,
  Package,
  Award,
  CheckCircle2,
  ShieldAlert,
  FilePlus2,
  Plus,
  Menu,
  X,
  RefreshCw,
  Crown,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useHq } from '../../context/HqContext';
import { useHqAuth } from '../../context/HqAuthContext';
import RequestProductModal from '../modals/RequestProductModal';
import RequestFranchiseModal from '../modals/RequestFranchiseModal';
import RequestStoreModal from '../modals/RequestStoreModal';

export default function HqLayout({ children }) {
  const {
    activeScreen,
    setActiveScreen,
    setShowProductModal,
    setShowFranchiseModal,
    setShowStoreModal,
    refreshAll,
    isLoading,
    stores,
    audits,
    requests
  } = useHq();
  const { hqUser, logout } = useHqAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navCounts = useMemo(() => {
    const failed = audits.filter(
      (a) => a.category === 'Other Fail' || a.category === 'L3 Critical Fail'
    ).length;
    const pendingReqs = requests.filter(
      (r) => !['approved', 'rejected'].includes(String(r.status || '').toLowerCase())
    ).length;
    return { failed, pendingReqs };
  }, [audits, requests]);

  const mainNav = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'FRANCHISEE_LIST', label: 'Franchisee List', icon: Building2 },
    { id: 'STORE_LIST', label: 'Store List', icon: Store },
    { id: 'AUDIT_LIST', label: 'Audit List', icon: ClipboardList },
    { id: 'PRODUCT_LIST', label: 'Product List', icon: Package },
    { id: 'CERTIFICATES', label: 'Certificates', icon: Award }
  ];

  const requestNav = [
    { id: 'FRANCHISEE_REQUESTS', label: 'Franchisee Requests', icon: FilePlus2 },
    { id: 'STORE_REQUESTS', label: 'Store Requests', icon: FilePlus2 },
    { id: 'PRODUCT_REQUESTS', label: 'Product Requests', icon: FilePlus2, badge: navCounts.pendingReqs || null }
  ];

  const outcomeNav = [
    { id: 'PASSED_AUDITS', label: 'Passed Audits', icon: CheckCircle2 },
    { id: 'FAILED_AUDITS', label: 'Failed Audits', icon: ShieldAlert, badge: navCounts.failed || null, badgeTone: 'crimson' }
  ];

  const allNav = [...mainNav, ...requestNav, ...outcomeNav];
  const currentNav = allNav.find((n) => n.id === activeScreen) || mainNav[0];

  const initials = useMemo(() => {
    const name = hqUser?.fullName || hqUser?.username || 'HQ';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }, [hqUser]);

  const handleNav = (id) => {
    setActiveScreen(id);
    setSidebarOpen(false);
  };

  const renderNavButton = (item) => {
    const Icon = item.icon;
    const active = activeScreen === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleNav(item.id)}
        className={`group relative w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
          active
            ? 'bg-white/[0.09] text-white font-semibold'
            : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#c8102e]" />
        )}
        <span className="flex items-center gap-2.5 min-w-0">
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              active ? 'text-[#f43f5e]' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span className="truncate">{item.label}</span>
        </span>
        {item.badge ? (
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums shrink-0 ${
              item.badgeTone === 'crimson'
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[#f4f5f7] text-slate-900 overflow-x-clip">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Static Fixed Executive Obsidian Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-[100dvh] w-[82vw] max-w-[280px] lg:w-[264px] bg-[#0b0e14] text-slate-200 border-r border-white/[0.08] flex flex-col transition-transform duration-200 ease-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNav('DASHBOARD')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#c8102e] flex items-center justify-center shadow-md shadow-rose-950/50 shrink-0 ring-1 ring-white/15">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold tracking-tight text-white leading-tight">
                KFC HEADQUARTERS
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Halal Food Authority
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <div className="space-y-0.5">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Overview &amp; Directory
            </div>
            {mainNav.map(renderNavButton)}
          </div>

          <div className="space-y-0.5 pt-4 border-t border-white/[0.07]">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Request Lists
            </div>
            {requestNav.map(renderNavButton)}
          </div>

          <div className="space-y-0.5 pt-4 border-t border-white/[0.07]">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Audit Outcomes
            </div>
            {outcomeNav.map(renderNavButton)}
          </div>

          <div className="pt-4 border-t border-white/[0.07] space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Quick Submissions
            </div>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowFranchiseModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Add New Franchisee</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowStoreModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Add New Store</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowProductModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.07] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Add New Product</span>
            </button>
          </div>
        </nav>

        {/* Footer User Profile + Logout */}
        <div className="p-3 border-t border-white/[0.07] bg-white/[0.02]">
          <div className="flex items-center justify-between gap-2.5 px-1.5 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8102e] to-[#7f0a1d] text-white text-xs font-bold flex items-center justify-center shrink-0 ring-1 ring-white/15">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {hqUser?.fullName || hqUser?.username || 'KFC HQ User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {hqUser?.role || 'KFC Headquarters'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell (offset by fixed sidebar width on desktop) */}
      <div className="min-h-[100dvh] flex flex-col min-w-0 lg:pl-[264px]">
        {/* Executive Top Bar */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <span className="hidden sm:inline font-medium text-slate-400">KFC HQ</span>
              <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-300 shrink-0" />
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="tabular-nums">{stores.length} Stores Live</span>
            </div>

            <button
              type="button"
              onClick={refreshAll}
              disabled={isLoading}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c8102e]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#c8102e]" />
              <span>New Product</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStoreModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>New Store</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFranchiseModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Franchisee</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Active Screen */}
        <main className="flex-1 px-3.5 sm:px-8 py-4 sm:py-6 max-w-[1400px] w-full mx-auto pb-24 lg:pb-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0b0e14]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-5 pt-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] px-1">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'FRANCHISEE_LIST', label: 'Franchises', icon: Building2 },
            { id: 'PRODUCT_LIST', label: 'Products', icon: Package },
            { id: 'AUDIT_LIST', label: 'Audits', icon: ClipboardList },
            { id: 'CERTIFICATES', label: 'Certs', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveScreen(tab.id)}
                className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-semibold ${
                  active ? 'text-white' : 'text-slate-500'
                }`}
              >
                <div className={`p-1 rounded-md mb-0.5 ${active ? 'bg-[#c8102e]' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[60px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Request Modals */}
      <RequestProductModal />
      <RequestFranchiseModal />
      <RequestStoreModal />
    </div>
  );
}
