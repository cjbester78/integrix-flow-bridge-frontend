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
import { DataStructure, Field } from '@/types/dataStructures';
import { FieldBuilder } from '@/components/FieldBuilder';
import { 
  Upload,
  FileText,
  Code,
  Database,
  Plus,
  Eye,
  Save,
  Trash2,
  Download,
  FileJson,
  FileCode,
  Layers,
  CheckCircle,
  AlertCircle,
  Copy,
  Edit,
  Settings
} from 'lucide-react';

const fieldTypes = [
  'string', 'number', 'boolean', 'date', 'datetime', 
  'object', 'array', 'integer', 'decimal', 'email', 'url'
];

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
  }
];

export const DataStructures = () => {
  const [structures, setStructures] = useState<DataStructure[]>(sampleStructures);
  const [selectedStructure, setSelectedStructure] = useState<DataStructure | null>(null);
  const [structureName, setStructureName] = useState('');
  const [structureDescription, setStructureDescription] = useState('');
  const [structureUsage, setStructureUsage] = useState<'source' | 'target' | 'both'>('both');
  const [customFields, setCustomFields] = useState<Field[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [xsdInput, setXsdInput] = useState('');
  const [wsdlInput, setWsdlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File, type: 'xsd' | 'json' | 'soap' | 'wsdl') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (type === 'json') {
        try {
          const parsed = JSON.parse(content);
          setJsonInput(JSON.stringify(parsed, null, 2));
          toast({
            title: "JSON File Loaded",
            description: `Successfully loaded ${file.name}`,
          });
        } catch (error) {
          toast({
            title: "Invalid JSON",
            description: "The uploaded file contains invalid JSON",
            variant: "destructive",
          });
        }
      } else if (type === 'wsdl') {
        setWsdlInput(content);
        toast({
          title: "WSDL File Loaded",
          description: `Successfully loaded ${file.name}`,
        });
      } else {
        setXsdInput(content);
        toast({
          title: `${type.toUpperCase()} File Loaded`,
          description: `Successfully loaded ${file.name}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'xsd' | 'json' | 'soap' | 'wsdl') => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const addCustomField = (parentIndex?: number) => {
    const newField: Field = {
      name: '',
      type: 'string',
      required: false,
      description: '',
      isComplexType: false,
      minOccurs: 1,
      maxOccurs: 1,
      children: []
    };

    if (parentIndex !== undefined) {
      // Adding child field
      const updated = [...customFields];
      if (!updated[parentIndex].children) {
        updated[parentIndex].children = [];
      }
      updated[parentIndex].children!.push(newField);
      setCustomFields(updated);
    } else {
      // Adding root field
      setCustomFields([...customFields, newField]);
    }
  };

  const updateCustomField = (index: number, field: Partial<Field>, parentIndex?: number) => {
    const updated = [...customFields];
    if (parentIndex !== undefined) {
      // Updating child field - need to find the correct path
      const findAndUpdate = (fields: Field[], targetParent: number, targetChild: number, updates: Partial<Field>) => {
        if (targetParent < fields.length && fields[targetParent].children) {
          if (targetChild < fields[targetParent].children!.length) {
            fields[targetParent].children![targetChild] = { ...fields[targetParent].children![targetChild], ...updates };
          }
        }
      };
      findAndUpdate(updated, parentIndex, index, field);
    } else {
      // Updating root field
      updated[index] = { ...updated[index], ...field };
    }
    setCustomFields(updated);
  };

  const removeCustomField = (index: number, parentIndex?: number) => {
    if (parentIndex !== undefined) {
      // Removing child field
      const updated = [...customFields];
      if (updated[parentIndex].children) {
        updated[parentIndex].children = updated[parentIndex].children!.filter((_, i) => i !== index);
      }
      setCustomFields(updated);
    } else {
      // Removing root field
      setCustomFields(customFields.filter((_, i) => i !== index));
    }
  };

  const parseJsonStructure = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return analyzeJsonStructure(obj);
    } catch {
      return null;
    }
  };

  const analyzeJsonStructure = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.length > 0 ? ['array', analyzeJsonStructure(obj[0])] : 'array';
    } else if (obj !== null && typeof obj === 'object') {
      const structure: any = {};
      for (const [key, value] of Object.entries(obj)) {
        structure[key] = analyzeJsonStructure(value);
      }
      return structure;
    } else {
      return typeof obj;
    }
  };

  const parseWsdlStructure = (wsdlString: string) => {
    try {
      // Basic WSDL parsing - extract complex types and elements
      const parser = new DOMParser();
      const doc = parser.parseFromString(wsdlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        return null;
      }
      
      const structure: any = {};
      
      // Extract complex types
      const complexTypes = doc.querySelectorAll('complexType, xs\\:complexType');
      complexTypes.forEach((complexType, index) => {
        const typeName = complexType.getAttribute('name') || `ComplexType${index + 1}`;
        const typeStructure: any = {};
        
        // Extract elements within the complex type
        const elements = complexType.querySelectorAll('element, xs\\:element');
        elements.forEach(element => {
          const elementName = element.getAttribute('name');
          const elementType = element.getAttribute('type') || 'string';
          if (elementName) {
            typeStructure[elementName] = elementType.replace(/^(xs:|xsd:)/, '');
          }
        });
        
        if (Object.keys(typeStructure).length > 0) {
          structure[typeName] = typeStructure;
        }
      });
      
      // Extract simple elements if no complex types found
      if (Object.keys(structure).length === 0) {
        const elements = doc.querySelectorAll('element, xs\\:element');
        elements.forEach(element => {
          const elementName = element.getAttribute('name');
          const elementType = element.getAttribute('type') || 'string';
          if (elementName) {
            structure[elementName] = elementType.replace(/^(xs:|xsd:)/, '');
          }
        });
      }
      
      return Object.keys(structure).length > 0 ? structure : null;
    } catch (error) {
      return null;
    }
  };

  const buildNestedStructure = (fields: Field[]): any => {
    const structure: any = {};
    
    fields.forEach(field => {
      if (field.children && field.children.length > 0) {
        // Complex type with children
        structure[field.name] = buildNestedStructure(field.children);
      } else {
        // Simple field
        structure[field.name] = field.type;
      }
    });
    
    return structure;
  };

  const saveStructure = () => {
    if (!structureName) {
      toast({
        title: "Validation Error",
        description: "Please provide a structure name",
        variant: "destructive",
      });
      return;
    }

    let structure: any = {};
    
    if (jsonInput) {
      structure = parseJsonStructure(jsonInput);
    } else if (wsdlInput) {
      structure = parseWsdlStructure(wsdlInput);
    } else if (xsdInput) {
      // Basic XSD parsing could be added here similar to WSDL
      structure = { message: 'XSD parsing not fully implemented yet' };
    } else if (customFields.length > 0) {
      structure = buildNestedStructure(customFields);
    } else {
      toast({
        title: "Validation Error",
        description: "Please define a structure using JSON, XSD, WSDL, or custom fields",
        variant: "destructive",
      });
      return;
    }

    const newStructure: DataStructure = {
      id: Date.now().toString(),
      name: structureName,
      type: jsonInput ? 'json' : wsdlInput ? 'wsdl' : xsdInput ? 'xsd' : 'custom',
      description: structureDescription,
      structure,
      createdAt: new Date().toISOString().split('T')[0],
      usage: structureUsage
    };

    setStructures([...structures, newStructure]);
    
    // Reset form
    setStructureName('');
    setStructureDescription('');
    setJsonInput('');
    setXsdInput('');
    setWsdlInput('');
    
    toast({
      title: "Structure Saved",
      description: `Data structure "${structureName}" has been created successfully`,
    });
  };

  const deleteStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
    if (selectedStructure?.id === id) {
      setSelectedStructure(null);
    }
    toast({
      title: "Structure Deleted",
      description: "Data structure has been removed",
    });
  };

  const duplicateStructure = (structure: DataStructure) => {
    const duplicate = {
      ...structure,
      id: Date.now().toString(),
      name: `${structure.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStructures([...structures, duplicate]);
    toast({
      title: "Structure Duplicated",
      description: `Created copy of "${structure.name}"`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'json': return FileJson;
      case 'xsd': case 'soap': case 'wsdl': return FileCode;
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
          <Layers className="h-8 w-8" />
          Data Structures
        </h1>
        <p className="text-muted-foreground">Define and manage data structures for source and target messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Structure Creation */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Create Data Structure</CardTitle>
              <CardDescription>Import existing schemas or create custom structures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="structureName">Structure Name *</Label>
                    <Input
                      id="structureName"
                      placeholder="e.g., Customer Order Schema"
                      value={structureName}
                      onChange={(e) => setStructureName(e.target.value)}
                      className="transition-all duration-300 focus:scale-[1.01]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usage">Usage</Label>
                    <Select value={structureUsage} onValueChange={(value: 'source' | 'target' | 'both') => setStructureUsage(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="source">Source Message</SelectItem>
                        <SelectItem value="target">Target Message</SelectItem>
                        <SelectItem value="both">Both Source & Target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and context of this data structure..."
                    value={structureDescription}
                    onChange={(e) => setStructureDescription(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.01]"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Define Structure</CardTitle>
              <CardDescription>Choose your preferred method to define the data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="json" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="json">JSON Schema</TabsTrigger>
                  <TabsTrigger value="xsd">XSD/XML</TabsTrigger>
                  <TabsTrigger value="wsdl">WSDL</TabsTrigger>
                  <TabsTrigger value="custom">Custom Builder</TabsTrigger>
                </TabsList>
                
                <TabsContent value="json" className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onDrop={(e) => handleDrop(e, 'json')}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop a JSON file or paste JSON structure below
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'json')}
                      className="hidden"
                      id="json-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('json-upload')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload JSON File
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>JSON Structure</Label>
                    <Textarea
                      placeholder='{"orderId": "string", "amount": 100.50, "items": []}'
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="xsd" className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onDrop={(e) => handleDrop(e, 'xsd')}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop XSD or WSDL files
                    </p>
                    <input
                      type="file"
                      accept=".xsd,.wsdl,.xml"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'xsd')}
                      className="hidden"
                      id="xsd-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('xsd-upload')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload XSD/WSDL
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>XSD/SOAP Content</Label>
                    <Textarea
                      placeholder="Paste your XSD or SOAP schema here..."
                      value={xsdInput}
                      onChange={(e) => setXsdInput(e.target.value)}
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="wsdl" className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onDrop={(e) => handleDrop(e, 'wsdl')}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag & drop a WSDL file or paste WSDL content below
                    </p>
                    <input
                      type="file"
                      accept=".wsdl,.xml"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'wsdl')}
                      className="hidden"
                      id="wsdl-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('wsdl-upload')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload WSDL File
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>WSDL Content</Label>
                    <Textarea
                      placeholder="Paste your WSDL definition here..."
                      value={wsdlInput}
                      onChange={(e) => setWsdlInput(e.target.value)}
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Structure Definition</Label>
                      <Button onClick={() => addCustomField()} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Root Field
                      </Button>
                    </div>
                    
                    {customFields.map((field, index) => (
                      <FieldBuilder
                        key={index}
                        field={field}
                        index={index}
                        onUpdate={(idx, updates) => updateCustomField(idx, updates)}
                        onRemove={(idx) => removeCustomField(idx)}
                        onAddChild={(idx) => addCustomField(idx)}
                        depth={0}
                      />
                    ))}
                    
                    {customFields.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No fields defined. Click "Add Root Field" to get started.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 pt-4 border-t">
                <Button onClick={saveStructure} className="w-full bg-gradient-primary hover:opacity-90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Data Structure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structure Library */}
        <div className="space-y-6">
          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Structure Library</CardTitle>
              <CardDescription>Existing data structures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {structures.map((structure) => {
                const Icon = getTypeIcon(structure.type);
                return (
                  <div
                    key={structure.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-soft ${
                      selectedStructure?.id === structure.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => setSelectedStructure(structure)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{structure.name}</span>
                            <Badge variant="outline" className="text-xs">{structure.type.toUpperCase()}</Badge>
                          </div>
                          {structure.description && (
                            <p className="text-xs text-muted-foreground mt-1">{structure.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={structure.usage === 'source' ? 'default' : structure.usage === 'target' ? 'secondary' : 'outline'} className="text-xs">
                              {structure.usage}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{structure.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={(e) => { e.stopPropagation(); duplicateStructure(structure); }}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); deleteStructure(structure.id); }}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {structures.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No data structures created yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedStructure && (
            <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Structure Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{selectedStructure.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedStructure.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <Label className="text-xs font-medium">Structure Definition</Label>
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      {renderStructurePreview(selectedStructure.structure)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};