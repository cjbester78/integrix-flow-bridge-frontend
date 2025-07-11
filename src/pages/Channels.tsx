import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { Customer } from '@/types/customer';
import { Activity, RefreshCw } from 'lucide-react';
import { Channel } from '@/services/channelService';
import { ChannelStats } from '@/components/channels/ChannelStats';
import { CustomerFilter } from '@/components/channels/CustomerFilter';
import { ChannelList } from '@/components/channels/ChannelList';

export default function Channels() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { customers, loading } = useCustomerAdapters();

  // Mock channels data - replace with actual API call
  const channels: Channel[] = [];

  const filteredChannels = channels.filter(channel => {
    if (selectedCustomer && channel.customerId !== selectedCustomer.id) return false;
    if (statusFilter && channel.status !== statusFilter) return false;
    return true;
  });

  const handleRefresh = () => {
    // Implement refresh logic
    console.log('Refreshing channels...');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading channels...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Channel Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage integration channels
            </p>
          </div>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <CustomerFilter
        customers={customers}
        selectedCustomer={selectedCustomer}
        onCustomerSelect={setSelectedCustomer}
      />

      <ChannelStats
        channels={filteredChannels}
        isCustomerSelected={!!selectedCustomer}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />

      <ChannelList channels={filteredChannels} />
    </div>
  );
}