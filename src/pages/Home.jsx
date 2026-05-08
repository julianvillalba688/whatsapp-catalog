import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/catalog/ProductGrid';
import { ShieldCheck, Truck, Clock, MessageCircle, Heart, Star, ChevronRight, Gift } from 'lucide-react';
import { siteConfig } from '../config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const data = await response.json();
          // Solo mostrar primeros 8 destacados
          const featured = data.filter(p => p.featured).slice(0, 8);
          setProducts(featured.length > 0 ? featured : data.slice(0, 8));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="bg-[#fcf9f8]">
      <Helmet>
        <title>{siteConfig.siteName} | Bisutería Femenina y Accesorios</title>
        <meta name="description" content="Bisutería delicada para elevar tu estilo. Accesorios femeninos, elegantes y fáciles de pedir por WhatsApp. Envíos seguros." />
      </Helmet>

      {/* 1. Hero Banner (Priority Load) */}
      <section className="relative bg-white overflow-hidden border-b border-[#f2e8e5]">
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 bg-[#fdf8f6] opacity-50"></div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-[85vh] py-16">
            
            <div className="order-2 lg:order-1 pt-8 lg:pt-0">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold tracking-widest uppercase mb-6 border border-primary-200">
                Colección Exclusiva
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-dark tracking-tight mb-6 leading-[1.1]">
                Bisutería delicada para <span className="italic text-primary-600">elevar</span> tu estilo
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-light">
                Piezas únicas y elegantes seleccionadas para ti. Compra de manera fácil y segura directamente a través de WhatsApp.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog" className="bg-dark text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-900 transition-all shadow-lg flex items-center justify-center gap-2 group">
                  Ver Colección
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría recibir asesoría sobre sus accesorios de bisutería.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-dark border-2 border-dark px-8 py-4 rounded-xl font-semibold hover:bg-[#fdf8f6] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} className="text-green-600" />
                  Pedir Asesoría
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500 font-medium flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" /> Atención personalizada garantizada
              </p>
            </div>

            <div className="order-1 lg:order-2 relative w-full aspect-[4/5] lg:aspect-square max-w-lg mx-auto">
              {/* Carga prioritaria de la imagen LCP sin animación de entrada pesada */}
              <img
                src="https://images.unsplash.com/photo-1599643478514-4a820cbf31cd?w=800&q=80"
                alt="Mujer luciendo bisutería fina"
                fetchpriority="high"
                loading="eager"
                width="800"
                height="800"
                className="w-full h-full object-cover rounded-[2rem] shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl z-20 border border-[#f2e8e5] hidden md:flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  <Star size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Favoritos</p>
                  <p className="font-serif text-lg font-bold text-dark">+500 Clientas Felices</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Beneficios / Trust Section */}
      <section className="py-12 border-b border-[#f2e8e5] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#eaddd7]">
            <div className="p-4 flex flex-col items-center">
              <Truck size={32} className="text-primary-500 mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-dark mb-2">Envíos Seguros</h3>
              <p className="text-gray-500 text-sm">Coordinamos la entrega hasta la puerta de tu casa.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <Heart size={32} className="text-primary-500 mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-dark mb-2">Calidad Cuidada</h3>
              <p className="text-gray-500 text-sm">Piezas seleccionadas rigurosamente para garantizar su belleza.</p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <MessageCircle size={32} className="text-primary-500 mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-dark mb-2">Atención Rápida</h3>
              <p className="text-gray-500 text-sm">Atención 1 a 1 por WhatsApp para resolver tus dudas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Favoritos / Catálogo Destacado */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-dark mb-3">Favoritos de Clientas</h2>
              <p className="text-gray-600 text-lg">Las piezas más deseadas de esta temporada.</p>
            </div>
            <Link to="/catalog" className="hidden sm:flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors uppercase tracking-wider text-sm">
              Ver Catálogo Completo <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link to="/catalog" className="bg-white text-dark border border-[#eaddd7] px-8 py-4 rounded-xl font-bold w-full flex justify-center shadow-sm">
              Ver Todo El Catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Banner de Regalos */}
      <section className="py-16 bg-primary-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=1000" alt="Fondo" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 relative z-10 text-center">
          <Gift size={48} className="mx-auto mb-6 text-primary-300" strokeWidth={1} />
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Ideas para Regalar</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8 font-light">
            Detalles delicados perfectos para cumpleaños, aniversarios o simplemente para sorprender a esa persona especial.
          </p>
          <Link to="/catalog" className="inline-block bg-white text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors">
            Ver Opciones de Regalo
          </Link>
        </div>
      </section>

      {/* 5. Cómo Comprar (Embudos de venta) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-dark mb-4">¿Cómo comprar?</h2>
            <p className="text-gray-500 text-lg">Un proceso rápido, seguro y personalizado.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Elige tu pieza', desc: 'Explora nuestro catálogo y selecciona los accesorios que más te gusten.' },
              { num: '02', title: 'Escríbenos', desc: 'Usa el botón de WhatsApp en el producto o el carrito para enviarnos tu pedido.' },
              { num: '03', title: 'Confirmamos', desc: 'Te confirmamos la disponibilidad de las piezas de inmediato.' },
              { num: '04', title: 'Coordinamos', desc: 'Acordamos el método de pago y los detalles del envío directo a ti.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#fcf9f8] p-8 rounded-3xl border border-[#f2e8e5] text-center relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl font-serif font-bold text-primary-200 mb-4 group-hover:text-primary-300 transition-colors">{step.num}</div>
                <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Cuidados y FAQ Breve */}
      <section className="py-20 bg-[#fcf9f8] border-t border-[#f2e8e5]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Cuidados */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-dark mb-8">Cuidados</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3"><span className="text-primary-500">•</span> Evita perfumes directos.</li>
              <li className="flex items-start gap-3"><span className="text-primary-500">•</span> Guarda tus piezas en un lugar seco.</li>
              <li className="flex items-start gap-3"><span className="text-primary-500">•</span> Limpia suavemente con paño seco.</li>
              <li className="flex items-start gap-3"><span className="text-primary-500">•</span> Evita agua, sudor y productos químicos.</li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-dark mb-8">Preguntas Frecuentes</h2>
            <div className="space-y-6 text-left">
              {[
                { q: '¿Cómo hago un pedido?', a: 'Elige tus joyas y escríbenos al WhatsApp. Ahí tomaremos tu pedido.' },
                { q: '¿Tienen envíos?', a: 'Sí, contamos con envíos. Coordinamos todo por mensaje.' },
                { q: '¿Cómo confirmo disponibilidad?', a: 'Al enviarnos el mensaje por WhatsApp, te diremos al instante si hay stock.' },
                { q: '¿Puedo pedir varias piezas?', a: '¡Claro! Puedes usar el carrito para agregar varias piezas y enviar un solo mensaje.' },
                { q: '¿Qué métodos de pago aceptan?', a: 'Te confirmaremos los medios de pago disponibles al coordinar la entrega por WhatsApp.' },
                { q: '¿Cómo cuido mi bisutería?', a: 'Revisa la sección de Cuidados para mantener tus piezas perfectas.' }
              ].map((faq, i) => (
                <div key={i} className="border-b border-[#eaddd7] pb-4">
                  <h4 className="font-bold text-dark mb-2">{faq.q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button 
                onClick={() => {
                  import('../utils/whatsapp').then(({ openWhatsApp }) => {
                    openWhatsApp('Hola, tengo algunas dudas adicionales.', 'whatsapp_click_faq');
                  });
                }}
                className="text-primary-600 font-bold hover:underline"
              >
                ¿Tienes otra duda? Escríbenos directamente
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
