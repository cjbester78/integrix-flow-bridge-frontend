import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Shield, 
  Key, 
  Plus, 
  Edit, 
  Trash2,
  Settings,
  UserCheck,
  Crown
} from 'lucide-react';

const users = [
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

const roles = [
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

const certificates = [
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

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Crown className="h-4 w-4 text-warning" />;
      case 'integrator':
        return <Settings className="h-4 w-4 text-info" />;
      case 'viewer':
        return <UserCheck className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'expiring':
        return 'destructive';
      default:
        return 'outline';
    }
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and their access levels</CardDescription>
                </div>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>Define and manage user roles and permissions</CardDescription>
                </div>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id} className="bg-gradient-secondary border-border/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getRoleIcon(role.name)}
                          <div>
                            <CardTitle className="text-lg capitalize">{role.name}</CardTitle>
                            <CardDescription>{role.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{role.userCount} users</Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <div className="text-sm font-medium mb-2">Permissions:</div>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>Manage SSL certificates and authentication keys</CardDescription>
                </div>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Issuer</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">{cert.name}</TableCell>
                        <TableCell>{cert.type}</TableCell>
                        <TableCell>{cert.issuer}</TableCell>
                        <TableCell className="text-sm">
                          {cert.validFrom} to {cert.validTo}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(cert.status)}>
                            {cert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{cert.usage}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};