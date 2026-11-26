import React, { useState, useEffect } from 'react';
import { Plus, Building2, PackagePlus, Store, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useHq } from '../../context/HqContext';

export default function RequestsScreen({ initialFilter = 'ALL' }) {
  const { requests, isLoading, setShowProductModal, setShowFranchiseModal, setShowStoreModal } = useHq();
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const headingTitle =
    filter === 'FRANCHISE'
      ? 'Request List (Franchisee)'
      : filter === 'STORE'
      ? 'Request List (Store)'
      : filter === 'PRODUCT'
      ? 'Request List (Products)'
      : 'HQ Requests Center';

  const filtered = requests.filter((r) => {
    if (filter === 'ALL') return true;
    if (filter === 'PRODUCT') return String(r.requestType || '').toLowerCase().includes('product');
    if (filter === 'FRANCHISE') return String(r.requestType || '').toLowerCase().includes('franchise');
    if (filter === 'STORE') return String(r.requestType || '').toLowerCase().includes('store');
    return true;
  });

  const getStatusBadge = (status) => {
    const s = String(status || 'Pending').toLowerCase();
    if (s === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
          <XCircle className="w-3 h-3" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">{headingTitle}</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Track new product approvals and franchise onboarding requests sent to HFA Admin
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0f1117] hover:bg-stone-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PackagePlus className="w-4 h-4 text-rose-400" />
            <span>Request Product</span>
          </button>
          <button
            type="button"
            onClick={() => setShowStoreModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Request Store</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFranchiseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Request Franchise</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'ALL', label: `All Requests (${requests.length})` },
          { id: 'PRODUCT', label: 'Product Requests' },
          { id: 'STORE', label: 'Store Requests' },
          { id: 'FRANCHISE', label: 'Franchise Requests' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              filter === t.id
                ? 'bg-[#0f1117] text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-20 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <p className="text-sm text-stone-500">No requests found for this filter.</p>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 rounded-xl bg-[#c8102e] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Request
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filtered.map((req, idx) => (
              <div
                key={req._id || req.id || idx}
                className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-[#c8102e] border border-rose-200/70">
                      {req.requestType || 'Store Request'}
                    </span>
                    {req.productCategory && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                        Category: {req.productCategory}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400">{req.date || ''}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-stone-900 truncate">
                    {req.productName || req.franchisee || req.storeName}
                  </div>
                  <div className="text-xs text-stone-500">
                    {req.supplier ? `Supplier: ${req.supplier}` : req.contactPerson ? `Contact: ${req.contactPerson}` : req.address}
                    {req.notes ? ` — ${req.notes}` : ''}
                  </div>
                </div>
                <div className="shrink-0">{getStatusBadge(req.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
