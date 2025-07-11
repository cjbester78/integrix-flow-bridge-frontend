import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, X, CheckCircle } from 'lucide-react';
import { FieldNode, FieldMapping } from './fieldMapping/types';
import { useWebservices } from '@/hooks/useWebservices';
import { SourcePanel } from './fieldMapping/SourcePanel';
import { TargetPanel } from './fieldMapping/TargetPanel';
import { MappingArea } from './fieldMapping/MappingArea';
import { JavaEditor } from './fieldMapping/JavaEditor';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';
import { DataStructure } from '@/types/dataStructures';

interface MappingScreenProps {
  onClose?: () => void;
  onSave?: (mappings: FieldMapping[], mappingName: string) => void;
  initialMappingName?: string;
  sourceCustomer?: string;
  targetCustomer?: string;
  sourceStructure?: string;
  targetStructure?: string;
  sampleStructures?: DataStructure[];
  onSourceCustomerChange?: (value: string) => void;
  onTargetCustomerChange?: (value: string) => void;
  onSourceStructureChange?: (value: string) => void;
  onTargetStructureChange?: (value: string) => void;
}

export function FieldMappingScreen({ 
  onClose, 
  onSave, 
  initialMappingName = '',
  sourceCustomer = '',
  targetCustomer = '',
  sourceStructure = '',
  targetStructure = '',
  sampleStructures = [],
  onSourceCustomerChange,
  onTargetCustomerChange,
  onSourceStructureChange,
  onTargetStructureChange
}: MappingScreenProps) {
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
  const [mappingName, setMappingName] = useState(initialMappingName);
  const { customers, loading, getStructuresForCustomer, getAdaptersForCustomer } = useCustomerAdapters();

  const [customerAdapters, setCustomerAdapters] = useState<string[]>([]);
  const [customerStructures, setCustomerStructures] = useState<string[]>([]);

  useEffect(() => {
    if (sourceCustomer) {
      loadCustomerData(sourceCustomer);
    }
  }, [sourceCustomer]);

  const loadCustomerData = async (customerId: string) => {
    const adapters = await getAdaptersForCustomer(customerId);
    const structures = await getStructuresForCustomer(customerId);
    setCustomerAdapters(adapters);
    setCustomerStructures(structures);
  };

  const getFilteredStructures = (customerId: string, usage: 'source' | 'target') => {
    if (!customerId) return sampleStructures.filter(s => s.usage === usage);
    return sampleStructures.filter(s => 
      customerStructures.includes(s.id) && s.usage === usage
    );
  };

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
        name: `${draggedField.name}_to_${targetField.name}`,
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

  const selectWebservice = async (filename: string, isSource: boolean) => {
    const { getWebserviceStructure } = useWebservices();
    const structure = await getWebserviceStructure(filename) || [];
    
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

  const handleEditJavaFunction = (mappingId: string) => {
    const mapping = mappings.find(m => m.id === mappingId);
    setShowJavaEditor(mappingId);
    setTempJavaFunction(mapping?.javaFunction || '');
  };

  const currentMapping = showJavaEditor ? mappings.find(m => m.id === showJavaEditor) : null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="border-b">
        {/* Customer and Structure Selection */}
        <div className="px-6 py-4 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Customer & Structure */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-white">Source Customer</Label>
                <Select value={sourceCustomer} onValueChange={onSourceCustomerChange} disabled={loading}>
                  <SelectTrigger className="bg-card/50 border-border">
                    <SelectValue placeholder="Select source customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        <div className="flex items-center gap-2">
                          <span>{customer.name}</span>
                          {customer.description && (
                            <Badge variant="outline" className="text-xs">{customer.description}</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-white">Source Structure</Label>
                <Select 
                  value={sourceStructure} 
                  onValueChange={onSourceStructureChange}
                  disabled={!sourceCustomer}
                >
                  <SelectTrigger className="bg-card/50 border-border">
                    <SelectValue placeholder="Select source structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredStructures(sourceCustomer, 'source').map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        <div className="flex items-center gap-2">
                          <span>{structure.name}</span>
                          <Badge variant="outline" className="text-xs">{structure.type}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Target Customer & Structure */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-white">Target Customer</Label>
                <Select value={targetCustomer} onValueChange={onTargetCustomerChange} disabled={loading}>
                  <SelectTrigger className="bg-card/50 border-border">
                    <SelectValue placeholder="Select target customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        <div className="flex items-center gap-2">
                          <span>{customer.name}</span>
                          {customer.description && (
                            <Badge variant="outline" className="text-xs">{customer.description}</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-white">Target Structure</Label>
                <Select 
                  value={targetStructure} 
                  onValueChange={onTargetStructureChange}
                  disabled={!targetCustomer}
                >
                  <SelectTrigger className="bg-card/50 border-border">
                    <SelectValue placeholder="Select target structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredStructures(targetCustomer, 'target').map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        <div className="flex items-center gap-2">
                          <span>{structure.name}</span>
                          <Badge variant="outline" className="text-xs">{structure.type}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mapping Name and Actions */}
        <div className="h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="mappingName" className="text-sm font-medium">Mapping Name:</Label>
              <Input
                id="mappingName"
                placeholder="Enter mapping name"
                value={mappingName}
                onChange={(e) => setMappingName(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={clearAllMappings} 
              className="text-destructive hover:text-destructive hover-scale"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Mappings
            </Button>
            {mappings.length > 0 && (
              <Button 
                onClick={() => onSave?.(mappings, mappingName)} 
                className="hover-scale"
                disabled={!mappingName.trim()}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Mappings
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="hover-scale"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-8rem)]">
        <SourcePanel
          fields={sourceFields}
          mappings={mappings}
          selectedService={selectedSource}
          searchValue={searchSource}
          showSelector={showSourceSelector}
          onSearchChange={setSearchSource}
          onShowSelectorChange={setShowSourceSelector}
          onSelectService={(service) => selectWebservice(service, true)}
          onToggleExpanded={toggleExpanded}
          onDragStart={handleDragStart}
        />

        <MappingArea
          mappings={mappings}
          onRemoveMapping={removeMapping}
          onEditJavaFunction={handleEditJavaFunction}
        />

        <TargetPanel
          fields={targetFields}
          mappings={mappings}
          selectedService={selectedTarget}
          searchValue={searchTarget}
          showSelector={showTargetSelector}
          onSearchChange={setSearchTarget}
          onShowSelectorChange={setShowTargetSelector}
          onSelectService={(service) => selectWebservice(service, false)}
          onToggleExpanded={toggleExpanded}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>

      <JavaEditor
        isOpen={!!showJavaEditor}
        onClose={() => setShowJavaEditor(null)}
        mapping={currentMapping}
        javaFunction={tempJavaFunction}
        onJavaFunctionChange={setTempJavaFunction}
        onSave={() => updateMappingJavaFunction(showJavaEditor!, tempJavaFunction)}
      />
    </div>
  );
}