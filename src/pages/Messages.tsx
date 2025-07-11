import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { useMessageMonitoring } from '@/hooks/useMessageMonitoring';
import { Customer } from '@/types/customer';
import { MessageSquare, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { MessageStats } from '@/components/messages/MessageStats';
import { MessageList } from '@/components/messages/MessageList';
import { CustomerFilter } from '@/components/channels/CustomerFilter';

export const Messages = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { customers, loading } = useCustomerAdapters();
  const { 
    messages, 
    stats, 
    loading: messagesLoading, 
    connected, 
    refreshData 
  } = useMessageMonitoring(selectedCustomer?.id);

  // Apply status filter to messages
  const displayMessages = statusFilter 
    ? messages.filter(msg => msg.status === statusFilter)
    : messages;

  const handleRefresh = () => {
    refreshData();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  const handleCustomerChange = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    setStatusFilter(null); // Reset status filter when changing customer
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Message Monitor
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Track and analyze integration message flows</p>
            <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-1">
              {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connected ? 'Live' : 'Disconnected'}
            </Badge>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="hover-scale"
          disabled={messagesLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${messagesLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <MessageStats 
        messages={displayMessages} 
        stats={stats}
        isCustomerSelected={!!selectedCustomer}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
        loading={messagesLoading}
      />

      {/* Customer Selection */}
      <CustomerFilter
        selectedCustomer={selectedCustomer}
        customers={customers}
        loading={loading}
        onCustomerChange={handleCustomerChange}
      />

      {/* Message List */}
      <MessageList 
        messages={displayMessages} 
        isCustomerSelected={!!selectedCustomer}
        statusFilter={statusFilter}
        loading={messagesLoading}
      />
    </div>
  );
};