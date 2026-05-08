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
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-dark">Tu Carrito</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-dark"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart size={48} className="text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">Tu carrito está vacío</p>
                  <p className="text-sm text-center">¡Agrega algunos productos para continuar!</p>
                  <button onClick={closeCart} className="btn-primary mt-4">
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.sku} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg bg-gray-50"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.sku)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="font-medium text-dark">
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
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-dark mt-2 pt-2 border-t border-gray-100">
                  <span>Total estimado</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="space-y-3 mt-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-whatsapp flex items-center justify-center gap-2 py-4 text-lg"
                  >
                    <Send size={20} />
                    Enviar pedido por WhatsApp
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-gray-500 font-medium hover:text-red-500 transition-colors"
                  >
                    Vaciar carrito
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
