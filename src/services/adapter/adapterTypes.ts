import { api, ApiResponse } from '../api';
import { AdapterType } from '@/types/adapter';

export class AdapterTypes {
  // Get available adapter types and their configurations
  async getAdapterTypes(): Promise<ApiResponse<AdapterType[]>> {
    return api.get('/adapters/types');
  }
}