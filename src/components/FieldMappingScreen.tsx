import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Trash2, 
  ArrowRight, 
  Settings, 
  Link2,
  X,
  ChevronDown,
  ChevronRight,
  Code,
  Plus
} from 'lucide-react';

interface FieldNode {
  id: string;
  name: string;
  type: string;
  path: string;
  children?: FieldNode[];
  expanded?: boolean;
}

interface FieldMapping {
  id: string;
  sourceFields: string[];
  targetField: string;
  sourcePaths: string[];
  targetPath: string;
  javaFunction?: string;
}

interface MappingScreenProps {
  onClose?: () => void;
}

// Demo webservice files
const demoWebservices = [
  'CustomerOrderService.wsdl',
  'InventoryManagementService.wsdl', 
  'PaymentProcessingService.wsdl',
  'UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl',
  'UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_In.wsdl'
];

// Mock structures for demo webservices
const webserviceStructures: Record<string, FieldNode[]> = {
  'CustomerOrderService.wsdl': [
    {
      id: 'customer_1',
      name: 'CustomerOrder',
      type: 'object',
      path: '/CustomerOrder',
      expanded: true,
      children: [
        {
          id: 'customer_2',
          name: 'OrderHeader',
          type: 'object',
          path: '/OrderHeader',
          expanded: true,
          children: [
            { id: 'customer_3', name: 'OrderID', type: 'string', path: '/OrderHeader/OrderID' },
            { id: 'customer_4', name: 'CustomerID', type: 'string', path: '/OrderHeader/CustomerID' },
            { id: 'customer_5', name: 'OrderDate', type: 'date', path: '/OrderHeader/OrderDate' }
          ]
        },
        {
          id: 'customer_6',
          name: 'OrderItems',
          type: 'array',
          path: '/OrderItems',
          expanded: false,
          children: [
            { id: 'customer_7', name: 'ProductID', type: 'string', path: '/OrderItems/ProductID' },
            { id: 'customer_8', name: 'Quantity', type: 'number', path: '/OrderItems/Quantity' },
            { id: 'customer_9', name: 'Price', type: 'decimal', path: '/OrderItems/Price' }
          ]
        }
      ]
    }
  ],
  'InventoryManagementService.wsdl': [
    {
      id: 'inventory_1',
      name: 'InventoryUpdate',
      type: 'object',
      path: '/InventoryUpdate',
      expanded: true,
      children: [
        { id: 'inventory_2', name: 'ProductID', type: 'string', path: '/InventoryUpdate/ProductID' },
        { id: 'inventory_3', name: 'StockLevel', type: 'number', path: '/InventoryUpdate/StockLevel' },
        { id: 'inventory_4', name: 'Location', type: 'string', path: '/InventoryUpdate/Location' }
      ]
    }
  ]
};

export function FieldMappingScreen({ onClose }: MappingScreenProps) {
  const [sourceFields, setSourceFields] = useState<FieldNode[]>([]);
  const [targetFields, setTargetFields] = useState<FieldNode[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [draggedField, setDraggedField] = useState<FieldNode | null>(null);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [showJavaEditor, setShowJavaEditor] = useState<string | null>(null);
  const [tempJavaFunction, setTempJavaFunction] = useState('');
  const [fieldPositions, setFieldPositions] = useState<Record<string, { x: number, y: number }>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  const toggleExpanded = useCallback((nodeId: string, isSource: boolean) => {
    const updateNode = (nodes: FieldNode[]): FieldNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    if (isSource) {
      setSourceFields(updateNode);
    } else {
      setTargetFields(updateNode);
    }
  }, []);

  const handleDragStart = (field: FieldNode) => {
    setDraggedField(field);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetField: FieldNode) => {
    if (!draggedField) return;
    
    // Find existing mapping for target field
    const existingMappingIndex = mappings.findIndex(m => m.targetPath === targetField.path);
    
    if (existingMappingIndex >= 0) {
      // Add to existing mapping (multi-source)
      const existingMapping = mappings[existingMappingIndex];
      const updatedMapping: FieldMapping = {
        ...existingMapping,
        sourceFields: [...existingMapping.sourceFields, draggedField.name],
        sourcePaths: [...existingMapping.sourcePaths, draggedField.path]
      };
      
      const updatedMappings = [...mappings];
      updatedMappings[existingMappingIndex] = updatedMapping;
      setMappings(updatedMappings);
    } else {
      // Create new mapping
      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        sourceFields: [draggedField.name],
        targetField: targetField.name,
        sourcePaths: [draggedField.path],
        targetPath: targetField.path,
        javaFunction: ''
      };
      
      setMappings(prev => [...prev, newMapping]);
    }
    
    setDraggedField(null);
  };

  const removeMapping = (mappingId: string) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
  };

  const clearAllMappings = () => {
    setMappings([]);
  };

  const selectWebservice = (filename: string, isSource: boolean) => {
    const structure = webserviceStructures[filename] || [];
    
    if (isSource) {
      setSelectedSource(filename);
      setSourceFields(structure);
      setShowSourceSelector(false);
    } else {
      setSelectedTarget(filename);
      setTargetFields(structure);
      setShowTargetSelector(false);
    }
  };

  const updateMappingJavaFunction = (mappingId: string, javaFunction: string) => {
    setMappings(prev => prev.map(m => 
      m.id === mappingId ? { ...m, javaFunction } : m
    ));
    setShowJavaEditor(null);
    setTempJavaFunction('');
  };

  const renderField = (field: FieldNode, level: number, side: 'source' | 'target') => {
    const isLeaf = !field.children || field.children.length === 0;
    const isMapped = mappings.some(m => 
      side === 'source' ? m.sourcePaths.includes(field.path) : m.targetPath === field.path
    );

    return (
      <div key={field.id} className="w-full">
        <div
          className={`flex items-center p-2 border rounded-md transition-colors ${
            isMapped ? 'bg-primary/10 border-primary' : 'bg-background hover:bg-muted/50'
          } ${isLeaf && side === 'source' ? 'cursor-grab active:cursor-grabbing' : ''} ${
            isLeaf && side === 'target' ? 'border-dashed border-2 hover:border-primary' : ''
          }`}
          style={{ marginLeft: `${level * 16}px` }}
          draggable={isLeaf && side === 'source'}
          onDragStart={() => isLeaf && side === 'source' && handleDragStart(field)}
          onDragOver={isLeaf && side === 'target' ? handleDragOver : undefined}
          onDrop={(e) => {
            if (isLeaf && side === 'target') {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(field);
            }
          }}
        >
          {!isLeaf && (
            <button
              onClick={() => toggleExpanded(field.id, side === 'source')}
              className="mr-2 p-1 hover:bg-muted rounded"
            >
              {field.expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          )}
          
          <div className="flex-1 flex items-center gap-2">
            <span className="font-medium text-sm">{field.name}</span>
            <Badge variant="outline" className="text-xs">{field.type}</Badge>
            {isMapped && <Link2 className="h-3 w-3 text-primary" />}
          </div>
          
          {side === 'source' && isLeaf && (
            <span className="text-xs text-muted-foreground">Drag →</span>
          )}
          {side === 'target' && isLeaf && (
            <span className="text-xs text-muted-foreground">Drop here</span>
          )}
        </div>

        {!isLeaf && field.expanded && field.children && (
          <div className="ml-4">
            {field.children.map(child => renderField(child, level + 1, side))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Field Mapping</h1>
          <Separator orientation="vertical" className="h-6" />
          <Badge variant="secondary">SOAP Adapter</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={clearAllMappings} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Mappings
          </Button>
          <Button onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Source Panel */}
        <div className="w-1/3 border-r bg-muted/20">
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Source Message</Label>
              <Dialog open={showSourceSelector} onOpenChange={setShowSourceSelector}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Select Source Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-primary/10 border-primary">Local Resources</Button>
                      <Button variant="outline">Global Resources</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List of demo webservice files available for mapping.
                    </p>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      {demoWebservices.map(service => (
                        <div 
                          key={service}
                          className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                            selectedSource === service 
                              ? 'bg-primary/10 border border-primary' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => selectWebservice(service, true)}
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3 p-2 bg-background border rounded">
              {selectedSource || 'No source selected'}
            </div>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search source fields..."
                value={searchSource}
                onChange={(e) => setSearchSource(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            {sourceFields.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Select a source webservice to view fields
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {sourceFields.map(field => renderField(field, 0, 'source'))}
              </div>
            )}
          </div>
        </div>

        {/* Mapping Area */}
        <div className="w-1/3 relative bg-background">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Field Mappings ({mappings.length})
            </h3>
          </div>

          <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
            {mappings.length === 0 ? (
              <Alert className="mt-8">
                <AlertDescription>
                  Drag fields from source to target to create mappings
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {mappings.map(mapping => (
                  <div key={mapping.id} className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {mapping.sourceFields.length > 1 ? 'Multi-Source Mapping' : 'Mapping'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowJavaEditor(mapping.id);
                            setTempJavaFunction(mapping.javaFunction || '');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMapping(mapping.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Source:</span>
                        <span className="text-muted-foreground">
                          {mapping.sourceFields.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span className="font-medium">Target:</span>
                        <span className="text-muted-foreground">{mapping.targetField}</span>
                      </div>
                      {mapping.javaFunction && (
                        <div className="mt-2 p-2 bg-background rounded text-xs">
                          <span className="font-medium">Java Function:</span>
                          <pre className="mt-1 text-muted-foreground whitespace-pre-wrap">
                            {mapping.javaFunction}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Target Panel */}
        <div className="w-1/3 border-l bg-muted/20">
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Target Message</Label>
              <Dialog open={showTargetSelector} onOpenChange={setShowTargetSelector}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Select Target Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-primary/10 border-primary">Local Resources</Button>
                      <Button variant="outline">Global Resources</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List of demo webservice files available for mapping.
                    </p>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      {demoWebservices.map(service => (
                        <div 
                          key={service}
                          className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                            selectedTarget === service 
                              ? 'bg-primary/10 border border-primary' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => selectWebservice(service, false)}
                        >
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3 p-2 bg-background border rounded">
              {selectedTarget || 'No target selected'}
            </div>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search target fields..."
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
            {targetFields.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Select a target webservice to view fields
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {targetFields.map(field => renderField(field, 0, 'target'))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Java Function Editor Dialog */}
      <Dialog open={!!showJavaEditor} onOpenChange={() => setShowJavaEditor(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Java Function</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Write a custom Java function to transform the source field(s) to the target field.
              {showJavaEditor && mappings.find(m => m.id === showJavaEditor)?.sourceFields.length! > 1 && (
                <span className="block mt-1 font-medium">
                  Multiple inputs: {mappings.find(m => m.id === showJavaEditor)?.sourceFields.join(', ')}
                </span>
              )}
            </p>
            <Textarea
              placeholder={`// Example function:
public String transform(${showJavaEditor ? mappings.find(m => m.id === showJavaEditor)?.sourceFields.map((field, i) => `String input${i + 1}`).join(', ') || 'String input' : 'String input'}) {
    // Your transformation logic here
    return ${showJavaEditor && mappings.find(m => m.id === showJavaEditor)?.sourceFields.length! > 1 ? 'input1 + " " + input2' : 'input.toUpperCase()'};
}`}
              value={tempJavaFunction}
              onChange={(e) => setTempJavaFunction(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowJavaEditor(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateMappingJavaFunction(showJavaEditor!, tempJavaFunction)}>
                Save Function
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}