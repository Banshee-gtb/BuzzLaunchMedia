import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { LOGO_WHITE_URL, NAV_LINKS } from '@/constants';
import { useSettings } from '@/hooks/useSettings';
import { trackEvent } from '@/lib/analytics';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.84 1.56V6.85a4.86 4.86 0 0 1-1.07-.16z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function Footer() {
  const { data: settings } = useSettings();

  const email = settings?.business_email || 'buzzlaunchmedia@gmail.com';
  const phone = settings?.business_phone || '07066916150';
  const whatsapp = settings?.business_whatsapp || '2347066916150';
  const instagram = settings?.instagram_url || 'https://instagram.com/buzz_medialaunch';
  const tiktok = settings?.tiktok_url || 'https://tiktok.com/@buzz_medialaunch';
  const twitter = settings?.twitter_url || 'https://twitter.com/buzz_medialaunch';
  const tagline = settings?.footer_tagline || 'Be Seen. Be Heard.';
  const description = settings?.footer_description || 'We help businesses get seen, get heard and work smarter through digital presence, media and custom systems.';

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={LOGO_WHITE_URL} alt="BuzzLaunch Media" className="h-10 w-auto mb-4" />
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#f5b800' }}>{tagline}</p>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
            <div className="flex items-center gap-3 mt-6">
              <a href={instagram} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', 'footer', { platform: 'instagram' })} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="Instagram"><InstagramIcon /></a>
              <a href={tiktok} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', 'footer', { platform: 'tiktok' })} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="TikTok"><TikTokIcon /></a>
              <a href={twitter} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', 'footer', { platform: 'twitter' })} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="Twitter/X"><TwitterIcon /></a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', 'footer')} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366' }} aria-label="WhatsApp"><WhatsAppIcon /></a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Navigation</p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm transition-colors duration-150 hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>Contact</p>
            <ul className="flex flex-col gap-4">
              <li>
                <a href={`mailto:${email}`} onClick={() => trackEvent('email_click', 'footer')} className="flex items-start gap-3 text-sm group" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Mail size={15} className="mt-0.5 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                  <span className="group-hover:text-white transition-colors break-all">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} onClick={() => trackEvent('call_click', 'footer')} className="flex items-center gap-3 text-sm group" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Phone size={15} className="flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                  <span className="group-hover:text-white transition-colors">{phone}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', 'footer')} className="flex items-center gap-3 text-sm group" style={{ color: 'rgba(37,211,102,0.7)' }}>
                  <MessageCircle size={15} className="flex-shrink-0 group-hover:text-green-400 transition-colors" />
                  <span className="group-hover:text-green-300 transition-colors">WhatsApp Us</span>
                </a>
              </li>
            </ul>
            <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Link to="/privacy" className="text-xs mr-4 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.3)' }}>Privacy Policy</Link>
              <Link to="/terms" className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.3)' }}>Terms</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} BuzzLaunch Media. All rights reserved.</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Built by BuzzLaunch Media</p>
        </div>
      </div>
    </footer>
  );
}
