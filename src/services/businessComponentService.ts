import { BusinessComponent, CreateBusinessComponentRequest, UpdateBusinessComponentRequest } from '@/types/businessComponent';

const API_BASE_URL = 'http://localhost:8080/api/business-components';

class BusinessComponentService {
  async getAllBusinessComponents(): Promise<{ success: boolean; data?: BusinessComponent[]; error?: string }> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch business components:', error);
      return { success: false, error: 'Failed to fetch business components' };
    }
  }

  async getBusinessComponentById(id: string): Promise<{ success: boolean; data?: BusinessComponent; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Business component not found' };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch business component:', error);
      return { success: false, error: 'Failed to fetch business component' };
    }
  }

  async createBusinessComponent(data: CreateBusinessComponentRequest): Promise<{ success: boolean; data?: BusinessComponent; error?: string }> {
    try {
      console.log('Frontend: Creating business component with data:', data);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Frontend: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Frontend: Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Frontend: Created business component:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Frontend: Failed to create business component:', error);
      return { success: false, error: 'Failed to create business component' };
    }
  }

  async updateBusinessComponent(data: UpdateBusinessComponentRequest): Promise<{ success: boolean; data?: BusinessComponent; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Business component not found' };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to update business component:', error);
      return { success: false, error: 'Failed to update business component' };
    }
  }

  async deleteBusinessComponent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: 'Business component not found' };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete business component:', error);
      return { success: false, error: 'Failed to delete business component' };
    }
  }
}

export const businessComponentService = new BusinessComponentService();