import { useState, useEffect, useCallback } from 'react';
import { channelService, Channel, ChannelStats, ChannelFilters } from '@/services/channel';
import { useToast } from '@/hooks/use-toast';

export const useChannelMonitoring = (customerId?: string) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const loadChannels = useCallback(async (filters?: ChannelFilters) => {
    setLoading(true);
    try {
      const response = customerId 
        ? await channelService.getCustomerChannels(customerId, filters)
        : await channelService.getChannels(filters);
        
      if (response.success && response.data) {
        setChannels(response.data.channels);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load channels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [customerId, toast]);

  const loadStats = useCallback(async (filters?: Omit<ChannelFilters, 'limit' | 'offset'>) => {
    try {
      const response = await channelService.getChannelStats(filters);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load channel stats:', error);
    }
  }, []);

  useEffect(() => {
    channelService.connectWebSocket(customerId);
    setConnected(true);

    const unsubscribeChannels = channelService.onChannelUpdate((updatedChannel) => {
      setChannels(prev => {
        const existingIndex = prev.findIndex(c => c.id === updatedChannel.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = updatedChannel;
          return updated;
        } else {
          return [updatedChannel, ...prev];
        }
      });
    });

    const unsubscribeStats = channelService.onStatsUpdate((newStats) => {
      setStats(newStats);
    });

    const unsubscribeAlerts = channelService.onAlert((alert) => {
      toast({
        title: "Channel Alert",
        description: alert.message,
        variant: alert.type === 'error' ? 'destructive' : 'default',
      });
    });

    loadChannels();
    loadStats();

    return () => {
      unsubscribeChannels();
      unsubscribeStats();
      unsubscribeAlerts();
      channelService.disconnectWebSocket();
      setConnected(false);
    };
  }, [customerId, loadChannels, loadStats, toast]);

  const controlChannel = useCallback(async (channelId: string, action: 'start' | 'stop' | 'restart') => {
    try {
      const response = await channelService.controlChannel({ action, channelId });
      if (response.success) {
        toast({
          title: "Success",
          description: `Channel ${action} operation initiated`,
        });
      } else {
        throw new Error(response.error || 'Failed to control channel');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} channel`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshData = useCallback((filters?: ChannelFilters) => {
    loadChannels(filters);
    loadStats(filters);
  }, [loadChannels, loadStats]);

  return {
    channels,
    stats,
    loading,
    connected,
    loadChannels,
    loadStats,
    controlChannel,
    refreshData,
  };
};