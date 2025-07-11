import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Channel } from './channelData';

interface ChannelStatsProps {
  channels: Channel[];
  isCustomerSelected: boolean;
}

export const ChannelStats = ({ channels, isCustomerSelected }: ChannelStatsProps) => {
  const activeChannels = channels.filter(ch => ch.status === 'running').length;
  const inactiveChannels = channels.filter(ch => ch.status === 'idle').length;
  const stoppedChannels = channels.filter(ch => ch.status === 'stopped').length;
  const errorChannels = channels.filter(ch => ch.errorRate > 0).length;

  const getSubtext = () => 
    isCustomerSelected 
      ? `of ${channels.length} customer channels` 
      : 'across all channels';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{activeChannels}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{inactiveChannels}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Stopped Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stoppedChannels}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Error Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{errorChannels}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
    </div>
  );
};