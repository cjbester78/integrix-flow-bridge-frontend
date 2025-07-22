import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FunctionPicker } from './FunctionPicker';
import { FieldNode, FieldMapping, FunctionNodeData } from './types';
import { functionsByCategory, TransformationFunction } from '@/services/transformationFunctions';
import { Plus, X, Settings, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualMappingCanvasProps {
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  mappings: FieldMapping[];
  draggedField: FieldNode | null;
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
  onCreateMapping: (mapping: FieldMapping) => void;
  onRemoveMapping: (mappingId: string) => void;
  onDragEnd: () => void;
  currentTargetField?: FieldNode; // Field currently being mapped
  selectedSourceStructure?: string; // Selected source structure name
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: 'field' | 'function';
}

interface DragState {
  isDragging: boolean;
  draggedItem: FieldNode | FunctionNodeData | null;
  dragType: 'source' | 'function-output' | null;
  startPosition: { x: number; y: number };
}

export const VisualMappingCanvas: React.FC<VisualMappingCanvasProps> = ({
  sourceFields,
  targetFields,
  mappings,
  draggedField: externalDraggedField,
  onUpdateMapping,
  onCreateMapping,
  onRemoveMapping,
  onDragEnd,
  currentTargetField,
  selectedSourceStructure
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [functionNodes, setFunctionNodes] = useState<FunctionNodeData[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragType: null,
    startPosition: { x: 0, y: 0 }
  });
  const [dropTargets, setDropTargets] = useState<Set<string>>(new Set());

  // Filter fields based on current context
  const filteredSourceFields = currentTargetField && selectedSourceStructure 
    ? sourceFields 
    : sourceFields;
  
  const filteredTargetFields = currentTargetField 
    ? [currentTargetField] 
    : targetFields;

  // Function management - Fixed to prevent disappearing during drag
  const addFunctionNode = useCallback((functionName: string) => {
    console.log('Adding function node:', functionName);
    const allFunctions = Object.values(functionsByCategory).flat();
    const func = allFunctions.find(f => f.name === functionName);
    console.log('Found function:', func);
    if (!func) {
      console.error('Function not found:', functionName);
      return;
    }

    const newFunctionNode: FunctionNodeData = {
      id: `function_${Date.now()}`,
      functionName,
      parameters: {},
      sourceConnections: {},
      position: { 
        x: 400 + functionNodes.length * 50, 
        y: 150 + functionNodes.length * 100 
      }
    };

    console.log('Creating new function node:', newFunctionNode);
    setFunctionNodes(prev => {
      const updated = [...prev, newFunctionNode];
      console.log('Updated function nodes:', updated);
      return updated;
    });
  }, [functionNodes]);

  const removeFunctionNode = useCallback((nodeId: string) => {
    setFunctionNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => !c.id.includes(nodeId)));
    
    // Remove mappings that use this function
    mappings.forEach(mapping => {
      if (mapping.functionNode?.id === nodeId) {
        onRemoveMapping(mapping.id);
      }
    });
  }, [mappings, onRemoveMapping]);

  // Drag and drop handlers - Fixed to not interfere with function nodes
  const handleSourceFieldDragStart = useCallback((field: FieldNode, event: React.DragEvent) => {
    console.log('Starting drag for field:', field.name);
    event.stopPropagation(); // Prevent event bubbling
    
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: field,
      dragType: 'source',
      startPosition: { x: event.clientX, y: event.clientY }
    }));
    
    // Highlight potential drop targets
    const targets = new Set<string>();
    filteredTargetFields.forEach(tf => targets.add(`target-${tf.id}`));
    functionNodes.forEach(fn => {
      const func = getAllFunctions().find(f => f.name === fn.functionName);
      func?.parameters.forEach(param => targets.add(`param-${fn.id}-${param.name}`));
    });
    setDropTargets(targets);
  }, [filteredTargetFields, functionNodes]);

  const handleFunctionOutputDragStart = useCallback((functionNode: FunctionNodeData, event: React.DragEvent) => {
    event.stopPropagation();
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: functionNode,
      dragType: 'function-output',
      startPosition: { x: event.clientX, y: event.clientY }
    }));
    
    // Highlight target fields
    const targets = new Set<string>();
    filteredTargetFields.forEach(tf => targets.add(`target-${tf.id}`));
    setDropTargets(targets);
  }, [filteredTargetFields]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragType: null,
      startPosition: { x: 0, y: 0 }
    });
    setDropTargets(new Set());
    onDragEnd();
  }, [onDragEnd]);

  // Drop handlers
  const handleDropOnTarget = useCallback((targetField: FieldNode) => {
    if (!dragState.isDragging) return;

    if (dragState.dragType === 'source' && dragState.draggedItem) {
      const sourceField = dragState.draggedItem as FieldNode;
      
      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        name: `${sourceField.name}_to_${targetField.name}`,
        sourceFields: [sourceField.name],
        targetField: targetField.name,
        sourcePaths: [sourceField.path],
        targetPath: targetField.path,
        requiresTransformation: false
      };

      onCreateMapping(newMapping);
      
      // Add visual connection
      const connection: Connection = {
        id: `connection_${Date.now()}`,
        sourceId: sourceField.id,
        targetId: targetField.id,
        sourceX: 200,
        sourceY: 100,
        targetX: 800,
        targetY: 100,
        type: 'field'
      };
      setConnections(prev => [...prev, connection]);
    } else if (dragState.dragType === 'function-output' && dragState.draggedItem) {
      const functionNode = dragState.draggedItem as FunctionNodeData;
      
      // Get connected source fields
      const connectedSourceFields: string[] = [];
      const connectedSourcePaths: string[] = [];
      
      Object.values(functionNode.sourceConnections).forEach(paths => {
        paths.forEach(path => {
          connectedSourcePaths.push(path);
          connectedSourceFields.push(path.split('.').pop() || path);
        });
      });

      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        name: `${functionNode.functionName}_to_${targetField.name}`,
        sourceFields: connectedSourceFields,
        targetField: targetField.name,
        sourcePaths: connectedSourcePaths,
        targetPath: targetField.path,
        functionNode,
        requiresTransformation: true
      };

      onCreateMapping(newMapping);
      
      // Add visual connection
      const connection: Connection = {
        id: `connection_${Date.now()}`,
        sourceId: functionNode.id,
        targetId: targetField.id,
        sourceX: functionNode.position.x + 200,
        sourceY: functionNode.position.y + 50,
        targetX: 800,
        targetY: 100,
        type: 'function'
      };
      setConnections(prev => [...prev, connection]);
    }

    handleDragEnd();
  }, [dragState, onCreateMapping, handleDragEnd]);

  const handleDropOnFunctionParameter = useCallback((functionNode: FunctionNodeData, paramName: string) => {
    if (!dragState.isDragging || dragState.dragType !== 'source') return;
    
    const sourceField = dragState.draggedItem as FieldNode;
    if (!sourceField) return;

    setFunctionNodes(prev => prev.map(node =>
      node.id === functionNode.id
        ? {
            ...node,
            sourceConnections: {
              ...node.sourceConnections,
              [paramName]: [...(node.sourceConnections[paramName] || []), sourceField.path]
            }
          }
        : node
    ));

    // Add visual connection to function parameter
    const connection: Connection = {
      id: `connection_${Date.now()}`,
      sourceId: sourceField.id,
      targetId: `${functionNode.id}-${paramName}`,
      sourceX: 200,
      sourceY: 100,
      targetX: functionNode.position.x,
      targetY: functionNode.position.y + 50,
      type: 'field'
    };
    setConnections(prev => [...prev, connection]);

    handleDragEnd();
  }, [dragState, handleDragEnd]);

  const getAllFunctions = () => {
    return Object.values(functionsByCategory).flat();
  };

  // Render the visual mapping canvas with SAP-like styling
  return (
    <div className="relative w-full h-full bg-background overflow-hidden border rounded-lg">
      {/* Professional toolbar like SAP */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FunctionPicker
            onFunctionSelect={(functionName, javaCode) => {
              console.log('Function selected from picker:', functionName, javaCode);
              addFunctionNode(functionName);
            }}
            trigger={
              <Button variant="outline" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add Function
              </Button>
            }
          />
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Play className="h-4 w-4 mr-1" />
            Test Mapping
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {mappings.length} mapping(s) • {functionNodes.length} function(s)
        </div>
      </div>

      {/* Main canvas area */}
      <div 
        ref={canvasRef}
        className="relative w-full h-full bg-background/50"
        style={{ height: 'calc(100% - 60px)' }}
      >
        {/* SVG for connections */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--primary))"
              />
            </marker>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Render all connections */}
          {connections.map(connection => (
            <g key={connection.id}>
              <path
                d={`M ${connection.sourceX} ${connection.sourceY} 
                   C ${connection.sourceX + 100} ${connection.sourceY}, 
                     ${connection.targetX - 100} ${connection.targetY}, 
                     ${connection.targetX} ${connection.targetY}`}
                stroke={connection.type === 'function' ? 'hsl(var(--primary))' : 'hsl(var(--primary))'}
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
                className="animate-draw-line"
              />
            </g>
          ))}
        </svg>

        {/* Source fields panel */}
        <div className="absolute left-4 top-4 w-60 h-full overflow-y-auto">
          <div className="bg-card border rounded-lg p-3 shadow-sm">
            <h3 className="font-semibold text-sm mb-3 text-primary">
              Source Fields {selectedSourceStructure && `(${selectedSourceStructure})`}
            </h3>
            <div className="space-y-2">
              {filteredSourceFields.map(field => (
                <div
                  key={field.id}
                  className={cn(
                    "bg-background border rounded p-3 cursor-grab transition-all hover:shadow-md",
                    dragState.isDragging && dragState.draggedItem?.id === field.id && "opacity-50"
                  )}
                  draggable
                  onDragStart={(e) => handleSourceFieldDragStart(field, e)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="font-medium text-sm">{field.name}</div>
                  <div className="text-xs text-muted-foreground">{field.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Function nodes area */}
        <div className="absolute left-80 top-4 right-80 h-full">
          {functionNodes.map(functionNode => {
            const func = getAllFunctions().find(f => f.name === functionNode.functionName);
            if (!func) return null;

            return (
              <div
                key={functionNode.id}
                className="absolute bg-card border-2 border-primary/20 rounded-lg shadow-lg"
                style={{
                  left: functionNode.position.x - 320,
                  top: functionNode.position.y,
                  width: '200px'
                }}
              >
                {/* Function header */}
                <div className="bg-primary text-primary-foreground p-2 rounded-t-lg flex justify-between items-center">
                  <span className="font-medium text-sm">{func.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFunctionNode(functionNode.id)}
                    className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Function parameters */}
                <div className="p-3 space-y-2">
                  {func.parameters.map(param => (
                    <div
                      key={param.name}
                      className={cn(
                        "border border-dashed border-muted-foreground/30 rounded p-2 text-xs transition-colors",
                        dropTargets.has(`param-${functionNode.id}-${param.name}`) && 
                        "border-primary bg-primary/10"
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropOnFunctionParameter(functionNode, param.name);
                      }}
                    >
                      <div className="font-medium">{param.name}</div>
                      <div className="text-muted-foreground">{param.type}</div>
                      {functionNode.sourceConnections[param.name]?.map((path, idx) => (
                        <div key={idx} className="text-xs bg-muted rounded px-1 mt-1">
                          {path.split('.').pop()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Function output */}
                <div
                  className="bg-success/10 border-t border-success/20 p-2 text-center cursor-grab hover:bg-success/20 transition-colors"
                  draggable
                  onDragStart={(e) => handleFunctionOutputDragStart(functionNode, e)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="text-xs font-medium text-success">Output</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Target fields panel */}
        <div className="absolute right-4 top-4 w-60 h-full overflow-y-auto">
          <div className="bg-card border rounded-lg p-3 shadow-sm">
            <h3 className="font-semibold text-sm mb-3 text-primary">
              Target Field {currentTargetField && `(${currentTargetField.name})`}
            </h3>
            <div className="space-y-2">
              {filteredTargetFields.map(field => (
                <div
                  key={field.id}
                  className={cn(
                    "bg-background border rounded p-3 transition-all hover:shadow-md",
                    dropTargets.has(`target-${field.id}`) && "border-primary bg-primary/10"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnTarget(field);
                  }}
                >
                  <div className="font-medium text-sm">{field.name}</div>
                  <div className="text-xs text-muted-foreground">{field.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drag overlay */}
        {dragState.isDragging && (
          <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-lg font-medium text-primary">
                Drop to create mapping
              </div>
              <div className="text-sm text-muted-foreground">
                {dragState.dragType === 'source' 
                  ? 'Drop on function parameter or target field'
                  : 'Drop on target field'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-muted/30 p-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Ready • Click and drag to create mappings
          </div>
          <div>
            {dragState.isDragging ? 'Dragging...' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
};