import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { useMessages } from '@/hooks/useMessages';
import { Customer } from '@/types/customer';
import { MessageFilters, MessageStatus } from '@/types/message';
import { MessageSquare, RefreshCw, Download } from 'lucide-react';
import { MessageStatsEnhanced } from '@/components/messages/MessageStatsEnhanced';
import { MessageCard } from '@/components/messages/MessageCardEnhanced';
import { MessageFiltersComponent } from '@/components/messages/MessageFilters';
import { CustomerFilter } from '@/components/channels/CustomerFilter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const Messages = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filters, setFilters] = useState<MessageFilters>({
    page: 1,
    limit: 50,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  });

  const { customers, loading: customersLoading } = useCustomerAdapters();
  const { toast } = useToast();

  // Update filters when customer changes
  const updatedFilters = {
    ...filters,
    customerId: selectedCustomer?.id,
  };

  const {
    messages,
    stats,
    loading,
    error,
    newMessageCount,
    wsConnected,
    retryMessage,
    cancelMessage,
    searchMessages,
    refetch,
    clearNewMessageCount,
  } = useMessages({
    filters: updatedFilters,
    enableRealtime: true,
    autoRefresh: false,
  });

  const handleFiltersChange = (newFilters: MessageFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to first page when filters change
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchMessages(query);
    } else {
      refetch();
    }
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    });
    setSelectedCustomer(null);
  };

  const handleRefresh = () => {
    refetch();
    clearNewMessageCount();
  };

  const handleRetryMessage = async (messageId: string) => {
    try {
      await retryMessage(messageId);
      toast({
        title: 'Message Retry Initiated',
        description: 'The message has been queued for retry.',
      });
    } catch (error) {
      toast({
        title: 'Retry Failed',
        description: 'Failed to retry the message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelMessage = async (messageId: string) => {
    try {
      await cancelMessage(messageId, 'Cancelled by user');
      toast({
        title: 'Message Cancelled',
        description: 'The message has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Cancel Failed',
        description: 'Failed to cancel the message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusFilter = (status: string | null) => {
    setFilters(prev => ({
      ...prev,
      status: status ? [status as MessageStatus] : undefined,
      page: 1,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Message Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time tracking and analysis of integration message flows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hover-scale">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="hover-scale">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics with Real-time Support */}
      <MessageStatsEnhanced
        stats={stats}
        onStatusFilter={handleStatusFilter}
        statusFilter={filters.status?.[0] || null}
        isRealtime={true}
        wsConnected={wsConnected}
        newMessageCount={newMessageCount}
        onClearNewMessages={clearNewMessageCount}
      />

      {/* Customer Selection */}
      <CustomerFilter
        selectedCustomer={selectedCustomer}
        customers={customers}
        loading={customersLoading}
        onCustomerChange={setSelectedCustomer}
      />

      {/* Advanced Filters */}
      <MessageFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
      />

      {/* Enhanced Message List */}
      <Card className="bg-gradient-secondary border-border/50">
        <CardContent className="p-6">
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Error loading messages: {error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Retry
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading messages...</div>
            </div>
          )}

          {!loading && !error && messages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Messages Found</h3>
              <p className="text-muted-foreground">
                No messages match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}

          {!loading && !error && messages.length > 0 && (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    onRetry={handleRetryMessage}
                    onCancel={handleCancelMessage}
                    onViewDetails={(id) => console.log('View details:', id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};