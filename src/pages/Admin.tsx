import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Key, FileArchive, ScrollText } from 'lucide-react';
import { AdminStats } from '@/components/admin/AdminStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { RoleManagement } from '@/components/admin/RoleManagement';
import { CertificateManagement } from '@/components/admin/CertificateManagement';
import { JarFileManagement } from '@/components/admin/JarFileManagement';
import { SystemLogs } from '@/components/admin/SystemLogs';
import { User, Role, Certificate, JarFile } from '@/types/admin';

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@integrixlab.com',
    role: 'administrator',
    status: 'active',
    lastLogin: '2024-01-15 14:30:25',
    createdAt: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    username: 'integrator1',
    email: 'integrator1@company.com',
    role: 'integrator',
    status: 'active',
    lastLogin: '2024-01-15 12:15:30',
    createdAt: '2024-01-05 10:30:00'
  },
  {
    id: '3',
    username: 'viewer1',
    email: 'viewer1@company.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-01-10 16:45:12',
    createdAt: '2024-01-08 14:20:00'
  }
];

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'administrator',
    description: 'Full system access with user management capabilities',
    permissions: ['read', 'write', 'admin', 'user_management'],
    userCount: 1
  },
  {
    id: '2',
    name: 'integrator',
    description: 'Can create and manage integration flows',
    permissions: ['read', 'write', 'execute'],
    userCount: 1
  },
  {
    id: '3',
    name: 'viewer',
    description: 'Read-only access to monitoring and logs',
    permissions: ['read'],
    userCount: 1
  }
];

const initialCertificates: Certificate[] = [
  {
    id: '1',
    name: 'SAP Production SSL',
    type: 'SSL Certificate',
    issuer: 'DigiCert Inc',
    validFrom: '2024-01-01',
    validTo: '2025-01-01',
    status: 'active',
    usage: 'SAP ERP Connection'
  },
  {
    id: '2',
    name: 'Salesforce OAuth',
    type: 'OAuth Certificate',
    issuer: 'Salesforce.com',
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'active',
    usage: 'Salesforce API Authentication'
  },
  {
    id: '3',
    name: 'Legacy System Cert',
    type: 'Client Certificate',
    issuer: 'Internal CA',
    validFrom: '2023-06-01',
    validTo: '2024-02-01',
    status: 'expiring',
    usage: 'Legacy SOAP Service'
  }
];

const initialJarFiles: JarFile[] = [
  {
    id: '1',
    name: 'MySQL JDBC Driver',
    version: '8.0.33',
    description: 'MySQL Connector/J JDBC Driver for database connectivity',
    fileName: 'mysql-connector-java-8.0.33.jar',
    size: 2456789,
    uploadDate: '2024-01-15',
    driverType: 'Database'
  },
  {
    id: '2',
    name: 'PostgreSQL JDBC Driver',
    version: '42.6.0',
    description: 'PostgreSQL JDBC Driver for database operations',
    fileName: 'postgresql-42.6.0.jar',
    size: 1234567,
    uploadDate: '2024-01-10',
    driverType: 'Database'
  },
  {
    id: '3',
    name: 'ActiveMQ Client',
    version: '5.18.3',
    description: 'ActiveMQ JMS Client for message queue operations',
    fileName: 'activemq-client-5.18.3.jar',
    size: 987654,
    uploadDate: '2024-01-08',
    driverType: 'Message Queue'
  }
];

export const Admin = () => {
  const [users] = useState<User[]>(initialUsers);
  const [roles] = useState<Role[]>(initialRoles);
  const [certificates] = useState<Certificate[]>(initialCertificates);
  const [jarFiles, setJarFiles] = useState<JarFile[]>(initialJarFiles);
  const [activeTab, setActiveTab] = useState('users');

  const handleJarFileAdded = (jarFile: JarFile) => {
    setJarFiles(prev => [...prev, jarFile]);
  };

  const handleJarFileDeleted = (id: string) => {
    setJarFiles(prev => prev.filter(jar => jar.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground">Manage users, roles, and system security</p>
      </div>

      <AdminStats 
        users={users}
        roles={roles}
        certificates={certificates}
        jarFiles={jarFiles}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="jar-files" className="flex items-center gap-2">
            <FileArchive className="h-4 w-4" />
            JAR Files
          </TabsTrigger>
          <TabsTrigger value="system-logs" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            System Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement users={users} />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleManagement roles={roles} />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <CertificateManagement certificates={certificates} />
        </TabsContent>

        <TabsContent value="jar-files" className="space-y-4">
          <JarFileManagement 
            jarFiles={jarFiles}
            onJarFileAdded={handleJarFileAdded}
            onJarFileDeleted={handleJarFileDeleted}
          />
        </TabsContent>

        <TabsContent value="system-logs" className="space-y-4">
          <SystemLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};