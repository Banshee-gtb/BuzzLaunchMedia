import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Home } from 'lucide-react';
import Header from '@/components/layout/Header';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-8xl font-black mb-4" style={{ color: 'rgba(245,184,0,0.15)' }}>404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>The page you're looking for doesn't exist or was moved.</p>
          <Link to="/" className="btn-primary">
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
