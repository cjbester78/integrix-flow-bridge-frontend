import { Message } from '../messageData';
import { TimeFilter } from '../types/timeFilter';

export const filterMessagesByTime = (messages: Message[], filter: TimeFilter): Message[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return messages.filter(message => {
    const messageDate = new Date(message.timestamp);
    
    if (filter === 'today') {
      return messageDate >= today;
    }
    
    if (filter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayAfter = new Date(yesterday);
      dayAfter.setDate(dayAfter.getDate() + 1);
      return messageDate >= yesterday && messageDate < dayAfter;
    }
    
    if (filter === 'last-7-days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return messageDate >= sevenDaysAgo;
    }
    
    if (filter === 'last-30-days') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return messageDate >= thirtyDaysAgo;
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

export const getFilterDescription = (timeFilter: TimeFilter, messageCount: number): string => {
  if (timeFilter === 'today') {
    return `${messageCount} messages today`;
  }
  if (timeFilter === 'yesterday') {
    return `${messageCount} messages yesterday`;
  }
  if (timeFilter === 'last-7-days') {
    return `${messageCount} messages in the past 7 days`;
  }
  if (timeFilter === 'last-30-days') {
    return `${messageCount} messages in the past 30 days`;
  }
  if (timeFilter.startsWith('today-')) {
    const hour = parseInt(timeFilter.split('-')[1]);
    const hourStr = hour.toString().padStart(2, '0');
    return `${messageCount} messages today ${hourStr}:00 - ${hourStr}:59`;
  }
  return `${messageCount} total messages`;
};