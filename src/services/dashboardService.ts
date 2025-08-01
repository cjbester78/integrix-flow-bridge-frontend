import { api } from './api';

export interface DashboardStats {
  activeIntegrations: number;
  messagesToday: number;
  successRate: number;
  avgResponseTime: number;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface RecentMessage {
  id: string;
  source: string;
  target: string;
  status: 'success' | 'failed' | 'processing';
  time: string;
  businessComponentId?: string;
}

export interface ChannelStatus {
  name: string;
  status: 'running' | 'idle' | 'stopped';
  load: number;
  businessComponentId?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  metrics: DashboardMetric[];
  recentMessages: RecentMessage[];
  channelStatuses: ChannelStatus[];
}

class DashboardService {
  async getDashboardStats(businessComponentId?: string): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
    try {
      const endpoint = businessComponentId 
        ? `/dashboard/stats?businessComponentId=${businessComponentId}` 
        : '/dashboard/stats';
      return await api.get<DashboardStats>(endpoint);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  }

  async getDashboardMetrics(businessComponentId?: string): Promise<{ success: boolean; data?: DashboardMetric[]; error?: string }> {
    try {
      const endpoint = businessComponentId 
        ? `/dashboard/metrics?businessComponentId=${businessComponentId}` 
        : '/dashboard/metrics';
      const response = await api.get<DashboardStats>(endpoint);
      
      if (response.success && response.data) {
        // Transform stats into metrics format
        const stats = response.data;
        const metrics: DashboardMetric[] = [
          {
            title: "Active Integrations",
            value: stats.activeIntegrations.toString(),
            change: "+0%", // This should come from backend
            icon: "Activity",
            color: "text-success"
          },
          {
            title: "Messages Today",
            value: stats.messagesToday.toLocaleString(),
            change: "+0%", // This should come from backend
            icon: "MessageSquare",
            color: "text-info"
          },
          {
            title: "Success Rate",
            value: `${stats.successRate.toFixed(1)}%`,
            change: "+0%", // This should come from backend
            icon: "CheckCircle",
            color: "text-success"
          },
          {
            title: "Avg Response Time",
            value: `${stats.avgResponseTime}ms`,
            change: "0ms", // This should come from backend
            icon: "Zap",
            color: "text-warning"
          }
        ];
        
        return { success: true, data: metrics };
      }
      
      return response as any;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard metrics'
      };
    }
  }

  async getRecentMessages(businessComponentId?: string, limit: number = 10): Promise<{ success: boolean; data?: RecentMessage[]; error?: string }> {
    try {
      const endpoint = businessComponentId 
        ? `/messages/recent?businessComponentId=${businessComponentId}&limit=${limit}` 
        : `/messages/recent?limit=${limit}`;
      return await api.get<RecentMessage[]>(endpoint);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent messages'
      };
    }
  }

  async getChannelStatuses(businessComponentId?: string): Promise<{ success: boolean; data?: ChannelStatus[]; error?: string }> {
    try {
      const endpoint = businessComponentId 
        ? `/channels/status?businessComponentId=${businessComponentId}` 
        : '/channels/status';
      return await api.get<ChannelStatus[]>(endpoint);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch channel statuses'
      };
    }
  }

  async getDashboardData(businessComponentId?: string): Promise<{ success: boolean; data?: DashboardData; error?: string }> {
    try {
      // Fetch all dashboard data in parallel
      const [statsResponse, messagesResponse, channelsResponse] = await Promise.all([
        this.getDashboardStats(businessComponentId),
        this.getRecentMessages(businessComponentId),
        this.getChannelStatuses(businessComponentId)
      ]);

      if (!statsResponse.success || !messagesResponse.success || !channelsResponse.success) {
        return {
          success: false,
          error: 'Failed to fetch some dashboard data'
        };
      }

      // Transform stats to metrics
      const metrics = await this.getDashboardMetrics(businessComponentId);

      return {
        success: true,
        data: {
          stats: statsResponse.data!,
          metrics: metrics.data || [],
          recentMessages: messagesResponse.data || [],
          channelStatuses: channelsResponse.data || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
      };
    }
  }
}

export const dashboardService = new DashboardService();