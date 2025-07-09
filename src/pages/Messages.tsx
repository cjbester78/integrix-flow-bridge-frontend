import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  Terminal,
  FileText
} from 'lucide-react';

const messages = [
  {
    id: 'MSG-001',
    timestamp: '2024-01-15 14:30:25',
    source: 'SAP ERP',
    target: 'Salesforce CRM',
    type: 'Customer Update',
    status: 'success',
    processingTime: '245ms',
    size: '2.4KB',
    logs: [
      { timestamp: '2024-01-15 14:30:25.001', level: 'INFO', message: 'Message received from SAP ERP' },
      { timestamp: '2024-01-15 14:30:25.015', level: 'INFO', message: 'Validating customer data format' },
      { timestamp: '2024-01-15 14:30:25.089', level: 'INFO', message: 'Data transformation: SAP → Salesforce format' },
      { timestamp: '2024-01-15 14:30:25.156', level: 'INFO', message: 'Connecting to Salesforce API' },
      { timestamp: '2024-01-15 14:30:25.203', level: 'INFO', message: 'Customer record updated successfully' },
      { timestamp: '2024-01-15 14:30:25.245', level: 'SUCCESS', message: 'Message processing completed' }
    ]
  },
  {
    id: 'MSG-002',
    timestamp: '2024-01-15 14:28:12',
    source: 'REST API',
    target: 'MySQL Database',
    type: 'Order Creation',
    status: 'success',
    processingTime: '156ms',
    size: '5.2KB',
    logs: [
      { timestamp: '2024-01-15 14:28:12.001', level: 'INFO', message: 'REST API request received' },
      { timestamp: '2024-01-15 14:28:12.025', level: 'INFO', message: 'Parsing JSON payload' },
      { timestamp: '2024-01-15 14:28:12.067', level: 'INFO', message: 'Validating order data' },
      { timestamp: '2024-01-15 14:28:12.098', level: 'INFO', message: 'Database connection established' },
      { timestamp: '2024-01-15 14:28:12.134', level: 'INFO', message: 'Order inserted with ID: ORD-12345' },
      { timestamp: '2024-01-15 14:28:12.156', level: 'SUCCESS', message: 'Order creation completed' }
    ]
  },
  {
    id: 'MSG-003',
    timestamp: '2024-01-15 14:25:45',
    source: 'File System',
    target: 'HTTP Endpoint',
    type: 'Batch Upload',
    status: 'failed',
    processingTime: '1.2s',
    size: '15.8KB',
    logs: [
      { timestamp: '2024-01-15 14:25:45.001', level: 'INFO', message: 'File detected: batch_data_20240115.csv' },
      { timestamp: '2024-01-15 14:25:45.156', level: 'INFO', message: 'Reading file content' },
      { timestamp: '2024-01-15 14:25:45.234', level: 'INFO', message: 'Processing 500 records' },
      { timestamp: '2024-01-15 14:25:45.789', level: 'WARN', message: 'Invalid data format detected in row 245' },
      { timestamp: '2024-01-15 14:25:46.023', level: 'ERROR', message: 'HTTP endpoint returned 500 Internal Server Error' },
      { timestamp: '2024-01-15 14:25:46.200', level: 'ERROR', message: 'Batch upload failed - transaction rolled back' }
    ]
  },
  {
    id: 'MSG-004',
    timestamp: '2024-01-15 14:23:18',
    source: 'SOAP Service',
    target: 'JSON API',
    type: 'Data Sync',
    status: 'processing',
    processingTime: '-',
    size: '3.7KB',
    logs: [
      { timestamp: '2024-01-15 14:23:18.001', level: 'INFO', message: 'SOAP request received' },
      { timestamp: '2024-01-15 14:23:18.045', level: 'INFO', message: 'Parsing SOAP envelope' },
      { timestamp: '2024-01-15 14:23:18.089', level: 'INFO', message: 'Converting SOAP to JSON format' },
      { timestamp: '2024-01-15 14:23:18.156', level: 'INFO', message: 'Waiting for target API response...' }
    ]
  },
  {
    id: 'MSG-005',
    timestamp: '2024-01-15 14:20:33',
    source: 'SFTP Server',
    target: 'Document Store',
    type: 'File Transfer',
    status: 'success',
    processingTime: '2.1s',
    size: '28.5KB',
    logs: [
      { timestamp: '2024-01-15 14:20:33.001', level: 'INFO', message: 'SFTP connection established' },
      { timestamp: '2024-01-15 14:20:33.234', level: 'INFO', message: 'File download started: report_2024_01_15.pdf' },
      { timestamp: '2024-01-15 14:20:34.567', level: 'INFO', message: 'File download completed (28.5KB)' },
      { timestamp: '2024-01-15 14:20:34.789', level: 'INFO', message: 'Uploading to document store' },
      { timestamp: '2024-01-15 14:20:35.100', level: 'SUCCESS', message: 'File transfer completed successfully' }
    ]
  }
];

export const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'ERROR':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'WARN':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'INFO':
        return <Info className="h-4 w-4 text-info" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLogLevelVariant = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'default';
      case 'ERROR':
        return 'destructive';
      case 'WARN':
        return 'secondary';
      case 'INFO':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleMessageClick = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            Message Monitor
          </h1>
          <p className="text-muted-foreground">Track and analyze integration message flows</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-success">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">98.2%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">187ms</div>
            <p className="text-xs text-success">-23ms improvement</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-secondary border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>View and filter recent integration messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-8 gap-4 px-4 py-2 border-b border-border text-sm font-medium text-muted-foreground">
            <div>Message ID</div>
            <div>Timestamp</div>
            <div>Source → Target</div>
            <div>Type</div>
            <div>Status</div>
            <div>Processing Time</div>
            <div>Size</div>
            <div>Actions</div>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border border-border rounded-lg">
                {/* Main Message Row */}
                <div className="p-4">
                  <div className="grid grid-cols-8 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMessageClick(message.id)}
                        className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                      >
                        {expandedMessage === message.id ? (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1" />
                        )}
                        {message.id}
                      </Button>
                    </div>
                    <div className="text-muted-foreground text-sm">{message.timestamp}</div>
                    <div className="text-sm">
                      {message.source} → {message.target}
                    </div>
                    <div className="text-sm">{message.type}</div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <Badge variant={getStatusVariant(message.status)} className="text-xs">
                        {message.status}
                      </Badge>
                    </div>
                    <div className="text-sm">{message.processingTime}</div>
                    <div className="text-sm">{message.size}</div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expandable Log Section */}
                {expandedMessage === message.id && (
                  <div className="border-t border-border bg-muted/30">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Terminal className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-medium">Message Logs</h4>
                        <Badge variant="outline" className="text-xs">
                          {message.logs.length} entries
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {message.logs.map((log, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {getLogLevelIcon(log.level)}
                              <Badge variant={getLogLevelVariant(log.level)} className="text-xs">
                                {log.level}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-mono text-muted-foreground">
                                {log.timestamp}
                              </div>
                              <div className="text-sm mt-1">{log.message}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Log Details for {message.id}</span>
                          <div className="flex items-center gap-4">
                            <span>Total Processing Time: {message.processingTime}</span>
                            <span>Message Size: {message.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};