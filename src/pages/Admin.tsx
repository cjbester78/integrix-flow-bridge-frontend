import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  Key, 
  Plus, 
  Edit, 
  Trash2,
  Settings,
  UserCheck,
  Crown,
  FileArchive,
  Upload,
  Download,
  Search
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

interface JarFile {
  id: string;
  name: string;
  version: string;
  description: string;
  fileName: string;
  size: number;
  uploadDate: string;
  driverType: string;
}

export const Admin = () => {
  const [jarFiles, setJarFiles] = useState<JarFile[]>([
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
  ]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    description: '',
    driverType: ''
  });

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('users');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.jar')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid JAR file.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      // Auto-populate name from filename
      setFormData(prev => ({
        ...prev,
        name: file.name.replace('.jar', '').replace(/-[\d.]+/, '')
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.name || !formData.version) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // TODO: Replace with actual API call to your Java backend
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('driverType', formData.driverType);

      // Simulated upload - replace with actual fetch to your Java API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newJarFile: JarFile = {
        id: Date.now().toString(),
        name: formData.name,
        version: formData.version,
        description: formData.description,
        fileName: selectedFile.name,
        size: selectedFile.size,
        uploadDate: new Date().toISOString().split('T')[0],
        driverType: formData.driverType
      };

      setJarFiles(prev => [...prev, newJarFile]);
      
      // Reset form
      setSelectedFile(null);
      setFormData({ name: '', version: '', description: '', driverType: '' });
      
      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload JAR file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteJar = async (id: string) => {
    try {
      // TODO: Replace with actual API call to your Java backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJarFiles(prev => prev.filter(jar => jar.id !== id));
      
      toast({
        title: "File Deleted",
        description: "JAR file has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete JAR file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (jarFile: JarFile) => {
    try {
      // TODO: Replace with actual download from your Java backend
      toast({
        title: "Download Started",
        description: `Downloading ${jarFile.fileName}...`
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download JAR file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredJarFiles = jarFiles.filter(jar =>
    jar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jar.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jar.driverType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Defined roles</p>
          </CardContent>
        </Card>
        
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">SSL/Auth certs</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileArchive className="h-4 w-4" />
              JAR Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jarFiles.length}</div>
            <p className="text-xs text-muted-foreground">Driver files</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <TabsList className="grid w-full grid-cols-4">
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

        <TabsContent value="jar-files" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card className="animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Upload JAR File
                  </CardTitle>
                  <CardDescription>
                    Upload new adapter driver JAR files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jar-file">JAR File *</Label>
                    <Input
                      id="jar-file"
                      type="file"
                      accept=".jar"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Driver Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., MySQL JDBC Driver"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version">Version *</Label>
                    <Input
                      id="version"
                      placeholder="e.g., 8.0.33"
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driverType">Driver Type</Label>
                    <Input
                      id="driverType"
                      placeholder="e.g., Database, Message Queue"
                      value={formData.driverType}
                      onChange={(e) => setFormData(prev => ({ ...prev, driverType: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the driver functionality..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleUpload} 
                    disabled={uploading || !selectedFile}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload JAR File'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* JAR Files List */}
            <div className="lg:col-span-2">
              <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Uploaded JAR Files</CardTitle>
                  <CardDescription>
                    Manage your adapter driver files
                  </CardDescription>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search JAR files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJarFiles.map((jarFile) => (
                          <TableRow key={jarFile.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{jarFile.name}</div>
                                <div className="text-sm text-muted-foreground">{jarFile.fileName}</div>
                                {jarFile.description && (
                                  <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                                    {jarFile.description}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{jarFile.version}</Badge>
                            </TableCell>
                            <TableCell>
                              {jarFile.driverType && (
                                <Badge variant="outline">{jarFile.driverType}</Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatFileSize(jarFile.size)}</TableCell>
                            <TableCell>{jarFile.uploadDate}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(jarFile)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete JAR File</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{jarFile.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteJar(jarFile.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filteredJarFiles.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        {searchTerm ? 'No JAR files match your search.' : 'No JAR files uploaded yet.'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};