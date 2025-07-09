import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Bell,
  Shield,
  Database,
  Network,
  Palette,
  Monitor,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';

export const Settings = () => {
  const { user, getAllUsers, createUser, updateUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(getAllUsers());
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'viewer' as 'admin' | 'integrator' | 'viewer',
    permissions: ['read']
  });

  const rolePermissions = {
    admin: ['create', 'read', 'update', 'delete', 'manage_users', 'system_config'],
    integrator: ['create', 'read', 'update', 'delete'],
    viewer: ['read']
  };

  // Mock passwords for display purposes
  const getUserPassword = (username: string) => {
    const passwords: { [key: string]: string } = {
      admin: 'admin123',
      integrator1: 'integrator123',
      viewer1: 'viewer123'
    };
    return passwords[username] || 'defaultpass123';
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      ...newUser,
      permissions: rolePermissions[newUser.role]
    };

    createUser(userData);
    setUsers(getAllUsers());
    setNewUser({ username: '', email: '', role: 'viewer', permissions: ['read'] });
    setIsCreateUserOpen(false);
    
    toast({
      title: "User Created",
      description: `User "${newUser.username}" has been created successfully`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    updateUser(selectedUser.id, {
      email: selectedUser.email,
      role: selectedUser.role,
      permissions: rolePermissions[selectedUser.role]
    });
    
    setUsers(getAllUsers());
    setIsEditUserOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "User Updated",
      description: `User "${selectedUser.username}" has been updated successfully`,
    });
  };

  const handleDeleteUser = (userId: string, username: string) => {
    if (user?.id === userId) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    deleteUser(userId);
    setUsers(getAllUsers());
    
    toast({
      title: "User Deleted",
      description: `User "${username}" has been deleted`,
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'integrator': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure your IntegrixLab platform preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* User Management Section */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with specified permissions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={newUser.role} 
                          onValueChange={(value) => setNewUser({...newUser, role: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="integrator">Integrator</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="flex flex-wrap gap-1">
                          {rolePermissions[newUser.role].map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>
                          Create User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">System Users ({users.length})</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showPasswords ? 'Hide' : 'Show'} Passwords
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {users.map((userItem) => (
                    <div key={userItem.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium">{userItem.username}</span>
                            <Badge variant={getRoleBadgeVariant(userItem.role)} className="text-xs">
                              {userItem.role.toUpperCase()}
                            </Badge>
                            {userItem.id === user?.id && (
                              <Badge variant="outline" className="text-xs">Current User</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Email: {userItem.email}</div>
                            {showPasswords && (
                              <div>Password: <code className="bg-muted px-1 rounded">{getUserPassword(userItem.username)}</code></div>
                            )}
                            <div>Created: {userItem.createdAt}</div>
                            {userItem.lastLogin && (
                              <div>Last Login: {userItem.lastLogin}</div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {userItem.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog open={isEditUserOpen && selectedUser?.id === userItem.id} onOpenChange={(open) => {
                            setIsEditUserOpen(open);
                            if (!open) setSelectedUser(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser({...userItem})}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information and permissions
                                </DialogDescription>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Username</Label>
                                    <Input value={selectedUser.username} disabled />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={selectedUser.email}
                                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select 
                                      value={selectedUser.role} 
                                      onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="integrator">Integrator</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Permissions</Label>
                                    <div className="flex flex-wrap gap-1">
                                      {rolePermissions[selectedUser.role as keyof typeof rolePermissions].map((permission) => (
                                        <Badge key={permission} variant="outline" className="text-xs">
                                          {permission}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleEditUser}>
                                      Update User
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                            disabled={userItem.id === user?.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Settings Sidebar */}
        <div className="space-y-6">
          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flow failures</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily reports</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compact view</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session timeout</span>
                  <span className="text-sm text-muted-foreground">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Multi-factor auth</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};