import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, TrendingUp, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import type { TeamMember } from '@/types';

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('page_view', '/about');
  }, []);

  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').order('display_order');
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <BuzzAILauncher />

      {/* Hero */}
      <section className="relative py-24 sm:py-32">
        <BackgroundSlideshow overlayOpacity={0.92} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">About</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            We help businesses<br />work louder.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            BuzzLaunch Media is a digital, media and systems agency built around one goal: helping businesses get found, look credible and turn attention into customers.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Globe, title: 'Get Found', desc: 'We make sure your business shows up where your customers are looking — search, social, everywhere that matters.' },
              { icon: TrendingUp, title: 'Look Credible', desc: 'A professional digital presence signals trust. We build the websites, content and visuals that earn it.' },
              { icon: Settings, title: 'Work Smarter', desc: 'The right systems remove bottlenecks, free up your time and help your business scale without burning out.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-7 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,184,0,0.1)' }}>
                  <Icon size={20} style={{ color: '#f5b800' }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="text-center mb-12">
            <p className="section-label mb-3">The Team</p>
            <h2 className="section-heading">The people behind it.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
                <div className="aspect-[4/3] overflow-hidden relative">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(245,184,0,0.05)' }}>
                      <span className="text-6xl font-black" style={{ color: 'rgba(245,184,0,0.2)' }}>{member.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#f5b800' }}>{member.role}</p>
                  {member.bio && <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{member.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24" style={{ background: '#0d0d0d' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Our Approach</p>
            <h2 className="section-heading">How we operate.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: 'Honest, not hype', desc: "We don't promise rankings, viral moments or guaranteed revenue. We promise thoughtful work, delivered well." },
              { title: 'Results over aesthetics', desc: "A beautiful website that no one finds is useless. We build for performance, not just appearance." },
              { title: 'Communication first', desc: "We keep clients informed. No disappearing acts, no guessing — just clear updates and direct access." },
              { title: 'Built to last', desc: "Everything we build is designed to be maintained, updated and grown — not thrown away after six months." },
            ].map(({ title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-6">
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#0a0a0a' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-4">Work with us.</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>We're a young team that builds things with intention. If that sounds like a good fit, let's talk.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/hire')} className="btn-primary">Hire BuzzLaunch <ArrowRight size={16} /></button>
            <button onClick={() => navigate('/join')} className="btn-secondary">Join the Team</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
