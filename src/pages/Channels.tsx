import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { Customer } from '@/types/customer';
import { Activity, RefreshCw } from 'lucide-react';
import { customerChannelData } from '@/components/channels/channelData';
import { ChannelStats } from '@/components/channels/ChannelStats';
import { CustomerFilter } from '@/components/channels/CustomerFilter';
import { ChannelList } from '@/components/channels/ChannelList';

export const Channels = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { customers, loading } = useCustomerAdapters();

  // Get all channels or customer-specific channels
  const allChannels = Object.values(customerChannelData).flat();
  const displayChannels = selectedCustomer 
    ? customerChannelData[selectedCustomer.id as keyof typeof customerChannelData] || []
    : allChannels;

  // Get customer-specific channels for display
  const customerChannels = selectedCustomer 
    ? customerChannelData[selectedCustomer.id as keyof typeof customerChannelData] || []
    : [];

  const handleRefresh = () => {
    setSelectedCustomer(null);
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
        channels={displayChannels} 
        isCustomerSelected={!!selectedCustomer} 
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
        selectedCustomer={selectedCustomer}
        customerChannels={customerChannels}
      />
    </div>
  );
};