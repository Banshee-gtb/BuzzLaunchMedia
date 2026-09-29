import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, TrendingUp, Settings, ArrowRight, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { SERVICES } from '@/constants';
import { trackEvent } from '@/lib/analytics';

const serviceIcons = [Globe, TrendingUp, Settings];

const serviceDetails = [
  {
    why: 'Customers judge your business online before they ever walk through your door or call. A slow, outdated or missing website signals that you may not be worth their time.',
    process: ['Discovery call to understand your business and audience', 'Design system and wireframes', 'Development and mobile optimization', 'SEO setup and launch'],
  },
  {
    why: 'Your audience is already on social media. If your business isn\'t showing up consistently with content that speaks to them, someone else is.',
    process: ['Audit of current social presence', 'Strategy and content calendar', 'Content creation and scheduling', 'Monthly review and optimization'],
  },
  {
    why: 'Time spent on manual tasks, chasing leads or managing bookings manually is time not spent growing. The right systems eliminate friction and help you scale.',
    process: ['Workflow mapping and needs assessment', 'Tool and tech selection', 'Build and integration', 'Training and handover'],
  },
];

export default function Services() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('page_view', '/services');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Services</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            Digital. Media. Systems.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Three interconnected service pillars built to make your business easier to find, more credible to trust and more efficient to run.
          </p>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {SERVICES.map((s, i) => {
            const Icon = serviceIcons[i];
            const detail = serviceDetails[i];
            return (
              <div key={s.number} className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-20 pb-20 ${i < SERVICES.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                  <p className="text-6xl font-black mb-4" style={{ color: 'rgba(245,184,0,0.12)' }}>{s.number}</p>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,184,0,0.1)' }}>
                      <Icon size={18} style={{ color: '#f5b800' }} />
                    </div>
                    <span className="section-label text-xs">{s.label}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{s.title}</h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.description}</p>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>{detail.why}</p>
                  <button onClick={() => navigate('/hire')} className="btn-primary">
                    Get Started <ArrowRight size={16} />
                  </button>
                </div>
                <div className={i % 2 !== 0 ? 'lg:order-1' : ''}>
                  <div className="glass-card rounded-2xl p-7">
                    <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#f5b800' }}>What's Included</p>
                    <ul className="flex flex-col gap-3 mb-8">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <ChevronRight size={14} style={{ color: '#f5b800', flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                      <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Our Process</p>
                      {detail.process.map((step, idx) => (
                        <div key={step} className="flex items-start gap-3 mb-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ background: 'rgba(245,184,0,0.1)', color: '#f5b800' }}>{idx + 1}</span>
                          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-4">Not sure where to start?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Tell us about your business and we'll figure out the best approach together.</p>
          <button onClick={() => navigate('/hire')} className="btn-primary">Hire BuzzLaunch <ArrowRight size={16} /></button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
