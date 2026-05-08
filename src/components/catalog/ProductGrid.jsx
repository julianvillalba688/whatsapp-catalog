import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, columnsView = '4', onClear, hasFiltersActive }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#f2e8e5] shadow-sm text-center px-4">
        <div className="text-6xl mb-6 opacity-80">💍</div>
        <h3 className="text-2xl font-serif text-dark font-semibold mb-3">No encontramos productos</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          No hay piezas que coincidan con los filtros seleccionados. Intenta ajustar la búsqueda o limpiar los filtros.
        </p>
        {hasFiltersActive && (
          <button 
            onClick={onClear}
            className="px-6 py-2.5 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-colors"
          >
            Limpiar todos los filtros
          </button>
        )}
      </div>
    );
  }

  // Lógica responsiva de columnas
  let gridClasses = "grid gap-4 sm:gap-6 lg:gap-8 ";
  
  if (columnsView === '1') {
    gridClasses += "grid-cols-1 max-w-md mx-auto";
  } else if (columnsView === '2') {
    gridClasses += "grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto";
  } else {
    // Default: 4 columns in desktop, 2 in tablet, 2 in mobile (never 4 in mobile)
    gridClasses += "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  }

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.sku} 
          product={product} 
          priority={index < 4} // Eager load the first 4 images
        />
      ))}
    </div>
  );
};

export default ProductGrid;
