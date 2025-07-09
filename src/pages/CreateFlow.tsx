import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DataStructure } from '@/types/dataStructures';
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
  Trash2,
  Layers,
  FileJson,
  FileCode,
  Eye,
  ChevronDown,
  ChevronRight
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

// Mock data structures - in a real app, this would come from your data structures API/state
const sampleStructures: DataStructure[] = [
  {
    id: '1',
    name: 'Customer Order',
    type: 'json',
    description: 'Standard customer order structure',
    structure: {
      orderId: 'string',
      customerId: 'string',
      items: 'array',
      totalAmount: 'decimal',
      orderDate: 'datetime'
    },
    createdAt: '2024-01-15',
    usage: 'source'
  },
  {
    id: '2',
    name: 'Payment Response',
    type: 'soap',
    description: 'Payment gateway response format',
    structure: {
      transactionId: 'string',
      status: 'string',
      amount: 'decimal',
      currency: 'string'
    },
    createdAt: '2024-01-10',
    usage: 'target'
  },
  {
    id: '3',
    name: 'User Profile',
    type: 'custom',
    description: 'Universal user profile structure',
    structure: {
      userId: 'string',
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      createdAt: 'datetime'
    },
    createdAt: '2024-01-12',
    usage: 'both'
  }
];

export const CreateFlow = () => {
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceAdapter, setSourceAdapter] = useState('');
  const [targetAdapter, setTargetAdapter] = useState('');
  const [sourceStructure, setSourceStructure] = useState('');
  const [targetStructure, setTargetStructure] = useState('');
  const [selectedTransformations, setSelectedTransformations] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showStructurePreview, setShowStructurePreview] = useState<string | null>(null);
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
    setSourceStructure('');
    setTargetStructure('');
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
  const getStructureById = (id: string) => sampleStructures.find(s => s.id === id);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'json': return FileJson;
      case 'xsd': case 'soap': return FileCode;
      case 'custom': return Database;
      default: return FileText;
    }
  };

  const renderStructurePreview = (structure: any, depth = 0) => {
    if (!structure) return null;
    
    return (
      <div className={`ml-${depth * 4} space-y-1`}>
        {typeof structure === 'object' && !Array.isArray(structure) ? (
          Object.entries(structure).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-medium text-primary">{key}</span>
              <span className="text-muted-foreground">: </span>
              {typeof value === 'string' ? (
                <Badge variant="outline" className="text-xs">{value}</Badge>
              ) : (
                <div className="mt-1">
                  {renderStructurePreview(value, depth + 1)}
                </div>
              )}
            </div>
          ))
        ) : (
          <Badge variant="outline" className="text-xs">{String(structure)}</Badge>
        )}
      </div>
    );
  };

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

          <Card className="animate-scale-in" style={{ animationDelay: '0.15s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Message Structures
              </CardTitle>
              <CardDescription>Select the data structures for source and target messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="selection" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="selection">Structure Selection</TabsTrigger>
                  <TabsTrigger value="preview">Preview & Mapping</TabsTrigger>
                </TabsList>
                
                <TabsContent value="selection" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Source Structure */}
                    <div className="space-y-3">
                      <Label>Source Message Structure</Label>
                      <Select value={sourceStructure} onValueChange={setSourceStructure}>
                        <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                          <SelectValue placeholder="Select source structure" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleStructures
                            .filter(s => s.usage === 'source' || s.usage === 'both')
                            .map((structure) => {
                              const Icon = getTypeIcon(structure.type);
                              return (
                                <SelectItem key={structure.id} value={structure.id}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{structure.name}</span>
                                    <Badge variant="outline" className="text-xs">{structure.type.toUpperCase()}</Badge>
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                      {sourceStructure && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getStructureById(sourceStructure) && (
                              <>
                                {(() => {
                                  const structure = getStructureById(sourceStructure)!;
                                  const IconComponent = getTypeIcon(structure.type);
                                  return (
                                    <>
                                      <IconComponent className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{structure.name}</span>
                                      <Badge variant="outline" className="text-xs">{structure.type}</Badge>
                                    </>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                          {getStructureById(sourceStructure)?.description && (
                            <p className="text-sm text-muted-foreground">
                              {getStructureById(sourceStructure)?.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Target Structure */}
                    <div className="space-y-3">
                      <Label>Target Message Structure</Label>
                      <Select value={targetStructure} onValueChange={setTargetStructure}>
                        <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                          <SelectValue placeholder="Select target structure" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleStructures
                            .filter(s => s.usage === 'target' || s.usage === 'both')
                            .map((structure) => {
                              const Icon = getTypeIcon(structure.type);
                              return (
                                <SelectItem key={structure.id} value={structure.id}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{structure.name}</span>
                                    <Badge variant="outline" className="text-xs">{structure.type.toUpperCase()}</Badge>
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                      {targetStructure && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getStructureById(targetStructure) && (
                              <>
                                {(() => {
                                  const structure = getStructureById(targetStructure)!;
                                  const IconComponent = getTypeIcon(structure.type);
                                  return (
                                    <>
                                      <IconComponent className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{structure.name}</span>
                                      <Badge variant="outline" className="text-xs">{structure.type}</Badge>
                                    </>
                                  );
                                })()}
                              </>
                            )}
                          </div>
                          {getStructureById(targetStructure)?.description && (
                            <p className="text-sm text-muted-foreground">
                              {getStructureById(targetStructure)?.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/data-structures" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Structure
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Library
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="space-y-6">
                  {sourceStructure && targetStructure ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Source Structure Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label>Source Structure</Label>
                          <Badge variant="outline" className="text-xs">
                            {getStructureById(sourceStructure)?.name}
                          </Badge>
                        </div>
                        <div className="border rounded-lg p-4 bg-muted/20 max-h-60 overflow-y-auto">
                          {getStructureById(sourceStructure) && renderStructurePreview(getStructureById(sourceStructure)!.structure)}
                        </div>
                      </div>

                      {/* Target Structure Preview */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label>Target Structure</Label>
                          <Badge variant="outline" className="text-xs">
                            {getStructureById(targetStructure)?.name}
                          </Badge>
                        </div>
                        <div className="border rounded-lg p-4 bg-muted/20 max-h-60 overflow-y-auto">
                          {getStructureById(targetStructure) && renderStructurePreview(getStructureById(targetStructure)!.structure)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select both source and target structures to see the preview</p>
                    </div>
                  )}

                  {/* Mapping Suggestions */}
                  {sourceStructure && targetStructure && (
                    <div className="mt-6 p-4 bg-gradient-secondary rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Field Mapping Suggestions
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Based on your selected structures, these field mappings are suggested:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm bg-card p-2 rounded">
                          <span className="text-primary">Source Field</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-primary">Target Field</span>
                        </div>
                        <div className="text-xs text-muted-foreground text-center py-2">
                          Auto-mapping will be available in field mapping transformation
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
                  <span className="text-muted-foreground">Source Structure:</span>
                  <span>{sourceStructure ? getStructureById(sourceStructure)?.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span>{targetAdapter ? getAdapterById(targetAdapter)?.name : 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Structure:</span>
                  <span>{targetStructure ? getStructureById(targetStructure)?.name : 'Not selected'}</span>
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