import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Mail, MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { trackEvent } from '@/lib/analytics';

const PAGE_CONTEXT: Record<string, string> = {
  '/': 'I visited your homepage and I am interested in BuzzLaunch Media.',
  '/services': 'I was checking out your services and would like to know more.',
  '/work': 'I saw your work and would like to discuss a project.',
  '/products': 'I was looking at your products and have some questions.',
  '/about': 'I was reading about your team and would like to get in touch.',
  '/reviews': 'I saw your reviews page and would like to discuss working together.',
  '/hire': 'I am interested in hiring BuzzLaunch Media for a project.',
  '/join': 'I am interested in joining the BuzzLaunch Media team.',
  '/contact': 'I found your contact page and want to reach out.',
  '/buzzai': 'I was using BuzzAI and have a question.',
};

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const HIDDEN_ROUTES = ['/admin'];

export default function FloatingContact() {
  const { pathname } = useLocation();
  const { data: settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  const whatsapp = settings?.business_whatsapp || '2347066916150';
  const email = settings?.business_email || 'buzzlaunchmedia@gmail.com';

  // Hide dot after user has seen it for 6 seconds once opened or dismissed
  useEffect(() => {
    if (open) setShowDot(false);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Don't render on hidden routes
  if (HIDDEN_ROUTES.includes(pathname)) return null;

  const pageMsg = encodeURIComponent(
    (PAGE_CONTEXT[pathname] ?? 'Hi, I found BuzzLaunch Media and would like to get in touch.') +
      ' Can we talk?'
  );
  const waUrl = `https://wa.me/${whatsapp}?text=${pageMsg}`;
  const mailUrl = `mailto:${email}?subject=${encodeURIComponent('Inquiry from BuzzLaunch Website')}`;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3"
      style={{ maxWidth: 'calc(100vw - 20px)' }}
    >
      {/* Expanded panel */}
      <div
        aria-hidden={!open}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          transformOrigin: 'bottom right',
          transition: 'opacity 220ms ease, transform 220ms ease',
          pointerEvents: open ? 'auto' : 'none',
          width: 'min(280px, calc(100vw - 32px))',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(14,14,14,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 24px 56px rgba(0,0,0,0.55)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="text-sm font-semibold text-white leading-none">Get in touch</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                We usually respond quickly
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              aria-label="Close"
            >
              <X size={13} />
            </button>
          </div>

          {/* Options */}
          <div className="p-3 flex flex-col gap-2">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent('whatsapp_click', pathname, { source: 'floating_widget' });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all duration-150"
              style={{
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.15)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
                style={{ background: 'rgba(37,211,102,0.15)', color: '#25d366' }}
              >
                <WhatsAppIcon />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-none">WhatsApp</p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Chat with us now
                </p>
              </div>
              <div
                className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: '#25d366' }}
              />
            </a>

            {/* Email */}
            <a
              href={mailUrl}
              onClick={() => {
                trackEvent('email_click', pathname, { source: 'floating_widget' });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all duration-150"
              style={{
                background: 'rgba(245,184,0,0.06)',
                border: '1px solid rgba(245,184,0,0.12)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
                style={{ background: 'rgba(245,184,0,0.12)', color: '#f5b800' }}
              >
                <Mail size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-none">Email</p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  buzzlaunchmedia@gmail.com
                </p>
              </div>
            </a>
          </div>

          {/* Footer note */}
          <p
            className="text-center text-[10px] pb-3 px-4"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            No automated bots — real people respond
          </p>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close contact widget' : 'Open contact widget'}
        aria-expanded={open}
        className="relative flex items-center gap-2.5 rounded-full transition-all duration-200"
        style={{
          background: open ? '#1a1a1a' : '#25d366',
          color: open ? 'rgba(255,255,255,0.7)' : '#fff',
          border: open ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(37,211,102,0.4)',
          boxShadow: open
            ? '0 4px 16px rgba(0,0,0,0.4)'
            : '0 8px 28px rgba(37,211,102,0.35)',
          padding: '11px 18px 11px 14px',
          transform: open ? 'scale(0.97)' : 'scale(1)',
          minHeight: 48,
        }}
      >
        {/* Notification dot */}
        {showDot && !open && (
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 z-10"
            style={{
              background: '#f5b800',
              borderColor: '#0a0a0a',
              animation: 'ping-dot 1.8s ease-in-out infinite',
            }}
          />
        )}

        {open ? (
          <X size={18} />
        ) : (
          <MessageCircle size={18} />
        )}
        <span className="text-sm font-semibold whitespace-nowrap">
          {open ? 'Close' : 'Chat with us'}
        </span>
      </button>

      {/* Ping animation keyframes */}
      <style>{`
        @keyframes ping-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ping-dot { 0%, 100% { transform: scale(1); opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
