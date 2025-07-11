import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSystemLogs } from '@/hooks/useSystemLogs';
import { SystemLogViewer } from '@/components/logs/SystemLogViewer';
import { LogFilters } from '@/components/adapter/LogFilters';
import { LogExport } from '@/components/adapter/LogExport';
import { ScrollText, Search, Filter, Download, RefreshCw } from 'lucide-react';

export const Logs = () => {
  const [selectedSource, setSelectedSource] = useState<'adapter' | 'system' | 'channel' | 'flow' | 'api' | ''>('');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [logLevel, setLogLevel] = useState<'info' | 'warn' | 'error' | 'debug' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { logs, loading, error, refetch, sources } = useSystemLogs({
    source: selectedSource || undefined,
    sourceId: selectedSourceId || undefined,
    level: logLevel || undefined,
    search: searchQuery,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterChange = (filters: any) => {
    setLogLevel(filters.level);
    setDateRange(filters.dateRange);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <ScrollText className="h-8 w-8" />
            System Logs
          </h1>
          <p className="text-muted-foreground">Monitor and analyze all system logs including errors, adapters, channels, and flows</p>
        </div>
        <div className="flex gap-2">
          <LogExport adapterId={selectedSourceId} />
          <Button variant="outline" size="sm" onClick={handleRefresh} className="hover-scale">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="bg-gradient-secondary border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Type</label>
              <Select value={selectedSource} onValueChange={(value: any) => setSelectedSource(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="adapter">Adapters</SelectItem>
                  <SelectItem value="channel">Channels</SelectItem>
                  <SelectItem value="flow">Flows</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedSource && selectedSource !== 'system' && selectedSource !== 'api' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Specific Source</label>
                <Select value={selectedSourceId} onValueChange={setSelectedSourceId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${selectedSource}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSource === 'adapter' && sources.adapters.map((adapter) => (
                      <SelectItem key={adapter.id} value={adapter.id!}>
                        {adapter.name}
                      </SelectItem>
                    ))}
                    {selectedSource === 'channel' && sources.channels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id!}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select value={logLevel} onValueChange={(value: any) => setLogLevel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <LogFilters onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      {/* Log Stats */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold">{logs.length}</p>
                </div>
                <Badge variant="outline">24h</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-destructive">
                    {logs.filter(log => log.level === 'error').length}
                  </p>
                </div>
                <Badge variant="destructive">Error</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-warning">
                    {logs.filter(log => log.level === 'warn').length}
                  </p>
                </div>
                <Badge variant="secondary">Warning</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Info</p>
                  <p className="text-2xl font-bold text-success">
                    {logs.filter(log => log.level === 'info').length}
                  </p>
                </div>
                <Badge variant="outline">Info</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log Viewer */}
      <SystemLogViewer 
        logs={logs} 
        loading={loading} 
        error={error}
        selectedSource={selectedSource}
      />
    </div>
  );
};