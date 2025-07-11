import { useState, useEffect } from 'react';
import { adapterService, CommunicationAdapter } from '@/services/adapter';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
  adapterId: string;
  adapterName?: string;
}

interface UseAdapterLogsParams {
  adapterId?: string;
  level?: 'info' | 'warn' | 'error';
  search?: string;
  startDate?: string;
  endDate?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useAdapterLogs = (params: UseAdapterLogsParams = {}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [adapters, setAdapters] = useState<CommunicationAdapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchAdapters = async () => {
    try {
      const response = await adapterService.getAdapters();
      if (response.success && response.data) {
        setAdapters(response.data.adapters);
      }
    } catch (err) {
      console.error('Failed to fetch adapters:', err);
    }
  };

  const fetchLogs = async () => {
    if (!params.adapterId) {
      setLogs([]);
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const response = await adapterService.getAdapterLogs(params.adapterId, {
        level: params.level,
        startDate: params.startDate,
        endDate: params.endDate,
        limit: 1000,
      });

      if (response.success && response.data) {
        // Transform the API response to our LogEntry format
        const transformedLogs: LogEntry[] = response.data.map((log: any, index: number) => ({
          id: log.id || `log-${index}`,
          timestamp: log.timestamp || new Date().toISOString(),
          level: log.level || 'info',
          message: log.message || 'No message',
          details: log.details,
          adapterId: params.adapterId!,
          adapterName: adapters.find(a => a.id === params.adapterId)?.name,
        }));

        // Apply search filter if provided
        let filteredLogs = transformedLogs;
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredLogs = transformedLogs.filter(log =>
            log.message.toLowerCase().includes(searchLower) ||
            (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
          );
        }

        // Sort by timestamp (newest first)
        filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setLogs(filteredLogs);
      } else {
        setError(response.error || 'Failed to fetch logs');
        setLogs([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLogs();
  };

  // Fetch adapters on mount
  useEffect(() => {
    fetchAdapters();
  }, []);

  // Fetch logs when parameters change
  useEffect(() => {
    fetchLogs();
  }, [params.adapterId, params.level, params.search, params.startDate, params.endDate]);

  // Auto refresh setup
  useEffect(() => {
    if (params.autoRefresh && params.adapterId) {
      const interval = setInterval(fetchLogs, params.refreshInterval || 30000);
      return () => clearInterval(interval);
    }
  }, [params.autoRefresh, params.refreshInterval, params.adapterId]);

  return {
    logs,
    adapters,
    loading,
    error,
    refetch,
  };
};