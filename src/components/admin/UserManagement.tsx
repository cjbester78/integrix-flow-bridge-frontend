import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Crown, Settings, UserCheck, Users } from 'lucide-react';
import { User } from '@/types/admin';
import { CreateUserDialog } from './CreateUserDialog';

interface UserManagementProps {
  users: User[];
}

export const UserManagement = ({ users }: UserManagementProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage system users and their access levels</CardDescription>
          </div>
          <Button 
            className="bg-gradient-primary"
            onClick={() => setShowCreateDialog(true)}
          >
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
                  <TableCell className="text-muted-foreground">{user.last_login_at || 'Never'}</TableCell>
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
      
      <CreateUserDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserCreated={() => {
          // In a real app, you would refresh the user list here
          // For now, we're just using mock data, so this is a placeholder
          console.log('User created successfully - in real app, refresh user list');
        }}
      />
    </Card>
  );
};