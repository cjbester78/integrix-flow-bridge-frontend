import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Channel, ChannelStatus } from './channelData';

interface ChannelStatsProps {
  channels: Channel[];
  isCustomerSelected: boolean;
  statusFilter: ChannelStatus | 'error' | null;
  onStatusFilter: (status: ChannelStatus | 'error' | null) => void;
}

export const ChannelStats = ({ channels, isCustomerSelected, statusFilter, onStatusFilter }: ChannelStatsProps) => {
  const activeChannels = channels.filter(ch => ch.status === 'running').length;
  const inactiveChannels = channels.filter(ch => ch.status === 'idle').length;
  const stoppedChannels = channels.filter(ch => ch.status === 'stopped').length;
  const errorChannels = channels.filter(ch => ch.errorRate > 0).length;

  const getSubtext = () => 
    isCustomerSelected 
      ? `of ${channels.length} customer channels` 
      : 'across all channels';

  const getButtonVariant = (filter: ChannelStatus | 'error') => 
    statusFilter === filter ? 'default' : 'ghost';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Button
        variant={getButtonVariant('running')}
        className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
        onClick={() => onStatusFilter('running')}
      >
        <Card className="w-full border-0 bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeChannels}</div>
            <p className="text-xs text-muted-foreground">{getSubtext()}</p>
          </CardContent>
        </Card>
      </Button>
      
      <Button
        variant={getButtonVariant('idle')}
        className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
        onClick={() => onStatusFilter('idle')}
      >
        <Card className="w-full border-0 bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{inactiveChannels}</div>
            <p className="text-xs text-muted-foreground">{getSubtext()}</p>
          </CardContent>
        </Card>
      </Button>
      
      <Button
        variant={getButtonVariant('stopped')}
        className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
        onClick={() => onStatusFilter('stopped')}
      >
        <Card className="w-full border-0 bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stopped Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stoppedChannels}</div>
            <p className="text-xs text-muted-foreground">{getSubtext()}</p>
          </CardContent>
        </Card>
      </Button>
      
      <Button
        variant={getButtonVariant('error')}
        className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
        onClick={() => onStatusFilter('error')}
      >
        <Card className="w-full border-0 bg-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{errorChannels}</div>
            <p className="text-xs text-muted-foreground">{getSubtext()}</p>
          </CardContent>
        </Card>
      </Button>
    </div>
  );
};