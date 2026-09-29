import { useEffect } from 'react';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { useSettings } from '@/hooks/useSettings';
import { trackEvent } from '@/lib/analytics';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.84 1.56V6.85a4.86 4.86 0 0 1-1.07-.16z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function Contact() {
  const { data: settings } = useSettings();

  const email = settings?.business_email || 'buzzlaunchmedia@gmail.com';
  const phone = settings?.business_phone || '07066916150';
  const whatsapp = settings?.business_whatsapp || '2347066916150';
  const instagram = settings?.instagram_url || 'https://instagram.com/buzz_medialaunch';
  const tiktok = settings?.tiktok_url || 'https://tiktok.com/@buzz_medialaunch';
  const twitter = settings?.twitter_url || 'https://twitter.com/buzz_medialaunch';

  useEffect(() => { trackEvent('page_view', '/contact'); }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Contact</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            Let's talk.
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Whether you have a project in mind or just want to understand what's possible — reach out directly.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', '/contact')}
              className="glass-card rounded-2xl p-7 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366' }}>
                <WhatsAppIcon />
              </div>
              <p className="text-base font-bold text-white mb-1">WhatsApp</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Fastest way to reach us</p>
              <span className="pill">Message Us</span>
            </a>

            <a
              href={`mailto:${email}`}
              onClick={() => trackEvent('email_click', '/contact')}
              className="glass-card rounded-2xl p-7 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(245,184,0,0.1)', color: '#f5b800' }}>
                <Mail size={22} />
              </div>
              <p className="text-base font-bold text-white mb-1">Email</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>For detailed inquiries</p>
              <span className="text-xs font-medium break-all" style={{ color: '#f5b800' }}>{email}</span>
            </a>

            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent('call_click', '/contact')}
              className="glass-card rounded-2xl p-7 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
                <Phone size={22} />
              </div>
              <p className="text-base font-bold text-white mb-1">Call</p>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>During business hours</p>
              <span className="text-sm font-medium" style={{ color: '#60a5fa' }}>{phone}</span>
            </a>
          </div>

          {/* Social */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="section-label mb-4">Follow Us</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>@buzz_medialaunch across all platforms</p>
            <div className="flex items-center justify-center gap-4">
              <a href={instagram} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', '/contact', { platform: 'instagram' })} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="Instagram"><InstagramIcon /></a>
              <a href={tiktok} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', '/contact', { platform: 'tiktok' })} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="TikTok"><TikTokIcon /></a>
              <a href={twitter} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('social_click', '/contact', { platform: 'twitter' })} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }} aria-label="Twitter/X"><TwitterIcon /></a>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', '/contact')} className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110" style={{ background: 'rgba(37,211,102,0.1)', color: '#25d366' }} aria-label="WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
