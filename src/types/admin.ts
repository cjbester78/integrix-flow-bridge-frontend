export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'integrator' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export interface Certificate {
  id: string;
  name: string;
  type: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: string;
  usage: string;
}

export interface JarFile {
  id: string;
  name: string;
  version: string;
  description: string;
  fileName: string;
  size: number;
  uploadDate: string;
  driverType: string;
}