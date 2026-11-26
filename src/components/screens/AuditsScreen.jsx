import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  ShieldAlert,
  Search,
  Calendar,
  Eye,
  X
} from 'lucide-react';
import { useHq } from '../../context/HqContext';

const ROUNDS = ['All Rounds', 'Round One', 'Round Two', 'Round Three'];
const YEARS = ['All Years', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

export default function AuditsScreen({ mode = 'ALL' }) {
  const { audits, isLoading } = useHq();

  const [roundFilter, setRoundFilter] = useState('All Rounds');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [franchiseeFilter, setFranchiseeFilter] = useState('ALL');
  const [auditorFilter, setAuditorFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewAudit, setViewAudit] = useState(null);

  const title =
    mode === 'PASSED'
      ? 'Passed List'
      : mode === 'FAILED'
      ? 'Failed List'
      : 'Audit List';

  const franchiseeList = useMemo(() => {
    return Array.from(new Set(audits.map((a) => a.franchisee).filter(Boolean))).sort();
  }, [audits]);

  const auditorList = useMemo(() => {
    return Array.from(new Set(audits.map((a) => a.auditor).filter(Boolean))).sort();
  }, [audits]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return audits.filter((a) => {
      if (mode === 'PASSED' && a.category !== 'Passed') return false;
      if (
        mode === 'FAILED' &&
        a.category !== 'Other Fail' &&
        a.category !== 'L3 Critical Fail'
      ) {
        return false;
      }

      if (roundFilter !== 'All Rounds' && !String(a.session || '').includes(roundFilter)) {
        return false;
      }
      if (yearFilter !== 'All Years' && !String(a.session || '').includes(yearFilter)) {
        return false;
      }
      if (franchiseeFilter !== 'ALL' && a.franchisee !== franchiseeFilter) return false;
      if (auditorFilter !== 'ALL' && a.auditor !== auditorFilter) return false;

      if (q) {
        const hay = `${a.storeName || ''} ${a.branchCode || ''} ${a.address || ''} ${a.franchisee || ''} ${a.auditor || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (startDate || endDate) {
        const parsed = new Date(a.auditDate);
        if (!Number.isNaN(parsed.getTime())) {
          if (startDate && parsed < new Date(startDate)) return false;
          if (endDate && parsed > new Date(`${endDate}T23:59:59`)) return false;
        }
      }

      return true;
    });
  }, [audits, mode, roundFilter, yearFilter, franchiseeFilter, auditorFilter, search, startDate, endDate]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'PASSED'
                ? 'bg-emerald-100 text-emerald-700'
                : mode === 'FAILED'
                ? 'bg-rose-100 text-[#c8102e]'
                : 'bg-stone-900 text-white'
            }`}
          >
            {mode === 'PASSED' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : mode === 'FAILED' ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ClipboardList className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">{title}</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              {filtered.length} matching audit record{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Filters matching kfcrequest.hfa-portals.com (Session Round/Year, Franchisee, Store, Auditor, Beginning/Ending Date) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white outline-none focus:border-[#c8102e]"
          >
            {ROUNDS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white outline-none focus:border-[#c8102e]"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={franchiseeFilter}
            onChange={(e) => setFranchiseeFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white outline-none focus:border-[#c8102e]"
          >
            <option value="ALL">All Franchisees</option>
            {franchiseeList.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <select
            value={auditorFilter}
            onChange={(e) => setAuditorFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-white outline-none focus:border-[#c8102e]"
          >
            <option value="ALL">All Auditors</option>
            {auditorList.map((au) => (
              <option key={au} value={au}>{au}</option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store or code..."
              className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-stone-200 bg-white outline-none focus:border-[#c8102e]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Beginning Date"
              className="w-full h-9 px-3 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:border-[#c8102e]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-semibold">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="Ending Date"
              className="w-full h-9 px-3 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:border-[#c8102e]"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px] text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#0f1117] text-white text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3.5">Store ID</th>
              <th className="py-3 px-3.5">Store Name</th>
              <th className="py-3 px-3.5">Store Address</th>
              <th className="py-3 px-3.5">Store Representative</th>
              <th className="py-3 px-3.5">Auditor</th>
              <th className="py-3 px-3.5">Audit Date</th>
              <th className="py-3 px-3.5">Time In</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-center">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-stone-400">
                  Loading audit records...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-stone-500">
                  No audit records match your filters.
                </td>
              </tr>
            ) : (
              filtered.slice(0, 100).map((a) => (
                <tr key={a._id || a.id} className="hover:bg-stone-50/70">
                  <td className="py-2.5 px-3.5 font-mono font-bold text-stone-800">
                    {a.branchCode || a.storeId || '—'}
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-stone-900">{a.storeName}</td>
                  <td className="py-2.5 px-3.5 text-stone-600 max-w-[200px] truncate">
                    {a.address || '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-stone-700">{a.storeRepresentative || '—'}</td>
                  <td className="py-2.5 px-3.5 font-semibold text-stone-800">{a.auditor}</td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">{a.auditDate}</td>
                  <td className="py-2.5 px-3.5 font-mono">{a.timeIn || '—'}</td>
                  <td className="py-2.5 px-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        a.category === 'Passed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : a.category === 'L3 Critical Fail'
                          ? 'bg-rose-100 text-rose-800'
                          : a.category === 'Other Fail'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {a.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => setViewAudit(a)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#0f1117] hover:text-white text-stone-700 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Detail Modal */}
      {viewAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden">
            <div className="bg-[#0f1117] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold">Audit Details — {viewAudit.storeName}</h3>
              <button
                type="button"
                onClick={() => setViewAudit(null)}
                className="p-1 text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-stone-400 block text-[11px]">Store ID</span><strong>{viewAudit.branchCode || viewAudit.storeId}</strong></div>
                <div><span className="text-stone-400 block text-[11px]">Franchisee</span><strong>{viewAudit.franchisee || '—'}</strong></div>
                <div><span className="text-stone-400 block text-[11px]">Auditor</span><strong>{viewAudit.auditor}</strong></div>
                <div><span className="text-stone-400 block text-[11px]">Audit Date</span><strong>{viewAudit.auditDate}</strong></div>
                <div><span className="text-stone-400 block text-[11px]">Representative</span><strong>{viewAudit.storeRepresentative || '—'}</strong></div>
                <div><span className="text-stone-400 block text-[11px]">Status</span><strong>{viewAudit.category}</strong></div>
              </div>
              {viewAudit.complianceSummary?.auditorNotes && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">Auditor Notes</span>
                  <p className="text-stone-700">{viewAudit.complianceSummary.auditorNotes}</p>
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewAudit(null)}
                  className="px-5 py-2 rounded-xl bg-[#0f1117] text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
