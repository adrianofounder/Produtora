'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Send, Loader2, ZapOff, MessageSquare, PanelRightClose, PanelRightOpen, TerminalSquare, Mic, Image as ImageIcon } from 'lucide-react';
import { contextualChatAction } from '@/app/actions/gaveta-actions';
import { ChatMessage } from '@/lib/ai/mock-chat-engine';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContextualChatProps {
  videoId: string;
  activeTab: string; // 'roteiro' | 'audio' | 'asset' | 'exportar'
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const TAB_ICONS: Record<string, React.ElementType> = {
  roteiro: TerminalSquare,
  audio: Mic,
  asset: ImageIcon,
  exportar: MessageSquare,
};

const TAB_NAMES: Record<string, string> = {
  roteiro: 'Diretoria Criativa',
  audio: 'Edição de Som',
  asset: 'Direção de Arte',
  exportar: 'Helpdesk Téc.',
};

type ChatHistories = Record<string, ChatMessage[]>;

export function ContextualChat({ videoId, activeTab, isExpanded, onToggleExpand }: ContextualChatProps) {
  const [histories, setHistories] = useState<ChatHistories>({});
  const [inputValue, setInputValue] = useState('');
  const [isSending, startSending] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const currentHistory = histories[activeTab] || [];

  const updateHistory = (newHistory: ChatMessage[]) => {
    setHistories(prev => ({ ...prev, [activeTab]: newHistory }));
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentHistory]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = { role: 'user', content: inputValue.trim() };
    const newHistory = [...currentHistory, userMsg];
    updateHistory(newHistory);
    setInputValue('');

    startSending(async () => {
      const result = await contextualChatAction(videoId, activeTab, userMsg.content, currentHistory);

      if (result.success) {
        updateHistory([...newHistory, { role: 'assistant', content: result.text }]);
      } else {
        setErrorMsg(result.errorMessage);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const Icon = TAB_ICONS[activeTab] || MessageSquare;
  const TabName = TAB_NAMES[activeTab] || 'Assistente';

  if (!isExpanded) {
    return (
      <div className="h-full flex flex-col items-center py-5 border-l border-white/5 bg-black/20 w-12 shrink-0">
        <button 
          onClick={onToggleExpand}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title="Abrir Chat Contextual"
        >
          <PanelRightOpen className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ width: 48, opacity: 0 }} 
      animate={{ width: 340, opacity: 1 }} 
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full flex flex-col border-l border-[var(--color-accent)]/10 bg-gradient-to-b from-[#0A0A0D]/90 to-black relative shrink-0"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-white">{TabName}</span>
        </div>
        <button 
          onClick={onToggleExpand}
          className="p-1.5 rounded hover:bg-white/10 text-[var(--color-text-3)] hover:text-white transition-colors"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {currentHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-center px-4 space-y-2">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-xs font-medium text-[var(--color-text-2)]">Nenhuma mensagem.</p>
            <p className="text-[10px] text-[var(--color-text-3)]">Use este canal direcional para refinar o roteiro ou pedir dicas de assets.</p>
          </div>
        )}

        {currentHistory.map((msg, idx) => (
          <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "px-3 py-2.5 rounded-xl max-w-[85%] text-sm leading-snug",
              msg.role === 'user' 
                ? "bg-[var(--color-accent)]/20 text-white border border-[var(--color-accent)]/30 rounded-tr-sm" 
                : "bg-white/5 text-[var(--color-text-2)] border border-white/5 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex flex-col items-start">
             <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-2">
               <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--color-accent)]" />
               <span className="text-xs text-[var(--color-text-3)]">Especialista analisando...</span>
             </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {errorMsg && (
        <div className="px-4 mb-2">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 flex items-start gap-2">
            <ZapOff className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
            <p className="text-xs text-red-200">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/5 bg-[#0A0A0D]/50">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            placeholder={isSending ? 'Processando...' : 'Peça um ajuste no roteiro...'}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)]/50 focus:bg-white/10 transition-colors disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[var(--color-accent)] text-white hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
