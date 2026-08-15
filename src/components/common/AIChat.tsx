import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI, ChatMessage } from '../../context/AIContext';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const AIChat: React.FC = () => {
  const { messages, isOpen, isProcessing, openChat, closeChat, sendMessage, clearMessages } = useAI();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-1'}`}>
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Assistant
              </span>
            </div>
          )}
          <div
            className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              isUser
                ? 'bg-indigo-600 text-white rounded-br-md'
                : msg.isError
                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-bl-md'
                : 'glass-subtle text-slate-800 dark:text-slate-200 rounded-bl-md'
            }`}
          >
            {msg.isError && (
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Error</span>
              </div>
            )}
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {msg.toolsUsed && msg.toolsUsed.length > 0 && (
              <div className="mt-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                  Searched: {msg.toolsUsed.join(', ')}
                </span>
              </div>
            )}
          </div>
          <span className={`block text-[9px] text-slate-400 dark:text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={openChat}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-20 z-40 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl cursor-pointer transition-colors ${
          isOpen
            ? 'bg-slate-700 dark:bg-slate-600'
            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
        }`}
        title="AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-2xs lg:hidden"
              onClick={closeChat}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] sm:max-h-[600px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                      AI Assistant
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Ask about your business
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearMessages}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Clear conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeChat}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer lg:hidden"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      How can I help you?
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[200px] leading-relaxed">
                      Ask about bookings, orders, products, revenue, or any business data.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                      {['Today\'s bookings', 'Revenue this month', 'Low stock products'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            sendMessage(suggestion);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium glass-subtle text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map(renderMessage)}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          Assistant
                        </span>
                      </div>
                      <div className="glass-subtle px-3.5 py-2.5 rounded-2xl rounded-bl-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your business..."
                    rows={1}
                    disabled={isProcessing}
                    className="flex-1 resize-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 dark:focus:border-indigo-600 transition-all disabled:opacity-50 max-h-[120px]"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isProcessing}
                    className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-default transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
