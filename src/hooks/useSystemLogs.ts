import { useState, useEffect } from 'react';
import { adapterService, CommunicationAdapter } from '@/services/adapter';
import { api } from '@/services/api';
import { systemErrorLogger } from '@/services/systemErrorLogger';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  details?: any;
  source: 'adapter' | 'system' | 'channel' | 'flow' | 'api';
  sourceId?: string;
  sourceName?: string;
}

interface UseSystemLogsParams {
  source?: 'adapter' | 'system' | 'channel' | 'flow' | 'api';
  sourceId?: string;
  level?: 'info' | 'warn' | 'error' | 'debug';
  search?: string;
  startDate?: string;
  endDate?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useSystemLogs = (params: UseSystemLogsParams = {}) => {
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [sources, setSources] = useState<{adapters: CommunicationAdapter[], channels: any[], flows: any[]}>({
    adapters: [],
    channels: [],
    flows: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchSources = async () => {
    try {
      const [adaptersRes, channelsRes] = await Promise.all([
        adapterService.getAdapters(),
        api.get('/channels')
      ]);
      
      setSources({
        adapters: adaptersRes.success ? adaptersRes.data?.adapters || [] : [],
        channels: channelsRes.success ? channelsRes.data || [] : [],
        flows: [] // Add flows API when available
      });
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // Get logs from the system error logger (includes sample data)
      const systemLogs = systemErrorLogger.getFilteredLogs({
        source: params.source,
        sourceId: params.sourceId,
        level: params.level,
        search: params.search,
      });

      // If we have real API endpoints, we could also fetch from them
      // For now, we'll use the mock system logger
      setLogs(systemLogs);
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

  // Fetch sources on mount
  useEffect(() => {
    fetchSources();
  }, []);

  // Fetch logs when parameters change
  useEffect(() => {
    fetchLogs();
  }, [params.source, params.sourceId, params.level, params.search, params.startDate, params.endDate]);

  // Auto refresh setup
  useEffect(() => {
    if (params.autoRefresh) {
      const interval = setInterval(fetchLogs, params.refreshInterval || 30000);
      return () => clearInterval(interval);
    }
  }, [params.autoRefresh, params.refreshInterval]);

  // Listen for new logs from the system logger
  useEffect(() => {
    const unsubscribe = systemErrorLogger.onLogUpdate(() => {
      fetchLogs(); // Refresh when new logs are added
    });
    return unsubscribe;
  }, []);

  return {
    logs,
    sources,
    loading,
    error,
    refetch,
  };
};