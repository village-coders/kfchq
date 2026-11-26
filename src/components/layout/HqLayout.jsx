import React, { useState } from 'react';
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
  LogOut
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
    isLoading
  } = useHq();
  const { hqUser, logout } = useHqAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainNav = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'FRANCHISEE_LIST', label: 'Franchisee List', icon: Building2 },
    { id: 'STORE_LIST', label: 'Store List', icon: Store },
    { id: 'AUDIT_LIST', label: 'Audit List', icon: ClipboardList },
    { id: 'PRODUCT_LIST', label: 'Product List', icon: Package },
    { id: 'CERTIFICATES', label: 'Certificates', icon: Award }
  ];

  const requestNav = [
    { id: 'FRANCHISEE_REQUESTS', label: 'Franchisee Request List', icon: FilePlus2 },
    { id: 'STORE_REQUESTS', label: 'Store Request List', icon: FilePlus2 },
    { id: 'PRODUCT_REQUESTS', label: 'Product Request List', icon: FilePlus2 }
  ];

  const outcomeNav = [
    { id: 'PASSED_AUDITS', label: 'Passed Audits', icon: CheckCircle2 },
    { id: 'FAILED_AUDITS', label: 'Failed Audits', icon: ShieldAlert }
  ];

  const allNav = [...mainNav, ...requestNav, ...outcomeNav];

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
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
          active
            ? 'bg-gradient-to-r from-[#c8102e] to-[#a60d26] text-white shadow-md shadow-rose-950/40'
            : 'text-stone-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-stone-500'}`} />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fafaf9] text-stone-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Obsidian Static Desktop Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-72 bg-[#0f1117] text-stone-200 border-r border-white/10 flex flex-col transition-transform duration-200 ease-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNav('DASHBOARD')}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8102e] to-[#8f0b20] flex items-center justify-center shadow-lg shadow-rose-950/50 shrink-0">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white">
                KFC HEADQUARTERS
              </div>
              <div className="text-[10px] text-amber-400/90 font-semibold tracking-wider uppercase">
                Halal Food Authority
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation matching kfcrequest.hfa-portals.com */}
        <nav className="flex-1 px-3.5 py-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Directory
            </div>
            {mainNav.map(renderNavButton)}
          </div>

          <div className="space-y-1 pt-3 border-t border-white/10">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Request Lists
            </div>
            {requestNav.map(renderNavButton)}
          </div>

          <div className="space-y-1 pt-3 border-t border-white/10">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Audit Outcomes
            </div>
            {outcomeNav.map(renderNavButton)}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Submit Request
            </div>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowFranchiseModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Franchisee</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowStoreModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add New Store</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                setShowProductModal(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-200 border border-white/10 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Add New Product</span>
            </button>
          </div>
        </nav>

        {/* Footer Authenticated KFC User + Logout */}
        <div className="p-3.5 m-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1.5 shrink-0">
              <img src="/hfa-logo.png" alt="HFA" className="h-6 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {hqUser?.fullName || hqUser?.username || 'KFC HQ User'}
              </div>
              <div className="text-[10px] text-amber-400/90 truncate">
                {hqUser?.role || 'KFC Headquarters'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-rose-600/20 text-rose-300 hover:text-rose-200 border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Glass Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1.5 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#c8102e]">
                KFC Headquarters Portal
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-stone-900 truncate">
                {allNav.find((n) => n.id === activeScreen)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={refreshAll}
              disabled={isLoading}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 cursor-pointer"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#c8102e]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f1117] hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-rose-400" />
              <span>Add New Product</span>
            </button>
            <button
              type="button"
              onClick={() => setShowStoreModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Store</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFranchiseModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add New Franchisee</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Active Screen */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0f1117]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-5 py-1.5 px-1">
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
                className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-semibold ${
                  active ? 'text-white' : 'text-stone-500'
                }`}
              >
                <div className={`p-1 rounded-lg mb-0.5 ${active ? 'bg-[#c8102e]' : ''}`}>
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
