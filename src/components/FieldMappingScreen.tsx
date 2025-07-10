import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Trash2, 
  ArrowRight, 
  FileText, 
  Settings, 
  Link2,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus
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
  sourceField: string;
  targetField: string;
  sourcePath: string;
  targetPath: string;
}

interface MappingScreenProps {
  onClose?: () => void;
}

// Mock data for source and target structures
const sourceStructure: FieldNode[] = [
  {
    id: 'src_1',
    name: 'UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out',
    type: 'object',
    path: '/UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out',
    expanded: true,
    children: [
      {
        id: 'src_2',
        name: 'MessageHeader',
        type: 'object',
        path: '/MessageHeader',
        expanded: true,
        children: [
          { id: 'src_3', name: 'ID', type: 'string', path: '/MessageHeader/ID' },
          { id: 'src_4', name: 'UUID', type: 'string', path: '/MessageHeader/UUID' },
          { id: 'src_5', name: 'ReferenceID', type: 'string', path: '/MessageHeader/ReferenceID' }
        ]
      },
      {
        id: 'src_6',
        name: 'UtilitiesDevice',
        type: 'object',
        path: '/UtilitiesDevice',
        expanded: false,
        children: [
          { id: 'src_7', name: 'ID', type: 'string', path: '/UtilitiesDevice/ID' },
          { id: 'src_8', name: 'DeviceCategory', type: 'string', path: '/UtilitiesDevice/DeviceCategory' }
        ]
      },
      { id: 'src_9', name: 'Log', type: 'object', path: '/Log' }
    ]
  }
];

const targetStructure: FieldNode[] = [
  {
    id: 'tgt_1',
    name: 'UtilitiesDeviceERPSmartMeterChangeConfirmation',
    type: 'object',
    path: '/UtilitiesDeviceERPSmartMeterChangeConfirmation',
    expanded: true,
    children: [
      {
        id: 'tgt_2',
        name: 'MessageHeader',
        type: 'object',
        path: '/MessageHeader',
        expanded: true,
        children: [
          { id: 'tgt_3', name: 'ID', type: 'string', path: '/MessageHeader/ID' },
          { id: 'tgt_4', name: 'UUID', type: 'string', path: '/MessageHeader/UUID' },
          { id: 'tgt_5', name: 'ReferenceID', type: 'string', path: '/MessageHeader/ReferenceID' }
        ]
      },
      {
        id: 'tgt_6',
        name: 'UtilitiesDevice',
        type: 'object',
        path: '/UtilitiesDevice',
        expanded: false,
        children: [
          { id: 'tgt_7', name: 'ID', type: 'string', path: '/UtilitiesDevice/ID' },
          { id: 'tgt_8', name: 'DeviceCategory', type: 'string', path: '/UtilitiesDevice/DeviceCategory' }
        ]
      },
      { id: 'tgt_9', name: 'Log', type: 'object', path: '/Log' }
    ]
  }
];

export function FieldMappingScreen({ onClose }: MappingScreenProps) {
  const [sourceFields, setSourceFields] = useState<FieldNode[]>(sourceStructure);
  const [targetFields, setTargetFields] = useState<FieldNode[]>(targetStructure);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [draggedField, setDraggedField] = useState<{ field: FieldNode; side: 'source' | 'target' } | null>(null);
  const [searchSource, setSearchSource] = useState('');
  const [searchTarget, setSearchTarget] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl');
  const [selectedTarget, setSelectedTarget] = useState<string>('UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_In.wsdl');
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
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

  const handleDragStart = (field: FieldNode, side: 'source' | 'target') => {
    setDraggedField({ field, side });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetField: FieldNode, targetSide: 'source' | 'target') => {
    if (!draggedField) return;
    
    if (draggedField.side !== targetSide) {
      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        sourceField: draggedField.side === 'source' ? draggedField.field.name : targetField.name,
        targetField: draggedField.side === 'target' ? draggedField.field.name : targetField.name,
        sourcePath: draggedField.side === 'source' ? draggedField.field.path : targetField.path,
        targetPath: draggedField.side === 'target' ? draggedField.field.path : targetField.path
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

  const renderField = (field: FieldNode, level: number, side: 'source' | 'target') => {
    const isLeaf = !field.children || field.children.length === 0;
    const isMapped = mappings.some(m => 
      side === 'source' ? m.sourcePath === field.path : m.targetPath === field.path
    );

    return (
      <div key={field.id} className="w-full">
        <div
          className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
            isMapped ? 'bg-primary/10 border-primary' : 'bg-background hover:bg-muted/50'
          } ${isLeaf ? 'cursor-grab' : ''}`}
          style={{ marginLeft: `${level * 16}px` }}
          draggable={isLeaf}
          onDragStart={() => isLeaf && handleDragStart(field, side)}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isLeaf) handleDrop(field, side);
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
          
          <span className="text-xs text-muted-foreground">1..1</span>
        </div>

        {!isLeaf && field.expanded && field.children && (
          <div className="ml-4">
            {field.children.map(child => renderField(child, level + 1, side))}
          </div>
        )}
      </div>
    );
  };

  const renderMappingLines = () => {
    return mappings.map(mapping => (
      <g key={mapping.id}>
        <line
          x1={300}
          y1={100}
          x2={500}
          y2={100}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
        <circle cx={400} cy={100} r={4} fill="hsl(var(--primary))" />
      </g>
    ));
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
                      List of local resources that are available in your integration flow.
                    </p>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="p-2 bg-primary/10 border border-primary rounded text-sm">
                        UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl
                      </div>
                      <div className="p-2 hover:bg-muted rounded text-sm cursor-pointer">
                        UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_In.wsdl
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3 p-2 bg-background border rounded">
              {selectedSource}
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
            <div className="space-y-2">
              {sourceFields.map(field => renderField(field, 0, 'source'))}
            </div>
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
                      <Badge variant="outline" className="text-xs">Mapping</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMapping(mapping.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Source:</span>
                        <span className="text-muted-foreground">{mapping.sourceField}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        <span className="font-medium">Target:</span>
                        <span className="text-muted-foreground">{mapping.targetField}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SVG for mapping lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="hsl(var(--primary))"
                />
              </marker>
            </defs>
            {renderMappingLines()}
          </svg>
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
                      List of local resources that are available in your integration flow.
                    </p>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="p-2 hover:bg-muted rounded text-sm cursor-pointer">
                        UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl
                      </div>
                      <div className="p-2 bg-primary/10 border border-primary rounded text-sm">
                        UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_In.wsdl
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3 p-2 bg-background border rounded">
              {selectedTarget}
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
            <div className="space-y-2">
              {targetFields.map(field => renderField(field, 0, 'target'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}