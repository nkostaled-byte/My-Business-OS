import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAI, ChatMessage, PendingAction } from '../../context/AIContext';
import {
  Bot,
  X,
  Send,
  Trash2,
  Loader2,
  AlertCircle,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const AIChat: React.FC = () => {
  const { messages, isOpen, isProcessing, openChat, closeChat, sendMessage, confirmAction, clearMessages } = useAI();
  const [input, setInput] = useState('');
  const [processingActionId, setProcessingActionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeChat]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  }, [input, isProcessing, sendMessage]);

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

  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  };

  const handleConfirmAction = async (action: PendingAction, confirmed: boolean) => {
    if (isProcessing || processingActionId) return;
    setProcessingActionId(action.id);
    try {
      await confirmAction(action.id, confirmed);
    } finally {
      setProcessingActionId(null);
    }
  };

  const renderConfirmationCard = (action: PendingAction, status?: ChatMessage['actionStatus']) => {
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';
    const isFailed = status === 'failed';
    const isProcessingAction = processingActionId === action.id;
    const isBooking = action.type === 'create_booking';
    const fieldEntries = Object.entries(action.fields || {});

    const statusLabel = isCompleted
      ? (isBooking ? 'Booking confirmed' : `${action.label} completed`)
      : isCancelled
      ? (isBooking ? 'Booking cancelled' : `${action.label} cancelled`)
      : '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, delay: 0.1 }}
        className="mt-2 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800"
      >
        {/* Card header */}
        <div className={`px-3 py-2 flex items-center gap-2 ${
          action.destructive
            ? 'bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-800/50'
            : 'bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700'
        }`}>
          {action.destructive ? (
            <ShieldAlert className={`w-3.5 h-3.5 ${isFailed ? 'text-rose-500' : 'text-rose-600 dark:text-rose-400'}`} />
          ) : (
            <Check className={`w-3.5 h-3.5 ${isFailed ? 'text-rose-500' : isCompleted ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
          )}
          <span className={`text-[11px] font-semibold ${
            action.destructive
              ? 'text-rose-700 dark:text-rose-300'
              : 'text-slate-700 dark:text-slate-300'
          }`}>
            {action.label}
          </span>
          {action.destructive && (
            <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase ml-auto">
              Destructive
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="px-3 py-2 space-y-1">
          {fieldEntries.map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-2 text-[11px]">
              <span className="text-slate-400 dark:text-slate-500 font-medium capitalize min-w-[70px]">
                {key}
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {String(value)}
              </span>
            </div>
          ))}
        </div>

        {/* Status / Actions */}
        {isCompleted || isCancelled ? (
          <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <X className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className={`text-[11px] font-semibold ${
                isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {statusLabel}
              </span>
            </div>
          </div>
        ) : isFailed ? (
          <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                Action failed
              </span>
            </div>
          </div>
        ) : isProcessingAction ? (
          <div className="px-3 py-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {isBooking ? 'Creating booking…' : 'Processing…'}
            </span>
          </div>
        ) : (
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <button
              onClick={() => handleConfirmAction(action, true)}
              disabled={isProcessing || !!processingActionId}
              className={`flex-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 ${
                action.destructive
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isBooking ? 'Confirm booking' : 'Confirm'}
            </button>
            <button
              onClick={() => handleConfirmAction(action, false)}
              disabled={isProcessing || !!processingActionId}
              className="flex-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className="max-w-[85%]">
          {!isUser && (
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bot className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Assistant
              </span>
            </div>
          )}
          <div
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
              isUser
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : msg.isError
                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 rounded-bl-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
            }`}
          >
            {msg.isError && (
              <div className="flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Error</span>
              </div>
            )}
            <p className="whitespace-pre-wrap">{cleanMarkdown(msg.content)}</p>
          </div>

          {/* Confirmation card for pending actions */}
          {!isUser && msg.pendingAction && (
            <div className="mt-1.5 ml-0">
              {renderConfirmationCard(msg.pendingAction, msg.actionStatus)}
            </div>
          )}

          <span className={`block text-[9px] text-slate-400 dark:text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Launcher button — positioned left of the FAB */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={isOpen ? closeChat : openChat}
        className="fixed bottom-4 right-[4.5rem] sm:bottom-6 sm:right-[5rem] z-40 w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer transition-colors bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600"
        title="AI Assistant"
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <Bot className="w-5 h-5" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-transparent"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-[4.5rem] right-2 sm:bottom-[5rem] sm:right-6 z-50 w-[calc(100vw-1rem)] max-w-sm sm:w-[22rem] rounded-xl flex flex-col overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900"
              style={{ maxHeight: 'min(65dvh, 560px)', marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                      Assistant
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Business data queries
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {messages.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={clearMessages}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Clear conversation"
                      aria-label="Clear conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={closeChat}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close assistant"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 overscroll-contain">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <Bot className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      How can I help?
                    </h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[180px] leading-relaxed">
                      Ask about bookings, orders, products, revenue, or any business data.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                      {['Today\'s bookings', 'Revenue this month', 'Low stock products'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => sendMessage(suggestion)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
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
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[85%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          Assistant
                        </span>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-xl rounded-bl-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Working...
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
                    className="flex-1 resize-none bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all disabled:opacity-50 max-h-[120px]"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isProcessing}
                    className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
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
