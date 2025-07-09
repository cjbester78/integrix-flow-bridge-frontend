import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  ArrowRight, 
  Settings, 
  Play, 
  Save, 
  Database,
  Globe,
  FileText,
  Mail,
  Smartphone,
  Server,
  Zap,
  CheckCircle,
  Copy,
  Trash2
} from 'lucide-react';

const adapters = [
  { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
  { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
  { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
  { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' },
  { id: 'file', name: 'File System', icon: FileText, category: 'Storage' },
  { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' },
  { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' },
  { id: 'database', name: 'Database', icon: Database, category: 'Storage' },
];

const transformations = [
  { id: 'json-xml', name: 'JSON to XML', description: 'Convert JSON payload to XML format' },
  { id: 'xml-json', name: 'XML to JSON', description: 'Convert XML payload to JSON format' },
  { id: 'field-mapping', name: 'Field Mapping', description: 'Map fields between source and target' },
  { id: 'data-filter', name: 'Data Filter', description: 'Filter data based on conditions' },
  { id: 'enrichment', name: 'Data Enrichment', description: 'Add additional data to payload' },
  { id: 'validation', name: 'Data Validation', description: 'Validate payload structure and content' },
];

export const CreateFlow = () => {
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceAdapter, setSourceAdapter] = useState('');
  const [targetAdapter, setTargetAdapter] = useState('');
  const [selectedTransformations, setSelectedTransformations] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();

  const handleAddTransformation = (transformationId: string) => {
    if (!selectedTransformations.includes(transformationId)) {
      setSelectedTransformations([...selectedTransformations, transformationId]);
    }
  };

  const handleRemoveTransformation = (transformationId: string) => {
    setSelectedTransformations(selectedTransformations.filter(id => id !== transformationId));
  };

  const handleSaveFlow = () => {
    if (!flowName || !sourceAdapter || !targetAdapter) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Flow Saved Successfully",
      description: `Integration flow "${flowName}" has been created`,
      variant: "default",
    });

    // Reset form
    setFlowName('');
    setDescription('');
    setSourceAdapter('');
    setTargetAdapter('');
    setSelectedTransformations([]);
  };

  const handleTestFlow = () => {
    if (!sourceAdapter || !targetAdapter) {
      toast({
        title: "Cannot Test Flow",
        description: "Please configure source and target adapters first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Flow Test Initiated",
      description: "Testing connection and data flow...",
      variant: "default",
    });
  };

  const getAdapterById = (id: string) => adapters.find(adapter => adapter.id === id);
  const getTransformationById = (id: string) => transformations.find(t => t.id === id);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Plus className="h-8 w-8" />
          Create Integration Flow
        </h1>
        <p className="text-muted-foreground">Design and configure a new message integration flow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Flow Details</CardTitle>
              <CardDescription>Configure the basic information for your integration flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flowName">Flow Name *</Label>
                <Input
                  id="flowName"
                  placeholder="e.g., Customer Data Sync"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this integration flow does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01]"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Source & Target Configuration</CardTitle>
              <CardDescription>Select the source and target systems for your integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Adapter */}
                <div className="space-y-3">
                  <Label>Source Adapter *</Label>
                  <Select value={sourceAdapter} onValueChange={setSourceAdapter}>
                    <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                      <SelectValue placeholder="Select source system" />
                    </SelectTrigger>
                    <SelectContent>
                      {adapters.map((adapter) => (
                        <SelectItem key={adapter.id} value={adapter.id}>
                          <div className="flex items-center gap-2">
                            <adapter.icon className="h-4 w-4" />
                            <span>{adapter.name}</span>
                            <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {sourceAdapter && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getAdapterById(sourceAdapter) && (
                          <>
                            {(() => {
                              const adapter = getAdapterById(sourceAdapter)!;
                              const IconComponent = adapter.icon;
                              return (
                                <>
                                  <IconComponent className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{adapter.name}</span>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Target Adapter */}
                <div className="space-y-3">
                  <Label>Target Adapter *</Label>
                  <Select value={targetAdapter} onValueChange={setTargetAdapter}>
                    <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                      <SelectValue placeholder="Select target system" />
                    </SelectTrigger>
                    <SelectContent>
                      {adapters.map((adapter) => (
                        <SelectItem key={adapter.id} value={adapter.id}>
                          <div className="flex items-center gap-2">
                            <adapter.icon className="h-4 w-4" />
                            <span>{adapter.name}</span>
                            <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {targetAdapter && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getAdapterById(targetAdapter) && (
                          <>
                            {(() => {
                              const adapter = getAdapterById(targetAdapter)!;
                              const IconComponent = adapter.icon;
                              return (
                                <>
                                  <IconComponent className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{adapter.name}</span>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Flow Visualization */}
              {sourceAdapter && targetAdapter && (
                <div className="mt-6 p-4 bg-gradient-secondary rounded-lg">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-soft">
                      {getAdapterById(sourceAdapter) && (
                        <>
                          {(() => {
                            const adapter = getAdapterById(sourceAdapter)!;
                            const IconComponent = adapter.icon;
                            return (
                              <>
                                <IconComponent className="h-5 w-5 text-primary" />
                                <span className="font-medium">{adapter.name}</span>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                    <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                    <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-soft">
                      {getAdapterById(targetAdapter) && (
                        <>
                          {(() => {
                            const adapter = getAdapterById(targetAdapter)!;
                            const IconComponent = adapter.icon;
                            return (
                              <>
                                <IconComponent className="h-5 w-5 text-primary" />
                                <span className="font-medium">{adapter.name}</span>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Data Transformations</CardTitle>
              <CardDescription>Configure how data should be transformed during the flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {transformations.map((transformation) => (
                  <div
                    key={transformation.id}
                    className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleAddTransformation(transformation.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium group-hover:text-primary transition-colors">
                          {transformation.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transformation.description}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {selectedTransformations.length > 0 && (
                <div className="mt-6">
                  <Label className="text-sm font-medium">Selected Transformations</Label>
                  <div className="mt-2 space-y-2">
                    {selectedTransformations.map((transformationId) => {
                      const transformation = getTransformationById(transformationId);
                      return transformation ? (
                        <div key={transformationId} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="font-medium">{transformation.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveTransformation(transformationId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-6">
          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Test and save your integration flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleTestFlow}
                className="w-full bg-gradient-accent hover:opacity-90 transition-all duration-300"
                variant="outline"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Flow
              </Button>
              <Button 
                onClick={handleSaveFlow}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Flow
              </Button>
              <Separator />
              <Button variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Flow
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Flow Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span>{sourceAdapter ? getAdapterById(sourceAdapter)?.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span>{targetAdapter ? getAdapterById(targetAdapter)?.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transformations:</span>
                  <span>{selectedTransformations.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Test your flow before saving to ensure connectivity</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Add transformations to modify data between systems</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Use descriptive names for easier management</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};