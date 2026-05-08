// utils/whatsapp.js
import { siteConfig } from '../config';
import { track } from '@vercel/analytics';
import { formatPrice } from './formatters';

export const generateWhatsAppMessage = (cart, total) => {
  let message = `Hola, quiero consultar estos productos:\n\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `SKU: ${item.sku}\n`;
    message += `Cantidad: ${item.quantity}\n`;
    message += `Precio unitario: ${formatPrice(item.price)}\n`;
    message += `Subtotal: ${formatPrice(item.price * item.quantity)}\n`;
    message += `Link: ${window.location.origin}/product/${item.slug}\n\n`;
  });

  message += `*Total estimado: ${formatPrice(total)}*\n\n`;
  message += `Quedo atento/a para confirmar disponibilidad, entrega y forma de pago.`;

  return encodeURIComponent(message);
};

export const generateProductWhatsAppMessage = (product) => {
  let message = `Hola, estoy interesado/a en este producto:\n\n`;
  message += `Producto: *${product.name}*\n`;
  message += `SKU: ${product.sku}\n`;
  message += `Precio: ${formatPrice(product.price)}\n`;
  message += `Link: ${window.location.origin}/product/${product.slug}\n\n`;
  message += `¿Me puedes dar más información?`;

  return encodeURIComponent(message);
};

export const openWhatsApp = (message, eventName = 'whatsapp_click_general') => {
  // Disparar métrica en Vercel Analytics
  try {
    track(eventName);
  } catch (error) {
    console.error('Error tracking event:', error);
  }

  const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${message}`;
  window.open(url, '_blank');
};
