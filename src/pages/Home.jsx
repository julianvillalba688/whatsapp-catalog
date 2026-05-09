import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/catalog/ProductGrid';
import { ShieldCheck, Truck, MessageCircle, Heart, Star, ChevronRight, Gift, Sparkles, CreditCard } from 'lucide-react';
import { siteConfig } from '../config';

const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.55,ease:'easeOut'}} };
const stagger = { hidden:{}, show:{transition:{staggerChildren:0.1}} };

const HOME_MEDIA = {
  hero: 'https://images.unsplash.com/photo-1611085510592-af3939396350?auto=format&fit=crop&w=1200&q=80',
  heroInset: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=400&q=80',
  categories: {
    aretes: 'https://assets.rediredi.com/items/images/5b4e6366-bb50-490c-8d24-1a4f8f5fda50_8c6466c7-a51f-4198-b1cb-731f2d21cfa3.jpg',
    collares: 'https://assets.rediredi.com/items/images/5b4e6366-bb50-490c-8d24-1a4f8f5fda50_bd0bd3a2-a842-4501-a6b4-1ad58f972a53.jpg',
    pulseras: 'https://assets.rediredi.com/items/images/5b4e6366-bb50-490c-8d24-1a4f8f5fda50_06b4309c-ab15-4944-9060-87c58de3b660.jpg',
    sets: 'https://assets.rediredi.com/items/images/5b4e6366-bb50-490c-8d24-1a4f8f5fda50_d22735b7-2f34-450b-b8a5-a0af62a00f71.jpg'
  },
  editorial: {
    diario: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
    ocasiones: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    regalar: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&w=800&q=80'
  },
  banner: 'https://images.unsplash.com/photo-1627280373830-80519f6a735c?auto=format&fit=crop&w=1200&q=80'
};

// Security check for duplicates in development
const checkDuplicateMedia = () => {
  const urls = [
    HOME_MEDIA.hero,
    HOME_MEDIA.heroInset,
    ...Object.values(HOME_MEDIA.categories),
    ...Object.values(HOME_MEDIA.editorial),
    HOME_MEDIA.banner
  ];
  const unique = new Set(urls.filter(Boolean));
  if (unique.size !== urls.filter(Boolean).length) {
    console.warn('HOME_MEDIA: Detected duplicate images on homepage.');
  }
};
checkDuplicateMedia();

const CATEGORIES = [
  { name:'Aretes', query:'Aretes', slug:'aretes', phrase:'Detalles que iluminan', img: HOME_MEDIA.categories.aretes },
  { name:'Collares', query:'Cadenas Y Collar', slug:'collares', phrase:'Capas delicadas', img: HOME_MEDIA.categories.collares },
  { name:'Pulseras', query:'Pulseras', slug:'pulseras', phrase:'Brillo sutil', img: HOME_MEDIA.categories.pulseras },
  { name:'Sets', query:'Juegos', slug:'sets', phrase:'Combinaciones listas', img: HOME_MEDIA.categories.sets },
];

const EDITORIAL = [
  { label:'Para el día a día', text:'Piezas ligeras que acompañan cada momento sin esfuerzo.', img: HOME_MEDIA.editorial.diario },
  { label:'Para ocasiones especiales', text:'Accesorios que convierten cualquier look en memorable.', img: HOME_MEDIA.editorial.ocasiones },
  { label:'Para regalar', text:'El regalo que siempre acierta: bisutería con alma.', img: HOME_MEDIA.editorial.regalar },
];

const TESTIMONIALS = [
  { name:'Carolina M.', stars:5, text:'Mis aretes llegaron perfectos y en tiempo récord. La atención por WhatsApp fue súper rápida.' },
  { name:'Valentina R.', stars:5, text:'Compré un set de collar y pulsera para mi mamá. Quedó encantada. La calidad se nota.' },
  { name:'Daniela P.', stars:5, text:'Me encanta que puedo ver todo el catálogo y pedir directamente. Muy cómodo y confiable.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const featured = arr.filter(p => p.featured).slice(0,8);
        setProducts(featured.length > 0 ? featured : arr.slice(0,8));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>{siteConfig.siteName} | Bisutería Femenina y Accesorios</title>
        <meta name="description" content="Bisutería delicada para elevar tu estilo. Accesorios femeninos, elegantes y fáciles de pedir por WhatsApp." />
      </Helmet>

      {/* ══ 1. HERO ══ */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden subtle-texture"
        style={{background:'linear-gradient(145deg,#FAF7F2 0%,#FDF0E8 40%,#FAF7F2 100%)'}}>
        {/* Glows decorativos */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[560px] h-[560px] rounded-full bg-gold/8 blur-[90px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full bg-nude/25 blur-[70px] -ml-16 -mb-16" />
          <div className="absolute top-1/3 left-1/4 w-56 h-56 rounded-full bg-cream/80 blur-[40px]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <motion.div className="order-1 lg:order-1" variants={stagger} initial="hidden" animate="show">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
                <span className="badge-gold"><Sparkles size={10} />Nueva Temporada</span>
                <span className="w-8 h-px bg-gold/40" />
                <span className="text-xs text-gray-400 font-medium tracking-wider">Colección 2025</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-[4.5rem] font-serif font-bold text-dark leading-[1.05] tracking-tight mb-6">
                Bisutería<br />
                <span className="italic text-gold">femenina</span><br />
                seleccionada para brillar
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-gray-500 mb-10 max-w-md leading-relaxed font-light">
                Piezas delicadas y versátiles que elevan tu look sin esfuerzo. Listas para acompañarte todos los días y fáciles de pedir por WhatsApp.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/catalog" className="btn-primary px-8 text-sm group">
                  Ver Catálogo
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría recibir asesoría sobre sus accesorios.')}`}
                   target="_blank" rel="noopener noreferrer"
                   className="btn-outline px-8 text-sm bg-white">
                  <MessageCircle size={16} className="text-green-500" />
                  Consultar por WhatsApp
                </a>
              </motion.div>

              {/* Mini trust */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                {['Envíos seguros','Calidad cuidada','Asesoría 1 a 1'].map(t => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />{t}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Images composition */}
            <motion.div className="order-2 lg:order-2 relative" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}>
              {/* Main image */}
              <div className="relative aspect-[3/4] max-w-[280px] sm:max-w-[360px] mx-auto lg:mx-0 lg:ml-auto">
                {/* Golden frame accent */}
                <div className="absolute -inset-2 rounded-[2.8rem] border border-gold/20 pointer-events-none z-20" />
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-premium border border-border-soft">
                  <img src={HOME_MEDIA.hero}
                    alt="Bisutería premium Salem Store" fetchPriority="high" loading="eager"
                    className="w-full h-full object-cover"
                    onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
                
                {/* Floating card: clientes */}
                <motion.div
                  className="absolute -bottom-5 -left-4 sm:-left-8 bg-white px-4 py-3 rounded-2xl shadow-premium border border-border-soft flex items-center gap-3 z-10"
                  animate={{y:[0,-6,0]}} transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gold/10 text-gold flex-shrink-0">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold whitespace-nowrap">Clientas felices</p>
                    <p className="font-serif text-sm font-bold text-dark">+500 pedidos</p>
                  </div>
                </motion.div>

                {/* Floating badge: compra segura */}
                <motion.div
                  className="absolute -top-3 -right-3 sm:-right-5 bg-dark text-white px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md"
                  animate={{y:[0,-4,0]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut',delay:0.5}}>
                  <ShieldCheck size={11} className="text-gold" /> Compra segura
                </motion.div>

                {/* Floating badge: WhatsApp */}
                <motion.div
                  className="absolute bottom-20 -right-4 sm:-right-8 bg-[#25D366] text-white px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-md"
                  animate={{y:[0,-5,0]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut',delay:1}}>
                  <MessageCircle size={11} /> Consulta rápida
                </motion.div>
                </div>
              </div>

              {/* Second small image */}
              <div className="hidden lg:block absolute -bottom-8 right-0 w-40 h-48 rounded-2xl overflow-hidden shadow-soft border-2 border-white">
                <img src={HOME_MEDIA.heroInset}
                  alt="Aretes elegantes" loading="lazy" className="w-full h-full object-cover"
                  onError={e=>{ e.currentTarget.style.display='none'; }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 2. TRUST BAR ══ */}
      <section className="py-6 bg-white border-y border-border-soft">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border-soft">
            {[
              { icon:<Truck size={20} strokeWidth={1.5} />, label:'Envíos seguros', sub:'A domicilio' },
              { icon:<Heart size={20} strokeWidth={1.5} />, label:'Calidad cuidada', sub:'Garantizada' },
              { icon:<MessageCircle size={20} strokeWidth={1.5} />, label:'Asesoría 1 a 1', sub:'Por WhatsApp' },
              { icon:<CreditCard size={20} strokeWidth={1.5} />, label:'Pagos flexibles', sub:'Múltiples métodos' },
            ].map((item,i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-4 px-4 text-center">
                <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-dark">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. CATEGORÍAS ══ */}
      <section className="py-20 bg-section-warm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            <motion.p variants={fadeUp} className="eyebrow mb-3">Colecciones</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Explora por Categoría</motion.h2>
            <div className="divider-gold" />
          </motion.div>

          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            {CATEGORIES.map(cat => (
              <motion.div key={cat.slug} variants={fadeUp}>
                <Link to={`/catalog?category=${cat.query}`}
                  className="group relative block rounded-3xl overflow-hidden aspect-[3/4] shadow-delicate card-hover"
                  aria-label={`Ver ${cat.name}`}>
                  <img src={cat.img} alt={`${cat.name} - ${cat.phrase}`} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=75'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white font-serif text-xl font-bold leading-tight">{cat.name}</p>
                    <p className="text-white/70 text-xs mt-1 font-light italic">{cat.phrase}</p>
                    <p className="text-gold text-xs font-semibold mt-2 flex items-center gap-1 group-hover:text-white transition-colors">
                      Ver colección <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                  {/* Golden corner accent */}
                  <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/40 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 4. EDITORIAL ══ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            <motion.p variants={fadeUp} className="eyebrow mb-3">Estilo de vida</motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">Accesorios que elevan<br />cada momento</motion.h2>
            <div className="divider-gold" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDITORIAL.map((item,i) => (
              <motion.div key={i}
                initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:0.5,delay:i*0.12}}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-delicate">
                <img src={item.img} alt={item.label} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=75'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-white font-light text-sm leading-relaxed">{item.text}</p>
                </div>
                {/* Top-left ornament */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. PRODUCTOS DESTACADOS ══ */}
      <section className="py-20 relative overflow-hidden" style={{background:'linear-gradient(160deg,#FDF0E8 0%,#FAF7F2 50%,#FDF0E8 100%)'}}>
        {/* Glow decorativo */}
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/6 blur-[80px] -mr-32 -mt-32" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-nude/20 blur-[60px] -ml-20 -mb-20" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4"
            variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            <div>
              <motion.p variants={fadeUp} className="eyebrow mb-2">Más queridas</motion.p>
              <motion.h2 variants={fadeUp} className="section-title">Favoritos de Clientas</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle mt-3 max-w-sm">Piezas delicadas elegidas para acompañarte todos los días.</motion.p>
              <div className="divider-gold-left mt-5" />
            </div>
            <motion.div variants={fadeUp} className="flex-shrink-0">
              <Link to="/catalog" className="btn-outline text-sm px-6">
                Ver catálogo completo <ChevronRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {[...Array(8)].map((_,i) => (
                <div key={i} className="rounded-[1.25rem] overflow-hidden bg-white border border-border-soft">
                  <div className="skeleton aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-3 w-1/3 rounded-full" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} columnsView="4" />
          )}
        </div>
      </section>

      {/* ══ 6. BANNER EDITORIAL ══ */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Image side */}
          <motion.div className="relative min-h-[300px] order-2 lg:order-1"
            initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.6}}>
            <img
              src={HOME_MEDIA.banner}
              alt="Colección de accesorios premium" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e=>{ e.currentTarget.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'; }}
            />
            <div className="absolute inset-0 bg-dark/25" />
            <div className="absolute inset-5 border border-white/15 rounded-2xl pointer-events-none hidden lg:block" />
          </motion.div>

          {/* Text side */}
          <div className="bg-section-dark relative flex flex-col justify-center px-8 sm:px-14 py-16 order-1 lg:order-2">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/6 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-nude/5 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="eyebrow text-gold">✦ Selección premium</span>
                  <span className="w-8 h-px bg-gold/30" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">
                  Diseñadas para<br /><span className="italic text-gold">brillar</span> contigo
                </h2>
                <p className="text-white/60 text-base mb-8 max-w-md leading-relaxed font-light">
                  Piezas pensadas para cada momento, desde el día a día hasta esa ocasión especial que merece una joya perfecta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/catalog" className="btn-gold px-8">
                    Ver colección <ChevronRight size={16} />
                  </Link>
                  <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                    className="btn-whatsapp px-8">
                    <MessageCircle size={16} /> Escríbenos
                  </a>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex gap-8">
                  {['Calidad garantizada','Envíos seguros'].map(t=>(
                    <span key={t} className="flex items-center gap-2 text-white/40 text-xs">
                      <ShieldCheck size={12} className="text-gold/60"/>{t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* ══ 7. TESTIMONIOS ══ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            <motion.p variants={fadeUp} className="eyebrow mb-3">Reseñas</motion.p>
            <motion.h2 variants={fadeUp} className="section-title">Lo que dicen<br />de Salem Store</motion.h2>
            <div className="divider-gold" />
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="show" viewport={{once:true,margin:'-60px'}}>
            {Array.isArray(TESTIMONIALS) && TESTIMONIALS.map((t,i) => (
              <motion.div key={i} variants={fadeUp}
                className="bg-section-warm rounded-3xl p-7 border border-border-soft relative overflow-hidden card-hover">
                {/* Big quote decoration */}
                <span className="absolute top-4 right-5 font-serif text-7xl text-gold/10 leading-none select-none">"</span>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_,s)=><Star key={s} size={13} className="text-gold" fill="currentColor" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center font-serif font-bold text-gold-dark text-base">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-dark text-sm">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 8. CTA FINAL ══ */}
      <section className="py-16 md:py-20 bg-[#1C1816] relative overflow-hidden text-center rounded-[2.5rem] mx-4 sm:mx-6 lg:mx-8 mb-10 shadow-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-nude/10 blur-[60px]" />
          {/* Subtle texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'20\\' cy=\\'20\\' r=\\'1\\' fill=\\'%23C8A96A\\' fill-opacity=\\'1\\'/%3E%3C/svg%3E')]"></div>
        </div>
        <motion.div className="max-w-2xl mx-auto px-4 relative z-10"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}}>
          <p className="eyebrow text-gold mb-4">✦ Atención Personalizada</p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-white mb-4 leading-[1.1]">
            ¿Viste una pieza que te encantó?
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-8 font-light max-w-lg mx-auto">
            Escríbenos por WhatsApp y te ayudamos a elegir la ideal, confirmar disponibilidad o armar un regalo perfecto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/catalog" className="btn-gold px-8 py-3 text-sm">Explorar Catálogo</Link>
            <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-8 py-3 text-sm">
              <MessageCircle size={16} /> Consultar por WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-white/50 text-xs font-medium">
            {['Envíos seguros','Atención 1 a 1','Compra confiable'].map(t=>(
              <span key={t} className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-gold/60"/>{t}</span>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};
export default Home;
