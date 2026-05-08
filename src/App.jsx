import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';

// Lazy load secondary routes to improve initial load performance
const Catalog = React.lazy(() => import('./pages/Catalog'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const AdminImport = React.lazy(() => import('./pages/AdminImport'));

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route 
                path="catalog" 
                element={
                  <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>}>
                    <Catalog />
                  </Suspense>
                } 
              />
              <Route 
                path="product/:slug" 
                element={
                  <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>}>
                    <ProductDetail />
                  </Suspense>
                } 
              />
              <Route 
                path="admin-import" 
                element={
                  <Suspense fallback={<div>Cargando administrador...</div>}>
                    <AdminImport />
                  </Suspense>
                } 
              />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </HelmetProvider>
  );
}

export default App;
