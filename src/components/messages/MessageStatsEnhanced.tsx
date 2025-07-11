import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageStats } from '@/types/message';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';

interface MessageStatsEnhancedProps {
  stats: MessageStats | null;
  onStatusFilter: (status: string | null) => void;
  statusFilter: string | null;
  isRealtime: boolean;
  wsConnected: boolean;
  newMessageCount: number;
  onClearNewMessages: () => void;
}

export const MessageStatsEnhanced = ({ 
  stats, 
  onStatusFilter, 
  statusFilter, 
  isRealtime,
  wsConnected,
  newMessageCount,
  onClearNewMessages
}: MessageStatsEnhancedProps) => {
  const [timeRange, setTimeRange] = useState('day');

  const getButtonVariant = (filter: string) => 
    statusFilter === filter ? 'default' : 'ghost';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;
  const formatDuration = (ms: number) => `${ms.toFixed(0)}ms`;

  if (!stats) {
    return (
      <Card className="bg-gradient-secondary border-border/50">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading message statistics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time Connection Status */}
      {isRealtime && (
        <Card className="bg-gradient-secondary border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <Wifi className="h-4 w-4 text-success" />
                ) : (
                  <WifiOff className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium">
                  Real-time: {wsConnected ? 'Connected' : 'Disconnected'}
                </span>
                {newMessageCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {newMessageCount} new
                  </Badge>
                )}
              </div>
              {newMessageCount > 0 && (
                <Button variant="outline" size="sm" onClick={onClearNewMessages}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant={getButtonVariant('completed')}
          className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
          onClick={() => onStatusFilter('completed')}
        >
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" />
                {formatNumber(stats.successfulMessages)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(stats.successRate)} success rate
              </p>
            </CardContent>
          </Card>
        </Button>
        
        <Button
          variant={getButtonVariant('failed')}
          className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
          onClick={() => onStatusFilter('failed')}
        >
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                {formatNumber(stats.failedMessages)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(stats.errorRate)} error rate
              </p>
            </CardContent>
          </Card>
        </Button>
        
        <Button
          variant={getButtonVariant('processing')}
          className="h-auto p-0 bg-gradient-secondary border-border/50 animate-scale-in hover:scale-105 transition-transform"
          onClick={() => onStatusFilter('processing')}
        >
          <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                {formatNumber(stats.processingMessages)}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </Button>
        
        <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <Activity className="h-6 w-6" />
              {formatNumber(stats.throughputPerMinute)}
            </div>
            <p className="text-xs text-muted-foreground">
              messages/minute
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {formatDuration(stats.averageProcessingTime)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(stats.totalMessages)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Hourly Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {formatNumber(stats.throughputPerHour)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};