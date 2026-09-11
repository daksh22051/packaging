import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  Truck,
  Leaf,
  RefreshCw
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; action: string; link?: string }[];
}

export const CircularAiDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, userStats } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello! I'm Circular AI. I track packaging material streams, circular match viability, transport emission vectors, and material savings for ${currentUser?.name || 'your facility'}. How can I assist your circular operations today?`,
      timestamp: 'Just now',
      actions: [
        { label: 'Explore Smart Matches', action: 'navigate', link: '/matches' },
        { label: 'Calculate Net Impact', action: 'navigate', link: '/impact' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'I have 3 tonnes of plastic waste near Ahmedabad.',
    'Find buyers for my cardboard.',
    'Which listing can save me the most money?',
    'How much CO₂ can this transaction avoid?',
    'Optimize delivery for order CIR-2026-8901'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiService.askCircularAi(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.suggestedActions
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'I apologize, but I could not analyze that request right now. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#14261D]/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 border-l border-[#E2EAE4] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAEFEA] bg-[#F7FAF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#16382C] text-emerald-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#182620]">Circular AI</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  v2.4 Online
                </span>
              </div>
              <p className="text-[11px] text-[#55695E]">
                Autonomous Material & Carbon Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6A7B72] hover:bg-[#EEF4F0] hover:text-[#182620]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick context banner */}
        <div className="px-4 py-2 bg-[#EEF5F0] border-b border-[#DEE9E1] text-[11px] text-[#294B3C] flex items-center justify-between">
          <span>Active context: <strong>{currentUser?.name || 'Your Enterprise'}</strong> ({currentUser?.city || 'Local'})</span>
          <span>Score: <strong>{userStats?.circularityScore ?? 82}/100</strong></span>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#16382C] text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#16382C] text-white rounded-tr-xs'
                    : 'bg-[#F4F8F5] text-[#1B2923] border border-[#E0EBE3] rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#D9E5DC] flex flex-wrap gap-2">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (act.link) {
                            navigate(act.link);
                            onClose();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#CDDCD1] text-xs font-semibold text-[#16382C] hover:bg-emerald-50 transition-colors"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    m.sender === 'user' ? 'text-emerald-200' : 'text-[#75897E]'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#E2EBE5] text-[#16382C] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-[#52655A] italic">
              <div className="w-6 h-6 rounded-md bg-[#16382C] text-emerald-300 flex items-center justify-center">
                <Bot className="w-3 h-3" />
              </div>
              <span>Circular AI is analyzing material databases...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-t border-[#EAEFEA] bg-[#FAFCFA]">
          <p className="text-[10px] font-semibold text-[#7E9186] uppercase tracking-wider mb-2">
            Suggested Prompts
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            {promptSuggestions.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isTyping}
                className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-white border border-[#D5E1D8] text-[#2F3E36] hover:bg-[#EEF5F0] hover:border-[#BED0C3] transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="p-3 sm:p-4 border-t border-[#EAEFEA] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Circular AI about materials, carbon, matches..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 bg-[#F6FAF7] border border-[#D9E3DC] rounded-xl text-xs sm:text-sm text-[#1A2520] placeholder-[#798C81] focus:outline-none focus:ring-2 focus:ring-[#16382C]/20 focus:bg-white"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputValue.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            />
          </form>
          <p className="text-[10px] text-[#7A8E82] text-center mt-2">
            AI estimates carbon and material values based on WARM v15 and regional telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
