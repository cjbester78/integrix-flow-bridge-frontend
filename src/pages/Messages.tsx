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
  Eye
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
    size: '2.4KB'
  },
  {
    id: 'MSG-002',
    timestamp: '2024-01-15 14:28:12',
    source: 'REST API',
    target: 'MySQL Database',
    type: 'Order Creation',
    status: 'success',
    processingTime: '156ms',
    size: '5.2KB'
  },
  {
    id: 'MSG-003',
    timestamp: '2024-01-15 14:25:45',
    source: 'File System',
    target: 'HTTP Endpoint',
    type: 'Batch Upload',
    status: 'failed',
    processingTime: '1.2s',
    size: '15.8KB'
  },
  {
    id: 'MSG-004',
    timestamp: '2024-01-15 14:23:18',
    source: 'SOAP Service',
    target: 'JSON API',
    type: 'Data Sync',
    status: 'processing',
    processingTime: '-',
    size: '3.7KB'
  },
  {
    id: 'MSG-005',
    timestamp: '2024-01-15 14:20:33',
    source: 'SFTP Server',
    target: 'Document Store',
    type: 'File Transfer',
    status: 'success',
    processingTime: '2.1s',
    size: '28.5KB'
  }
];

export const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');

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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Source → Target</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processing Time</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.id}</TableCell>
                    <TableCell className="text-muted-foreground">{message.timestamp}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {message.source} → {message.target}
                      </div>
                    </TableCell>
                    <TableCell>{message.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <Badge variant={getStatusVariant(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{message.processingTime}</TableCell>
                    <TableCell>{message.size}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};