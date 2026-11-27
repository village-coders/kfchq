import React, { useState, useMemo, useEffect } from 'react';
import { Award, Search, CheckCircle2, ShieldAlert, Eye, X, Building2 } from 'lucide-react';
import { useHq } from '../../context/HqContext';
import PaginationBar from '../common/PaginationBar';

export default function CertificatesScreen() {
  const { stores, isLoading } = useHq();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [previewCert, setPreviewCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const certificates = useMemo(() => {
    return stores.map((s) => {
      const isValid = Boolean(s.halalCertified || s.status === 'Passed');
      return {
        id: s._id || s.id || s.branchCode,
        certificateNumber: s.certificateNumber || `HFA-KFC-${s.branchCode || '0000'}`,
        storeName: s.name || 'KFC Store',
        branchCode: s.branchCode || '—',
        franchisee: s.franchisee || '—',
        address: s.address || '',
        postcode: s.postcode || '',
        status: isValid ? 'Valid' : 'Under Review',
        isValid,
        lastAuditDate: s.lastAuditDate || 'Pending'
      };
    });
  }, [stores]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return certificates.filter((c) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'VALID' && c.isValid) ||
        (statusFilter === 'REVIEW' && !c.isValid);
      const matchesSearch =
        !q ||
        c.storeName.toLowerCase().includes(q) ||
        c.franchisee.toLowerCase().includes(q) ||
        c.certificateNumber.toLowerCase().includes(q) ||
        String(c.branchCode).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [certificates, search, statusFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
          Halal Certificates Registry
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          Inspect active HFA Halal certificates issued across all KFC franchises and stores
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: `All (${certificates.length})` },
            { id: 'VALID', label: `Valid (${certificates.filter((c) => c.isValid).length})` },
            { id: 'REVIEW', label: `Under Review (${certificates.filter((c) => !c.isValid).length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#0f1117] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate #, store, or franchisee..."
            className="w-full h-10 pl-10 pr-3.5 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#c8102e] outline-none"
          />
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-36 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-500">
            No matching certificates found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-stone-200/80 hover:border-amber-300 bg-gradient-to-br from-white to-stone-50/70 p-4 space-y-3 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        cert.isValid
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-stone-900 truncate">
                        {cert.certificateNumber}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">{cert.franchisee}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      cert.isValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cert.isValid ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <ShieldAlert className="w-3 h-3" />
                    )}
                    {cert.status}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-stone-900 truncate">
                    {cert.storeName} (#{cert.branchCode})
                  </div>
                  <div className="text-xs text-stone-500 truncate mt-0.5">
                    {cert.address || 'UK Certified Restaurant'}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Last Audit: {cert.lastAuditDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewCert(cert)}
                    className="text-xs font-bold text-[#c8102e] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
        <PaginationBar
          totalItems={filtered.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[12, 18, 36, 72]}
          itemLabel="certificates"
        />
      </div>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border-4 border-amber-500/40 overflow-hidden">
            <div className="bg-[#0f1117] text-white px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Official HFA Certificate Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 text-center space-y-4 bg-gradient-to-b from-amber-50/30 to-white">
              <img
                src="/hfa-logo.png"
                alt="HFA Approved"
                className="h-16 w-auto mx-auto object-contain"
              />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                  Certificate of Halal Compliance
                </div>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                  {previewCert.storeName}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 flex items-center justify-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#c8102e]" />
                  <span>{previewCert.franchisee}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">Certificate No:</span>
                  <strong className="font-mono text-stone-900">{previewCert.certificateNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Branch Code:</span>
                  <strong className="font-mono text-stone-900">{previewCert.branchCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <strong className={previewCert.isValid ? 'text-emerald-700' : 'text-amber-700'}>
                    {previewCert.status}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Last Audit Date:</span>
                  <strong className="text-stone-900">{previewCert.lastAuditDate}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="px-6 py-2.5 rounded-xl bg-[#0f1117] hover:bg-stone-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
