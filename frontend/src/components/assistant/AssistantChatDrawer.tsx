import React, { useState, useRef, useEffect } from 'react';
import { api } from '@/services/api';
import { Drawer } from '@/components/ui/Drawer';
import { ProvenanceBadge } from '@/components/ui/ProvenanceBadge';
import { BotIcon, SendIcon, SparklesIcon, RouteIcon, BoltIcon, LeafIcon } from '@/components/icons';

interface AssistantChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCorridor?: (segmentId: string) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  tools?: string[];
  timestamp?: string;
}

export const AssistantChatDrawer: React.FC<AssistantChatDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCorridor,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Greetings, Administrator. I am your Coimbatore Urban Intelligence Assistant, grounded strictly in live database telemetry and digital twin models. You can ask me about current traffic bottlenecks, ML forecasts, TANGEDCO power demand, or air quality.",
      citations: ['SYSTEM_BASE_TWIN'],
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim() || loading) return;

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const newMessages: Message[] = [...messages, { sender: 'user', text: msg, timestamp: time }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAssistant(msg);
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: res.reply,
          citations: res.data_citations,
          tools: res.tools_executed,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: 'assistant',
          text: "I encountered an error querying the digital twin state. Please verify server connectivity.",
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const starterChips = [
    { label: 'Worst bottlenecks', query: 'Show worst traffic bottlenecks right now' },
    { label: 'Avinashi delays', query: 'Explain traffic delays on Avinashi Road' },
    { label: 'Peak power forecast', query: 'What is today expected peak power demand?' },
    { label: 'Air quality status', query: 'What is the current air quality and vehicle emission share?' },
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Grounded AI Assistant"
      subtitle="Autonomous urban query agent strictly grounded in live twin data"
      badge={<ProvenanceBadge origin="LIVE API" size="sm" />}
      width="w-full sm:w-[440px]"
    >
      {/* Grounding Trust Notice */}
      <div className="p-2.5 rounded-lg bg-ghats-soft border border-ghats/30 text-[11px] text-ghats flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-ghats animate-pulse" />
          Grounded in live twin state (Zero Hallucination)
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ghats-dark font-semibold">
          VERIFIED RAG
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-3 min-h-[300px] max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 text-[10px] text-ink-lo mb-1 px-1">
              <span>{m.sender === 'user' ? 'Operator' : 'AI Assistant'}</span>
              <span>•</span>
              <span className="font-mono">{m.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[88%] shadow-atlas-sm ${
                m.sender === 'user'
                  ? 'bg-indigo text-white rounded-br-none'
                  : 'bg-surface text-ink-hi border border-line rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Citations Chips under Assistant Answer */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-line/50 flex flex-wrap items-center gap-1">
                  <span className="text-[9px] font-mono text-ink-lo uppercase tracking-wider">
                    Sources:
                  </span>
                  {m.citations.map((c, i) => (
                    <span
                      key={i}
                      onClick={() => {
                        if (c.startsWith('SEG_')) {
                          onSelectCorridor?.(c);
                        }
                      }}
                      className="inline-flex items-center font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface-sunken text-indigo border border-indigo/20 cursor-pointer hover:bg-indigo-soft transition-colors"
                      title={`Citation: ${c}`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-2 p-3 bg-surface border border-line rounded-xl w-32 shadow-atlas-sm">
            <BotIcon className="w-3.5 h-3.5 text-indigo animate-bounce" />
            <span className="text-xs text-ink-mid">Querying twin...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="space-y-1.5 pt-2 border-t border-line">
        <span className="text-[10px] font-mono text-ink-lo uppercase tracking-wider">
          Suggested Municipal Inquiries:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {starterChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip.query)}
              type="button"
              className="text-[11px] px-2.5 py-1 rounded-full bg-surface hover:bg-indigo-soft border border-line text-ink-mid hover:text-indigo font-medium transition-all shadow-atlas-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about traffic, energy grid, or AQI..."
          className="flex-1 bg-surface-sunken border border-line rounded-xl px-3.5 py-2.5 text-xs text-ink-hi placeholder-ink-lo outline-none focus:border-indigo focus:ring-1 focus:ring-indigo/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo text-white hover:bg-indigo-dark disabled:opacity-50 disabled:cursor-not-allowed shadow-atlas-sm transition-all"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>
    </Drawer>
  );
};
