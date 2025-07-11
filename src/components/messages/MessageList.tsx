import { useState } from 'react';
import { Message } from './messageData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Database } from 'lucide-react';
import { TimeFilter } from './types/timeFilter';
import { filterMessagesByTime, getFilterDescription } from './utils/timeFilters';
import { TimeFilterSelect } from './components/TimeFilterSelect';
import { MessageCard } from './components/MessageCard';

interface MessageListProps {
  messages: Message[];
  isCustomerSelected: boolean;
  statusFilter?: string | null;
}

export const MessageList = ({ messages, isCustomerSelected, statusFilter }: MessageListProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');

  // Apply filters
  let filteredMessages = filterMessagesByTime(messages, timeFilter);
  
  if (statusFilter) {
    filteredMessages = filteredMessages.filter(msg => msg.status === statusFilter);
  }

  // Sort by timestamp (newest first)
  filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
            <TimeFilterSelect value={timeFilter} onValueChange={setTimeFilter} />
          </div>
          <p className="text-sm text-muted-foreground">
            {getFilterDescription(timeFilter, filteredMessages.length)}
          </p>
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
            <MessageCard key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
};