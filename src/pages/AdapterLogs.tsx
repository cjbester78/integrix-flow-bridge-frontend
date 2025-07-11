import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdapterLogs } from '@/hooks/useAdapterLogs';
import { LogViewer } from '@/components/adapter/LogViewer';
import { LogFilters } from '@/components/adapter/LogFilters';
import { LogExport } from '@/components/adapter/LogExport';
import { ScrollText, Search, Filter, Download, RefreshCw } from 'lucide-react';

export const AdapterLogs = () => {
  const [selectedAdapter, setSelectedAdapter] = useState<string>('');
  const [logLevel, setLogLevel] = useState<'info' | 'warn' | 'error' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const { logs, loading, error, refetch, adapters } = useAdapterLogs({
    adapterId: selectedAdapter,
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
            Adapter Logs
          </h1>
          <p className="text-muted-foreground">Monitor and analyze adapter execution logs</p>
        </div>
        <div className="flex gap-2">
          <LogExport adapterId={selectedAdapter} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adapter</label>
              <Select value={selectedAdapter} onValueChange={setSelectedAdapter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select adapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Adapters</SelectItem>
                  {adapters.map((adapter) => (
                    <SelectItem key={adapter.id} value={adapter.id!}>
                      {adapter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select value={logLevel} onValueChange={(value: any) => setLogLevel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
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
      {selectedAdapter && (
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
      <LogViewer 
        logs={logs} 
        loading={loading} 
        error={error}
        adapterId={selectedAdapter}
      />
    </div>
  );
};