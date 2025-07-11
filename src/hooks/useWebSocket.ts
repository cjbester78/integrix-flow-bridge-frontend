import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeUpdate, Message, MessageStats } from '@/types/message';

interface UseWebSocketOptions {
  url?: string;
  protocols?: string[];
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = 'ws://localhost:8080/ws',
    protocols,
    onOpen,
    onClose,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    autoConnect = true,
  } = options;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  const connect = useCallback(() => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url, protocols);

      ws.onopen = (event) => {
        setIsConnected(true);
        setIsConnecting(false);
        setReconnectCount(0);
        setError(null);
        onOpen?.(event);
        console.log('WebSocket connected');
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setSocket(null);
        onClose?.(event);
        
        // Attempt reconnection if not manually closed
        if (!event.wasClean && reconnectCount < reconnectAttempts) {
          console.log(`WebSocket disconnected. Attempting reconnection ${reconnectCount + 1}/${reconnectAttempts}`);
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1);
            connect();
          }, reconnectInterval);
        } else if (reconnectCount >= reconnectAttempts) {
          setError('Max reconnection attempts reached');
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket connection error');
        setIsConnecting(false);
        onError?.(event);
        console.error('WebSocket error:', event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as RealtimeUpdate;
          const handler = messageHandlersRef.current.get(data.type);
          if (handler) {
            handler(data);
          }
          
          // Broadcast to all handlers for 'all' type
          const allHandler = messageHandlersRef.current.get('all');
          if (allHandler) {
            allHandler(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      setSocket(ws);
    } catch (error) {
      setError('Failed to create WebSocket connection');
      setIsConnecting(false);
      console.error('WebSocket creation error:', error);
    }
  }, [url, protocols, onOpen, onClose, onError, reconnectAttempts, reconnectInterval, reconnectCount, isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close(1000, 'Manual disconnect');
      setSocket(null);
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    setReconnectCount(0);
  }, [socket]);

  const subscribe = useCallback((messageType: string, handler: (data: any) => void) => {
    messageHandlersRef.current.set(messageType, handler);
    
    return () => {
      messageHandlersRef.current.delete(messageType);
    };
  }, []);

  const send = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [socket, isConnected]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    reconnectCount,
    connect,
    disconnect,
    subscribe,
    send,
  };
};

// Hook specifically for message monitoring
export const useMessageWebSocket = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const { isConnected, isConnecting, error, subscribe, send } = useWebSocket({
    url: `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/ws/messages`,
    autoConnect: true,
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  useEffect(() => {
    const unsubscribeMessageCreated = subscribe('message_created', (update: RealtimeUpdate) => {
      if (update.type === 'message_created') {
        setMessages(prev => [update.data as Message, ...prev.slice(0, 999)]); // Keep last 1000 messages
        setNewMessageCount(prev => prev + 1);
      }
    });

    const unsubscribeMessageUpdated = subscribe('message_updated', (update: RealtimeUpdate) => {
      if (update.type === 'message_updated') {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === (update.data as Message).id ? update.data as Message : msg
          )
        );
      }
    });

    const unsubscribeStatsUpdated = subscribe('stats_updated', (update: RealtimeUpdate) => {
      if (update.type === 'stats_updated') {
        setStats(update.data as MessageStats);
      }
    });

    return () => {
      unsubscribeMessageCreated();
      unsubscribeMessageUpdated();
      unsubscribeStatsUpdated();
    };
  }, [subscribe]);

  const clearNewMessageCount = useCallback(() => {
    setNewMessageCount(0);
  }, []);

  const subscribeToFilters = useCallback((filters: any) => {
    send({
      type: 'subscribe_filters',
      data: filters,
    });
  }, [send]);

  const unsubscribeFromFilters = useCallback(() => {
    send({
      type: 'unsubscribe_filters',
    });
  }, [send]);

  return {
    messages,
    stats,
    newMessageCount,
    isConnected,
    isConnecting,
    error,
    clearNewMessageCount,
    subscribeToFilters,
    unsubscribeFromFilters,
  };
};