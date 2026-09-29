import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Globe, Smartphone, Settings, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { trackEvent } from '@/lib/analytics';

const works = [
  {
    title: 'ViralForge AI',
    label: 'Built by BuzzLaunch',
    type: 'Product',
    description: 'An AI-powered content tool built to help creators and brands generate viral-ready content at scale.',
    icon: Smartphone,
    url: 'https://viral-forge-ai-omega.vercel.app/',
    tags: ['AI', 'Content', 'SaaS'],
    color: '#f5b800',
    featured: true,
  },
  {
    title: 'BetaBook',
    label: 'Built by BuzzLaunch',
    type: 'Product',
    description: 'A platform that helps creators and developers validate their ideas and collect early access sign-ups.',
    icon: Globe,
    url: 'https://ibetabook.vercel.app/',
    tags: ['SaaS', 'Validation', 'Waitlist'],
    color: '#60a5fa',
    featured: true,
  },
  {
    title: 'Local Business Website',
    label: 'Concept',
    type: 'Digital',
    description: 'A clean, mobile-first website concept for a local service business — optimized for search and conversion.',
    icon: Globe,
    url: null,
    tags: ['Website', 'SEO', 'Local Business'],
    color: '#4ade80',
    featured: false,
  },
  {
    title: 'Social Media System',
    label: 'Prototype',
    type: 'Media',
    description: 'A structured content system for a fashion brand — including content calendar, templates and short-form video strategy.',
    icon: Settings,
    url: null,
    tags: ['Content', 'Social Media', 'Strategy'],
    color: '#a78bfa',
    featured: false,
  },
  {
    title: 'Client Dashboard',
    label: 'Prototype',
    type: 'Systems',
    description: 'A custom client portal prototype showing service status, invoices and communication — built for a service-based business.',
    icon: Settings,
    url: null,
    tags: ['Dashboard', 'Portal', 'Automation'],
    color: '#f5b800',
    featured: false,
  },
  {
    title: 'BuzzLaunch Media',
    label: 'Built by BuzzLaunch',
    type: 'Digital',
    description: 'The website you\'re viewing right now. Built with our own stack — React, Supabase, AI — as proof of what we can deliver.',
    icon: Globe,
    url: null,
    tags: ['Website', 'Full-Stack', 'AI'],
    color: '#f5b800',
    featured: false,
  },
];

export default function Work() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('page_view', '/work');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Portfolio</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            Things we've built.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Products, prototypes and concepts from the BuzzLaunch team. Labeled clearly — no inflated case studies, no invented results.
          </p>
        </div>
      </section>

      {/* Work Grid */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Featured */}
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {works.filter((w) => w.featured).map((work) => {
              const Icon = work.icon;
              return (
                <div key={work.title} className="glass-card rounded-2xl p-7 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
                  <div className="absolute top-4 right-4">
                    <span className="pill text-[10px]">{work.label}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${work.color}12` }}>
                    <Icon size={20} style={{ color: work.color }} />
                  </div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{work.type}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{work.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{work.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {work.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>{t}</span>
                    ))}
                  </div>
                  {work.url && (
                    <a href={work.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('portfolio_link_click', '/work', { title: work.title })} className="btn-secondary text-sm px-4 py-2.5 inline-flex">
                      View Live <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Other Works */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {works.filter((w) => !w.featured).map((work) => {
              const Icon = work.icon;
              return (
                <div key={work.title} className="glass-card rounded-xl p-6 group hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${work.color}12` }}>
                      <Icon size={16} style={{ color: work.color }} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{work.label}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{work.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{work.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {work.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-4">Want something built?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Tell us what your business needs and let's build it right.</p>
          <button onClick={() => navigate('/hire')} className="btn-primary">Hire BuzzLaunch <ArrowRight size={16} /></button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
