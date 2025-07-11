import { useState, useEffect } from 'react';
import { adapterService, CommunicationAdapter } from '@/services/adapter';
import { api } from '@/services/api';

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
      // Fetch logs from multiple sources
      const logPromises = [];
      
      // System logs
      const systemParams = new URLSearchParams();
      if (params.level) systemParams.append('level', params.level);
      if (params.startDate) systemParams.append('startDate', params.startDate);
      if (params.endDate) systemParams.append('endDate', params.endDate);
      if (params.search) systemParams.append('search', params.search);
      systemParams.append('limit', '1000');
      
      logPromises.push(api.get(`/logs/system?${systemParams.toString()}`));

      // Adapter logs (if specific source requested)
      if (params.source === 'adapter' || !params.source) {
        if (params.sourceId) {
          logPromises.push(adapterService.getAdapterLogs(params.sourceId, {
            level: params.level as 'info' | 'warn' | 'error' | undefined,
            startDate: params.startDate,
            endDate: params.endDate,
            limit: 1000,
          }));
        } else {
          // Get logs from all adapters
          sources.adapters.forEach(adapter => {
            if (adapter.id) {
              logPromises.push(adapterService.getAdapterLogs(adapter.id, {
                level: params.level as 'info' | 'warn' | 'error' | undefined,
                startDate: params.startDate,
                endDate: params.endDate,
                limit: 200, // Reduced per adapter to avoid too many logs
              }));
            }
          });
        }
      }

      // Channel logs
      if (params.source === 'channel' || !params.source) {
        sources.channels.forEach(channel => {
          if (channel.id) {
            const channelParams = new URLSearchParams();
            if (params.level) channelParams.append('level', params.level);
            if (params.startDate) channelParams.append('startDate', params.startDate);
            if (params.endDate) channelParams.append('endDate', params.endDate);
            channelParams.append('limit', '200');
            
            logPromises.push(api.get(`/channels/${channel.id}/logs?${channelParams.toString()}`));
          }
        });
      }

      const responses = await Promise.allSettled(logPromises);
      const allLogs: SystemLogEntry[] = [];

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.success) {
          const responseData = response.value.data;
          if (Array.isArray(responseData)) {
            responseData.forEach((log: any, logIndex: number) => {
              // Determine source based on response
              let source: SystemLogEntry['source'] = 'system';
              let sourceId = '';
              let sourceName = '';

              if (index === 0) {
                source = 'system';
              } else if (log.adapterId || log.source === 'adapter') {
                source = 'adapter';
                sourceId = log.adapterId || '';
                sourceName = sources.adapters.find(a => a.id === sourceId)?.name || 'Unknown Adapter';
              } else if (log.channelId || log.source === 'channel') {
                source = 'channel';
                sourceId = log.channelId || '';
                sourceName = sources.channels.find(c => c.id === sourceId)?.name || 'Unknown Channel';
              }

              allLogs.push({
                id: log.id || `log-${index}-${logIndex}`,
                timestamp: log.timestamp || new Date().toISOString(),
                level: log.level || 'info',
                message: log.message || 'No message',
                details: log.details,
                source,
                sourceId,
                sourceName,
              });
            });
          }
        }
      });

      // Apply search filter if provided
      let filteredLogs = allLogs;
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredLogs = allLogs.filter(log =>
          log.message.toLowerCase().includes(searchLower) ||
          log.sourceName?.toLowerCase().includes(searchLower) ||
          (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
        );
      }

      // Sort by timestamp (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setLogs(filteredLogs);
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
    if (sources.adapters.length > 0 || sources.channels.length > 0) {
      fetchLogs();
    }
  }, [params.source, params.sourceId, params.level, params.search, params.startDate, params.endDate, sources]);

  // Auto refresh setup
  useEffect(() => {
    if (params.autoRefresh) {
      const interval = setInterval(fetchLogs, params.refreshInterval || 30000);
      return () => clearInterval(interval);
    }
  }, [params.autoRefresh, params.refreshInterval]);

  return {
    logs,
    sources,
    loading,
    error,
    refetch,
  };
};