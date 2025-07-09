import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';

const stats = [
  {
    title: "Active Integrations",
    value: "24",
    change: "+12%",
    icon: Activity,
    color: "text-success"
  },
  {
    title: "Messages Today",
    value: "1,543",
    change: "+8%",
    icon: MessageSquare,
    color: "text-info"
  },
  {
    title: "Success Rate",
    value: "99.2%",
    change: "+0.3%",
    icon: CheckCircle,
    color: "text-success"
  },
  {
    title: "Avg Response Time",
    value: "127ms",
    change: "-15ms",
    icon: Zap,
    color: "text-warning"
  }
];

const recentMessages = [
  { id: '1', source: 'SAP ERP', target: 'Salesforce', status: 'success', time: '2 min ago' },
  { id: '2', source: 'REST API', target: 'MySQL DB', status: 'success', time: '5 min ago' },
  { id: '3', source: 'File System', target: 'HTTP Endpoint', status: 'failed', time: '12 min ago' },
  { id: '4', source: 'SOAP Service', target: 'JSON API', status: 'processing', time: '15 min ago' },
];

const channels = [
  { name: 'SAP-to-Salesforce', status: 'running', load: 85 },
  { name: 'File-to-Database', status: 'running', load: 45 },
  { name: 'API-Gateway', status: 'running', load: 92 },
  { name: 'Batch-Processor', status: 'idle', load: 12 },
];

export const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your integration platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="bg-gradient-secondary border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-elegant group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} transition-all duration-300 group-hover:scale-110`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stat.change}</span> from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>Latest integration message flows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted/70 group">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {message.status === 'success' && <CheckCircle className="h-4 w-4 text-success" />}
                    {message.status === 'failed' && <XCircle className="h-4 w-4 text-destructive" />}
                    {message.status === 'processing' && <Clock className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{message.source} → {message.target}</div>
                    <div className="text-xs text-muted-foreground">{message.time}</div>
                  </div>
                </div>
                <Badge variant={
                  message.status === 'success' ? 'default' : 
                  message.status === 'failed' ? 'destructive' : 'secondary'
                }>
                  {message.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Channel Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Channel Status
            </CardTitle>
            <CardDescription>Integration channel performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${
                      channel.status === 'running' ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                    <span className="text-sm font-medium">{channel.name}</span>
                  </div>
                  <Badge variant={channel.status === 'running' ? 'default' : 'secondary'}>
                    {channel.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Load</span>
                    <span>{channel.load}%</span>
                  </div>
                  <Progress value={channel.load} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};