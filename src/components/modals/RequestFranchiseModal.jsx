import React, { useState } from 'react';
import { X, Building2, Loader2 } from 'lucide-react';
import { useHq } from '../../context/HqContext';

export default function RequestFranchiseModal() {
  const { showFranchiseModal, setShowFranchiseModal, submitFranchiseRequest, isSubmitting } = useHq();
  const [franchiseeName, setFranchiseeName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');

  if (!showFranchiseModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!franchiseeName.trim() || !contactPerson.trim()) return;
    const ok = await submitFranchiseRequest({
      franchiseeName,
      contactPerson,
      contactEmail,
      contactPhone,
      address,
      postcode,
      notes
    });
    if (ok) {
      setFranchiseeName('');
      setContactPerson('');
      setContactEmail('');
      setContactPhone('');
      setAddress('');
      setPostcode('');
      setNotes('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f1117] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-stone-950" />
            </div>
            <div>
              <h3 className="text-base font-bold">Request New Franchise</h3>
              <p className="text-[11px] text-stone-400">
                Onboard a new franchise partner group with HFA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFranchiseModal(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Franchise / Partner Group Name <span className="text-[#c8102e]">*</span>
            </label>
            <input
              type="text"
              required
              value={franchiseeName}
              onChange={(e) => setFranchiseeName(e.target.value)}
              placeholder="e.g. Horizon Foods Group Ltd"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Primary Contact Person <span className="text-[#c8102e]">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Operations Director"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+44 ..."
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="director@franchise-group.com"
              className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registered Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Head office address"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="SW1A 1AA"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Additional Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial store count, target onboarding date, or notes..."
              className="w-full p-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] focus:ring-2 focus:ring-rose-100 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowFranchiseModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c8102e] hover:bg-[#a60d26] disabled:opacity-70 inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Franchise Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
