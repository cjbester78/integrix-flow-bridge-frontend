import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Play, 
  Pause, 
  Settings, 
  RefreshCw,
  Server,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';

const channels = [
  {
    id: 'CH-001',
    name: 'SAP-to-Salesforce Integration',
    description: 'Customer data synchronization between SAP ERP and Salesforce CRM',
    status: 'running',
    load: 85,
    throughput: '245 msg/min',
    uptime: '99.8%',
    lastActivity: '2 seconds ago',
    adapters: ['SAP Adapter', 'Salesforce Adapter'],
    errorRate: 0.2
  },
  {
    id: 'CH-002',
    name: 'File-to-Database Processor',
    description: 'Automated file processing and database insertion workflow',
    status: 'running',
    load: 45,
    throughput: '89 msg/min',
    uptime: '100%',
    lastActivity: '15 seconds ago',
    adapters: ['File Adapter', 'JDBC Adapter'],
    errorRate: 0.0
  },
  {
    id: 'CH-003',
    name: 'API Gateway Channel',
    description: 'REST API request routing and transformation gateway',
    status: 'running',
    load: 92,
    throughput: '412 msg/min',
    uptime: '98.5%',
    lastActivity: '1 second ago',
    adapters: ['HTTP Adapter', 'REST Adapter'],
    errorRate: 1.5
  },
  {
    id: 'CH-004',
    name: 'Batch Processing Pipeline',
    description: 'Scheduled batch processing for large data transfers',
    status: 'idle',
    load: 12,
    throughput: '0 msg/min',
    uptime: '95.2%',
    lastActivity: '2 hours ago',
    adapters: ['SFTP Adapter', 'Database Adapter'],
    errorRate: 0.0
  },
  {
    id: 'CH-005',
    name: 'SOAP Service Bridge',
    description: 'Legacy SOAP to modern REST API transformation bridge',
    status: 'stopped',
    load: 0,
    throughput: '0 msg/min',
    uptime: '87.3%',
    lastActivity: '6 hours ago',
    adapters: ['SOAP Adapter', 'HTTP Adapter'],
    errorRate: 2.8
  }
];

export const Channels = () => {
  const getStatusColor = (status: string) => {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'idle':
        return 'secondary';
      case 'stopped':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8" />
            Channel Monitor
          </h1>
          <p className="text-muted-foreground">Monitor and manage integration channel performance</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">3</div>
            <p className="text-xs text-muted-foreground">of 5 total channels</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">746</div>
            <p className="text-xs text-muted-foreground">messages/minute</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">96.2%</div>
            <p className="text-xs text-success">+2.1% this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">1.1%</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel List */}
      <div className="space-y-4">
        {channels.map((channel) => (
          <Card key={channel.id} className="bg-gradient-secondary border-border/50">
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
                  <Button variant="outline" size="sm">
                    {channel.status === 'running' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
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
                    {channel.adapters.map((adapter) => (
                      <Badge key={adapter} variant="outline" className="text-xs">
                        {adapter}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};