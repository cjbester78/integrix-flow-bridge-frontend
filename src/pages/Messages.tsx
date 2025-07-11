import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { Customer } from '@/types/customer';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { customerMessageData } from '@/components/messages/messageData';
import { MessageStats } from '@/components/messages/MessageStats';
import { MessageList } from '@/components/messages/MessageList';
import { CustomerFilter } from '@/components/channels/CustomerFilter';

export const Messages = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { customers, loading } = useCustomerAdapters();

  // Get all messages or customer-specific messages
  const allMessages = Object.values(customerMessageData).flat();
  const displayMessages = selectedCustomer 
    ? customerMessageData[selectedCustomer.id as keyof typeof customerMessageData] || []
    : allMessages;

  const handleRefresh = () => {
    setSelectedCustomer(null);
    setStatusFilter(null);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(statusFilter === status ? null : status);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Message Monitor
          </h1>
          <p className="text-muted-foreground">Track and analyze integration message flows</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="hover-scale">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <MessageStats 
        messages={displayMessages} 
        isCustomerSelected={!!selectedCustomer}
        onStatusFilter={handleStatusFilter}
        statusFilter={statusFilter}
      />

      {/* Customer Selection */}
      <CustomerFilter
        selectedCustomer={selectedCustomer}
        customers={customers}
        loading={loading}
        onCustomerChange={setSelectedCustomer}
      />

      {/* Message List */}
      <MessageList 
        messages={displayMessages} 
        isCustomerSelected={!!selectedCustomer}
        statusFilter={statusFilter}
      />
    </div>
  );
};