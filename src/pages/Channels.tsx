import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { Customer } from '@/types/customer';
import { Activity, RefreshCw } from 'lucide-react';
import { customerChannelData, ChannelStatus } from '@/components/channels/channelData';
import { ChannelStats } from '@/components/channels/ChannelStats';
import { CustomerFilter } from '@/components/channels/CustomerFilter';
import { ChannelList } from '@/components/channels/ChannelList';

export const Channels = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<ChannelStatus | 'error' | null>(null);
  const { customers, loading } = useCustomerAdapters();

  // Get all channels or customer-specific channels
  const allChannels = Object.values(customerChannelData).flat();
  const customerSpecificChannels = selectedCustomer 
    ? customerChannelData[selectedCustomer.id as keyof typeof customerChannelData] || []
    : allChannels;

  // Apply status filter
  const displayChannels = statusFilter 
    ? customerSpecificChannels.filter(channel => {
        if (statusFilter === 'error') return channel.errorRate > 0;
        return channel.status === statusFilter;
      })
    : customerSpecificChannels;

  const handleRefresh = () => {
    setSelectedCustomer(null);
    setStatusFilter(null);
  };

  const handleStatusFilter = (status: ChannelStatus | 'error' | null) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8" />
            Channel Monitor
          </h1>
          <p className="text-muted-foreground">Monitor and manage integration channel performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="hover-scale">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <ChannelStats 
        channels={customerSpecificChannels} 
        isCustomerSelected={!!selectedCustomer}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
      />

      {/* Customer Selection */}
      <CustomerFilter
        selectedCustomer={selectedCustomer}
        customers={customers}
        loading={loading}
        onCustomerChange={setSelectedCustomer}
      />

      {/* Channel List */}
      <ChannelList
        channels={displayChannels}
      />
    </div>
  );
};