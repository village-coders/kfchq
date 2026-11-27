import React, { useState, useMemo, useEffect } from 'react';
import { Package, Search, Plus, Snowflake, Thermometer, Box, CheckCircle2 } from 'lucide-react';
import { useHq } from '../../context/HqContext';
import PaginationBar from '../common/PaginationBar';

const CATEGORY_TABS = ['All', 'Frozen', 'Chilled', 'Ambient'];

export default function ProductsScreen() {
  const { products, isLoading, setShowProductModal } = useHq();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length, Frozen: 0, Chilled: 0, Ambient: 0 };
    products.forEach((p) => {
      const cat = p.category || 'Ambient';
      if (counts[cat] !== undefined) counts[cat] += 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const cat = p.category || 'Ambient';
      const matchesCat =
        activeCategory === 'All' || cat.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.supplier?.toLowerCase().includes(q) ||
        p.manufacturer?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, search, activeCategory]);

  const getCategoryIcon = (cat) => {
    if (cat === 'Frozen') return Snowflake;
    if (cat === 'Chilled') return Thermometer;
    return Box;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Approved Halal Products
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Browse all HFA-approved KFC products or request approval for a new product
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowProductModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#c8102e] hover:bg-[#a60d26] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#0f1117] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat} ({categoryCounts[cat] ?? 0})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name, supplier, or code..."
            className="w-full h-10 pl-10 pr-3.5 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:border-[#c8102e] outline-none"
          />
        </div>
      </div>

      {/* Product Grid / Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-900">{filtered.length}</strong> of{' '}
            <strong className="text-stone-900">{products.length}</strong> products
          </span>
        </div>

        {isLoading ? (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-24 rounded-2xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-500">
            No products match your search criteria.
          </div>
        ) : (
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filtered
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((prod, idx) => {
              const cat = prod.category || 'Ambient';
              const CatIcon = getCategoryIcon(cat);
              return (
                <div
                  key={prod._id || prod.id || idx}
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-rose-200 bg-stone-50/40 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Package className="w-4 h-4 text-[#c8102e] shrink-0" />
                      <h4 className="font-bold text-sm text-stone-900 truncate">{prod.name}</h4>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        cat === 'Frozen'
                          ? 'bg-sky-100 text-sky-800'
                          : cat === 'Chilled'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <CatIcon className="w-3 h-3" />
                      {cat}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 truncate">
                    Supplier: <strong>{prod.supplier || prod.manufacturer || 'HFA Approved'}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      HFA Approved
                    </span>
                    {prod.code && (
                      <span className="font-mono text-stone-400">{prod.code}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <PaginationBar
          totalItems={filtered.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[12, 18, 36, 72]}
          itemLabel="products"
        />
      </div>
    </div>
  );
}
