import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Crown, Settings, UserCheck, Users } from 'lucide-react';
import { Role } from '@/types/admin';

interface RoleManagementProps {
  roles: Role[];
}

export const RoleManagement = ({ roles }: RoleManagementProps) => {
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

  return (
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
          {roles.length === 0 ? (
            <Card className="bg-gradient-secondary border-border/50">
              <CardContent className="text-center py-8 text-muted-foreground">
                No roles found. Click "Add Role" to create your first role.
              </CardContent>
            </Card>
          ) : (
            roles.map((role) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};