import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from './messageData';

interface MessageStatsProps {
  messages: Message[];
  isCustomerSelected: boolean;
  onStatusFilter?: (status: string) => void;
  statusFilter?: string | null;
}

export const MessageStats = ({ 
  messages, 
  isCustomerSelected, 
  onStatusFilter, 
  statusFilter 
}: MessageStatsProps) => {
  const successfulMessages = messages.filter(msg => msg.status === 'success').length;
  const processingMessages = messages.filter(msg => msg.status === 'processing').length;
  const failedMessages = messages.filter(msg => msg.status === 'failed').length;
  
  // Calculate success rate
  const totalMessages = messages.length;
  const successRate = totalMessages > 0 ? ((successfulMessages / totalMessages) * 100).toFixed(1) : '0.0';
  
  // Calculate average processing time
  const completedMessages = messages.filter(msg => msg.status !== 'processing' && msg.processingTime !== '-');
  const avgProcessingTime = completedMessages.length > 0 
    ? Math.round(completedMessages.reduce((sum, msg) => {
        const time = parseFloat(msg.processingTime.replace(/[^\d.]/g, ''));
        return sum + (isNaN(time) ? 0 : time);
      }, 0) / completedMessages.length)
    : 0;

  const getSubtext = () => 
    isCustomerSelected 
      ? `of ${totalMessages} customer messages` 
      : 'across all messages';

  const handleCardClick = (status: string) => {
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card 
        className={`bg-gradient-secondary border-border/50 cursor-pointer transition-all hover-scale animate-scale-in ${
          statusFilter === 'success' ? 'ring-2 ring-success' : ''
        }`}
        onClick={() => handleCardClick('success')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Successful Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{successfulMessages}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card 
        className={`bg-gradient-secondary border-border/50 cursor-pointer transition-all hover-scale animate-scale-in ${
          statusFilter === 'processing' ? 'ring-2 ring-warning' : ''
        }`}
        onClick={() => handleCardClick('processing')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Processing Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{processingMessages}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card 
        className={`bg-gradient-secondary border-border/50 cursor-pointer transition-all hover-scale animate-scale-in ${
          statusFilter === 'failed' ? 'ring-2 ring-destructive' : ''
        }`}
        onClick={() => handleCardClick('failed')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Failed Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{failedMessages}</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{successRate}%</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-secondary border-border/50 animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">{avgProcessingTime}ms</div>
          <p className="text-xs text-muted-foreground">{getSubtext()}</p>
        </CardContent>
      </Card>
    </div>
  );
};