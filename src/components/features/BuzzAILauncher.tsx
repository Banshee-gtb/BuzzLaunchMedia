import { useNavigate, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function BuzzAILauncher() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/buzzai' || location.pathname === '/admin') return null;

  return (
    <button
      onClick={() => navigate('/buzzai')}
      className="fixed bottom-6 left-5 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(135deg, #f5b800, #e0a800)',
        color: '#0a0a0a',
        boxShadow: '0 8px 32px rgba(245,184,0,0.3)',
      }}
      aria-label="Open BuzzAI"
    >
      <Zap size={16} />
      <span>BuzzAI</span>
    </button>
  );
}
