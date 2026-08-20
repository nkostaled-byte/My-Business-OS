import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import api, { NotificationRecord } from '../lib/api-client';
import { getSupabaseClient } from '../lib/auth-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface NotificationContextType {
  notifications: NotificationRecord[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const initializedRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const result = await api.getNotifications(50);
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch (err) {
      console.error('[NotificationContext] Failed to fetch notifications:', err);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      setLoading(true);
      await fetchNotifications();

      const supabase = getSupabaseClient();

      const channel = supabase
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            const newNotif = payload.new as NotificationRecord;
            setNotifications(prev => {
              if (prev.some(n => n.id === newNotif.id)) return prev;
              return [newNotif, ...prev].slice(0, 50);
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            const updated = payload.new as NotificationRecord;
            setNotifications(prev =>
              prev.map(n => (n.id === updated.id ? updated : n))
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'notifications',
          },
          (payload) => {
            const deleted = payload.old as { id: string };
            setNotifications(prev => prev.filter(n => n.id !== deleted.id));
          }
        )
        .subscribe();

      channelRef.current = channel;
      setLoading(false);
    };

    init();

    return () => {
      const ch = channelRef.current;
      if (ch) {
        try {
          const sb = getSupabaseClient();
          sb.removeChannel(ch);
        } catch {
          // ignore
        }
        channelRef.current = null;
      }
      initializedRef.current = false;
    };
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      )
    );
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      console.error('[NotificationContext] Failed to mark as read:', err);
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || now })));
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.error('[NotificationContext] Failed to mark all as read:', err);
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id);
    } catch (err) {
      console.error('[NotificationContext] Failed to delete notification:', err);
      await fetchNotifications();
    }
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
