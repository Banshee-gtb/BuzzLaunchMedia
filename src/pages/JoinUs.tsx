import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, Loader, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

const schema = z.object({
  full_name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  role_applied: z.string().min(1, 'Select a role'),
  experience_years: z.string().optional(),
  portfolio_links: z.string().optional(),
  availability: z.string().optional(),
  why_join: z.string().min(20, 'Please tell us why you want to join (min 20 chars)'),
  additional_info: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const roles = ['Web Developer', 'UI/UX Designer', 'Video Editor', 'Content Creator', 'Social Media Manager', 'Copywriter', 'Marketing Strategist', 'Business Development', 'Other'];
const experienceLevels = ['No experience (ready to learn)', '0–1 year', '1–3 years', '3–5 years', '5+ years'];
const availabilities = ['Full-time', 'Part-time', 'Contract / Project-based', 'Freelance', 'Remote only'];
const skillOptions = ['React / Next.js', 'Figma / UI Design', 'Video Editing', 'Photography', 'Copywriting', 'SEO', 'Paid Ads', 'Social Media', 'Motion Graphics', 'Python', 'Node.js', 'No-code Tools'];

const STEPS = ['Personal Info', 'Role & Skills', 'Your Story'];

export default function JoinUs() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { trackEvent('page_view', '/join'); }, []);

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { toast.error('Only PDF or Word documents are allowed'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return; }
    setResumeFile(file);
  };

  const nextStep = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 0) fields = ['full_name', 'email', 'role_applied'];
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    let resumePath = '';

    if (resumeFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${resumeFile.name.replace(/\s+/g, '-')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile);
      setUploading(false);
      if (uploadError) { toast.error('Resume upload failed. Submitting without resume.'); }
      else resumePath = uploadData.path;
    }

    const { error } = await supabase.from('join_applications').insert({
      ...data,
      skills: selectedSkills,
      resume_path: resumePath,
    });

    if (error) { toast.error('Submission failed. Please try again.'); setSubmitting(false); return; }

    // Send welcome email
    await supabase.functions.invoke('send-welcome-email', {
      body: { applicant_name: data.full_name, applicant_email: data.email, role: data.role_applied },
    });

    trackEvent('join_application_submit', '/join', { role: data.role_applied });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
            <CheckCircle size={48} style={{ color: '#4ade80' }} className="mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-white mb-3">Application submitted!</h2>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Thank you, <strong className="text-white">{getValues('full_name')}</strong>. We've received your application and sent a confirmation to <strong className="text-white">{getValues('email')}</strong>.</p>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>Our team will review your application. If it's a match, we'll be in touch.</p>
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
          <div className="text-center mb-10">
            <p className="section-label mb-3">Join BuzzLaunch</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Work with the team.</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>We're always looking for talented people to join our growing agency. No guaranteed employment — but we do take applications seriously.</p>
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
              {/* Step 0 */}
              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-white">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name *</label>
                      <input {...register('full_name')} placeholder="Your Full Name" className="input-field" />
                      {errors.full_name && <p className="text-xs mt-1 text-red-400">{errors.full_name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email Address *</label>
                      <input {...register('email')} type="email" placeholder="you@email.com" className="input-field" />
                      {errors.email && <p className="text-xs mt-1 text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Phone / WhatsApp</label>
                      <input {...register('phone')} placeholder="07000000000" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Role Applying For *</label>
                      <select {...register('role_applied')} className="select-field">
                        <option value="" style={{ background: '#111' }}>Select role...</option>
                        {roles.map((r) => <option key={r} value={r} style={{ background: '#111' }}>{r}</option>)}
                      </select>
                      {errors.role_applied && <p className="text-xs mt-1 text-red-400">{errors.role_applied.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-lg font-bold text-white">Role & Skills</h2>
                  <div>
                    <label className="block text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Skills (select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((s) => (
                        <button key={s} type="button" onClick={() => toggleSkill(s)} className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150" style={{ background: selectedSkills.includes(s) ? 'rgba(245,184,0,0.15)' : 'rgba(255,255,255,0.05)', color: selectedSkills.includes(s) ? '#f5b800' : 'rgba(255,255,255,0.5)', border: `1px solid ${selectedSkills.includes(s) ? 'rgba(245,184,0,0.3)' : 'rgba(255,255,255,0.08)'}`, minHeight: 36 }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Experience Level</label>
                      <select {...register('experience_years')} className="select-field">
                        <option value="" style={{ background: '#111' }}>Select level...</option>
                        {experienceLevels.map((e) => <option key={e} value={e} style={{ background: '#111' }}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Availability</label>
                      <select {...register('availability')} className="select-field">
                        <option value="" style={{ background: '#111' }}>Select availability...</option>
                        {availabilities.map((a) => <option key={a} value={a} style={{ background: '#111' }}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Portfolio / Work Links</label>
                    <input {...register('portfolio_links')} placeholder="GitHub, Behance, Dribbble, website..." className="input-field" />
                  </div>
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Resume / CV (optional, PDF or Word, max 10MB)</label>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    {!resumeFile ? (
                      <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-xl p-6 flex flex-col items-center gap-2 transition-all duration-150 border-2 border-dashed" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}>
                        <Upload size={20} />
                        <span className="text-xs">Click to upload resume</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(245,184,0,0.08)', border: '1px solid rgba(245,184,0,0.15)' }}>
                        <span className="text-sm text-white truncate">{resumeFile.name}</span>
                        <button type="button" onClick={() => setResumeFile(null)} className="ml-3 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <h2 className="text-lg font-bold text-white">Your Story</h2>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Why do you want to join BuzzLaunch? *</label>
                    <textarea {...register('why_join')} rows={5} placeholder="Tell us what draws you to BuzzLaunch, what you bring, and what you want to build here..." className="textarea-field" />
                    {errors.why_join && <p className="text-xs mt-1 text-red-400">{errors.why_join.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Anything else you'd like us to know?</label>
                    <textarea {...register('additional_info')} rows={3} placeholder="Awards, projects, context, links, anything relevant..." className="textarea-field" />
                  </div>
                  <div className="rounded-xl p-4 text-xs leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.35)' }}>
                    By submitting, you agree that BuzzLaunch Media may store and review your application. We do not guarantee employment or placement.
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
                  <button type="submit" disabled={submitting || uploading} className="btn-primary" style={{ opacity: (submitting || uploading) ? 0.7 : 1 }}>
                    {submitting || uploading ? <><Loader size={15} className="animate-spin" /> Submitting...</> : <>Submit Application <ArrowRight size={15} /></>}
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
