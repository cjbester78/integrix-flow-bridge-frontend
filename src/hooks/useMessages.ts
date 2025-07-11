import { useState, useEffect, useCallback } from 'react';
import { messageService } from '@/services/messageService';
import { Message, MessageFilters, MessageStats } from '@/types/message';
import { useMessageWebSocket } from './useWebSocket';

interface UseMessagesOptions {
  filters?: MessageFilters;
  enableRealtime?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useMessages = (options: UseMessagesOptions = {}) => {
  const {
    filters = {},
    enableRealtime = true,
    autoRefresh = false,
    refreshInterval = 30000,
  } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });

  // WebSocket for real-time updates
  const {
    messages: realtimeMessages,
    stats: realtimeStats,
    newMessageCount,
    isConnected: wsConnected,
    clearNewMessageCount,
    subscribeToFilters,
    unsubscribeFromFilters,
  } = useMessageWebSocket();

  // Fetch messages from API
  const fetchMessages = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const response = await messageService.getMessages(filters);
      if (response.success && response.data) {
        setMessages(response.data.messages);
        setPagination({
          total: response.data.total,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
        });
      } else {
        setError(response.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await messageService.getMessageStats({
        timeRange: 'day',
        flowId: filters.flowId,
        customerId: filters.customerId,
      });
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch message stats:', err);
    }
  }, [filters.flowId, filters.customerId]);

  // Retry a message
  const retryMessage = useCallback(async (messageId: string) => {
    try {
      const response = await messageService.retryMessage(messageId);
      if (response.success) {
        // Refresh messages to get updated status
        fetchMessages(false);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to retry message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry message');
      throw err;
    }
  }, [fetchMessages]);

  // Cancel a message
  const cancelMessage = useCallback(async (messageId: string, reason?: string) => {
    try {
      const response = await messageService.cancelMessage(messageId, reason);
      if (response.success) {
        fetchMessages(false);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to cancel message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel message');
      throw err;
    }
  }, [fetchMessages]);

  // Search messages
  const searchMessages = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await messageService.searchMessages(query, {
        searchIn: ['content', 'logs', 'metadata'],
      });
      if (response.success && response.data) {
        setMessages(response.data);
        setPagination(prev => ({ ...prev, total: response.data!.length }));
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  // WebSocket filter subscription
  useEffect(() => {
    if (enableRealtime && wsConnected) {
      subscribeToFilters(filters);
      return () => unsubscribeFromFilters();
    }
  }, [enableRealtime, wsConnected, filters, subscribeToFilters, unsubscribeFromFilters]);

  // Merge real-time messages with fetched messages
  const allMessages = enableRealtime && realtimeMessages.length > 0 
    ? [...realtimeMessages, ...messages].slice(0, filters.limit || 50)
    : messages;

  // Use real-time stats if available
  const currentStats = enableRealtime && realtimeStats ? realtimeStats : stats;

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && !enableRealtime) {
      const interval = setInterval(() => {
        fetchMessages(false);
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, enableRealtime, refreshInterval, fetchMessages, fetchStats]);

  return {
    messages: allMessages,
    stats: currentStats,
    loading,
    error,
    pagination,
    newMessageCount,
    wsConnected,
    retryMessage,
    cancelMessage,
    searchMessages,
    refetch: fetchMessages,
    clearNewMessageCount,
  };
};