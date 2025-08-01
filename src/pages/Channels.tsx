import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChannelCard } from '@/components/channels/ChannelCard';
import { ChannelFilters } from '@/components/channels/ChannelFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BusinessComponent } from '@/types/businessComponent';
import { useBusinessComponentAdapters } from '@/hooks/useBusinessComponentAdapters';
import { channelService, Channel, ChannelStatus } from '@/services/channelService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Channels() {
  const [selectedBusinessComponent, setSelectedBusinessComponent] = useState<BusinessComponent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { businessComponents, loading: loadingComponents } = useBusinessComponentAdapters();
  const { toast } = useToast();

  // Fetch channels when business component changes
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setError(null);
        setLoadingChannels(true);
        
        const response = await channelService.getChannels(selectedBusinessComponent?.id);
        
        if (response.success && response.data) {
          setChannels(response.data);
        } else {
          setError(response.error || 'Failed to fetch channels');
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || 'Failed to fetch channels',
          });
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels');
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Failed to load channels',
        });
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannels();
    
    // Refresh channels every 30 seconds
    const interval = setInterval(fetchChannels, 30000);
    return () => clearInterval(interval);
  }, [selectedBusinessComponent, toast]);

  // Handle channel updates
  const handleUpdateChannel = async (channelId: string, updates: Partial<Channel>) => {
    try {
      const response = await channelService.updateChannel(channelId, updates);
      
      if (response.success && response.data) {
        setChannels(prevChannels => 
          prevChannels.map(channel => 
            channel.id === channelId ? response.data! : channel
          )
        );
        toast({
          title: "Success",
          description: "Channel updated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to update channel',
        });
      }
    } catch (err) {
      console.error('Error updating channel:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to update channel',
      });
    }
  };

  // Handle channel deletion
  const handleDeleteChannel = async (channelId: string) => {
    try {
      const response = await channelService.deleteChannel(channelId);
      
      if (response.success) {
        setChannels(prevChannels => 
          prevChannels.filter(channel => channel.id !== channelId)
        );
        toast({
          title: "Success",
          description: "Channel deleted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || 'Failed to delete channel',
        });
      }
    } catch (err) {
      console.error('Error deleting channel:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Failed to delete channel',
      });
    }
  };

  // Filter channels based on status
  const filteredChannels = channels.filter(channel => {
    if (statusFilter && channel.status !== statusFilter) return false;
    return true;
  });

  // Calculate overall metrics
  const totalChannels = channels.length;
  const activeChannels = channels.filter(c => c.status === 'running' || c.status === 'active').length;
  const channelsWithErrors = channels.filter(c => c.status === 'error').length;
  const averageLoad = channels.length > 0 
    ? Math.round(channels.reduce((sum, c) => sum + (c.load || 0), 0) / channels.length)
    : 0;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Integration Channels</h1>
        <p className="text-gray-600">Monitor and manage your integration channels</p>
      </div>

      {/* Business Component Filter */}
      <div className="mb-6 flex items-center gap-4">
        <Label htmlFor="business-component">Business Component:</Label>
        <Select
          value={selectedBusinessComponent?.id || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedBusinessComponent(null);
            } else {
              const component = businessComponents.find(bc => bc.id === value);
              setSelectedBusinessComponent(component || null);
            }
          }}
          disabled={loadingComponents}
        >
          <SelectTrigger id="business-component" className="w-[280px]">
            <SelectValue placeholder="Select a business component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Components</SelectItem>
            {businessComponents.map((bc) => (
              <SelectItem key={bc.id} value={bc.id}>
                {bc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Channels</h3>
          <p className="text-2xl font-bold">{totalChannels}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Channels</h3>
          <p className="text-2xl font-bold text-green-600">{activeChannels}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Channels with Errors</h3>
          <p className="text-2xl font-bold text-red-600">{channelsWithErrors}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Load</h3>
          <div className="mt-2">
            <Progress value={averageLoad} className="h-2" />
            <p className="text-sm text-gray-600 mt-1">{averageLoad}%</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ChannelFilters 
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Channels List */}
      {loadingChannels ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredChannels.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">
            {statusFilter 
              ? `No channels found with status: ${statusFilter}`
              : selectedBusinessComponent 
                ? `No channels found for ${selectedBusinessComponent.name}`
                : 'No channels found'
            }
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredChannels.map(channel => (
            <ChannelCard 
              key={channel.id} 
              channel={channel}
              onUpdate={(updates) => handleUpdateChannel(channel.id, updates)}
              onDelete={() => handleDeleteChannel(channel.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}