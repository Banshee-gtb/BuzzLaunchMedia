import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { trackEvent } from '@/lib/analytics';

export default function Terms() {
  useEffect(() => { trackEvent('page_view', '/terms'); }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-4">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Terms of Service</h1>
          <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex flex-col gap-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {[
              {
                title: 'Acceptance of Terms',
                content: 'By accessing and using BuzzLaunch Media\'s website and services, you agree to be bound by these terms. If you do not agree, please do not use this website.',
              },
              {
                title: 'Services',
                content: 'BuzzLaunch Media provides digital presence, media and business systems services. Service scope, deliverables and timelines are agreed upon separately between BuzzLaunch Media and each client prior to commencement of work.',
              },
              {
                title: 'No Guarantees',
                content: 'BuzzLaunch Media does not guarantee specific rankings, revenue increases, conversion rates or any other quantitative outcomes. Results depend on many factors outside our control.',
              },
              {
                title: 'Applications',
                content: 'Submitting a "Join BuzzLaunch" application does not constitute an offer of employment or engagement. Applications are reviewed at the discretion of BuzzLaunch Media and we are not obligated to respond to all submissions.',
              },
              {
                title: 'Intellectual Property',
                content: 'All content on this website including copy, design and code is the property of BuzzLaunch Media unless otherwise stated. Work delivered to clients becomes the property of the client upon full payment.',
              },
              {
                title: 'Limitation of Liability',
                content: 'BuzzLaunch Media is not liable for any indirect or consequential damages arising from use of our services or this website.',
              },
              {
                title: 'Changes to Terms',
                content: 'We may update these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.',
              },
              {
                title: 'Contact',
                content: 'For terms-related questions, contact us at buzzlaunchmedia@gmail.com.',
              },
            ].map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
                <p className="text-sm leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
