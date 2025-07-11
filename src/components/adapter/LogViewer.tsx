import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LogEntry } from '@/hooks/useAdapterLogs';
import { AlertCircle, Info, AlertTriangle, Clock, Terminal } from 'lucide-react';
import { useState } from 'react';

interface LogViewerProps {
  logs: LogEntry[];
  loading: boolean;
  error?: string;
  adapterId?: string;
}

export const LogViewer = ({ logs, loading, error, adapterId }: LogViewerProps) => {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-success" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warn':
        return <Badge variant="secondary" className="text-warning">Warning</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-gradient-secondary border-border/50">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading logs...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-secondary border-border/50">
        <CardContent className="p-8 text-center">
          <div className="text-destructive">Error loading logs: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="bg-gradient-secondary border-border/50">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            {adapterId ? 'No logs found for the selected adapter and filters' : 'Select an adapter to view logs'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-secondary border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Execution Logs ({logs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="border border-border/50 rounded-lg p-3 bg-background/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getLogIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getLevelBadge(log.level)}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground">{log.message}</p>
                      {log.details && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLogExpansion(log.id)}
                            className="text-xs"
                          >
                            {expandedLogs.has(log.id) ? 'Hide Details' : 'Show Details'}
                          </Button>
                          {expandedLogs.has(log.id) && (
                            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                              <pre className="whitespace-pre-wrap font-mono">
                                {typeof log.details === 'string' 
                                  ? log.details 
                                  : JSON.stringify(log.details, null, 2)
                                }
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {log !== logs[logs.length - 1] && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};