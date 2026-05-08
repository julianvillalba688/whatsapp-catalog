import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

// Asegurar que el build haya terminado
if (!fs.existsSync(indexHtmlPath)) {
  console.error('No se encontró dist/index.html. Ejecuta vite build primero.');
  process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf-8');

const siteConfig = {
  siteName: "Lumina Accesorios",
  url: "https://lumina-accesorios.com", // Cambiar por dominio real
  description: "Bisutería delicada, accesorios femeninos y joyería elegante. Compra fácil por WhatsApp con envíos seguros y atención personalizada.",
  currency: "USD",
  logoUrl: "https://lumina-accesorios.com/logo.png"
};

// Leer productos del JSON (que ya debería estar en public/data/ o dist/data/)
let products = [];
try {
  const productsPath = path.join(distDir, 'data/products.json');
  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  }
} catch (e) {
  console.log('No se pudieron cargar los productos para el prerender, o está vacío.');
}

// Función helper para inyectar metadata en el <head>
const injectMeta = (html, metaData) => {
  let injected = html.replace(/<title>.*?<\/title>/, `<title>${metaData.title}</title>`);
  
  const metaTags = `
    <meta name="description" content="${metaData.description}">
    <link rel="canonical" href="${metaData.url}">
    <meta property="og:title" content="${metaData.title}">
    <meta property="og:description" content="${metaData.description}">
    <meta property="og:url" content="${metaData.url}">
    <meta property="og:image" content="${metaData.image || siteConfig.logoUrl}">
    <meta property="og:type" content="${metaData.type || 'website'}">
    <meta name="twitter:card" content="summary_large_image">
    ${metaData.jsonLd ? `<script type="application/ld+json">\n${JSON.stringify(metaData.jsonLd, null, 2)}\n</script>` : ''}
  `;
  
  return injected.replace('</head>', `${metaTags}\n</head>`);
};

const routes = [];

// 1. Ruta Home
const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": siteConfig.siteName,
  "url": siteConfig.url,
  "description": siteConfig.description,
  "publisher": {
    "@type": "Organization",
    "name": siteConfig.siteName,
    "logo": siteConfig.logoUrl
  }
};

routes.push({
  path: '/',
  meta: {
    title: `${siteConfig.siteName} | Bisutería Femenina y Accesorios Elegantes`,
    description: siteConfig.description,
    url: siteConfig.url,
    jsonLd: homeSchema
  }
});

// 2. Ruta Catálogo
routes.push({
  path: '/catalog',
  meta: {
    title: `Catálogo Completo | ${siteConfig.siteName}`,
    description: "Explora nuestra colección completa de aretes, collares, pulseras y anillos. Filtra por precio y categoría.",
    url: `${siteConfig.url}/catalog`
  }
});

// 3. Rutas de Productos
products.forEach(product => {
  const productUrl = `${siteConfig.url}/product/${product.slug}`;
  const isAvailable = product.status === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [product.image, ...(product.gallery || [])],
    "description": product.description || `Compra ${product.name} en ${siteConfig.siteName}.`,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": product.brand || siteConfig.siteName
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": siteConfig.currency,
      "price": product.salePrice || product.price,
      "availability": isAvailable,
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  routes.push({
    path: `/product/${product.slug}`,
    meta: {
      title: `${product.name} | ${siteConfig.siteName}`,
      description: product.description || `Adquiere ${product.name} de forma fácil y segura.`,
      url: productUrl,
      image: product.image,
      type: 'product',
      jsonLd: productSchema
    }
  });
});

console.log('Generando archivos HTML prerenderizados (SSG)...');

// Generar Sitemap
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Crear las rutas físicas
routes.forEach(route => {
  const finalHtml = injectMeta(template, route.meta);
  
  let filePath;
  if (route.path === '/') {
    filePath = path.join(distDir, 'index.html'); // Sobreescribimos el root index.html
  } else {
    // Crear directorio para la ruta limpia
    const routeDir = path.join(distDir, route.path);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    filePath = path.join(routeDir, 'index.html');
  }
  
  fs.writeFileSync(filePath, finalHtml, 'utf-8');
  console.log(`✓ Generado: ${route.path}`);

  sitemapXml += `  <url>\n    <loc>${route.meta.url}</loc>\n    <changefreq>${route.path === '/' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
});

sitemapXml += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
console.log('✓ Generado: /sitemap.xml');

// Generar robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
console.log('✓ Generado: /robots.txt');

console.log('¡Prerenderizado SEO completado con éxito!');
