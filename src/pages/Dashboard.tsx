import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useBusinessComponentAdapters } from '@/hooks/useBusinessComponentAdapters';
import { BusinessComponent } from '@/types/businessComponent';
import { dashboardService, DashboardMetric, RecentMessage, ChannelStatus } from '@/services/dashboardService';
import { 
  Activity, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Server,
  Zap,
  Users,
  Loader2
} from 'lucide-react';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, any> = {
  Activity,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Server,
  Zap,
  Users
};

export const Dashboard = () => {
  console.log('Dashboard component loading...');
  const [selectedBusinessComponent, setSelectedBusinessComponent] = useState<BusinessComponent | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [channelStatuses, setChannelStatuses] = useState<ChannelStatus[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { businessComponents, loading: loadingComponents } = useBusinessComponentAdapters();
  
  console.log('Dashboard - business components:', businessComponents, 'loading:', loadingComponents);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        const businessComponentId = selectedBusinessComponent?.id;

        // Fetch metrics
        setLoadingMetrics(true);
        const metricsResponse = await dashboardService.getDashboardMetrics(businessComponentId);
        if (metricsResponse.success && metricsResponse.data) {
          setMetrics(metricsResponse.data);
        } else {
          console.error('Failed to fetch metrics:', metricsResponse.error);
        }
        setLoadingMetrics(false);

        // Fetch recent messages
        setLoadingMessages(true);
        const messagesResponse = await dashboardService.getRecentMessages(businessComponentId);
        if (messagesResponse.success && messagesResponse.data) {
          setRecentMessages(messagesResponse.data);
        } else {
          console.error('Failed to fetch messages:', messagesResponse.error);
        }
        setLoadingMessages(false);

        // Fetch channel statuses
        setLoadingChannels(true);
        const channelsResponse = await dashboardService.getChannelStatuses(businessComponentId);
        if (channelsResponse.success && channelsResponse.data) {
          setChannelStatuses(channelsResponse.data);
        } else {
          console.error('Failed to fetch channels:', channelsResponse.error);
        }
        setLoadingChannels(false);

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
        setLoadingMetrics(false);
        setLoadingMessages(false);
        setLoadingChannels(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedBusinessComponent]);

  console.log('Dashboard render - about to return JSX');
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integration Dashboard</h1>
        <p className="text-muted-foreground">Monitor your integration flows and system health</p>
      </div>

      {/* Business Component Filter */}
      <div className="flex items-center gap-4">
        <Label htmlFor="business-component">Business Component:</Label>
        <Select
          value={selectedBusinessComponent?.id || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              setSelectedBusinessComponent(null);
            } else {
              const component = businessComponents.find(bc => bc.id === value);
              setSelectedBusinessComponent(component || null);
            }
          }}
        >
          <SelectTrigger id="business-component" className="w-[280px]">
            <SelectValue placeholder="Select a business component" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Components</SelectItem>
            {businessComponents.map((bc) => (
              <SelectItem key={bc.id} value={bc.id}>
                {bc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingMetrics ? (
          <div className="col-span-full flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          metrics.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Activity;
            const isPositive = stat.change.startsWith('+') || stat.change.startsWith('-') && stat.change.includes('ms');
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} from last period
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest integration messages</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMessages ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No recent messages</p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          message.status === 'success' ? 'success' :
                          message.status === 'failed' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {message.status}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          {message.source} → {message.target}
                        </p>
                        <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                    </div>
                    {message.status === 'success' && <CheckCircle className="h-4 w-4 text-success" />}
                    {message.status === 'failed' && <XCircle className="h-4 w-4 text-destructive" />}
                    {message.status === 'processing' && <Clock className="h-4 w-4 text-warning animate-pulse" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Status */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Status</CardTitle>
            <CardDescription>Active integration channels</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChannels ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : channelStatuses.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No active channels</p>
            ) : (
              <div className="space-y-4">
                {channelStatuses.map((channel, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </div>
                      <Badge 
                        variant={
                          channel.status === 'running' ? 'success' : 
                          channel.status === 'idle' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {channel.status}
                      </Badge>
                    </div>
                    <Progress value={channel.load} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Load: {channel.load}%</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};