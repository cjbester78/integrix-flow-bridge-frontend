export interface IntegrationFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  sourceAdapter: string;
  targetAdapter: string;
  transformationConfig?: any;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  customerId?: string;
}