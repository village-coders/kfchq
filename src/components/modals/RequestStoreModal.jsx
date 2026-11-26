import React, { useState, useMemo, useEffect } from 'react';
import { X, Store, Building2, MapPin, Loader2 } from 'lucide-react';
import { useHq } from '../../context/HqContext';

export default function RequestStoreModal() {
  const {
    showStoreModal,
    setShowStoreModal,
    franchisees,
    stores,
    selectedFranchiseName,
    submitStoreRequest,
    isSubmitting
  } = useHq();

  const franchiseOptions = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const f of franchisees) {
      const name = (f.name || f.franchisee || '').trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        list.push(name);
      }
    }
    for (const s of stores) {
      const name = (s.franchisee || '').trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        list.push(name);
      }
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [franchisees, stores]);

  const [franchisee, setFranchisee] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [storeType, setStoreType] = useState('New Store');

  useEffect(() => {
    if (showStoreModal) {
      setFranchisee(selectedFranchiseName || franchiseOptions[0] || '');
    }
  }, [showStoreModal, selectedFranchiseName, franchiseOptions]);

  if (!showStoreModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!franchisee.trim() || !storeName.trim() || !address.trim()) return;
    const ok = await submitStoreRequest({
      franchisee,
      branchCode,
      storeName,
      address,
      postcode,
      contactPerson,
      contactPhone,
      openingDate,
      storeType
    });
    if (ok) {
      setBranchCode('');
      setStoreName('');
      setAddress('');
      setPostcode('');
      setContactPerson('');
      setContactPhone('');
      setOpeningDate('');
      setStoreType('New Store');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f1117] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">New Store</h3>
              <p className="text-[11px] text-stone-400">Enter Details — Request Store Onboarding</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowStoreModal(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Franchisee Name <span className="text-[#c8102e]">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                required
                value={franchisee}
                onChange={(e) => setFranchisee(e.target.value)}
                className="w-full h-10 pl-10 pr-3.5 text-sm rounded-xl border border-stone-200 bg-white focus:border-[#c8102e] outline-none"
              >
                <option value="" disabled>Select Franchisee...</option>
                {franchiseOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Branch Code</label>
              <input
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                placeholder="e.g. 8755"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Store Name <span className="text-[#c8102e]">*</span>
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Manchester - Oxford Road"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Address <span className="text-[#c8102e]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address"
                className="w-full h-10 pl-10 pr-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Post Code</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="e.g. M1 5QA"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Store / Area Manager"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+44 ..."
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Open Date</label>
              <input
                type="date"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Store Type <span className="text-[#c8102e]">*</span>
            </label>
            <select
              required
              value={storeType}
              onChange={(e) => setStoreType(e.target.value)}
              className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 bg-white focus:border-[#c8102e] outline-none"
            >
              <option value="New Store">New Store</option>
              <option value="Convert Store">Convert Store</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowStoreModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c8102e] hover:bg-[#a60d26] disabled:opacity-70 inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
