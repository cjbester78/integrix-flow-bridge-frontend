import { useState } from 'react';
import { Message } from './messageData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Database, FileText, ChevronDown, ChevronRight, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MessageListProps {
  messages: Message[];
  isCustomerSelected: boolean;
  statusFilter?: string | null;
}

type TimeFilter = 'all' | 'today' | 'today-hourly' | 'yesterday' | 'past-7-days' | 'past-30-days';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'processing':
      return <Clock className="h-4 w-4 text-warning animate-spin" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

const getLogLevelIcon = (level: string) => {
  switch (level.toUpperCase()) {
    case 'SUCCESS':
      return <CheckCircle className="h-3 w-3 text-success" />;
    case 'ERROR':
      return <XCircle className="h-3 w-3 text-destructive" />;
    case 'WARN':
      return <AlertTriangle className="h-3 w-3 text-warning" />;
    default:
      return <Info className="h-3 w-3 text-info" />;
  }
};

const filterMessagesByTime = (messages: Message[], filter: TimeFilter): Message[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return messages.filter(message => {
    const messageDate = new Date(message.timestamp);
    
    switch (filter) {
      case 'today':
        return messageDate >= today;
      case 'today-hourly':
        return messageDate >= today;
      case 'yesterday':
        const tomorrowStart = new Date(today);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        return messageDate >= yesterday && messageDate < today;
      case 'past-7-days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return messageDate >= sevenDaysAgo;
      case 'past-30-days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return messageDate >= thirtyDaysAgo;
      default:
        return true;
    }
  });
};

export const MessageList = ({ messages, isCustomerSelected, statusFilter }: MessageListProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  // Apply filters
  let filteredMessages = filterMessagesByTime(messages, timeFilter);
  
  if (statusFilter) {
    filteredMessages = filteredMessages.filter(msg => msg.status === statusFilter);
  }

  // Sort by timestamp (newest first)
  filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getFilterDescription = () => {
    const total = filteredMessages.length;
    switch (timeFilter) {
      case 'today':
        return `${total} messages today`;
      case 'today-hourly':
        return `${total} messages today (hourly view)`;
      case 'yesterday':
        return `${total} messages yesterday`;
      case 'past-7-days':
        return `${total} messages in the past 7 days`;
      case 'past-30-days':
        return `${total} messages in the past 30 days`;
      default:
        return `${total} total messages`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <Card className="bg-gradient-secondary border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Message History
            </CardTitle>
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="today-hourly">Today (Hourly)</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="past-7-days">Past 7 Days</SelectItem>
                <SelectItem value="past-30-days">Past 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">{getFilterDescription()}</p>
        </CardHeader>
      </Card>

      {/* Message List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <Card className="bg-gradient-secondary border-border/50">
            <CardContent className="py-12 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Messages Found</h3>
              <p className="text-muted-foreground">
                {statusFilter 
                  ? `No ${statusFilter} messages found for the selected time period.`
                  : 'No messages found for the selected time period.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="bg-gradient-secondary border-border/50 hover-scale">
              <Collapsible
                open={expandedMessages.has(message.id)}
                onOpenChange={() => toggleMessageExpansion(message.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full p-0 h-auto hover:bg-transparent">
                    <CardHeader className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(message.status)}
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{message.id}</span>
                              <Badge variant="outline" className="text-xs">
                                {message.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {message.source} → {message.target}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div className="text-sm">
                            <div className="text-muted-foreground">{message.timestamp}</div>
                            <div className="text-xs text-muted-foreground">
                              {message.processingTime} • {message.size}
                            </div>
                          </div>
                          {expandedMessages.has(message.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="border-t border-border/50 pt-4">
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Processing Logs
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {message.logs.map((log, index) => (
                          <div key={index} className="flex items-start gap-3 text-xs">
                            {getLogLevelIcon(log.level)}
                            <span className="text-muted-foreground min-w-[120px] font-mono">
                              {log.timestamp.split(' ')[1]}
                            </span>
                            <span className="text-foreground">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};