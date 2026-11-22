import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Shield,
  Bot,
  User,
} from 'lucide-react';

export const ConciergeChat: React.FC = () => {
  const {
    chatMessages,
    sendChatMessage,
    isChatOpen,
    setIsChatOpen,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'Arrange airport limousine',
    'Request 4:00 PM late check-out',
    'Recommend Michelin dining near Tokyo',
    'How do I redeem my loyalty points?',
  ];

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !attachedImage) return;

    sendChatMessage(inputMessage.trim(), attachedImage || undefined);
    setInputMessage('');
    setAttachedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
          aria-label="Open 24/7 Concierge Chat"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-amber-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-stone-900" />
          </div>
          <span className="text-xs font-bold hidden sm:inline group-hover:inline transition-all">
            24/7 VIP Concierge
          </span>
        </button>
      )}

      {/* Chat Popover Window */}
      {isChatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed bottom-4 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-96 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in slide-in-from-bottom-5"
        >
          {/* Header */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center font-bold text-xs">
                  LS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-stone-900" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Lord Sterling</span>
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest font-normal">
                    VIP Butler
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Available 24/7 • Instant Reply</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-stone-50/50 dark:bg-stone-950/40">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="attachment"
                        className="rounded-xl mb-2 max-h-40 w-full object-cover"
                      />
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputMessage(prompt);
                }}
                className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Image attachment preview */}
          {attachedImage && (
            <div className="px-4 py-2 bg-stone-100 dark:bg-stone-800 flex items-center justify-between text-xs">
              <span className="truncate max-w-[200px] text-stone-600 dark:text-stone-300">
                Image attached
              </span>
              <button
                onClick={() => setAttachedImage(null)}
                className="text-stone-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Controls */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Attach media or hotel receipt"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your concierge anything..."
              className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-amber-600 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() && !attachedImage}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
