import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Zap, BookOpen, Settings, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { trackEvent } from '@/lib/analytics';

const products = [
  {
    name: 'ViralForge AI',
    tagline: 'Generate content that actually spreads.',
    description: 'ViralForge AI is an AI-powered content generation tool built by BuzzLaunch to help creators and brands produce high-quality, viral-ready content faster. It combines AI intelligence with strategic content frameworks.',
    icon: Zap,
    url: 'https://viral-forge-ai-omega.vercel.app/',
    color: '#f5b800',
    features: ['AI-powered content creation', 'Platform-specific formatting', 'Viral content frameworks', 'Batch content generation'],
    status: 'Live',
  },
  {
    name: 'BetaBook',
    tagline: 'Validate before you build.',
    description: 'BetaBook is a validation platform that helps creators, developers and entrepreneurs collect early access sign-ups and gauge real interest before committing to a full build.',
    icon: BookOpen,
    url: 'https://ibetabook.vercel.app/',
    color: '#60a5fa',
    features: ['Waitlist and early access pages', 'Interest validation tools', 'Subscriber management', 'Analytics dashboard'],
    status: 'Live',
  },
  {
    name: 'Custom Business Systems',
    tagline: 'Built around your workflow, not against it.',
    description: 'Beyond our own products, BuzzLaunch designs and builds custom software tailored to how your business actually operates — dashboards, customer portals, booking tools and automation systems that replace manual work with intelligent process.',
    icon: Settings,
    url: null,
    color: '#4ade80',
    features: ['Workflow analysis and mapping', 'Custom dashboard development', 'Customer portal creation', 'AI-assisted process automation'],
    status: 'Custom',
  },
];

export default function Products() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('page_view', '/products');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Products</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            Built by BuzzLaunch.
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            A curated product ecosystem — from AI-powered tools to custom business systems — built to solve real problems.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div key={product.name} className="glass-card rounded-2xl p-8 sm:p-10 group hover:-translate-y-0.5 transition-transform duration-200">
                <div className="grid sm:grid-cols-5 gap-8 items-start">
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${product.color}12` }}>
                        <Icon size={20} style={{ color: product.color }} />
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ background: product.status === 'Live' ? 'rgba(74,222,128,0.1)' : 'rgba(245,184,0,0.1)', color: product.status === 'Live' ? '#4ade80' : '#f5b800' }}>
                        {product.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                    <p className="text-sm font-medium mb-4" style={{ color: product.color }}>{product.tagline}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{product.description}</p>
                    <div className="mt-6">
                      {product.url ? (
                        <a href={product.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('product_link_click', '/products', { product: product.name })} className="btn-primary text-sm">
                          Visit {product.name} <ExternalLink size={14} />
                        </a>
                      ) : (
                        <button onClick={() => navigate('/hire')} className="btn-primary text-sm">
                          Build With Us <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>Key Features</p>
                    <ul className="flex flex-col gap-3">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: product.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
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
          <h2 className="section-heading mb-4">Need something custom?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>If the right tool doesn't exist, we'll build it. Tell us what your business needs.</p>
          <button onClick={() => navigate('/hire')} className="btn-primary">Start a Project <ArrowRight size={16} /></button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
