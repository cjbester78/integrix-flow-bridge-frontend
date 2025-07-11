import { api, ApiResponse } from './api';

export interface Channel {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'idle' | 'stopped';
  load: number;
  throughput: string;
  uptime: string;
  lastActivity: string;
  adapters: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  errorRate: number;
  totalMessages: number;
  avgResponseTime: string;
  customerId?: string;
}

export interface ChannelFilters {
  customerId?: string;
  status?: string;
  category?: string;
  healthStatus?: 'healthy' | 'warning' | 'error';
  limit?: number;
  offset?: number;
}

export interface ChannelStats {
  total: number;
  running: number;
  idle: number;
  stopped: number;
  errorChannels: number;
  avgUptime: number;
  totalThroughput: number;
}

export interface ChannelAction {
  action: 'start' | 'stop' | 'restart' | 'configure';
  channelId: string;
  parameters?: any;
}

class ChannelService {
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private channelListeners: ((channel: Channel) => void)[] = [];
  private statsListeners: ((stats: ChannelStats) => void)[] = [];
  private alertListeners: ((alert: any) => void)[] = [];

  // Get all channels with optional filtering
  async getChannels(filters?: ChannelFilters): Promise<ApiResponse<{ channels: Channel[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/channels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Get a specific channel by ID
  async getChannel(id: string): Promise<ApiResponse<Channel>> {
    return api.get<Channel>(`/channels/${id}`);
  }

  // Get channel statistics
  async getChannelStats(filters?: Omit<ChannelFilters, 'limit' | 'offset'>): Promise<ApiResponse<ChannelStats>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/channels/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Control channel operations
  async controlChannel(action: ChannelAction): Promise<ApiResponse<Channel>> {
    return api.post<Channel>(`/channels/${action.channelId}/control`, action);
  }

  // Get channels for a specific customer
  async getCustomerChannels(customerId: string, filters?: Omit<ChannelFilters, 'customerId'>): Promise<ApiResponse<{ channels: Channel[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/customers/${customerId}/channels${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // WebSocket Real-time Updates
  connectWebSocket(customerId?: string): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/ws/channels${customerId ? `?customerId=${customerId}` : ''}`;
    
    try {
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('WebSocket connected for channel monitoring');
        this.reconnectAttempts = 0;
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'channel_update') {
            this.channelListeners.forEach(listener => listener(data.channel));
          } else if (data.type === 'stats_update') {
            this.statsListeners.forEach(listener => listener(data.stats));
          } else if (data.type === 'channel_alert') {
            this.alertListeners.forEach(listener => listener(data.alert));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.websocket.onclose = () => {
        console.log('WebSocket connection closed');
        this.attemptReconnect(customerId);
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private attemptReconnect(customerId?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(customerId);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.channelListeners = [];
    this.statsListeners = [];
    this.alertListeners = [];
    this.reconnectAttempts = 0;
  }

  // Event listeners
  onChannelUpdate(callback: (channel: Channel) => void): () => void {
    this.channelListeners.push(callback);
    return () => {
      const index = this.channelListeners.indexOf(callback);
      if (index > -1) this.channelListeners.splice(index, 1);
    };
  }

  onStatsUpdate(callback: (stats: ChannelStats) => void): () => void {
    this.statsListeners.push(callback);
    return () => {
      const index = this.statsListeners.indexOf(callback);
      if (index > -1) this.statsListeners.splice(index, 1);
    };
  }

  onAlert(callback: (alert: any) => void): () => void {
    this.alertListeners.push(callback);
    return () => {
      const index = this.alertListeners.indexOf(callback);
      if (index > -1) this.alertListeners.splice(index, 1);
    };
  }

  sendCommand(command: string, data?: any): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ command, data }));
    }
  }
}

export const channelService = new ChannelService();