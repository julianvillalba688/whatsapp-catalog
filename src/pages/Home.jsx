import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/catalog/ProductGrid';
import {
  ShieldCheck, Truck, MessageCircle, Heart, Star,
  ChevronRight, Gift, Sparkles, CreditCard
} from 'lucide-react';
import { siteConfig } from '../config';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const CATEGORIES = [
  { name: 'Aretes', slug: 'aretes', img: 'https://images.unsplash.com/photo-1573408301185-9519f94815ac?w=500&q=75' },
  { name: 'Collares', slug: 'collares', img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=75' },
  { name: 'Pulseras', slug: 'pulseras', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&q=75' },
  { name: 'Sets', slug: 'sets', img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=75' },
];

const TESTIMONIALS = [
  { name: 'Carolina M.', stars: 5, text: 'Mis aretes llegaron perfectos y en tiempo récord. La atención por WhatsApp fue súper rápida.' },
  { name: 'Valentina R.', stars: 5, text: 'Compré un set de collar y pulsera para mi mamá. Quedó encantada. La calidad se nota.' },
  { name: 'Daniela P.', stars: 5, text: 'Me encanta que puedo ver todo el catálogo y pedir directamente. Muy cómodo y confiable.' },
];

const STEPS = [
  { num: '01', title: 'Elige tu pieza', desc: 'Explora el catálogo y agrega los accesorios que más te gusten.' },
  { num: '02', title: 'Escríbenos', desc: 'Usa el botón de WhatsApp para enviarnos tu pedido en segundos.' },
  { num: '03', title: 'Confirmamos', desc: 'Te confirmamos disponibilidad al instante y acordamos el pago.' },
  { num: '04', title: 'Lo recibes', desc: 'Coordinamos el envío directo hasta donde estés.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        if (response.ok) {
          const data = await response.json();
          const featured = data.filter(p => p.featured).slice(0, 8);
          setProducts(featured.length > 0 ? featured : data.slice(0, 8));
        }
      } catch (e) {
        console.error('Error cargando productos:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="bg-warm overflow-hidden">
      <Helmet>
        <title>{siteConfig.siteName} | Bisutería Femenina y Accesorios</title>
        <meta name="description" content="Bisutería delicada para elevar tu estilo. Accesorios femeninos, elegantes y fáciles de pedir por WhatsApp." />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative bg-warm border-b border-border-soft">
        {/* Decoración de fondo optimizada para no saturar móviles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[300px] h-[300px] rounded-full bg-nude/10 blur-3xl" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[85vh] py-12 lg:py-20">
            <motion.div className="order-2 lg:order-1 pt-4 lg:pt-0" variants={stagger} initial="hidden" animate="show">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold-dark border border-gold/20 text-xs font-semibold tracking-widest uppercase mb-6">
                <Sparkles size={12} /> Nueva Temporada
              </motion.span>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[4rem] font-serif font-bold text-dark leading-[1.1] tracking-tight mb-6">
                Bisutería delicada<br />para <span className="italic text-gold">elevar</span> tu estilo
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed font-light">
                Piezas únicas y elegantes seleccionadas para ti. Compra de forma fácil y segura directamente por WhatsApp.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog" className="btn-primary px-8 group">
                  Ver Colección
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría recibir asesoría sobre sus accesorios.')}`} target="_blank" rel="noopener noreferrer" className="btn-outline px-8 bg-white">
                  <MessageCircle size={18} className="text-green-500" />
                  Pedir Asesoría
                </a>
              </motion.div>
              <motion.p variants={fadeUp} className="mt-6 text-sm text-gray-500 flex items-center gap-2 font-medium">
                <ShieldCheck size={16} className="text-green-500" /> Atención personalizada · Envíos seguros
              </motion.p>
            </motion.div>

            <motion.div className="order-1 lg:order-2 relative w-full aspect-[4/5] lg:aspect-square max-w-[420px] mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80" alt="Mujer luciendo bisutería fina" fetchPriority="high" loading="eager" width="800" height="800" className="w-full h-full object-cover rounded-[2rem] shadow-soft" />
              <div className="absolute -bottom-5 -left-2 md:-left-6 bg-white px-5 py-4 rounded-2xl shadow-sm border border-border-soft flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/10 text-gold">
                  <Star size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Clientas</p>
                  <p className="font-serif text-base font-bold text-dark">+500 Felices</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="py-8 bg-white border-b border-border-soft">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Truck size={20} strokeWidth={1.5} />, label: 'Envíos seguros' },
              { icon: <Heart size={20} strokeWidth={1.5} />, label: 'Calidad cuidada' },
              { icon: <MessageCircle size={20} strokeWidth={1.5} />, label: 'Asesoría 1 a 1' },
              { icon: <CreditCard size={20} strokeWidth={1.5} />, label: 'Pagos flexibles' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-gray-600">
                <span className="text-gold">{item.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORÍAS */}
      <section className="py-20 bg-warm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase mb-3 text-gold">Colecciones</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Explora por Categoría</motion.h2>
            <div className="divider-gold" />
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.slug} variants={fadeUp}>
                <Link to={`/catalog?category=${cat.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-sm card-hover">
                  <img src={cat.img} alt={cat.name} loading="lazy" width="400" height="533" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-serif text-xl font-bold">{cat.name}</p>
                    <p className="text-white/80 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                      Ver colección <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. DESTACADOS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <div>
              <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase mb-2 text-gold">Más queridas</motion.p>
              <motion.h2 variants={fadeUp} className="section-title">Favoritos de Clientas</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link to="/catalog" className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-dark hover:text-gold transition-colors group">
                Ver catálogo completo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden"><div className="skeleton aspect-[3/4]" /><div className="p-3 space-y-2"><div className="skeleton h-4 w-3/4 rounded" /></div></div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} columnsView="4" />
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link to="/catalog" className="btn-outline w-full">Ver todo el catálogo</Link>
          </div>
        </div>
      </section>

      {/* 5. BANNER SPLIT */}
      <section className="bg-dark relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 sm:px-16 py-16 lg:py-24 order-2 lg:order-1 relative z-10">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
              <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase mb-4 text-gold">✦ Selección Premium</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Diseñadas para<br /><span className="italic text-gold">brillar</span> contigo
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/70 text-base mb-8 max-w-md leading-relaxed font-light">
                Piezas pensadas para cada momento, desde el día a día hasta esa ocasión especial que merece una joya perfecta.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link to="/catalog" className="btn-gold inline-flex w-auto">
                  Descubrir Ahora <ChevronRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="relative min-h-[300px] lg:min-h-full order-1 lg:order-2">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=75" alt="Colección elegante" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-dark/20" />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section className="py-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <motion.p variants={fadeUp} className="text-xs font-bold tracking-widest uppercase mb-3 text-gold">Reseñas</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">Lo que dicen de nosotros</motion.h2>
            <div className="divider-gold" />
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-7 shadow-sm border border-border-soft card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={14} className="text-gold" fill="currentColor" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center font-serif font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-dark text-sm">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. PASOS DE COMPRA */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <motion.h2 variants={fadeUp} className="section-title mb-4">¿Cómo comprar?</motion.h2>
            <motion.p variants={fadeUp} className="section-subtitle">Un proceso diseñado para tu comodidad.</motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            {STEPS.map((step, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-warm p-8 rounded-3xl border border-border-soft text-center card-hover">
                <div className="text-4xl font-serif font-bold mb-4 text-gold/40">{step.num}</div>
                <h3 className="text-lg font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-20 bg-dark relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-nude blur-3xl" />
        </div>
        <motion.div className="max-w-3xl mx-auto px-4 relative z-10" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6"><Gift size={40} className="text-gold/60" strokeWidth={1} /></motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Encuentra tu pieza ideal</motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 text-lg mb-10 font-light max-w-xl mx-auto">Explora el catálogo completo y descubre los accesorios perfectos para ti o para regalar.</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="btn-gold px-10">Ver Catálogo</Link>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-10">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
