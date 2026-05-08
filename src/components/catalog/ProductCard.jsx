import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { generateProductWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import { formatPrice } from '../../utils/formatters';

const ProductCard = ({ product, priority = false }) => {
  const { cart, addToCart } = useCart();
  const isInCart = cart.some(item => item.sku === product.sku);

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
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-delicate transition-all duration-300 border border-[#f2e8e5]"
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
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x500?text=Imagen+No+Disponible';
          }}
        />
      </div>

      {/* Contenido (Textos, Precios, Mobile CTA) */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="text-[10px] uppercase tracking-widest text-primary-500 mb-1 font-semibold">
          {product.category}
        </div>
        
        <h3 className="font-serif text-sm sm:text-base md:text-lg text-dark mb-1 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="hidden sm:block text-xs text-gray-500 mb-3 line-clamp-1">
            {product.shortDescription}
          </p>
        )}
        
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.isOffer && product.salePrice ? (
              <>
                <span className="text-base sm:text-lg font-bold text-accent">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold text-dark">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Botones de acción siempre visibles en móvil */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.status === 'agotado'}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] ${
                isInCart 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-dark text-white hover:bg-primary-900 shadow-sm'
              }`}
              aria-label={isInCart ? "Producto en carrito" : "Agregar al carrito"}
            >
              {isInCart ? (
                <>
                  <Check size={16} />
                  En carrito
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Añadir al carrito
                </>
              )}
            </button>
            
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-primary-50 hover:bg-primary-100 text-primary-800 border border-primary-200 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              aria-label="Pedir por WhatsApp"
            >
              <MessageCircle size={16} className="text-green-600" />
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
