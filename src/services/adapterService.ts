import { api, ApiResponse } from './api';

export interface CommunicationAdapter {
  id?: string;
  name: string;
  type: 'rest' | 'soap' | 'file' | 'database' | 'sap' | 'salesforce' | 'email' | 'sms';
  mode: 'inbound' | 'outbound' | 'bidirectional';
  description?: string;
  configuration: AdapterConfiguration;
  status: 'active' | 'inactive' | 'error' | 'testing';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface AdapterConfiguration {
  // REST API Configuration
  baseUrl?: string;
  authentication?: {
    type: 'none' | 'basic' | 'bearer' | 'api-key' | 'oauth2';
    credentials?: any;
  };
  headers?: { [key: string]: string };
  timeout?: number;
  
  // SOAP Configuration
  wsdlUrl?: string;
  soapAction?: string;
  namespace?: string;
  
  // File Configuration
  directory?: string;
  filePattern?: string;
  encoding?: string;
  
  // Database Configuration
  connectionString?: string;
  driver?: string;
  schema?: string;
  
  // Email Configuration
  smtpHost?: string;
  smtpPort?: number;
  encryption?: 'none' | 'ssl' | 'tls';
  
  // Custom properties
  properties?: { [key: string]: any };
}

export interface AdapterTestResult {
  success: boolean;
  responseTime: number;
  statusCode?: number;
  message: string;
  details?: any;
  errors?: string[];
}

class AdapterService {
  // Create a new communication adapter
  async createAdapter(adapter: Omit<CommunicationAdapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<CommunicationAdapter>> {
    return api.post<CommunicationAdapter>('/adapters', adapter);
  }

  // Get all adapters with optional filtering
  async getAdapters(params?: {
    type?: string;
    mode?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ adapters: CommunicationAdapter[]; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/adapters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get(endpoint);
  }

  // Get a specific adapter by ID
  async getAdapter(id: string): Promise<ApiResponse<CommunicationAdapter>> {
    return api.get<CommunicationAdapter>(`/adapters/${id}`);
  }

  // Update an existing adapter
  async updateAdapter(id: string, updates: Partial<CommunicationAdapter>): Promise<ApiResponse<CommunicationAdapter>> {
    return api.put<CommunicationAdapter>(`/adapters/${id}`, updates);
  }

  // Delete an adapter
  async deleteAdapter(id: string): Promise<ApiResponse<void>> {
    return api.delete(`/adapters/${id}`);
  }

  // Test adapter connection and configuration
  async testAdapter(adapterId: string, testData?: any): Promise<ApiResponse<AdapterTestResult>> {
    return api.post<AdapterTestResult>(`/adapters/${adapterId}/test`, { testData });
  }

  // Test adapter configuration without saving
  async testAdapterConfiguration(config: AdapterConfiguration, type: string): Promise<ApiResponse<AdapterTestResult>> {
    return api.post<AdapterTestResult>('/adapters/test-config', { configuration: config, type });
  }

  // Get adapter statistics and health
  async getAdapterStats(id: string, timeRange?: string): Promise<ApiResponse<{
    totalMessages: number;
    successfulMessages: number;
    failedMessages: number;
    averageResponseTime: number;
    uptime: number;
    lastExecution?: string;
  }>> {
    const endpoint = `/adapters/${id}/stats${timeRange ? `?timeRange=${timeRange}` : ''}`;
    return api.get(endpoint);
  }

  // Get adapter execution logs
  async getAdapterLogs(id: string, params?: {
    level?: 'info' | 'warn' | 'error';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
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

  // Clone an existing adapter
  async cloneAdapter(id: string, newName: string): Promise<ApiResponse<CommunicationAdapter>> {
    return api.post<CommunicationAdapter>(`/adapters/${id}/clone`, { name: newName });
  }

  // Get available adapter types and their configurations
  async getAdapterTypes(): Promise<ApiResponse<Array<{
    type: string;
    name: string;
    description: string;
    configurationSchema: any;
    supportedModes: string[];
  }>>> {
    return api.get('/adapters/types');
  }

  // Validate adapter configuration
  async validateAdapterConfig(type: string, configuration: AdapterConfiguration): Promise<ApiResponse<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>> {
    return api.post('/adapters/validate-config', { type, configuration });
  }
}

export const adapterService = new AdapterService();