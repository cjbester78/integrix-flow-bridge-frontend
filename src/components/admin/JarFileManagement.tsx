import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload, Download, Trash2, Search } from 'lucide-react';
import { JarFile } from '@/types/admin';

interface JarFileManagementProps {
  jarFiles: JarFile[];
  onJarFileAdded: (jarFile: JarFile) => void;
  onJarFileDeleted: (id: string) => void;
}

export const JarFileManagement = ({ jarFiles, onJarFileAdded, onJarFileDeleted }: JarFileManagementProps) => {
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
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('driverType', formData.driverType);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const newJarFile: JarFile = {
        id: Date.now().toString(),
        name: formData.name,
        version: formData.version,
        description: formData.description,
        file_name: selectedFile.name,
        size_bytes: selectedFile.size,
        upload_date: new Date().toISOString().split('T')[0],
        driver_type: formData.driverType,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onJarFileAdded(newJarFile);
      
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onJarFileDeleted(id);
      
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
      toast({
        title: "Download Started",
        description: `Downloading ${jarFile.file_name}...`
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
    jar.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (jar.driver_type && jar.driver_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
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
                  {filteredJarFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No JAR files found. Click "Upload JAR File" to add your first JAR file.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJarFiles.map((jarFile) => (
                      <TableRow key={jarFile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{jarFile.name}</div>
                            <div className="text-sm text-muted-foreground">{jarFile.file_name}</div>
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
                          {jarFile.driver_type && (
                            <Badge variant="outline">{jarFile.driver_type}</Badge>
                          )}
                        </TableCell>
                        <TableCell>{jarFile.size_bytes ? formatFileSize(jarFile.size_bytes) : 'N/A'}</TableCell>
                        <TableCell>{jarFile.upload_date}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};