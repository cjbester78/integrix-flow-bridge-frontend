import { api, ApiResponse } from './api';
import { Message, MessageFilters, MessageStats, MessageLog, MessageError } from '@/types/message';

export class MessageService {
  // Get messages with filtering and pagination
  async getMessages(filters?: MessageFilters): Promise<ApiResponse<{
    messages: Message[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    const endpoint = `/messages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Get a specific message by ID with full details
  async getMessage(id: string): Promise<ApiResponse<Message>> {
    return api.get<Message>(`/messages/${id}`);
  }

  // Get message statistics
  async getMessageStats(filters?: {
    timeRange?: 'hour' | 'day' | 'week' | 'month';
    startDate?: string;
    endDate?: string;
    flowId?: string;
    customerId?: string;
  }): Promise<ApiResponse<MessageStats>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/messages/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Get message logs for a specific message
  async getMessageLogs(messageId: string, params?: {
    level?: string;
    component?: string;
    limit?: number;
  }): Promise<ApiResponse<MessageLog[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/messages/${messageId}/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Get message errors for a specific message
  async getMessageErrors(messageId: string): Promise<ApiResponse<MessageError[]>> {
    return api.get<MessageError[]>(`/messages/${messageId}/errors`);
  }

  // Retry a failed message
  async retryMessage(messageId: string, options?: {
    resetRetryCount?: boolean;
    skipValidation?: boolean;
  }): Promise<ApiResponse<Message>> {
    return api.post<Message>(`/messages/${messageId}/retry`, options || {});
  }

  // Cancel a pending/processing message
  async cancelMessage(messageId: string, reason?: string): Promise<ApiResponse<Message>> {
    return api.post<Message>(`/messages/${messageId}/cancel`, { reason });
  }

  // Reprocess a message with new configuration
  async reprocessMessage(messageId: string, config?: {
    targetAdapterId?: string;
    transformationOverrides?: any;
  }): Promise<ApiResponse<Message>> {
    return api.post<Message>(`/messages/${messageId}/reprocess`, config || {});
  }

  // Search messages by content, logs, or metadata
  async searchMessages(query: string, filters?: {
    searchIn?: ('content' | 'logs' | 'metadata')[];
    includeArchived?: boolean;
  }): Promise<ApiResponse<Message[]>> {
    const params = { 
      q: query,
      ...filters
    };
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
    
    return api.get(`/messages/search?${queryParams.toString()}`);
  }

  // Get message trace (related messages in a correlation chain)
  async getMessageTrace(correlationId: string): Promise<ApiResponse<{
    messages: Message[];
    relationships: Array<{
      parentId: string;
      childId: string;
      relationship: 'triggered' | 'split' | 'transformed' | 'callback';
    }>;
  }>> {
    return api.get(`/messages/trace/${correlationId}`);
  }

  // Get real-time message metrics
  async getRealtimeMetrics(): Promise<ApiResponse<{
    activeMessages: number;
    messagesPerSecond: number;
    averageLatency: number;
    errorRate: number;
    systemHealth: 'healthy' | 'degraded' | 'critical';
    queueDepth: { [queueName: string]: number };
  }>> {
    return api.get('/messages/metrics/realtime');
  }

  // Archive old messages
  async archiveMessages(filters: {
    olderThan: string; // ISO date
    status?: string[];
    dryRun?: boolean;
  }): Promise<ApiResponse<{
    archivedCount: number;
    estimatedSize: string;
  }>> {
    return api.post('/messages/archive', filters);
  }

  // Export messages to various formats
  async exportMessages(filters: MessageFilters, format: 'csv' | 'json' | 'excel'): Promise<ApiResponse<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }>> {
    return api.post('/messages/export', { filters, format });
  }

  // Get message flow visualization data
  async getMessageFlow(messageId: string): Promise<ApiResponse<{
    nodes: Array<{
      id: string;
      type: 'adapter' | 'transformer' | 'validator' | 'router';
      name: string;
      status: 'completed' | 'failed' | 'skipped';
      duration: number;
      timestamp: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      data?: any;
    }>;
  }>> {
    return api.get(`/messages/${messageId}/flow`);
  }
}

export const messageService = new MessageService();