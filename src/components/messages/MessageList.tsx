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

type TimeFilter = 'all' | 'today' | 'today-00' | 'today-01' | 'today-02' | 'today-03' | 'today-04' | 'today-05' | 'today-06' | 'today-07' | 'today-08' | 'today-09' | 'today-10' | 'today-11' | 'today-12' | 'today-13' | 'today-14' | 'today-15' | 'today-16' | 'today-17' | 'today-18' | 'today-19' | 'today-20' | 'today-21' | 'today-22' | 'today-23';

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
  
  return messages.filter(message => {
    const messageDate = new Date(message.timestamp);
    
    if (filter === 'today') {
      return messageDate >= today;
    }
    
    if (filter.startsWith('today-')) {
      const hour = parseInt(filter.split('-')[1]);
      const hourStart = new Date(today);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(today);
      hourEnd.setHours(hour, 59, 59, 999);
      return messageDate >= hourStart && messageDate <= hourEnd;
    }
    
    // Default: all messages
    return true;
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
    if (timeFilter === 'today') {
      return `${total} messages today (all hours)`;
    }
    if (timeFilter.startsWith('today-')) {
      const hour = parseInt(timeFilter.split('-')[1]);
      const hourStr = hour.toString().padStart(2, '0');
      return `${total} messages today ${hourStr}:00 - ${hourStr}:59`;
    }
    return `${total} total messages`;
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
                <SelectItem value="today">Today (All Hours)</SelectItem>
                <SelectItem value="today-00">Today 00:00 - 00:59</SelectItem>
                <SelectItem value="today-01">Today 01:00 - 01:59</SelectItem>
                <SelectItem value="today-02">Today 02:00 - 02:59</SelectItem>
                <SelectItem value="today-03">Today 03:00 - 03:59</SelectItem>
                <SelectItem value="today-04">Today 04:00 - 04:59</SelectItem>
                <SelectItem value="today-05">Today 05:00 - 05:59</SelectItem>
                <SelectItem value="today-06">Today 06:00 - 06:59</SelectItem>
                <SelectItem value="today-07">Today 07:00 - 07:59</SelectItem>
                <SelectItem value="today-08">Today 08:00 - 08:59</SelectItem>
                <SelectItem value="today-09">Today 09:00 - 09:59</SelectItem>
                <SelectItem value="today-10">Today 10:00 - 10:59</SelectItem>
                <SelectItem value="today-11">Today 11:00 - 11:59</SelectItem>
                <SelectItem value="today-12">Today 12:00 - 12:59</SelectItem>
                <SelectItem value="today-13">Today 13:00 - 13:59</SelectItem>
                <SelectItem value="today-14">Today 14:00 - 14:59</SelectItem>
                <SelectItem value="today-15">Today 15:00 - 15:59</SelectItem>
                <SelectItem value="today-16">Today 16:00 - 16:59</SelectItem>
                <SelectItem value="today-17">Today 17:00 - 17:59</SelectItem>
                <SelectItem value="today-18">Today 18:00 - 18:59</SelectItem>
                <SelectItem value="today-19">Today 19:00 - 19:59</SelectItem>
                <SelectItem value="today-20">Today 20:00 - 20:59</SelectItem>
                <SelectItem value="today-21">Today 21:00 - 21:59</SelectItem>
                <SelectItem value="today-22">Today 22:00 - 22:59</SelectItem>
                <SelectItem value="today-23">Today 23:00 - 23:59</SelectItem>
                <SelectItem value="all">All Messages</SelectItem>
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