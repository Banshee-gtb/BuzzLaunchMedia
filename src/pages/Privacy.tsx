import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { trackEvent } from '@/lib/analytics';

export default function Privacy() {
  useEffect(() => { trackEvent('page_view', '/privacy'); }, []);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="section-label mb-4">Legal</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Privacy Policy</h1>
          <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.35)' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex flex-col gap-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {[
              {
                title: 'Information We Collect',
                content: 'When you submit a "Hire Us" or "Join Us" form, we collect the personal information you provide, including your name, email address, phone number and any other details entered in the form. We also collect basic analytics data such as page views and interaction events.',
              },
              {
                title: 'How We Use Your Information',
                content: 'We use your information solely to respond to your inquiry or application. We do not sell your data to third parties. Your information may be shared with our team members for the purpose of evaluating your inquiry or application.',
              },
              {
                title: 'Data Storage',
                content: 'Your data is stored securely on our backend infrastructure powered by Supabase. Uploaded resume files are stored in a private, access-controlled bucket and are not publicly browsable.',
              },
              {
                title: 'Cookies and Analytics',
                content: 'We use first-party analytics to track page views and interactions. We do not use advertising cookies or third-party tracking pixels.',
              },
              {
                title: 'Your Rights',
                content: 'You may request that we delete your personal data at any time by emailing buzzlaunchmedia@gmail.com. We will respond within 30 days.',
              },
              {
                title: 'Contact',
                content: 'For privacy-related questions, contact us at buzzlaunchmedia@gmail.com.',
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
