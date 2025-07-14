import { api, ApiResponse } from './api';
import { User } from '@/types/admin';

export interface CreateUserRequest {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'integrator' | 'viewer';
  password?: string;
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'integrator' | 'viewer';
  status?: 'active' | 'inactive' | 'pending';
  permissions?: string[];
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class UserService {
  // Get all users
  async getAllUsers(page: number = 1, limit: number = 50): Promise<ApiResponse<UserListResponse>> {
    return api.get<UserListResponse>(`/users?page=${page}&limit=${limit}`);
  }

  // Get user by ID
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/users/${userId}`);
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    // Use the auth/register endpoint for user creation
    const registerData = {
      ...userData,
      password: userData.password || this.generateDefaultPassword()
    };
    
    return api.post<User>('/auth/register', registerData);
  }

  // Update user
  async updateUser(userId: string, updates: UpdateUserRequest): Promise<ApiResponse<User>> {
    return api.put<User>(`/users/${userId}`, updates);
  }

  // Delete user
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return api.delete(`/users/${userId}`);
  }

  // Update user status (activate/deactivate)
  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return api.patch<User>(`/users/${userId}/status`, { status });
  }

  // Reset user password
  async resetUserPassword(userId: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return api.post<{ temporaryPassword: string }>(`/users/${userId}/reset-password`);
  }

  // Assign role to user
  async assignRole(userId: string, role: string, permissions: string[] = []): Promise<ApiResponse<User>> {
    return api.patch<User>(`/users/${userId}/role`, { role, permissions });
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<ApiResponse<{ permissions: string[] }>> {
    return api.get<{ permissions: string[] }>(`/users/${userId}/permissions`);
  }

  // Update user permissions
  async updateUserPermissions(userId: string, permissions: string[]): Promise<ApiResponse<User>> {
    return api.patch<User>(`/users/${userId}/permissions`, { permissions });
  }

  // Search users
  async searchUsers(query: string, filters?: {
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<UserListResponse>> {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status }),
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 50).toString()
    });

    return api.get<UserListResponse>(`/users/search?${params}`);
  }

  // Generate default password for new users
  private generateDefaultPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Helper method to get role permissions
  getRolePermissions(role: string): string[] {
    const rolePermissions = {
      admin: ['flows:create', 'flows:read', 'flows:update', 'flows:delete', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:delete', 'adapters:test', 'structures:create', 'structures:read', 'structures:update', 'structures:delete', 'users:create', 'users:read', 'users:update', 'users:delete', 'system:admin'],
      integrator: ['flows:create', 'flows:read', 'flows:update', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:test', 'structures:create', 'structures:read', 'structures:update'],
      viewer: ['flows:read', 'adapters:read', 'structures:read']
    };

    return rolePermissions[role as keyof typeof rolePermissions] || ['flows:read'];
  }
}

export const userService = new UserService();