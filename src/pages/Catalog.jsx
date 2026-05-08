import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Filter, LayoutGrid, Rows3, Columns4, Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../components/catalog/ProductGrid';
import ProductFilters from '../components/catalog/ProductFilters';
import PromoBanner from '../components/ui/PromoBanner';
import { siteConfig } from '../config';
import { normalizeText } from '../utils/formatters';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // UI State
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [columnsView, setColumnsView] = useState(() => {
    try { return localStorage.getItem('catalog_columns') || '4'; } catch { return '4'; }
  });
  const [visibleCount, setVisibleCount] = useState(16);

  // Initialize from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat.charAt(0).toUpperCase() + cat.slice(1));
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Save columns preference
  useEffect(() => {
    try { localStorage.setItem('catalog_columns', columnsView); } catch {}
  }, [columnsView]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(16);
  }, [searchTerm, activeCategory, sortBy, minPrice, maxPrice]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileFiltersOpen]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const query = normalizeText(searchTerm);
      result = result.filter(p =>
        normalizeText(p.name || '').includes(query) ||
        (p.description && normalizeText(p.description).includes(query)) ||
        normalizeText(p.sku || '').includes(query) ||
        (p.category && normalizeText(p.category).includes(query))
      );
    }

    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    if (minPrice !== '') {
      result = result.filter(p => (p.salePrice || p.price) >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => (p.salePrice || p.price) <= parseFloat(maxPrice));
    }

    const sortedResult = [...result];
    sortedResult.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high': return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'name-asc': return (a.name || '').localeCompare(b.name || '');
        case 'newest': return (b.isNew === true ? 1 : 0) - (a.isNew === true ? 1 : 0);
        case 'featured':
        default:
          return (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0);
      }
    });

    return sortedResult;
  }, [products, searchTerm, activeCategory, sortBy, minPrice, maxPrice]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;
  const hasFiltersActive = !!(searchTerm || activeCategory || minPrice || maxPrice || sortBy !== 'featured');

  const loadMore = useCallback(() => {
    setVisibleCount(prev => prev + 16);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setVisibleCount(16);
  }, []);

  const drawerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-10 pb-24">
      <Helmet>
        <title>Catálogo Completo | {siteConfig.siteName}</title>
        <meta name="description" content="Explora nuestro catálogo de bisutería y accesorios. Encuentra aretes, collares, pulseras y sets exclusivos." />
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Cabecera premium ── */}
        <div className="bg-[#1C1816] rounded-3xl p-8 md:p-12 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nude/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-gold font-bold tracking-widest uppercase text-xs mb-3">✦ Colección Completa</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">Piezas exclusivas</h1>
              <p className="text-white/60 font-light text-lg max-w-md">
                Explora nuestra selección cuidada de bisutería y encuentra el accesorio perfecto para ti.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <p className="text-sm font-medium text-white">
                Mostrando <span className="font-bold text-gold">{visibleProducts.length}</span> de {filteredProducts.length}
              </p>
            </div>
          </div>
        </div>

        {/* ── Desktop Controls Bar ── */}
        <div className="hidden lg:flex justify-end mb-6">
          <div className="flex items-center bg-white border border-[#eaddd7] rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setColumnsView('2')}
              className={`p-2 rounded-lg transition-colors ${columnsView === '2' ? 'bg-warm text-dark' : 'text-gray-400 hover:text-dark'}`}
              aria-label="Vista de 2 columnas"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setColumnsView('4')}
              className={`p-2 rounded-lg transition-colors ${columnsView === '4' ? 'bg-warm text-dark' : 'text-gray-400 hover:text-dark'}`}
              aria-label="Vista de 4 columnas"
            >
              <Columns4 size={18} />
            </button>
          </div>
        </div>

        {/* ── Mobile Search & Filters Bar ── */}
        <div className="lg:hidden flex flex-col gap-3 mb-6">
          <div className="flex gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Buscar joyas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-sm text-gray-800 min-h-[44px]"
                aria-label="Buscar productos"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark p-1"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm min-h-[44px] transition-colors ${
                hasFiltersActive
                  ? 'bg-dark text-white border-2 border-dark'
                  : 'bg-white text-dark border border-[#eaddd7] hover:border-dark'
              }`}
              aria-label="Abrir filtros"
            >
              <SlidersHorizontal size={18} />
              <span className="text-sm">Filtros</span>
              {hasFiltersActive && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>

            {/* Column selector */}
            <div className="flex items-center bg-white border border-[#eaddd7] rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setColumnsView('1')}
                className={`p-2 rounded-lg transition-colors ${columnsView === '1' ? 'bg-warm text-dark' : 'text-gray-400'}`}
                aria-label="Vista de lista"
              >
                <Rows3 size={18} />
              </button>
              <button
                onClick={() => setColumnsView('2')}
                className={`p-2 rounded-lg transition-colors ${columnsView !== '1' ? 'bg-warm text-dark' : 'text-gray-400'}`}
                aria-label="Vista de cuadrícula"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>

          {/* Active filters pills */}
          {hasFiltersActive && (
            <div className="flex flex-wrap gap-2">
              {activeCategory && (
                <span className="flex items-center gap-1 px-3 py-1 bg-dark text-white text-xs font-medium rounded-full">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('')} aria-label={`Quitar filtro ${activeCategory}`}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="flex items-center gap-1 px-3 py-1 bg-dark text-white text-xs font-medium rounded-full">
                  Precio filtrado
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} aria-label="Quitar filtro de precio">
                    <X size={12} />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="flex items-center gap-1 px-3 py-1 bg-dark text-white text-xs font-medium rounded-full">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} aria-label="Quitar búsqueda">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 text-xs text-gray-500 hover:text-dark border border-[#eaddd7] rounded-full transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile Filter Drawer (Framer Motion) ── */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Panel de filtros">
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsMobileFiltersOpen(false)}
              />

              {/* Drawer Panel */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#fcf9f8] shadow-2xl flex flex-col"
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#eaddd7] flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-dark">Filtros</h2>
                    {hasFiltersActive && (
                      <p className="text-xs text-gold font-medium mt-0.5">Filtros activos</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 text-gray-500 hover:text-dark hover:bg-warm rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Cerrar filtros"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-7">
                  {/* Category */}
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Categoría</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveCategory('')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border min-h-[40px] ${
                          !activeCategory ? 'bg-dark text-white border-dark' : 'bg-white text-dark border-[#eaddd7] hover:border-dark'
                        }`}
                      >
                        Todas
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border min-h-[40px] ${
                            activeCategory === cat ? 'bg-dark text-white border-dark' : 'bg-white text-dark border-[#eaddd7] hover:border-dark'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Rango de Precio</h3>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          placeholder="Mín"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm min-h-[44px]"
                        />
                      </div>
                      <span className="text-gray-400 font-light">–</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input
                          type="number"
                          placeholder="Máx"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 bg-white border border-[#eaddd7] rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Ordenar por</h3>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-[#eaddd7] rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-gold/50 text-dark min-h-[44px]"
                        aria-label="Ordenar productos"
                      >
                        <option value="featured">Destacados primero</option>
                        <option value="newest">Más recientes</option>
                        <option value="price-low">Precio: Menor a Mayor</option>
                        <option value="price-high">Precio: Mayor a Menor</option>
                        <option value="name-asc">Nombre: A – Z</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-[#eaddd7] flex-shrink-0 space-y-2.5">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full bg-dark text-white py-4 rounded-xl font-bold hover:bg-[#2e201b] transition-colors shadow-md min-h-[48px] text-base"
                  >
                    Ver {filteredProducts.length} productos
                  </button>
                  <button
                    onClick={() => { handleClearFilters(); setIsMobileFiltersOpen(false); }}
                    className="w-full py-3.5 text-dark font-medium hover:bg-warm rounded-xl transition-colors border border-[#eaddd7] min-h-[48px]"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* Left Sidebar: Filters + Promo — Desktop only */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            <ProductFilters
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              isMobileFiltersOpen={false}
              setIsMobileFiltersOpen={setIsMobileFiltersOpen}
              onClear={handleClearFilters}
            />
            <div className="sticky top-[500px]">
              <PromoBanner />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-[1.25rem] overflow-hidden bg-white border border-border-soft">
                    <div className="skeleton aspect-[3/4]" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-3 w-1/3 rounded-full" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <ProductGrid
                  products={visibleProducts}
                  columnsView={columnsView}
                  onClear={handleClearFilters}
                  hasFiltersActive={hasFiltersActive}
                />

                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button
                      onClick={loadMore}
                      className="px-10 py-3.5 bg-white border-2 border-[#eaddd7] text-dark font-bold rounded-full hover:border-dark hover:bg-warm transition-all duration-200 shadow-sm min-h-[48px]"
                    >
                      Cargar {Math.min(16, filteredProducts.length - visibleCount)} productos más
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
