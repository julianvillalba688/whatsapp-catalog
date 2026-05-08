import React from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { generateWhatsAppMessage, openWhatsApp } from '../../utils/whatsapp';
import { siteConfig } from '../../config';
import { formatPrice } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const message = generateWhatsAppMessage(cart, cartTotal);
    openWhatsApp(message);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#fcf9f8] shadow-2xl z-50 flex flex-col border-l border-[#eaddd7]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-[#eaddd7] shadow-sm relative">
              <div>
                <p className="text-gold font-bold tracking-widest uppercase text-[10px] mb-1">✦ Lumina Accesorios</p>
                <h2 className="text-2xl font-serif font-bold text-dark">Tu Colección</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2.5 hover:bg-[#fcf9f8] rounded-xl transition-colors text-gray-400 hover:text-dark min-h-[44px] min-w-[44px] flex items-center justify-center border border-transparent hover:border-[#eaddd7]"
                aria-label="Cerrar carrito"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm border border-[#eaddd7]">
                    <ShoppingCart size={40} className="text-gold/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-serif font-bold text-dark mb-2">Tu carrito está vacío</p>
                    <p className="text-sm font-light text-gray-500 max-w-[250px]">Descubre piezas únicas para complementar tu estilo.</p>
                  </div>
                  <button onClick={closeCart} className="btn-gold px-8 py-3.5 text-sm mt-4">
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.sku} className="flex gap-5 bg-white p-4 rounded-[1.25rem] border border-[#eaddd7] shadow-sm hover:shadow-soft transition-shadow">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded-xl bg-warm border border-white"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-serif text-lg font-bold text-dark leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-auto">SKU: {item.sku}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-[#fcf9f8] border border-[#eaddd7] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            className="p-1.5 text-gray-500 hover:text-dark transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            className="p-1.5 text-gray-500 hover:text-dark transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-bold text-dark text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-[#eaddd7] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-dark">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-[#eaddd7]">
                    <span className="text-sm font-bold text-dark uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-serif font-bold text-dark">{formatPrice(cartTotal)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-2">Envío calculado en WhatsApp</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-whatsapp py-4 flex items-center justify-center gap-2 shadow-md min-h-[56px] text-[15px]"
                  >
                    <MessageCircle size={20} />
                    Enviar pedido por WhatsApp
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-dark transition-colors"
                  >
                    Vaciar colección
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
