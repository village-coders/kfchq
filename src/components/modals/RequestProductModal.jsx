import React, { useState } from 'react';
import { X, PackagePlus, Snowflake, Thermometer, Box, Loader2 } from 'lucide-react';
import { useHq } from '../../context/HqContext';

const CATEGORIES = [
  { value: 'Frozen', label: 'Frozen', desc: 'Freezer storage & frozen poultry/sides', icon: Snowflake },
  { value: 'Chilled', label: 'Chilled', desc: 'Chiller / cold-chain ingredients', icon: Thermometer },
  { value: 'Ambient', label: 'Ambient', desc: 'Dry store, sauces, spices & drinks', icon: Box }
];

export default function RequestProductModal() {
  const { showProductModal, setShowProductModal, submitProductRequest, isSubmitting } = useHq();
  const [productCode, setProductCode] = useState('');
  const [supplier, setSupplier] = useState('');
  const [code, setCode] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [siteEcCode, setSiteEcCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Frozen');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState(['', '', '', '', '']);

  if (!showProductModal) return null;

  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0];
    setFiles((prev) => {
      const next = [...prev];
      next[index] = file ? file.name : '';
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productCategory || !supplier.trim()) return;
    const ok = await submitProductRequest({
      productCode,
      supplier,
      code,
      manufacturer,
      siteEcCode,
      productName,
      productCategory,
      notes,
      files: files.filter(Boolean)
    });
    if (ok) {
      setProductCode('');
      setSupplier('');
      setCode('');
      setManufacturer('');
      setSiteEcCode('');
      setProductName('');
      setProductCategory('Frozen');
      setNotes('');
      setFiles(['', '', '', '', '']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f1117] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c8102e] flex items-center justify-center">
              <PackagePlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">New Product</h3>
              <p className="text-[11px] text-stone-400">Enter Details — Submit for HFA Approval</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowProductModal(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Category <span className="text-[#c8102e]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const selected = productCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setProductCategory(cat.value)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-[#c8102e] bg-rose-50/70 ring-2 ring-rose-200'
                        : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${selected ? 'text-[#c8102e]' : 'text-stone-400'}`} />
                    <div className={`text-xs font-bold ${selected ? 'text-[#c8102e]' : 'text-stone-800'}`}>
                      {cat.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Name <span className="text-[#c8102e]">*</span>
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Supplier <span className="text-[#c8102e]">*</span>
              </label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Enter supplier name"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Product Code</label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="KFC Product Code"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Reference Code"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Manufacturer name"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Site EC Code</label>
              <input
                type="text"
                value={siteEcCode}
                onChange={(e) => setSiteEcCode(e.target.value)}
                placeholder="e.g. UK 4022 EC"
                className="w-full h-10 px-3.5 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Comment</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter compliance notes or Halal certificate details..."
              className="w-full p-3 text-sm rounded-xl border border-stone-200 focus:border-[#c8102e] outline-none"
            />
          </div>

          {/* 5 File Uploads matching kfcrequest.hfa-portals.com */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Supporting Files (up to 5 attachments)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {files.map((fname, idx) => (
                <div key={idx} className="p-2 rounded-xl border border-dashed border-stone-300 bg-stone-50/70">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(idx, e)}
                    className="w-full text-[11px] text-stone-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-[#0f1117] file:text-white"
                  />
                  {fname && <div className="text-[10px] text-emerald-700 truncate mt-1">{fname}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
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
