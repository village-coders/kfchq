import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Store,
  Search,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useHq } from '../../context/HqContext';

export default function FranchisesScreen() {
  const {
    franchisees,
    stores,
    isLoading,
    selectedFranchiseName,
    setSelectedFranchiseName,
    setShowFranchiseModal,
    setShowStoreModal
  } = useHq();

  const [franchiseQuery, setFranchiseQuery] = useState('');
  const [storeQuery, setStoreQuery] = useState('');

  // Build unified list of franchises (combining franchisees collection + stores grouped by franchisee)
  const franchiseGroups = useMemo(() => {
    const map = new Map();

    franchisees.forEach((f) => {
      const name = (f.name || f.franchisee || '').trim();
      if (!name) return;
      map.set(name.toLowerCase(), {
        id: f._id || f.id || name,
        name,
        contact: f.contactPerson || f.director || '',
        email: f.email || '',
        stores: []
      });
    });

    stores.forEach((s) => {
      const name = (s.franchisee || 'Unassigned').trim();
      const key = name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { id: key, name, contact: '', email: '', stores: [] });
      }
      map.get(key).stores.push(s);
    });

    return Array.from(map.values()).sort((a, b) => b.stores.length - a.stores.length);
  }, [franchisees, stores]);

  const filteredFranchises = useMemo(() => {
    const q = franchiseQuery.trim().toLowerCase();
    if (!q) return franchiseGroups;
    return franchiseGroups.filter((f) => f.name.toLowerCase().includes(q));
  }, [franchiseGroups, franchiseQuery]);

  // Default to first franchise if none selected
  useEffect(() => {
    if (!selectedFranchiseName && filteredFranchises.length > 0) {
      setSelectedFranchiseName(filteredFranchises[0].name);
    }
  }, [selectedFranchiseName, filteredFranchises, setSelectedFranchiseName]);

  const activeFranchise =
    franchiseGroups.find(
      (f) => f.name.toLowerCase() === String(selectedFranchiseName || '').toLowerCase()
    ) || filteredFranchises[0] || null;

  const visibleStores = useMemo(() => {
    if (!activeFranchise) return [];
    const q = storeQuery.trim().toLowerCase();
    if (!q) return activeFranchise.stores;
    return activeFranchise.stores.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        String(s.branchCode || '').toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        s.postcode?.toLowerCase().includes(q)
    );
  }, [activeFranchise, storeQuery]);

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Franchises &amp; Stores
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Select any franchise group to inspect all KFC stores operating under it
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowStoreModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0f1117] hover:bg-stone-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Request New Store</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFranchiseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Franchise</span>
          </button>
        </div>
      </div>

      {/* Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: All Franchises */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-stone-50/70">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={franchiseQuery}
                onChange={(e) => setFranchiseQuery(e.target.value)}
                placeholder={`Search ${franchiseGroups.length} franchises...`}
                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-stone-200 bg-white focus:border-[#c8102e] outline-none"
              />
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto divide-y divide-stone-100">
            {isLoading ? (
              <div className="p-4 space-y-2.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="h-14 rounded-xl bg-stone-100 animate-pulse" />
                ))}
              </div>
            ) : filteredFranchises.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No matching franchisees found.
              </div>
            ) : (
              filteredFranchises.map((f) => {
                const isSelected = activeFranchise?.name === f.name;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFranchiseName(f.name);
                      setStoreQuery('');
                    }}
                    className={`w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/80 border-l-4 border-[#c8102e]'
                        : 'hover:bg-stone-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-bold truncate ${
                          isSelected ? 'text-[#c8102e]' : 'text-stone-900'
                        }`}
                      >
                        {f.name}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {f.stores.length} store{f.stores.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#c8102e]' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Stores under Selected Franchise */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="bg-[#0f1117] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {activeFranchise?.name || 'Select a Franchise'}
                </h3>
                <p className="text-xs text-stone-400">
                  {visibleStores.length} store{visibleStores.length !== 1 ? 's' : ''} under this franchise
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
                placeholder="Filter stores or branch code..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {visibleStores.length === 0 ? (
              <div className="py-12 text-center text-sm text-stone-500">
                No stores found under this franchise.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {visibleStores.map((store) => {
                  const isCertified = store.halalCertified || store.status === 'Passed';
                  return (
                    <div
                      key={store._id || store.id || store.branchCode}
                      className="p-4 rounded-2xl border border-stone-200/80 hover:border-stone-300 bg-stone-50/40 space-y-2.5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Store className="w-4 h-4 text-[#c8102e] shrink-0" />
                          <div className="font-bold text-sm text-stone-900 truncate">
                            {store.name}
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-bold bg-white border border-stone-200 px-2 py-0.5 rounded-lg text-stone-700 shrink-0">
                          #{store.branchCode || '—'}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-xs text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                        <span className="leading-snug">
                          {store.address || 'Address not recorded'}
                          {store.postcode ? `, ${store.postcode}` : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold ${
                            isCertified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCertified ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {store.status || (isCertified ? 'Certified' : 'Under Review')}
                        </span>
                        <span className="text-stone-400 font-medium">
                          {store.lastAuditDate ? `Audit: ${store.lastAuditDate}` : 'No recent audit'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
