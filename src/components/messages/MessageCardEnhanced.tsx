import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Message } from '@/types/message';
import { 
  MessageSquare, 
  Clock, 
  Database, 
  ArrowRight, 
  RotateCcw, 
  X, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pause
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MessageCardProps {
  message: Message;
  onRetry?: (messageId: string) => void;
  onCancel?: (messageId: string) => void;
  onViewDetails?: (messageId: string) => void;
}

export const MessageCard = ({ message, onRetry, onCancel, onViewDetails }: MessageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'retrying':
        return <RotateCcw className="h-4 w-4 text-warning animate-spin" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-muted-foreground" />;
      case 'pending':
        return <Pause className="h-4 w-4 text-muted-foreground" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="text-success border-success">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="default">Processing</Badge>;
      case 'retrying':
        return <Badge variant="secondary" className="text-warning">Retrying</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="secondary" className="text-warning">High</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-muted-foreground">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const retryProgress = message.maxRetries > 0 ? (message.retryCount / message.maxRetries) * 100 : 0;

  return (
    <Card className="bg-gradient-secondary border-border/50 animate-fade-in hover:shadow-elegant transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon(message.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {message.flowName}
                </h3>
                {getStatusBadge(message.status)}
                {getPriorityBadge(message.priority)}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Database className="h-3 w-3" />
                <span>{message.source.adapterName}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{message.target.adapterName}</span>
                <span className="mx-2">•</span>
                <span>{message.messageType}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </div>
                <span>Size: {formatSize(message.size)}</span>
                {message.processingTime && (
                  <span>Duration: {formatDuration(message.processingTime)}</span>
                )}
                {message.retryCount > 0 && (
                  <span>Retries: {message.retryCount}/{message.maxRetries}</span>
                )}
              </div>

              {message.retryCount > 0 && message.maxRetries > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Retry Progress</span>
                    <span>{message.retryCount}/{message.maxRetries}</span>
                  </div>
                  <Progress value={retryProgress} className="h-1" />
                </div>
              )}

              {message.metadata.correlationId && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Correlation ID: <code className="bg-muted px-1 rounded">{message.metadata.correlationId}</code>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {message.status === 'failed' && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRetry(message.id)}
                className="hover-scale"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            
            {['pending', 'processing', 'retrying'].includes(message.status) && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(message.id)}
                className="hover-scale"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover-scale"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />
          
          {/* Recent Logs */}
          {message.logs.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Recent Logs ({message.logs.length})
              </h4>
              <ScrollArea className="h-32 border rounded-md p-2 bg-background/50">
                <div className="space-y-1">
                  {message.logs.slice(-5).map((log, index) => (
                    <div key={index} className="text-xs flex items-start gap-2">
                      <span className="text-muted-foreground font-mono min-w-[60px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge variant="outline" className="h-4 text-xs">
                        {log.level.toLowerCase()}
                      </Badge>
                      <span className="text-foreground">{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Errors */}
          {message.errors && message.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-destructive mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Errors ({message.errors.length})
              </h4>
              <div className="space-y-2">
                {message.errors.slice(-2).map((error, index) => (
                  <div key={index} className="border border-destructive/20 rounded-md p-2 bg-destructive/5">
                    <div className="text-xs text-destructive font-medium mb-1">
                      {error.errorCode}: {error.category}
                    </div>
                    <div className="text-xs text-foreground">{error.errorMessage}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(message.id)}
                className="hover-scale"
              >
                View Full Details
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};