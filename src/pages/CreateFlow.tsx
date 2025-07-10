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
import { FieldMappingScreen } from '@/components/FieldMappingScreen';
import { useToast } from '@/hooks/use-toast';
import { DataStructure } from '@/types/dataStructures';
import { flowService } from '@/services/flowService';
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
  ChevronRight,
  Code,
  Link,
  X
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
  { id: 'field-mapping', name: 'Field Mapping', description: 'Map fields between source and target' },
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
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [showMappingScreen, setShowMappingScreen] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<{ sourceFields: string[]; targetField: string; javaFunction?: string }[]>([]);
  const [selectedTargetField, setSelectedTargetField] = useState<string | null>(null);
  const [javaFunction, setJavaFunction] = useState('');
  const { toast } = useToast();

  const handleAddTransformation = (transformationId: string) => {
    if (!selectedTransformations.includes(transformationId)) {
      setSelectedTransformations([...selectedTransformations, transformationId]);
      if (transformationId === 'field-mapping') {
        setShowFieldMapping(true);
      }
    }
  };

  const handleRemoveTransformation = (transformationId: string) => {
    setSelectedTransformations(selectedTransformations.filter(id => id !== transformationId));
    if (transformationId === 'field-mapping') {
      setShowFieldMapping(false);
      setFieldMappings([]);
    }
  };

  const getFieldsFromStructure = (structure: any, prefix = ''): string[] => {
    if (!structure) return [];
    const fields: string[] = [];
    
    Object.entries(structure).forEach(([key, value]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      fields.push(fieldPath);
      
      if (typeof value === 'object' && !Array.isArray(value) && typeof value !== 'string') {
        fields.push(...getFieldsFromStructure(value, fieldPath));
      }
    });
    
    return fields;
  };

  const handleAddMapping = () => {
    setFieldMappings([...fieldMappings, { sourceFields: [], targetField: '' }]);
  };

  const handleRemoveMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const handleMappingChange = (index: number, field: 'targetField', value: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFieldMappings(newMappings);
  };

  const handleAddSourceField = (mappingIndex: number, sourceField: string) => {
    const newMappings = [...fieldMappings];
    if (!newMappings[mappingIndex].sourceFields.includes(sourceField)) {
      newMappings[mappingIndex] = {
        ...newMappings[mappingIndex],
        sourceFields: [...newMappings[mappingIndex].sourceFields, sourceField]
      };
      setFieldMappings(newMappings);
    }
  };

  const handleRemoveSourceField = (mappingIndex: number, sourceFieldIndex: number) => {
    const newMappings = [...fieldMappings];
    newMappings[mappingIndex] = {
      ...newMappings[mappingIndex],
      sourceFields: newMappings[mappingIndex].sourceFields.filter((_, i) => i !== sourceFieldIndex)
    };
    setFieldMappings(newMappings);
  };

  const handleTargetFieldSelect = (fieldPath: string, mappingIndex: number) => {
    setSelectedTargetField(fieldPath);
    setJavaFunction(fieldMappings[mappingIndex]?.javaFunction || '');
  };

  const handleSaveJavaFunction = () => {
    if (selectedTargetField) {
      const mappingIndex = fieldMappings.findIndex(m => m.targetField === selectedTargetField);
      if (mappingIndex >= 0) {
        const newMappings = [...fieldMappings];
        newMappings[mappingIndex] = { ...newMappings[mappingIndex], javaFunction };
        setFieldMappings(newMappings);
      }
    }
    setSelectedTargetField(null);
    setJavaFunction('');
  };

  const handleSaveFlow = async () => {
    if (!flowName || !sourceAdapter || !targetAdapter) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const flowData = {
        name: flowName,
        description,
        sourceAdapterId: sourceAdapter,
        targetAdapterId: targetAdapter,
        sourceStructureId: sourceStructure || undefined,
        targetStructureId: targetStructure || undefined,
        transformations: selectedTransformations.map((transformationId, index) => ({
          type: transformationId as 'field-mapping' | 'custom-function' | 'filter' | 'enrichment',
          configuration: transformationId === 'field-mapping' ? { fieldMappings } : {},
          order: index + 1
        })),
        status: 'draft' as const
      };

      const response = await flowService.createFlow(flowData);

      if (response.success) {
        toast({
          title: "Flow Saved Successfully",
          description: `Integration flow "${flowName}" has been created with ID: ${response.data?.id}`,
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
        setFieldMappings([]);
        setShowFieldMapping(false);
      } else {
        throw new Error(response.error || 'Failed to save flow');
      }
    } catch (error) {
      console.error('Error saving flow:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save integration flow",
        variant: "destructive",
      });
    }
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
    <>
      {showMappingScreen && (
        <FieldMappingScreen onClose={() => setShowMappingScreen(false)} />
      )}
      
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
              {/* Field Mapping Selection */}
              <div className="grid grid-cols-1 gap-3">
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

              {/* Field Mapping Interface */}
              {showFieldMapping && sourceStructure && targetStructure && (
                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">Field Mapping</span>
                    </div>
                     <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => setShowMappingScreen(true)}
                       >
                         <Plus className="h-4 w-4 mr-2" />
                         Add Mapping
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => handleRemoveTransformation('field-mapping')}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </div>

                  {/* Graphical Mapping Interface */}
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Source Fields */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Source Fields</Label>
                        <div className="border rounded-lg p-3 bg-card max-h-60 overflow-y-auto">
                          {getFieldsFromStructure(getStructureById(sourceStructure)?.structure || {}).map((field) => (
                            <div key={field} className="p-2 text-sm hover:bg-accent rounded cursor-default">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span>{field}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mapping Configuration */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Field Mappings</Label>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {fieldMappings.map((mapping, index) => (
                            <div key={index} className="p-3 border rounded-lg bg-card space-y-3">
                              {/* Target Field Selection */}
                              <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium min-w-[60px]">Target:</Label>
                                <Select 
                                  value={mapping.targetField} 
                                  onValueChange={(value) => handleMappingChange(index, 'targetField', value)}
                                >
                                  <SelectTrigger className="h-8 text-xs flex-1">
                                    <SelectValue placeholder="Select target field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFieldsFromStructure(getStructureById(targetStructure)?.structure || {}).map((field) => (
                                      <SelectItem key={field} value={field} className="text-xs">
                                        {field}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveMapping(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Source Fields Section */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs font-medium">Sources:</Label>
                                  <Select 
                                    value="" 
                                    onValueChange={(value) => handleAddSourceField(index, value)}
                                  >
                                    <SelectTrigger className="h-7 text-xs flex-1">
                                      <SelectValue placeholder="Add source field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getFieldsFromStructure(getStructureById(sourceStructure)?.structure || {})
                                        .filter(field => !mapping.sourceFields.includes(field))
                                        .map((field) => (
                                        <SelectItem key={field} value={field} className="text-xs">
                                          {field}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Selected Source Fields */}
                                {mapping.sourceFields.length > 0 && (
                                  <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded border-l-2 border-primary/20">
                                    {mapping.sourceFields.map((sourceField, sourceIndex) => (
                                      <div key={sourceIndex} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-xs">
                                        <span>{sourceField}</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveSourceField(index, sourceIndex)}
                                          className="h-4 w-4 p-0 hover:bg-destructive/20"
                                        >
                                          <X className="h-2 w-2" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {mapping.sourceFields.length === 0 && (
                                  <div className="text-xs text-muted-foreground italic p-2 bg-muted/30 rounded">
                                    No source fields selected
                                  </div>
                                )}
                              </div>

                              {/* Mapping Summary and Function */}
                              {mapping.targetField && mapping.sourceFields.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between p-2 bg-accent/30 rounded text-xs">
                                    <span className="font-medium">
                                      {mapping.sourceFields.length} source field{mapping.sourceFields.length !== 1 ? 's' : ''} → {mapping.targetField}
                                    </span>
                                    {mapping.sourceFields.length > 1 && (
                                      <Badge variant="secondary" className="text-xs">
                                        Multi-field mapping
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleTargetFieldSelect(mapping.targetField, index)}
                                      className="text-xs"
                                    >
                                      <Code className="h-3 w-3 mr-1" />
                                      {mapping.javaFunction ? 'Edit Function' : 'Add Function'}
                                    </Button>
                                    {mapping.javaFunction && (
                                      <Badge variant="secondary" className="text-xs">
                                        Function Added
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {fieldMappings.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p>No mappings configured</p>
                              <p className="text-xs">Click "Add Mapping" to start</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Target Fields */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Target Fields</Label>
                        <div className="border rounded-lg p-3 bg-card max-h-60 overflow-y-auto">
                          {getFieldsFromStructure(getStructureById(targetStructure)?.structure || {}).map((field) => (
                            <div key={field} className="p-2 text-sm hover:bg-accent rounded cursor-default">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-secondary" />
                                <span>{field}</span>
                                {fieldMappings.some(m => m.targetField === field) && (
                                  <Badge variant="outline" className="text-xs ml-auto">Mapped</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Java Function Editor Dialog */}
              {selectedTargetField && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-card border rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Custom Java Function</h3>
                        <p className="text-sm text-muted-foreground">
                          Target Field: <Badge variant="outline" className="text-xs">{selectedTargetField}</Badge>
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedTargetField(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="javaFunction">Java Function Code</Label>
                        <Textarea
                          id="javaFunction"
                          placeholder={`// Example: Transform source data to target field
public Object transform(Object sourceValue) {
    // Your custom transformation logic here
    return sourceValue.toString().toUpperCase();
}`}
                          value={javaFunction}
                          onChange={(e) => setJavaFunction(e.target.value)}
                          className="mt-2 font-mono text-sm"
                          rows={12}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTargetField(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveJavaFunction}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Function
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!showFieldMapping && selectedTransformations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select Field Mapping to configure data transformations</p>
                  <p className="text-xs mt-2">Field mapping allows you to connect source and target fields with custom logic</p>
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
    </>
  );
};