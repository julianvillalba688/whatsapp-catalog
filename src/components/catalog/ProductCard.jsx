import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Star, Sparkles, Heart, TrendingUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { siteConfig } from '../../config';

// Determinar badge basado en propiedades del producto
const getProductBadge = (product) => {
  if (product.isOffer && product.salePrice && product.salePrice < product.price) return { label: 'Oferta', style: 'bg-rose-500/90 text-white', icon: null };
  if (product.isBestSeller) return { label: 'M\u00e1s vendido', style: 'bg-dark/90 text-white', icon: <TrendingUp size={9} /> };
  if (product.isFavorite) return { label: 'Favorito', style: 'bg-nude/80 text-[#8a4a4a]', icon: <Heart size={9} fill="currentColor" /> };
  if (product.isNew) return { label: 'Nuevo', style: 'bg-gold/90 text-white', icon: <Sparkles size={9} /> };
  if (product.featured) return { label: 'Destacado', style: 'bg-white/90 text-gold-dark border border-gold/20', icon: <Star size={9} fill="currentColor" /> };
  return null;
};

const ProductCard = memo(({ product, viewType = 'grid' }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some(item => item.id === product.id);
  const badge = getProductBadge(product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) addToCart(product);
  };

  const hasOffer = product.salePrice && product.salePrice < product.price;

  // Si es list view
  if (viewType === 'list') {
    return (
      <Link to={`/product/${product.slug || product.id}`} className="group flex flex-col sm:flex-row bg-white border border-border-soft rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-300">
        <div className="w-full sm:w-48 aspect-square flex-shrink-0 relative bg-warm overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=75';
            }}
          />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
              }}
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
    <div className="group flex flex-col bg-white border border-border-soft rounded-[1.25rem] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_48px_-8px_rgba(28,24,22,0.18),0_2px_12px_-4px_rgba(200,169,106,0.12)]">


      {/* Link imagen */}
      <Link to={`/product/${product.slug || product.id}`} className="relative block aspect-[3/4] bg-warm overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" 
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=75';
          }}
        />
        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors duration-300" />
        {/* Badge único */}
        {badge && (
          <span className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${badge.style}`}>
            {badge.icon}{badge.label}
          </span>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 relative bg-white">
        
        <Link to={`/product/${product.slug || product.id}`} className="flex-1">
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

        {/* Botones de acción */}
        <div className="mt-auto space-y-2">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 min-h-[44px] ${
              inCart 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-dark text-white hover:bg-[#2e201b] shadow-sm hover:shadow-soft'
            }`}
          >
            <ShoppingCart size={15} />
            {inCart ? 'En carrito \u2713' : 'Añadir al carrito'}
          </button>
          
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa: ${product.name} (${hasOffer ? formatPrice(product.salePrice) : formatPrice(product.price)}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebe5d] transition-colors min-h-[44px] shadow-sm"
          >
            <MessageCircle size={15} />
            Pedir por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
});

export default ProductCard;
