import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../lib/api-client';
import posthog from '../lib/posthog';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
  isError?: boolean;
}

interface AIContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isProcessing: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
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
    processingRef.current = true;
    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);

    if (posthog.__loaded) {
      posthog.capture('ai_message_sent');
    }

    try {
      const result = await api.aiChat(message.trim());

      if (result.success && result.data) {
        const assistantMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: result.data.reply,
          timestamp: new Date(),
          toolsUsed: result.data.tools_used,
        };
        setMessages(prev => [...prev, assistantMsg]);

        if (posthog.__loaded && result.data.tools_used && result.data.tools_used.length > 0) {
          posthog.capture('ai_tool_used', {
            tools_count: result.data.tools_used.length,
          });
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

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <AIContext.Provider value={{ messages, isOpen, isProcessing, openChat, closeChat, sendMessage, clearMessages }}>
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
