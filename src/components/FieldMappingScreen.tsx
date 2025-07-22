import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, X, CheckCircle } from 'lucide-react';
import { FieldNode, FieldMapping } from './fieldMapping/types';
import { useDataStructures } from '@/hooks/useDataStructures';
import { SourcePanel } from './fieldMapping/SourcePanel';
import { TargetPanel } from './fieldMapping/TargetPanel';
import { MappingArea } from './fieldMapping/MappingArea';
import { JavaEditor } from './fieldMapping/JavaEditor';
import { DataStructure } from '@/types/dataStructures';

interface MappingScreenProps {
  onClose?: () => void;
  onSave?: (mappings: FieldMapping[], mappingName: string) => void;
  initialMappingName?: string;
  sampleStructures?: DataStructure[];
}

export function FieldMappingScreen({ 
  onClose, 
  onSave, 
  initialMappingName = '',
  sampleStructures = []
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
  const [requiresTransformation, setRequiresTransformation] = useState(true);
  
  const { structures } = useDataStructures();

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
        javaFunction: requiresTransformation ? '' : undefined,
        requiresTransformation
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

  const selectDataStructure = (structureName: string, isSource: boolean) => {
    const selectedStructure = structures.find(s => s.name === structureName);
    if (!selectedStructure) return;
    
    // Convert data structure to field nodes
    const convertToFieldNodes = (structure: any, parentPath = ''): FieldNode[] => {
      if (!structure || typeof structure !== 'object') return [];
      
      return Object.keys(structure).map((key, index) => {
        const value = structure[key];
        const path = parentPath ? `${parentPath}.${key}` : key;
        const hasChildren = value && typeof value === 'object' && !Array.isArray(value);
        
        return {
          id: `${path}_${index}`,
          name: key,
          type: Array.isArray(value) ? 'array' : typeof value,
          path,
          expanded: false,
          children: hasChildren ? convertToFieldNodes(value, path) : undefined
        };
      });
    };
    
    const fieldNodes = convertToFieldNodes(selectedStructure.structure);
    
    if (isSource) {
      setSelectedSource(structureName);
      setSourceFields(fieldNodes);
      setShowSourceSelector(false);
    } else {
      setSelectedTarget(structureName);
      setTargetFields(fieldNodes);
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
            <div className="flex items-center gap-2">
              <Checkbox
                id="requiresTransformation"
                checked={requiresTransformation}
                onCheckedChange={(checked) => setRequiresTransformation(checked as boolean)}
              />
              <Label htmlFor="requiresTransformation" className="text-sm font-medium">
                Requires Transformation
              </Label>
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
          onSelectService={(service) => selectDataStructure(service, true)}
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
          onSelectService={(service) => selectDataStructure(service, false)}
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