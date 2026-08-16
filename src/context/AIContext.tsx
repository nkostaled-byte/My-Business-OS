import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../lib/api-client';
import posthog from '../lib/posthog';

export interface PendingAction {
  id: string;
  type: string;
  label: string;
  destructive: boolean;
  fields: Record<string, string | number>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  pendingAction?: PendingAction;
  actionStatus?: 'pending' | 'completed' | 'cancelled' | 'failed';
}

interface AIContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isProcessing: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  confirmAction: (actionId: string, confirmed: boolean) => Promise<void>;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

let messageIdCounter = 0;

function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const pendingActionRef = useRef<PendingAction | null>(null);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (posthog.__loaded) {
      posthog.capture('ai_chat_opened');
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (processingRef.current || !message.trim()) return;

    const trimmedMessage = message.trim();
    const lowerMessage = trimmedMessage.toLowerCase();

    // Check if there's a pending action and user is confirming/cancelling
    if (pendingActionRef.current) {
      const confirmKeywords = ['yes', 'confirm', 'ok', 'okay', 'sure', 'do it', 'go ahead', 'proceed', 'yep', 'yeah'];
      const cancelKeywords = ['no', 'cancel', 'nevermind', 'never mind', 'dont', "don't", 'stop', 'nope', 'nah'];

      const isConfirm = confirmKeywords.some(kw => lowerMessage === kw || lowerMessage.includes(kw));
      const isCancel = cancelKeywords.some(kw => lowerMessage === kw || lowerMessage.includes(kw));

      if (isConfirm || isCancel) {
        const actionId = pendingActionRef.current.id;
        const confirmed = isConfirm;
        pendingActionRef.current = null; // Clear immediately to prevent double-processing

        processingRef.current = true;
        setIsProcessing(true);

        const userMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'user',
          content: trimmedMessage,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        if (posthog.__loaded) {
          posthog.capture(confirmed ? 'ai_write_action_confirmed' : 'ai_write_action_cancelled', {
            action_id: actionId,
          });
        }

        try {
          const result = await api.confirmAiAction(actionId, confirmed);

          if (result.success && result.data) {
            const data = result.data;
            const resultMsg: ChatMessage = {
              id: generateMessageId(),
              role: 'assistant',
              content: data.reply,
              timestamp: new Date(),
              actionStatus: data.status === 'completed' ? 'completed' : data.status === 'cancelled' ? 'cancelled' : 'failed',
            };
            setMessages(prev => prev.map(msg =>
              msg.pendingAction?.id === actionId
                ? { ...msg, actionStatus: data.status as ChatMessage['actionStatus'] }
                : msg
            ));
            setMessages(prev => [...prev, resultMsg]);

            if (posthog.__loaded && data.status === 'completed') {
              posthog.capture('ai_write_action_completed', {
                action_type: data.action_type,
              });
            } else if (posthog.__loaded && data.status === 'failed') {
              posthog.capture('ai_write_action_failed', {
                action_type: data.action_type,
              });
            }
          } else {
            const errorMsg: ChatMessage = {
              id: generateMessageId(),
              role: 'assistant',
              content: result.error || 'Sorry, the action could not be completed. Please try again.',
              timestamp: new Date(),
              isError: true,
            };
            setMessages(prev => prev.map(msg =>
              msg.pendingAction?.id === actionId ? { ...msg, actionStatus: 'failed' } : msg
            ));
            setMessages(prev => [...prev, errorMsg]);

            if (posthog.__loaded) {
              posthog.capture('ai_write_action_failed');
            }
          }
        } catch {
          const errorMsg: ChatMessage = {
            id: generateMessageId(),
            role: 'assistant',
            content: 'Sorry, the action could not be completed. Please try again.',
            timestamp: new Date(),
            isError: true,
          };
          setMessages(prev => prev.map(msg =>
            msg.pendingAction?.id === actionId ? { ...msg, actionStatus: 'failed' } : msg
          ));
          setMessages(prev => [...prev, errorMsg]);
        } finally {
          setIsProcessing(false);
          processingRef.current = false;
        }
        return;
      }
    }

    // Normal message flow
    processingRef.current = true;
    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);

    if (posthog.__loaded) {
      posthog.capture('ai_message_sent');
    }

    try {
      const result = await api.aiChat(trimmedMessage);

      if (result.success && result.data) {
        const assistantMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: result.data.reply,
          timestamp: new Date(),
          pendingAction: result.data.pending_action,
          actionStatus: result.data.pending_action ? 'pending' : undefined,
        };
        setMessages(prev => [...prev, assistantMsg]);

        // Update the pending action ref
        if (result.data.pending_action) {
          pendingActionRef.current = result.data.pending_action;
          if (posthog.__loaded) {
            posthog.capture('ai_write_action_requested', {
              action_type: result.data.pending_action.type,
            });
          }
        } else {
          pendingActionRef.current = null;
        }
      } else {
        const errorMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: result.error || 'Sorry, I couldn\'t complete that request. Please try again.',
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Sorry, I couldn\'t complete that request. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, []);

  const confirmAction = useCallback(async (actionId: string, confirmed: boolean) => {
    if (processingRef.current) return;
    pendingActionRef.current = null; // Clear the pending action ref
    processingRef.current = true;
    setIsProcessing(true);

    if (posthog.__loaded) {
      posthog.capture(confirmed ? 'ai_write_action_confirmed' : 'ai_write_action_cancelled', {
        action_id: actionId,
      });
    }

    try {
      const result = await api.confirmAiAction(actionId, confirmed);

      if (result.success && result.data) {
        const data = result.data;
        const resultMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
          actionStatus: data.status === 'completed' ? 'completed' : data.status === 'cancelled' ? 'cancelled' : 'failed',
        };
        setMessages(prev => prev.map(msg =>
          msg.pendingAction?.id === actionId
            ? { ...msg, actionStatus: data.status as ChatMessage['actionStatus'] }
            : msg
        ));
        setMessages(prev => [...prev, resultMsg]);

        if (posthog.__loaded && data.status === 'completed') {
          posthog.capture('ai_write_action_completed', {
            action_type: data.action_type,
          });
        } else if (posthog.__loaded && data.status === 'failed') {
          posthog.capture('ai_write_action_failed', {
            action_type: data.action_type,
          });
        }
      } else {
        const errorMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: result.error || 'Sorry, the action could not be completed. Please try again.',
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => prev.map(msg =>
          msg.pendingAction?.id === actionId ? { ...msg, actionStatus: 'failed' } : msg
        ));
        setMessages(prev => [...prev, errorMsg]);

        if (posthog.__loaded) {
          posthog.capture('ai_write_action_failed');
        }
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Sorry, the action could not be completed. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => prev.map(msg =>
        msg.pendingAction?.id === actionId ? { ...msg, actionStatus: 'failed' } : msg
      ));
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    pendingActionRef.current = null;
  }, []);

  return (
    <AIContext.Provider value={{ messages, isOpen, isProcessing, openChat, closeChat, sendMessage, confirmAction, clearMessages }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
