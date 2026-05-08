import React, { useState, useEffect, useMemo } from 'react';
import { Filter, LayoutGrid, Rows3, Columns4 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
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
    return localStorage.getItem('catalog_columns') || '4';
  });
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Save columns preference
  useEffect(() => {
    localStorage.setItem('catalog_columns', columnsView);
  }, [columnsView]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(16);
  }, [searchTerm, activeCategory, sortBy, minPrice, maxPrice]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter (Normalized)
    if (searchTerm) {
      const query = normalizeText(searchTerm);
      result = result.filter(p => 
        normalizeText(p.name).includes(query) || 
        (p.description && normalizeText(p.description).includes(query)) ||
        normalizeText(p.sku).includes(query) ||
        (p.category && normalizeText(p.category).includes(query))
      );
    }

    // Category filter
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    // Price Filter
    if (minPrice !== '') {
      result = result.filter(p => (p.salePrice || p.price) >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(p => (p.salePrice || p.price) <= parseFloat(maxPrice));
    }

    // Sort - creating a copy to not mutate
    const sortedResult = [...result];
    sortedResult.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high': return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'name-asc': return a.name.localeCompare(b.name);
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

  const loadMore = () => {
    setVisibleCount(prev => prev + 16);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setVisibleCount(16);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-10 pb-24">
      <Helmet>
        <title>Catálogo Completo | {siteConfig.siteName}</title>
        <meta name="description" content="Explora nuestro catálogo de bisutería y accesorios. Encuentra aretes, collares, pulseras y sets exclusivos." />
      </Helmet>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-[#eaddd7] pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-dark mb-2">Colección Exclusiva</h1>
            <p className="text-primary-600 font-medium tracking-wide">
              Mostrando {visibleProducts.length} de {filteredProducts.length} piezas
            </p>
          </div>
          
          <div className="w-full md:w-auto flex items-center justify-between gap-4">
            {/* Selector de Columnas */}
            <div className="flex items-center bg-white border border-[#eaddd7] rounded-xl p-1 shadow-sm">
              <button 
                onClick={() => setColumnsView('1')}
                className={`p-2 rounded-lg transition-colors ${columnsView === '1' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-dark'}`}
                aria-label="Vista de 1 columna"
              >
                <Rows3 size={18} />
              </button>
              <button 
                onClick={() => setColumnsView('2')}
                className={`p-2 rounded-lg transition-colors ${columnsView === '2' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-dark'}`}
                aria-label="Vista de 2 columnas"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setColumnsView('4')}
                className={`hidden md:block p-2 rounded-lg transition-colors ${columnsView === '4' ? 'bg-primary-100 text-primary-700' : 'text-gray-400 hover:text-dark'}`}
                aria-label="Vista de 4 columnas"
              >
                <Columns4 size={18} />
              </button>
            </div>

            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#eaddd7] text-dark rounded-xl font-medium shadow-sm hover:bg-gray-50"
            >
              <Filter size={18} className="text-primary-500" />
              Filtros
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* Left Sidebar: Filters + Promo */}
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
              isMobileFiltersOpen={isMobileFiltersOpen}
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
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                <ProductGrid 
                  products={visibleProducts} 
                  columnsView={columnsView} 
                  onClear={handleClearFilters}
                  hasFiltersActive={searchTerm || activeCategory || minPrice || maxPrice || sortBy !== 'featured'}
                />
                
                {hasMore && (
                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={loadMore}
                      className="px-8 py-3 bg-white border-2 border-primary-200 text-primary-800 font-bold rounded-full hover:bg-primary-50 transition-colors shadow-sm"
                    >
                      Cargar más productos
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
