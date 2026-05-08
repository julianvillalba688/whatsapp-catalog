import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const ProductFilters = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  searchTerm, 
  setSearchTerm,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isMobileFiltersOpen,
  setIsMobileFiltersOpen,
  onClear
}) => {
  
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="font-serif text-lg mb-3 text-dark font-semibold">Buscar</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar joyas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-primary-400" size={18} />
        </div>
      </div>

      {/* Categories Dropdown */}
      <div>
        <h3 className="font-serif text-lg mb-3 text-dark font-semibold">Categoría</h3>
        <div className="relative">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white border border-[#eaddd7] rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm text-gray-700"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-primary-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-serif text-lg mb-3 text-dark font-semibold">Rango de Precio</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full pl-7 pr-2 py-2 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm text-sm"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-7 pr-2 py-2 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-serif text-lg mb-3 text-dark font-semibold">Ordenar por</h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white border border-[#eaddd7] rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm text-gray-700"
          >
            <option value="featured">Destacados</option>
            <option value="newest">Más recientes</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A - Z</option>
          </select>
          <ChevronDown className="absolute right-3 top-2.5 text-primary-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Clear Filters Button */}
      {onClear && (
        <button 
          onClick={onClear}
          className="w-full py-2.5 mt-4 text-primary-600 font-medium hover:bg-primary-50 rounded-xl transition-colors border border-transparent hover:border-primary-100"
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white shadow-delicate">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-[#fcf9f8] p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#eaddd7]">
              <h2 className="text-2xl font-serif font-bold text-dark">Filtros</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-primary-500 hover:bg-primary-50 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <FilterContent />
            
            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full mt-8 bg-dark text-white py-3 rounded-xl hover:bg-primary-900 transition-colors shadow-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
