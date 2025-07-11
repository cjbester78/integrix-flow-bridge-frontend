import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Channel, FlowMetrics } from '@/services/channelService';

interface ChannelStatsProps {
  channels: Channel[];
  isCustomerSelected: boolean;
  statusFilter: string | null;
  onStatusFilter: (status: string | null) => void;
}

export const ChannelStats = ({ 
  channels, 
  isCustomerSelected, 
  statusFilter, 
  onStatusFilter 
}: ChannelStatsProps) => {
  const totalChannels = channels.length;
  const activeChannels = channels.filter(c => c.status === 'active').length;
  const inactiveChannels = channels.filter(c => c.status === 'inactive').length;
  const errorChannels = channels.filter(c => c.status === 'error').length;

  const totalMessages = channels.reduce((sum, channel) => 
    sum + (channel.flowMetrics?.totalMessages || 0), 0);
  const successfulMessages = channels.reduce((sum, channel) => 
    sum + (channel.flowMetrics?.successfulMessages || 0), 0);
  const failedMessages = channels.reduce((sum, channel) => 
    sum + (channel.flowMetrics?.failedMessages || 0), 0);

  const successRate = totalMessages > 0 ? Math.round((successfulMessages / totalMessages) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalChannels}</div>
          <p className="text-xs text-muted-foreground">
            {isCustomerSelected ? 'For selected customer' : 'Across all customers'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Channel Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilter(statusFilter === 'active' ? null : 'active')}
              className="text-xs"
            >
              Active ({activeChannels})
            </Button>
            <Button
              variant={statusFilter === 'error' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => onStatusFilter(statusFilter === 'error' ? null : 'error')}
              className="text-xs"
            >
              Error ({errorChannels})
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {errorChannels > 0 ? `${errorChannels} channels need attention` : 'All channels healthy'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMessages.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {successRate}% success rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{failedMessages}</div>
          <p className="text-xs text-muted-foreground">
            Requires investigation
          </p>
        </CardContent>
      </Card>
    </div>
  );
};