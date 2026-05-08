import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { siteConfig } from '../../config';

const ProductCard = memo(({ product, viewType = 'grid' }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!inCart) {
      addToCart(product);
    }
  };

  const hasOffer = product.salePrice && product.salePrice < product.price;

  // Si es list view
  if (viewType === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="group flex flex-col sm:flex-row bg-white border border-border-soft rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-300">
        <div className="w-full sm:w-48 aspect-square flex-shrink-0 relative bg-warm overflow-hidden">
          <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {hasOffer && <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Oferta</div>}
        </div>
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <p className="text-xs text-gold font-semibold uppercase tracking-wider mb-1">{product.category}</p>
            <h3 className="font-serif text-lg font-bold text-dark line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              {hasOffer ? (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-accent">{formatPrice(product.salePrice)}</span>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="font-bold text-lg text-dark">{formatPrice(product.price)}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${inCart ? 'bg-green-100 text-green-700' : 'bg-dark text-white hover:bg-[#2e201b]'}`}
            >
              <ShoppingCart size={16} />
              {inCart ? 'En carrito' : 'Añadir'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Vista Grid / Default (Premium)
  return (
    <div className="group flex flex-col bg-white border border-border-soft rounded-[1.25rem] overflow-hidden hover:shadow-soft transition-all duration-300">
      
      {/* Imagen (Fija aspect-[3/4]) */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] bg-warm overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
        />
        
        {/* Badges Flotantes */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="bg-white/90 backdrop-blur-sm text-gold-dark text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 border border-white/50">
              <Star size={10} fill="currentColor" /> Destacado
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles size={10} /> Nuevo
            </span>
          )}
          {hasOffer && (
            <span className="bg-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Oferta
            </span>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 relative bg-white">
        
        <Link to={`/product/${product.id}`} className="flex-1">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
            {product.category || 'Accesorios'}
          </p>
          <h3 className="font-serif text-lg font-bold text-dark leading-snug line-clamp-2 mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          
          <div className="mb-4">
            {hasOffer ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-[1.1rem] text-accent">{formatPrice(product.salePrice)}</span>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="font-bold text-[1.1rem] text-dark">{formatPrice(product.price)}</span>
            )}
          </div>
        </Link>

        {/* Botones de acción siempre visibles en mobile (botones grandes de bloque) */}
        <div className="mt-auto space-y-2">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px] ${
              inCart 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-warm text-dark hover:bg-gold hover:text-white border border-border-soft'
            }`}
          >
            <ShoppingCart size={16} />
            {inCart ? 'En carrito' : 'Añadir al carrito'}
          </button>
          
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name} (${hasOffer ? formatPrice(product.salePrice) : formatPrice(product.price)}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#2e201b] transition-colors min-h-[44px]"
            onClick={(e) => {
              import('../../utils/whatsapp').then(({ trackWhatsAppClick }) => {
                trackWhatsAppClick('whatsapp_click_product', product);
              });
            }}
          >
            <MessageCircle size={16} className="text-green-400" />
            Pedir por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
});

export default ProductCard;
