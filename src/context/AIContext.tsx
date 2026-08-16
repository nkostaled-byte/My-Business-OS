import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
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

// Natural-language confirmations/cancellations of a pending action. Matching
// uses word boundaries so "no" never matches "not" or "north".
const CONFIRM_PHRASES = [
  'yes please create it',
  'yes please go ahead',
  'make the booking',
  "that's correct",
  "that's right",
  'that is correct',
  'that is right',
  'yes please',
  'yes do it',
  'go ahead',
  'confirm it',
  'create it',
  'book it',
  'please do',
  'do it',
  'proceed',
  'confirm',
  'yes',
  'sure',
  'okay',
  'ok',
  'yep',
  'yeah',
];

const CANCEL_PHRASES = [
  "don't create it",
  'dont create it',
  "don't book",
  'dont book',
  'cancel that',
  'cancel it',
  'never mind',
  'nevermind',
  'forget it',
  'no thanks',
  'not now',
  'cancel',
  'stop',
  'no',
  'nope',
  'nah',
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesPhrase(message: string, phrase: string): boolean {
  return new RegExp(`\\b${escapeRegex(phrase)}\\b`).test(message);
}

function isConfirmation(message: string): boolean {
  return CONFIRM_PHRASES.some(p => matchesPhrase(message, p));
}

function isCancellation(message: string): boolean {
  return CANCEL_PHRASES.some(p => matchesPhrase(message, p));
}

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);
  const pendingActionRef = useRef<PendingAction | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
      const isConfirm = isConfirmation(lowerMessage);
      const isCancel = isCancellation(lowerMessage);

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
      const history = messagesRef.current.slice(-20).map(m => ({ role: m.role, content: m.content }));
      const result = await api.aiChat(trimmedMessage, { history });

      if (result.success && result.data) {
        const data = result.data;
        const assistantMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
          pendingAction: data.pending_action,
          actionStatus: data.pending_action ? 'pending' : undefined,
        };
        setMessages(prev => [...prev, assistantMsg]);

        // The backend resolved a pending action in the chat handler (confirm /
        // cancel / failed). Sync the pending message's card and clear the local
        // pending action ref.
        if (data.action_id && (data.status === 'completed' || data.status === 'cancelled' || data.status === 'failed')) {
          setMessages(prev => prev.map(msg =>
            msg.pendingAction?.id === data.action_id
              ? { ...msg, actionStatus: data.status as ChatMessage['actionStatus'] }
              : msg
          ));
          pendingActionRef.current = null;
          if (posthog.__loaded && data.status === 'completed') {
            posthog.capture('ai_write_action_completed', {
              action_type: data.action_type,
            });
          } else if (posthog.__loaded && data.status === 'failed') {
            posthog.capture('ai_write_action_failed', {
              action_type: data.action_type,
            });
          }
        } else if (data.pending_action) {
          // A new action is awaiting confirmation.
          pendingActionRef.current = data.pending_action;
          if (posthog.__loaded) {
            posthog.capture('ai_write_action_requested', {
              action_type: data.pending_action.type,
            });
          }
        }
        // else: unrelated reply — keep the existing pending action ref so the
        // user can still confirm or cancel it. The backend also retains it
        // server-side (indexed by client).
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
