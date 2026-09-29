import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

const schema = z.object({
  business_name: z.string().min(1, 'Required'),
  contact_name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  social_links: z.string().optional(),
  services_required: z.array(z.string()).optional(),
  business_goals: z.string().optional(),
  project_description: z.string().min(10, 'Please describe your project (min 10 chars)'),
  timeline: z.string().optional(),
  budget_range: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const serviceOptions = ['Website Design', 'Landing Page', 'SEO', 'Social Media Strategy', 'Content Creation', 'Ad Creatives', 'Custom Dashboard', 'Business Automation', 'Customer Portal', 'Other'];
const timelines = ['ASAP', '1–2 weeks', '1 month', '2–3 months', 'Flexible'];
const budgets = ['Under ₦50,000', '₦50,000–₦150,000', '₦150,000–₦500,000', '₦500,000+', 'Let\'s discuss'];

const STEPS = ['Business Info', 'Services', 'Project Details'];

export default function HireUs() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => { trackEvent('page_view', '/hire'); }, []);

  const { register, handleSubmit, trigger, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 0) fields = ['business_name', 'contact_name', 'email'];
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const { error } = await supabase.from('hire_requests').insert({
      ...data,
      services_required: selectedServices,
    });
    setSubmitting(false);
    if (error) { toast.error('Submission failed. Please try again.'); return; }
    trackEvent('hire_us_submit', '/hire', { business_name: data.business_name });
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
            <CheckCircle size={48} style={{ color: '#4ade80' }} className="mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-white mb-3">Request received!</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>We'll review your submission and reach out to <strong className="text-white">{getValues('email')}</strong> shortly.</p>
            <button onClick={() => navigate('/')} className="btn-primary w-full">Back to Home</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Header />
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="section-label mb-3">Hire Us</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Let's work together.</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Tell us about your business and what you need. We'll take it from there.</p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-10 justify-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200" style={{ background: i <= step ? '#f5b800' : 'rgba(255,255,255,0.08)', color: i <= step ? '#0a0a0a' : 'rgba(255,255,255,0.35)' }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs hidden sm:inline" style={{ color: i === step ? '#f5b800' : 'rgba(255,255,255,0.3)' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px" style={{ background: i < step ? '#f5b800' : 'rgba(255,255,255,0.1)' }} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-card rounded-2xl p-7 sm:p-9">
              {/* Step 0: Business Info */}
              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-white">Business Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Business Name *</label>
                      <input {...register('business_name')} placeholder="Your Business Name" className="input-field" />
                      {errors.business_name && <p className="text-xs mt-1 text-red-400">{errors.business_name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact Name *</label>
                      <input {...register('contact_name')} placeholder="Your Name" className="input-field" />
                      {errors.contact_name && <p className="text-xs mt-1 text-red-400">{errors.contact_name.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email Address *</label>
                    <input {...register('email')} type="email" placeholder="you@company.com" className="input-field" />
                    {errors.email && <p className="text-xs mt-1 text-red-400">{errors.email.message}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Phone / WhatsApp</label>
                      <input {...register('phone')} placeholder="07000000000" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Industry</label>
                      <input {...register('industry')} placeholder="e.g. Healthcare, Retail" className="input-field" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Location</label>
                      <input {...register('location')} placeholder="City, State" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Current Website</label>
                      <input {...register('website')} placeholder="https://yoursite.com" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Social Media Links</label>
                    <input {...register('social_links')} placeholder="Instagram, TikTok, Facebook..." className="input-field" />
                  </div>
                </div>
              )}

              {/* Step 1: Services */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-lg font-bold text-white">What do you need?</h2>
                  <div>
                    <label className="block text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Select all that apply</label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((s) => (
                        <button key={s} type="button" onClick={() => toggleService(s)} className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150" style={{ background: selectedServices.includes(s) ? 'rgba(245,184,0,0.15)' : 'rgba(255,255,255,0.05)', color: selectedServices.includes(s) ? '#f5b800' : 'rgba(255,255,255,0.5)', border: `1px solid ${selectedServices.includes(s) ? 'rgba(245,184,0,0.3)' : 'rgba(255,255,255,0.08)'}`, minHeight: 36 }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Business Goals</label>
                    <textarea {...register('business_goals')} rows={3} placeholder="What do you want to achieve in the next 3–6 months?" className="textarea-field" />
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-white">Project Details</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Project Description *</label>
                    <textarea {...register('project_description')} rows={5} placeholder="Describe what you want built, what problem it solves, and any specific requirements..." className="textarea-field" />
                    {errors.project_description && <p className="text-xs mt-1 text-red-400">{errors.project_description.message}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Timeline</label>
                      <select {...register('timeline')} className="select-field">
                        <option value="" style={{ background: '#111' }}>Select timeline...</option>
                        {timelines.map((t) => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Budget Range</label>
                      <select {...register('budget_range')} className="select-field">
                        <option value="" style={{ background: '#111' }}>Select budget...</option>
                        {budgets.map((b) => <option key={b} value={b} style={{ background: '#111' }}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {step > 0 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-secondary px-4 py-2.5 text-sm">
                    <ArrowLeft size={15} /> Back
                  </button>
                ) : <div />}
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={nextStep} className="btn-primary">
                    Continue <ArrowRight size={15} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? <><Loader size={15} className="animate-spin" /> Submitting...</> : <>Submit Request <ArrowRight size={15} /></>}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
