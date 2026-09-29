import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuzzAILauncher from '@/components/features/BuzzAILauncher';
import BackgroundSlideshow from '@/components/layout/BackgroundSlideshow';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

export default function Reviews() {
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent('page_view', '/reviews');
  }, []);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
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
          <p className="section-label mb-4">Reviews</p>
          <h1 className="font-black mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            What clients say.
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Real feedback from real clients. We don't manufacture testimonials.
          </p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 sm:py-24" style={{ background: '#0a0a0a' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(245,184,0,0.08)' }}>
                <MessageSquare size={28} style={{ color: '#f5b800' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">No reviews yet.</h3>
              <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                We're building our track record. Work with us and be among the first to share your experience.
              </p>
              <button onClick={() => navigate('/hire')} className="btn-primary">
                Start Working With Us <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card rounded-xl p-6 flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} style={{ color: '#f5b800' }} fill="#f5b800" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>"{review.content}"</p>
                  <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(245,184,0,0.15)', color: '#f5b800' }}>
                      {review.author_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{review.author_name}</p>
                      {(review.author_role || review.author_company) && (
                        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {[review.author_role, review.author_company].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    {review.created_at && (
                      <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>{formatDate(review.created_at)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: '#0d0d0d' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-heading mb-4">Ready to get started?</h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Join the businesses that chose BuzzLaunch to sharpen their digital presence.</p>
          <button onClick={() => navigate('/hire')} className="btn-primary">Hire BuzzLaunch <ArrowRight size={16} /></button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
