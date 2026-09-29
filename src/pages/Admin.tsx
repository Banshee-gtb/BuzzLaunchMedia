import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, MessageSquare, FileText, Star, Settings, BarChart3, Loader, Eye, EyeOff, Trash2, Check, X, Download, Lock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LOGO_WHITE_URL } from '@/constants';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { HireRequest, JoinApplication, Review, TeamMember, AnalyticsEvent } from '@/types';

type Tab = 'overview' | 'leads' | 'applications' | 'reviews' | 'team' | 'settings' | 'analytics';

export default function Admin() {
  const { isAuthenticated, loading: authLoading, login, logout } = useAdminAuth();
  const [pin, setPin] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { success, error } = await login(pin);
    setLoginLoading(false);
    if (!success) toast.error(error || 'Invalid PIN');
    else { setPin(''); toast.success('Welcome back'); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0a' }}>
        <div className="glass-card rounded-2xl p-10 max-w-sm w-full text-center">
          <img src={LOGO_WHITE_URL} alt="BuzzLaunch" className="h-9 w-auto mx-auto mb-8" />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(245,184,0,0.1)' }}>
            <Lock size={20} style={{ color: '#f5b800' }} />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Admin Access</h1>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Enter your admin PIN to continue.</p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="input-field pr-10 text-center tracking-widest text-lg"
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" disabled={loginLoading || !pin} className="btn-primary w-full" style={{ opacity: !pin ? 0.5 : 1 }}>
              {loginLoading ? <><Loader size={15} className="animate-spin" /> Verifying...</> : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.05)', minHeight: '100vh' }}>
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <img src={LOGO_WHITE_URL} alt="BuzzLaunch" className="h-7 w-auto" />
          <p className="text-[10px] mt-1 font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {([
            ['overview', BarChart3, 'Overview'],
            ['leads', FileText, 'Hire Requests'],
            ['applications', Users, 'Applications'],
            ['reviews', Star, 'Reviews'],
            ['team', Users, 'Team'],
            ['settings', Settings, 'Settings'],
            ['analytics', BarChart3, 'Analytics'],
          ] as [Tab, React.ElementType, string][]).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all duration-150" style={{ background: tab === key ? 'rgba(245,184,0,0.1)' : 'transparent', color: tab === key ? '#f5b800' : 'rgba(255,255,255,0.45)' }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm w-full transition-all duration-150" style={{ color: 'rgba(255,255,255,0.3)', background: 'transparent' }}>
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'leads' && <LeadsTab />}
        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'reviews' && <ReviewsTab queryClient={queryClient} />}
        {tab === 'team' && <TeamTab queryClient={queryClient} />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const { data: leads } = useQuery({ queryKey: ['admin-leads-count'], queryFn: async () => { const { count } = await supabase.from('hire_requests').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: apps } = useQuery({ queryKey: ['admin-apps-count'], queryFn: async () => { const { count } = await supabase.from('join_applications').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: reviews } = useQuery({ queryKey: ['admin-reviews-count'], queryFn: async () => { const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: events } = useQuery({ queryKey: ['admin-events-count'], queryFn: async () => { const { count } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }); return count || 0; } });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Hire Requests', value: leads ?? '—', color: '#f5b800' },
          { label: 'Applications', value: apps ?? '—', color: '#60a5fa' },
          { label: 'Reviews', value: reviews ?? '—', color: '#4ade80' },
          { label: 'Total Events', value: events ?? '—', color: '#a78bfa' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-5">
            <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadsTab() {
  const { data: leads = [], isLoading } = useQuery<HireRequest[]>({
    queryKey: ['admin-leads'],
    queryFn: async () => { const { data } = await supabase.from('hire_requests').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  if (isLoading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Hire Requests ({leads.length})</h2>
      {leads.length === 0 ? <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No hire requests yet.</p> : (
        <div className="flex flex-col gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="glass-card rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-white">{lead.business_name}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{lead.contact_name} · {lead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {lead.created_at && <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{formatDate(lead.created_at)}</span>}
                  <span className="pill text-[10px]">{lead.status || 'new'}</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                {lead.industry && <span style={{ color: 'rgba(255,255,255,0.4)' }}>Industry: <strong className="text-white">{lead.industry}</strong></span>}
                {lead.timeline && <span style={{ color: 'rgba(255,255,255,0.4)' }}>Timeline: <strong className="text-white">{lead.timeline}</strong></span>}
                {lead.budget_range && <span style={{ color: 'rgba(255,255,255,0.4)' }}>Budget: <strong className="text-white">{lead.budget_range}</strong></span>}
              </div>
              {lead.project_description && <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{lead.project_description}</p>}
              {lead.services_required && lead.services_required.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.services_required.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,184,0,0.08)', color: '#f5b800' }}>{s}</span>)}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <a href={`mailto:${lead.email}`} className="btn-primary text-xs px-3 py-2">Reply</a>
                {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs px-3 py-2">WhatsApp</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationsTab() {
  const { data: apps = [], isLoading } = useQuery<JoinApplication[]>({
    queryKey: ['admin-applications'],
    queryFn: async () => { const { data } = await supabase.from('join_applications').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const getResumeUrl = async (path: string) => {
    const { data } = await supabase.storage.from('resumes').createSignedUrl(path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
    else toast.error('Could not get resume URL');
  };

  if (isLoading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Join Applications ({apps.length})</h2>
      {apps.length === 0 ? <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No applications yet.</p> : (
        <div className="flex flex-col gap-4">
          {apps.map((app) => (
            <div key={app.id} className="glass-card rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-white">{app.full_name}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{app.role_applied} · {app.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {app.created_at && <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{formatDate(app.created_at)}</span>}
                  <span className="pill text-[10px]">{app.status}</span>
                </div>
              </div>
              {app.skills && app.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {app.skills.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>{s}</span>)}
                </div>
              )}
              {app.why_join && <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>"{app.why_join}"</p>}
              <div className="flex gap-2 flex-wrap">
                <a href={`mailto:${app.email}`} className="btn-primary text-xs px-3 py-2">Reply</a>
                {app.resume_path && <button onClick={() => getResumeUrl(app.resume_path!)} className="btn-secondary text-xs px-3 py-2 flex items-center gap-1"><Download size={12} /> Resume</button>}
                {app.portfolio_links && <a href={app.portfolio_links.startsWith('http') ? app.portfolio_links : `https://${app.portfolio_links}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs px-3 py-2">Portfolio</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ queryClient }: { queryClient: ReturnType<typeof useQueryClient> }) {
  const [form, setForm] = useState({ author_name: '', author_role: '', author_company: '', content: '', rating: 5 });
  const [adding, setAdding] = useState(false);

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ['admin-reviews'],
    queryFn: async () => { const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author_name || !form.content) { toast.error('Name and content required'); return; }
    const { error } = await supabase.from('reviews').insert(form);
    if (error) { toast.error('Failed to add review'); return; }
    toast.success('Review added');
    setForm({ author_name: '', author_role: '', author_company: '', content: '', rating: 5 });
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
  };

  const togglePublish = async (review: Review) => {
    const { error } = await supabase.from('reviews').update({ is_published: !review.is_published }).eq('id', review.id!);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(review.is_published ? 'Unpublished' : 'Published');
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Deleted');
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-base font-bold text-white mb-4">Add Review</h3>
        <form onSubmit={addReview} className="flex flex-col gap-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} placeholder="Author Name *" className="input-field" />
            <input value={form.author_role} onChange={(e) => setForm({ ...form, author_role: e.target.value })} placeholder="Role" className="input-field" />
            <input value={form.author_company} onChange={(e) => setForm({ ...form, author_company: e.target.value })} placeholder="Company" className="input-field" />
          </div>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} placeholder="Review content *" className="textarea-field" />
          <div className="flex items-center gap-3">
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="select-field w-auto" style={{ minWidth: 120 }}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r} style={{ background: '#111' }}>{r} Stars</option>)}
            </select>
            <button type="submit" className="btn-primary text-sm">Add Review</button>
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card rounded-xl p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{review.author_name}</p>
              {(review.author_role || review.author_company) && <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{[review.author_role, review.author_company].filter(Boolean).join(' · ')}</p>}
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>"{review.content}"</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => togglePublish(review)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" title={review.is_published ? 'Unpublish' : 'Publish'} style={{ background: review.is_published ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)', color: review.is_published ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                {review.is_published ? <Check size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => deleteReview(review.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamTab({ queryClient }: { queryClient: ReturnType<typeof useQueryClient> }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TeamMember>>({});

  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ['admin-team'],
    queryFn: async () => { const { data } = await supabase.from('team_members').select('*').order('display_order'); return data || []; },
  });

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await supabase.from('team_members').update(editData).eq('id', editId);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Saved');
    setEditId(null);
    queryClient.invalidateQueries({ queryKey: ['admin-team'] });
    queryClient.invalidateQueries({ queryKey: ['team'] });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Team Members</h2>
      <div className="flex flex-col gap-4">
        {team.map((member) => (
          <div key={member.id} className="glass-card rounded-xl p-5">
            {editId === member.id ? (
              <div className="flex flex-col gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Name" className="input-field" />
                  <input value={editData.role || ''} onChange={(e) => setEditData({ ...editData, role: e.target.value })} placeholder="Role" className="input-field" />
                </div>
                <input value={editData.image_url || ''} onChange={(e) => setEditData({ ...editData, image_url: e.target.value })} placeholder="Image URL" className="input-field" />
                <textarea value={editData.bio || ''} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} rows={3} placeholder="Bio" className="textarea-field" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="btn-primary text-xs px-4 py-2">Save</button>
                  <button onClick={() => setEditId(null)} className="btn-secondary text-xs px-4 py-2">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {member.image_url && <img src={member.image_url} alt={member.name} className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white">{member.name}</h3>
                  <p className="text-sm mb-1" style={{ color: '#f5b800' }}>{member.role}</p>
                  {member.bio && <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{member.bio}</p>}
                </div>
                <button onClick={() => { setEditId(member.id!); setEditData(member); }} className="btn-secondary text-xs px-3 py-1.5">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { useAdminAuth: _auth } = { useAdminAuth };
  const { changePin } = useAdminAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const { data: rawSettings } = useQuery({
    queryKey: ['admin-settings-all'],
    queryFn: async () => { const { data } = await supabase.from('admin_settings').select('key, value'); return data || []; },
  });

  useEffect(() => {
    if (rawSettings) {
      const map: Record<string, string> = {};
      rawSettings.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      setSettings(map);
    }
  }, [rawSettings]);

  const saveSetting = async (key: string) => {
    setSaving(true);
    const { error } = await supabase.from('admin_settings').upsert({ key, value: settings[key], updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) toast.error('Failed to save');
    else { toast.success('Saved'); queryClient.invalidateQueries({ queryKey: ['settings'] }); }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await changePin(currentPin, newPin);
    if (!success) toast.error(error);
    else { toast.success('PIN changed'); setCurrentPin(''); setNewPin(''); }
  };

  const fields: [string, string][] = [
    ['business_email', 'Business Email'],
    ['business_phone', 'Phone Number'],
    ['business_whatsapp', 'WhatsApp Number (with country code, e.g. 2347...)'],
    ['instagram_url', 'Instagram URL'],
    ['tiktok_url', 'TikTok URL'],
    ['twitter_url', 'Twitter/X URL'],
    ['footer_tagline', 'Footer Tagline'],
    ['footer_description', 'Footer Description'],
    ['hero_headline', 'Hero Headline'],
    ['hero_subtext', 'Hero Subtext'],
    ['seo_home_title', 'SEO Home Title'],
    ['seo_home_description', 'SEO Home Description'],
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
      <div className="glass-card rounded-xl p-6 mb-6">
        <h3 className="text-base font-bold text-white mb-5">Site Settings</h3>
        <div className="flex flex-col gap-4">
          {fields.map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
              <div className="flex gap-2">
                <input value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="input-field flex-1" />
                <button onClick={() => saveSetting(key)} disabled={saving} className="btn-primary text-xs px-4 py-2.5 flex-shrink-0">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-5">Change Admin PIN</h3>
        <form onSubmit={handleChangePin} className="flex flex-col gap-3 max-w-sm">
          <input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} placeholder="Current PIN" className="input-field" />
          <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="New PIN" className="input-field" />
          <button type="submit" className="btn-primary text-sm">Change PIN</button>
        </form>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const { data: events = [] } = useQuery<AnalyticsEvent[]>({
    queryKey: ['admin-analytics'],
    queryFn: async () => { const { data } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(100); return data || []; },
  });

  const eventCounts: Record<string, number> = {};
  events.forEach((e) => { eventCounts[e.event_type] = (eventCounts[e.event_type] || 0) + 1; });

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(eventCounts).map(([type, count]) => (
          <div key={type} className="glass-card rounded-xl p-5">
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{type.replace(/_/g, ' ').toUpperCase()}</p>
            <p className="text-3xl font-black" style={{ color: '#f5b800' }}>{count}</p>
          </div>
        ))}
        {Object.keys(eventCounts).length === 0 && <p className="text-sm col-span-3" style={{ color: 'rgba(255,255,255,0.35)' }}>No events tracked yet. Events will appear as users interact with the site.</p>}
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <h3 className="text-sm font-bold text-white">Recent Activity</h3>
        </div>
        <div className="divide-y" style={{ divideColor: 'rgba(255,255,255,0.04)' }}>
          {events.slice(0, 50).map((event) => (
            <div key={event.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-white">{event.event_type}</span>
                {event.page && <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{event.page}</span>}
              </div>
              {event.created_at && <span className="text-[10px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>{formatDate(event.created_at)}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
