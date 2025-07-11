import { api, ApiResponse } from '../api';
import { AdapterStats, AdapterLogParams } from '@/types/adapter';

export class AdapterMonitoring {
  // Get adapter statistics and health
  async getAdapterStats(id: string, timeRange?: string): Promise<ApiResponse<AdapterStats>> {
    const endpoint = `/adapters/${id}/stats${timeRange ? `?timeRange=${timeRange}` : ''}`;
    return api.get(endpoint);
  }

  // Get adapter execution logs
  async getAdapterLogs(id: string, params?: AdapterLogParams): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/adapters/${id}/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }
}