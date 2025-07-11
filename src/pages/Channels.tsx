import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { Customer } from '@/types/customer';
import { 
  Activity, 
  Play, 
  Pause, 
  Settings, 
  RefreshCw,
  Server,
  Zap,
  Clock,
  TrendingUp,
  Database,
  Globe,
  FileText,
  Mail,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';

// New adapter definitions matching CreateFlow
const adapters = [
  { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
  { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
  { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
  { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' },
  { id: 'file', name: 'File System', icon: FileText, category: 'Storage' },
  { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' },
  { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' },
  { id: 'database', name: 'Database', icon: Database, category: 'Storage' },
];

// Customer-specific channel data
const customerChannelData = {
  '1': [ // ACME Corporation
    {
      id: 'CH-001',
      name: 'SAP-to-Salesforce Integration',
      description: 'Customer data synchronization between SAP ERP and Salesforce CRM',
      status: 'running',
      load: 85,
      throughput: '245 msg/min',
      uptime: '99.8%',
      lastActivity: '2 seconds ago',
      adapters: [
        { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
        { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' }
      ],
      errorRate: 0.2,
      totalMessages: 124567,
      avgResponseTime: '120ms'
    },
    {
      id: 'CH-002',
      name: 'REST-to-Database Processor',
      description: 'Automated REST API processing and database insertion workflow',
      status: 'running',
      load: 45,
      throughput: '89 msg/min',
      uptime: '100%',
      lastActivity: '15 seconds ago',
      adapters: [
        { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
        { id: 'database', name: 'Database', icon: Database, category: 'Storage' }
      ],
      errorRate: 0.0,
      totalMessages: 45890,
      avgResponseTime: '85ms'
    },
    {
      id: 'CH-003',
      name: 'SOAP Service Bridge',
      description: 'Legacy SOAP to modern API transformation bridge',
      status: 'idle',
      load: 12,
      throughput: '15 msg/min',
      uptime: '95.2%',
      lastActivity: '2 hours ago',
      adapters: [
        { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' }
      ],
      errorRate: 0.0,
      totalMessages: 12345,
      avgResponseTime: '200ms'
    }
  ],
  '2': [ // TechStart Inc
    {
      id: 'CH-004',
      name: 'Salesforce-to-Email Gateway',
      description: 'Automated email notifications from Salesforce CRM',
      status: 'running',
      load: 67,
      throughput: '156 msg/min',
      uptime: '98.5%',
      lastActivity: '1 second ago',
      adapters: [
        { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
        { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' }
      ],
      errorRate: 1.5,
      totalMessages: 289456,
      avgResponseTime: '45ms'
    },
    {
      id: 'CH-005',
      name: 'SMS Alert Service',
      description: 'Real-time SMS notifications and alerts system',
      status: 'running',
      load: 78,
      throughput: '89 msg/min',
      uptime: '99.1%',
      lastActivity: '30 seconds ago',
      adapters: [
        { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' }
      ],
      errorRate: 0.9,
      totalMessages: 67890,
      avgResponseTime: '180ms'
    },
    {
      id: 'CH-006',
      name: 'REST API Gateway',
      description: 'REST API request routing and transformation gateway',
      status: 'stopped',
      load: 0,
      throughput: '0 msg/min',
      uptime: '87.3%',
      lastActivity: '6 hours ago',
      adapters: [
        { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' }
      ],
      errorRate: 2.8,
      totalMessages: 23456,
      avgResponseTime: '350ms'
    }
  ]
};

export const Channels = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { customers, loading } = useCustomerAdapters();

  // Get customer-specific channels or empty array
  const customerChannels = selectedCustomer 
    ? customerChannelData[selectedCustomer.id as keyof typeof customerChannelData] || []
    : [];

  // Calculate dynamic stats based on selected customer
  const activeChannels = customerChannels.filter(ch => ch.status === 'running').length;
  const totalChannels = customerChannels.length;
  const totalThroughput = customerChannels.reduce((sum, ch) => {
    const throughput = parseInt(ch.throughput.split(' ')[0]);
    return sum + (isNaN(throughput) ? 0 : throughput);
  }, 0);
  const avgUptime = customerChannels.length > 0 
    ? (customerChannels.reduce((sum, ch) => sum + parseFloat(ch.uptime), 0) / customerChannels.length).toFixed(1)
    : '0.0';
  const avgErrorRate = customerChannels.length > 0 
    ? (customerChannels.reduce((sum, ch) => sum + ch.errorRate, 0) / customerChannels.length).toFixed(1)
    : '0.0';

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

      {/* Customer Selection */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Filter
          </CardTitle>
          <CardDescription>
            Filter channels by customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select
              value={selectedCustomer?.id || ''}
              onValueChange={(customerId) => {
                const customer = customers.find(c => c.id === customerId) || null;
                setSelectedCustomer(customer);
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a customer to filter channels" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeChannels}</div>
            <p className="text-xs text-muted-foreground">of {totalChannels} total channels</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{totalThroughput}</div>
            <p className="text-xs text-muted-foreground">messages/minute</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{avgUptime}%</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{avgErrorRate}%</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel List */}
      <div className="space-y-4">
        {selectedCustomer && customerChannels.length > 0 ? (
          customerChannels.map((channel) => (
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
                      {channel.adapters.map((adapter) => {
                        const IconComponent = adapter.icon;
                        return (
                          <Badge key={adapter.id} variant="outline" className="text-xs flex items-center gap-1">
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
          ))
        ) : (
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                {selectedCustomer ? 'No channels found for this customer' : 'Select a customer to view their channels'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};