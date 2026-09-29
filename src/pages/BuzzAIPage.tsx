import { useState, useRef, useEffect } from 'react';
import { Send, Zap, Loader, Plus, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BUZZ_AI_PROMPTS, LOGO_WHITE_URL } from '@/constants';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';
import type { ChatMessage } from '@/types';

const SUGGESTED = [
  { icon: '🚀', label: 'What services do you offer?' },
  { icon: '💼', label: 'I need a website for my business' },
  { icon: '📊', label: 'How can you grow my brand?' },
  { icon: '💬', label: 'How do I contact the team?' },
  { icon: '🤝', label: 'Tell me about joining BuzzLaunch' },
];

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: '#f5b800',
            animation: 'buzz-bounce 1.2s ease-in-out infinite',
            animationDelay: `${d}ms`,
          }}
        />
      ))}
    </span>
  );
}

function MessageBubble({ msg, isLast, loading }: { msg: ChatMessage; isLast: boolean; loading: boolean }) {
  const isUser = msg.role === 'user';
  const isEmpty = !msg.content && isLast && loading;

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5"
          style={{ background: 'linear-gradient(135deg, rgba(245,184,0,0.2), rgba(245,184,0,0.08))', border: '1px solid rgba(245,184,0,0.2)' }}
        >
          <Zap size={14} style={{ color: '#f5b800' }} />
        </div>
      )}

      <div className={`max-w-[75%] sm:max-w-[68%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className="px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #f5b800, #e0a800)',
                  color: '#0a0a0a',
                  borderRadius: '18px 18px 4px 18px',
                  fontWeight: 500,
                }
              : {
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.88)',
                  borderRadius: '4px 18px 18px 18px',
                  border: '1px solid rgba(255,255,255,0.07)',
                }
          }
        >
          {isEmpty ? <TypingDots /> : msg.content}
        </div>
      </div>
    </div>
  );
}

export default function BuzzAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => { trackEvent('page_view', '/buzzai'); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [input]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setError('');
    const userMsg: ChatMessage = { role: 'user', content: content.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buzz-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: updated }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'AI service error');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            aiContent += delta;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: 'assistant', content: aiContent };
              return next;
            });
          } catch { /* ignore parse errors */ }
        }
      }
    } catch (err: unknown) {
      console.error('BuzzAI error:', err);
      setError('Something went wrong. Please try again.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const newChat = () => {
    setMessages([]);
    setError('');
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#080808' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(245,184,0,0.2), rgba(245,184,0,0.06))', border: '1px solid rgba(245,184,0,0.2)' }}
            >
              <Zap size={16} style={{ color: '#f5b800' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-white leading-none">BuzzAI</h1>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(245,184,0,0.12)', color: '#f5b800', letterSpacing: '0.03em' }}
                >
                  BETA
                </span>
              </div>
              <p className="text-[11px] mt-0.5 leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>
                by BuzzLaunch Media
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Online indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80' }} />
            <span className="text-[11px] font-medium" style={{ color: '#4ade80' }}>Online</span>
          </div>

          {hasMessages && (
            <button
              onClick={newChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Plus size={13} />
              <span className="hidden sm:inline">New chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Empty / Welcome State */
          <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 text-center">
            {/* Glow orb */}
            <div className="relative mb-8">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ background: '#f5b800', transform: 'scale(2)' }}
              />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,184,0,0.18), rgba(245,184,0,0.05))',
                  border: '1px solid rgba(245,184,0,0.25)',
                  boxShadow: '0 0 40px rgba(245,184,0,0.12)',
                }}
              >
                <Zap size={34} style={{ color: '#f5b800' }} />
              </div>
            </div>

            <img src={LOGO_WHITE_URL} alt="BuzzLaunch" className="h-7 w-auto mb-4 opacity-50" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              Hey, I&apos;m BuzzAI.
            </h2>
            <p className="text-sm sm:text-base mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Your AI guide for everything BuzzLaunch — services, pricing, team and more.
            </p>

            {/* Suggestion chips */}
            <div className="flex flex-col gap-2 w-full max-w-md">
              {SUGGESTED.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.label)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm text-left w-full transition-all duration-150 group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,184,0,0.07)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,184,0,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <span className="text-base flex-shrink-0">{s.icon}</span>
                  <span className="font-medium">{s.label}</span>
                  <Sparkles size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#f5b800' }} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                msg={msg}
                isLast={i === messages.length - 1}
                loading={loading}
              />
            ))}

            {/* Standalone typing indicator if last message was from user */}
            {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex items-end gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5"
                  style={{ background: 'linear-gradient(135deg, rgba(245,184,0,0.2), rgba(245,184,0,0.08))', border: '1px solid rgba(245,184,0,0.2)' }}
                >
                  <Zap size={14} style={{ color: '#f5b800' }} />
                </div>
                <div
                  className="px-4 py-3 rounded-[4px_18px_18px_18px]"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 18px 18px 18px' }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm mx-auto"
                style={{ background: 'rgba(248,113,113,0.07)', color: '#f87171', border: '1px solid rgba(248,113,113,0.13)', maxWidth: 400 }}
              >
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="text-xs underline underline-offset-2 flex-shrink-0"
                  style={{ color: 'rgba(248,113,113,0.7)' }}
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div
        className="flex-shrink-0 px-4 sm:px-6 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,8,0.98)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onFocusCapture={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'rgba(245,184,0,0.3)';
              el.style.background = 'rgba(255,255,255,0.05)';
            }}
            onBlurCapture={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'rgba(255,255,255,0.09)';
              el.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about BuzzLaunch..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-white placeholder-gray-600 leading-relaxed"
              style={{ maxHeight: 140, minHeight: 24 }}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150"
              style={{
                background: input.trim() && !loading ? '#f5b800' : 'rgba(255,255,255,0.05)',
                color: input.trim() && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.18)',
                transform: input.trim() && !loading ? 'scale(1)' : 'scale(0.95)',
              }}
              aria-label="Send"
            >
              {loading ? (
                <Loader size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-center mt-2.5" style={{ color: 'rgba(255,255,255,0.15)' }}>
            BuzzAI may make mistakes. For accurate info, contact us directly.
          </p>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes buzz-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
