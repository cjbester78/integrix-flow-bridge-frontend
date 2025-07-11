import { useState, useEffect, useCallback } from 'react';
import { channelService } from '@/services/channelService';
import { ChannelLog, LogLevel, sampleChannelLogs } from '@/components/channels/channelData';
import { useToast } from '@/hooks/use-toast';

interface ChannelLogsFilters {
  level?: LogLevel;
  search?: string;
  adapterId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const useChannelLogs = (channelId: string, filters?: ChannelLogsFilters) => {
  const [logs, setLogs] = useState<ChannelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const loadLogs = useCallback(async () => {
    setLoading(true);
    // Use sample data for demo - replace with actual API call
    setTimeout(() => {
      setLogs(sampleChannelLogs);
      setLoading(false);
    }, 500);
  }, [channelId, filters]);

  useEffect(() => {
    // Connect to real-time log streaming for this channel
    channelService.connectLogStream(channelId);
    setConnected(true);

    const unsubscribe = channelService.onLogUpdate((newLog) => {
      // Only add logs for this channel
      if (newLog.channelId === channelId) {
        setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep only latest 1000 logs
      }
    });

    loadLogs();

    return () => {
      unsubscribe();
      channelService.disconnectLogStream(channelId);
      setConnected(false);
    };
  }, [channelId, loadLogs]);

  const refreshLogs = useCallback(() => {
    loadLogs();
  }, [loadLogs]);

  const exportLogs = useCallback(async () => {
    try {
      const response = await channelService.exportChannelLogs(channelId, filters);
      if (response.success && response.data) {
        // Create and download file
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `channel-${channelId}-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "Logs exported successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export logs",
        variant: "destructive",
      });
    }
  }, [channelId, filters, toast]);

  return {
    logs,
    loading,
    connected,
    refreshLogs,
    exportLogs,
    loadLogs,
  };
};