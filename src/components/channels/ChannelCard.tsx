import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Settings, 
  Zap, 
  TrendingUp, 
  Clock, 
  Server 
} from 'lucide-react';
import { Channel, ChannelStatus } from './channelData';

interface ChannelCardProps {
  channel: Channel;
}

export const ChannelCard = ({ channel }: ChannelCardProps) => {
  const getStatusColor = (status: ChannelStatus) => {
    switch (status) {
      case 'running':
        return 'bg-success';
      case 'idle':
        return 'bg-warning';
      case 'stopped':
        return 'bg-destructive';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusVariant = (status: ChannelStatus) => {
    switch (status) {
      case 'running':
        return 'default' as const;
      case 'idle':
        return 'secondary' as const;
      case 'stopped':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <Card className="bg-gradient-secondary border-border/50 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${getStatusColor(channel.status)}`} />
            <div>
              <CardTitle className="text-lg">{channel.name}</CardTitle>
              <CardDescription>{channel.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusVariant(channel.status)}>
              {channel.status}
            </Badge>
            <Button variant="outline" size="sm" className="hover-scale">
              {channel.status === 'running' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" className="hover-scale">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Load Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Load</span>
              <span className="font-medium">{channel.load}%</span>
            </div>
            <Progress value={channel.load} className="h-2" />
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-info" />
              <div>
                <div className="text-sm font-medium">{channel.throughput}</div>
                <div className="text-xs text-muted-foreground">Throughput</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <div>
                <div className="text-sm font-medium">{channel.uptime}</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{channel.lastActivity}</div>
                <div className="text-xs text-muted-foreground">Last Activity</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-warning" />
              <div>
                <div className="text-sm font-medium">{channel.errorRate}%</div>
                <div className="text-xs text-muted-foreground">Error Rate</div>
              </div>
            </div>
          </div>

          {/* Adapters */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Adapters</div>
            <div className="flex flex-wrap gap-1">
              {channel.adapters.map((adapter) => {
                const IconComponent = adapter.icon;
                return (
                  <Badge 
                    key={adapter.id} 
                    variant="outline" 
                    className="text-xs flex items-center gap-1 hover-scale"
                  >
                    <IconComponent className="h-3 w-3" />
                    {adapter.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};