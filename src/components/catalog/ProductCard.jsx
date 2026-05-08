import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { siteConfig } from '../../config';
import { generateProductWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';

const ProductCard = ({ product, priority = false }) => {
  const { addToCart } = useCart();

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = generateProductWhatsAppMessage(product);
    openWhatsApp(message, 'whatsapp_click_product');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-delicate transition-all duration-500 border border-[#f2e8e5]"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#fdf8f6]">
        {/* Etiquetas Elegantes */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary-50 text-primary-700 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm border border-primary-200 backdrop-blur-md">
              Nuevo
            </span>
          )}
          {product.isOffer && (
            <span className="bg-accent text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
              Oferta
            </span>
          )}
        </div>
        
        {product.status === 'agotado' && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <span className="bg-dark text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full shadow-lg">
              Agotado
            </span>
          </div>
        )}

        {/* Imagen Optimizada */}
        <img
          src={product.image || 'https://via.placeholder.com/400x500?text=Lumina'}
          alt={product.name}
          width="400"
          height="500"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x500?text=Imagen+No+Disponible';
          }}
        />
        
        {/* Acciones Rápidas (Desktop Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-dark/60 to-transparent hidden md:flex items-end justify-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.status === 'agotado'}
            className="flex-1 bg-white text-dark py-2 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={16} />
            Agregar
          </button>
        </div>
      </div>

      {/* Contenido (Textos, Precios, Mobile CTA) */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="text-[10px] uppercase tracking-widest text-primary-500 mb-1.5 font-semibold">
          {product.category}
        </div>
        
        <h3 className="font-serif text-base sm:text-lg text-dark mb-2 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2 mb-4">
            {product.isOffer && product.salePrice ? (
              <>
                <span className="text-lg font-bold text-accent">
                  {siteConfig.currencySymbol}{product.salePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {siteConfig.currencySymbol}{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-dark">
                {siteConfig.currencySymbol}{product.price}
              </span>
            )}
          </div>
          
          {/* Botón CTA explícito para WhatsApp en móvil y escritorio */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-primary-50 hover:bg-primary-100 text-primary-800 border border-primary-200 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} className="text-green-600" />
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
