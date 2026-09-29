import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, TrendingUp, Settings, ChevronRight, Monitor, Users, Zap, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import { LOGO_WHITE_URL, SERVICES } from '@/constants';
import { trackEvent } from '@/lib/analytics';

const serviceIcons = [Globe, TrendingUp, Settings];

const businessTypes = ['Restaurant', 'Boutique', 'Salon', 'Gym', 'Clinic', 'Law Firm', 'Real Estate', 'Tech Startup', 'E-commerce', 'Consultancy'];

export default function Index() {
  const navigate = useNavigate();
  const [selectedBiz, setSelectedBiz] = useState('');
  const [auditVisible, setAuditVisible] = useState(false);
  const [auditResult, setAuditResult] = useState<null | { score: number; issues: string[]; improvements: string[] }>(null);

  useEffect(() => {
    trackEvent('page_view', '/');
  }, []);

  const runAudit = () => {
    if (!selectedBiz) return;
    trackEvent('audit_request', '/', { business_type: selectedBiz });
    setAuditResult({
      score: Math.floor(Math.random() * 25) + 50,
      issues: [
        'No consistent social media presence found',
        'Website may not be mobile-optimized',
        'Weak local SEO signals',
        'No visible review management strategy',
      ],
      improvements: [
        'Launch a mobile-first website with clear CTAs',
        'Establish weekly content on Instagram/TikTok',
        'Set up and optimize Google Business Profile',
        'Create a review collection system',
      ],
    });
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <BackgroundSlideshow overlayOpacity={0.88} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="pill mb-6">
                <Zap size={10} />
                Digital · Media · Systems
              </div>
              <h1 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
                YOUR BUSINESS.<br />
                <span style={{ color: '#f5b800' }}>LOUDER.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Websites, content and digital systems designed to help businesses get found, look credible and turn attention into customers.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { trackEvent('hire_us_click', '/'); navigate('/hire'); }} className="btn-primary">
                  Hire Us <ArrowRight size={16} />
                </button>
                <button onClick={() => { setAuditVisible(true); document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-secondary">
                  Free Business Audit
                </button>
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="hidden lg:block">
              <div className="glass-card rounded-2xl p-6 max-w-sm ml-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={LOGO_WHITE_URL} alt="BuzzLaunch" className="h-5 w-auto" />
                    <span className="text-xs font-semibold text-white/50">Digital Dashboard</span>
                  </div>
                  <span className="pill text-[10px]">Live</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ label: 'Visibility', val: '4.2×', up: true }, { label: 'Inquiries', val: '+68%', up: true }, { label: 'Reach', val: '12K', up: true }].map((m) => (
                    <div key={m.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</p>
                      <p className="text-lg font-bold" style={{ color: '#f5b800' }}>{m.val}</p>
                    </div>
                  ))}
                </div>
                {[
                  { icon: Globe, label: 'Website', status: 'Active', color: '#4ade80' },
                  { icon: TrendingUp, label: 'Social Media', status: 'Posting', color: '#f5b800' },
                  { icon: Settings, label: 'Systems', status: 'Running', color: '#60a5fa' },
                ].map(({ icon: Icon, label, status, color }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} style={{ color }} />
                      <span className="text-sm text-white/70">{label}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>{status}</span>
                  </div>
                ))}
                <p className="text-[10px] mt-3 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>Illustrative — not live data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 sm:py-28" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="section-label mb-4">The Reality</p>
            <h2 className="section-heading mb-6">Your customers search before they call.</h2>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>When someone discovers your business, they check your website, your social media, your reviews — and make a judgment in seconds. Before you ever speak to them.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Monitor, title: 'Outdated Website', desc: 'A slow or outdated site signals to customers that you may not be in business.' },
              { icon: Users, title: 'Inactive Socials', desc: 'No recent posts means no proof that your business is active and thriving.' },
              { icon: Globe, title: 'Hard to Find', desc: 'If you\'re not on page one locally, you\'re invisible to people searching right now.' },
              { icon: Settings, title: 'Manual Processes', desc: 'Time lost to admin tasks and manual follow-ups that could be automated.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(245,184,0,0.08)' }}>
                  <Icon size={18} style={{ color: '#f5b800' }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 sm:py-28" style={{ background: '#0a0a0a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
            <div>
              <p className="section-label mb-3">What We Do</p>
              <h2 className="section-heading">Three pillars.<br />One direction.</h2>
            </div>
            <Link to="/services" className="btn-secondary text-sm px-4 py-2.5">
              All Services <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <div key={s.number} className="glass-card rounded-2xl p-7 group hover:-translate-y-1 transition-transform duration-200">
                  <p className="text-4xl font-black mb-4" style={{ color: 'rgba(245,184,0,0.2)', fontVariantNumeric: 'tabular-nums' }}>{s.number}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,184,0,0.1)' }}>
                      <Icon size={16} style={{ color: '#f5b800' }} />
                    </div>
                    <span className="section-label text-[11px]">{s.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.description}</p>
                  <ul className="flex flex-col gap-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <ChevronRight size={12} style={{ color: '#f5b800', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Audit Section */}
      <section id="audit" className="py-20 sm:py-28 relative">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Free Tool</p>
          <h2 className="section-heading mb-4">See your business differently.</h2>
          <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>Select your business type and get a quick audit of what's likely holding your digital presence back.</p>
          <div className="glass-card rounded-2xl p-8">
            <label className="block text-sm font-medium text-left mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Business Type</label>
            <select value={selectedBiz} onChange={(e) => { setSelectedBiz(e.target.value); setAuditResult(null); }} className="select-field mb-4">
              <option value="" style={{ background: '#111' }}>Select your business type...</option>
              {businessTypes.map((b) => <option key={b} value={b} style={{ background: '#111' }}>{b}</option>)}
            </select>
            <button onClick={runAudit} disabled={!selectedBiz} className="btn-primary w-full" style={{ opacity: !selectedBiz ? 0.5 : 1, cursor: !selectedBiz ? 'not-allowed' : 'pointer' }}>
              Run Free Audit
            </button>
            {auditResult && (
              <div className="mt-6 text-left">
                <div className="flex items-center justify-between mb-4 p-4 rounded-xl" style={{ background: 'rgba(245,184,0,0.08)', border: '1px solid rgba(245,184,0,0.15)' }}>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#f5b800' }}>Digital Presence Score</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Estimated based on typical {selectedBiz} businesses</p>
                  </div>
                  <p className="text-3xl font-black" style={{ color: '#f5b800' }}>{auditResult.score}<span className="text-sm">/100</span></p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3 text-red-400">Common Issues</p>
                    {auditResult.issues.map((issue) => (
                      <p key={issue} className="text-xs mb-2 flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#f87171' }} />
                        {issue}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#4ade80' }}>Improvements</p>
                    {auditResult.improvements.map((imp) => (
                      <p key={imp} className="text-xs mb-2 flex items-start gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#4ade80' }} />
                        {imp}
                      </p>
                    ))}
                  </div>
                </div>
                <button onClick={() => navigate('/hire')} className="btn-primary w-full mt-6">
                  Get a Real Audit from BuzzLaunch <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28" style={{ background: '#0d0d0d' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(245,184,0,0.1)' }}>
            <Star size={24} style={{ color: '#f5b800' }} />
          </div>
          <h2 className="section-heading mb-4">Ready to get louder?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Start with a conversation. We'll figure out where your business is and where it needs to go.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/hire')} className="btn-primary">Hire BuzzLaunch <ArrowRight size={16} /></button>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
