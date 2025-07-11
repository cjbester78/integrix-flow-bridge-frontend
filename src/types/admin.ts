export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
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