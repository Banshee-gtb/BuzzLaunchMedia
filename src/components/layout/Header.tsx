import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { LOGO_WHITE_URL, NAV_LINKS } from '@/constants';
import { trackEvent } from '@/lib/analytics';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleHireUs = () => {
    trackEvent('hire_us_click', location.pathname);
    navigate('/hire');
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={LOGO_WHITE_URL} alt="BuzzLaunch Media" className="h-8 sm:h-9 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 text-sm font-medium transition-colors duration-150 rounded-md"
                  style={{
                    color: location.pathname === link.path ? '#f5b800' : 'rgba(255,255,255,0.7)',
                    background: location.pathname === link.path ? 'rgba(245,184,0,0.08)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) (e.target as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/buzzai"
                className="ml-1 px-3 py-2 text-sm font-medium flex items-center gap-1.5 rounded-md transition-all duration-150"
                style={{ color: location.pathname === '/buzzai' ? '#f5b800' : 'rgba(245,184,0,0.85)' }}
              >
                <Zap size={14} />
                BuzzAI
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <button onClick={handleHireUs} className="btn-primary text-sm px-5 py-2.5">
                Hire Us
              </button>
            </div>

            {/* Mobile: BuzzAI + Menu */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/buzzai"
                className="flex items-center gap-1 px-2.5 py-2 rounded-md text-xs font-semibold"
                style={{ color: '#f5b800' }}
              >
                <Zap size={13} />
                <span className="hidden sm:inline">BuzzAI</span>
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-md text-white"
                aria-label="Toggle menu"
                style={{ background: 'rgba(255,255,255,0.06)', minWidth: 40, minHeight: 40 }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="lg:hidden"
            style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: location.pathname === link.path ? '#f5b800' : 'rgba(255,255,255,0.75)',
                    background: location.pathname === link.path ? 'rgba(245,184,0,0.08)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/5">
                <button onClick={handleHireUs} className="btn-primary w-full text-sm">
                  Hire Us
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 sm:h-18" />
    </>
  );
}
