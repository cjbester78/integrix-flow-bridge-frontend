import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileArchive, Trash2, Download, Plus, Search } from 'lucide-react';

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

export const JarManagement = () => {
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

  const handleDelete = async (id: string) => {
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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileArchive className="h-8 w-8" />
          JAR File Management
        </h1>
        <p className="text-muted-foreground">Upload and manage adapter driver JAR files</p>
      </div>

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
                                  <AlertDialogAction onClick={() => handleDelete(jarFile.id)}>
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
    </div>
  );
};