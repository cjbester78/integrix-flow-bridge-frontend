export interface Message {
  id: string;
  timestamp: string;
  flowId: string;
  flowName: string;
  customerId: string;
  customerName: string;
  source: {
    adapterId: string;
    adapterName: string;
    type: string;
  };
  target: {
    adapterId: string;
    adapterName: string;
    type: string;
  };
  messageType: string;
  status: MessageStatus;
  priority: MessagePriority;
  size: number; // in bytes
  processingTime?: number; // in milliseconds
  retryCount: number;
  maxRetries: number;
  content?: {
    headers: { [key: string]: string };
    payload: any;
    transformedPayload?: any;
  };
  logs: MessageLog[];
  errors?: MessageError[];
  metadata: {
    correlationId?: string;
    parentMessageId?: string;
    tags?: string[];
    businessKey?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface MessageLog {
  id: string;
  messageId: string;
  timestamp: string;
  level: LogLevel;
  component: string; // adapter name, transformer, etc.
  message: string;
  details?: any;
  duration?: number; // step duration in ms
}

export interface MessageError {
  id: string;
  messageId: string;
  timestamp: string;
  errorCode: string;
  errorMessage: string;
  stackTrace?: string;
  component: string;
  retryable: boolean;
  category: ErrorCategory;
}

export interface MessageStats {
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
  processingMessages: number;
  retryingMessages: number;
  averageProcessingTime: number;
  throughputPerMinute: number;
  throughputPerHour: number;
  errorRate: number;
  successRate: number;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface MessageFilters {
  status?: MessageStatus[];
  priority?: MessagePriority[];
  flowId?: string;
  customerId?: string;
  source?: string;
  target?: string;
  messageType?: string;
  startDate?: string;
  endDate?: string;
  search?: string; // search in content, logs, errors
  correlationId?: string;
  businessKey?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'timestamp' | 'processingTime' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface RealtimeUpdate {
  type: 'message_created' | 'message_updated' | 'message_completed' | 'message_failed' | 'stats_updated';
  data: Message | MessageStats;
  timestamp: string;
}

export type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying' | 'cancelled';
export type MessagePriority = 'low' | 'normal' | 'high' | 'critical';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type ErrorCategory = 'validation' | 'transformation' | 'connection' | 'timeout' | 'authentication' | 'business_logic' | 'system';