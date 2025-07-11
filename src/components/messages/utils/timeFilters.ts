import { Message, MessageStatus } from '@/services/messageService';
import { TimeFilter } from '../types/timeFilter';

export const filterMessagesByTime = (messages: Message[], filter: TimeFilter): Message[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (filter) {
    case 'today':
      return messages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate >= today;
      });
    
    case 'last-24h':
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return messages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate >= last24h;
      });
    
    case 'last-7d':
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return messages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate >= last7d;
      });
    
    case 'last-30d':
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return messages.filter(message => {
        const messageDate = new Date(message.timestamp);
        return messageDate >= last30d;
      });
    
    case 'success':
      return messages.filter(message => message.status === 'success');
    
    case 'failed':
      return messages.filter(message => message.status === 'failed');
    
    case 'processing':
      return messages.filter(message => message.status === 'processing');
    
    case 'all':
    default:
      return messages;
  }
};

export const getFilterDescription = (timeFilter: TimeFilter, messageCount: number): string => {
  if (timeFilter === 'today') {
    return `${messageCount} messages today`;
  } else if (timeFilter === 'last-24h') {
    return `${messageCount} messages in last 24 hours`;
  } else if (timeFilter === 'last-7d') {
    return `${messageCount} messages in last 7 days`;
  } else if (timeFilter === 'last-30d') {
    return `${messageCount} messages in last 30 days`;
  } else if (timeFilter === 'success') {
    return `${messageCount} successful messages`;
  } else if (timeFilter === 'failed') {
    return `${messageCount} failed messages`;
  } else if (timeFilter === 'processing') {
    return `${messageCount} processing messages`;
  } else {
    return `${messageCount} messages total`;
  }
};