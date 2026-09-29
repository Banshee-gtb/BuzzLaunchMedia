import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Index from './pages/Index';
import Services from './pages/Services';
import Work from './pages/Work';
import Products from './pages/Products';
import About from './pages/About';
import Reviews from './pages/Reviews';
import HireUs from './pages/HireUs';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import BuzzAIPage from './pages/BuzzAIPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import FloatingContact from './components/features/FloatingContact';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageTransitionIndicator() {
  const { pathname } = useLocation();
  useEffect(() => {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;top:0;left:0;right:0;height:2px;background:#f5b800;z-index:9999;transition:opacity 300ms;opacity:1;';
    document.body.appendChild(el);
    const t = setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 400);
    return () => { clearTimeout(t); el.remove(); };
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" />
      <BrowserRouter>
        <ScrollToTop />
        <PageTransitionIndicator />
        <FloatingContact />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/hire" element={<HireUs />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/buzzai" element={<BuzzAIPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
