import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldNode, FieldMapping, FunctionNodeData } from './types';
import { functionsByCategory, TransformationFunction } from '@/services/transformationFunctions';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunctionMappingModalProps {
  open: boolean;
  onClose: () => void;
  selectedFunction: string;
  sourceFields: FieldNode[];
  targetField: FieldNode | null;
  onApplyMapping: (mapping: FieldMapping) => void;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

interface DragState {
  isDragging: boolean;
  draggedItem: FieldNode | null;
  startPosition: { x: number; y: number };
}

export const FunctionMappingModal: React.FC<FunctionMappingModalProps> = ({
  open,
  onClose,
  selectedFunction,
  sourceFields,
  targetField,
  onApplyMapping
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [functionNode, setFunctionNode] = useState<FunctionNodeData>({
    id: 'function_modal',
    functionName: selectedFunction,
    parameters: {},
    sourceConnections: {},
    position: { x: 400, y: 200 }
  });
  
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    startPosition: { x: 0, y: 0 }
  });
  const [dropTargets, setDropTargets] = useState<Set<string>>(new Set());
  const [outputConnected, setOutputConnected] = useState(false);

  // Get function definition
  const getAllFunctions = () => Object.values(functionsByCategory).flat();
  const func = getAllFunctions().find(f => f.name === selectedFunction);

  // Drag handlers
  const handleSourceFieldDragStart = useCallback((field: FieldNode, event: React.DragEvent) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    
    setDragState({
      isDragging: true,
      draggedItem: field,
      startPosition: { x: event.clientX, y: event.clientY }
    });
    
    // Highlight function parameter drop targets
    const targets = new Set<string>();
    func?.parameters.forEach(param => targets.add(`param-${functionNode.id}-${param.name}`));
    setDropTargets(targets);
  }, [func, functionNode.id]);

  const handleFunctionOutputDragStart = useCallback((event: React.DragEvent) => {
    if (!targetField) return;
    
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    
    // Highlight target field
    const targets = new Set<string>();
    targets.add(`target-${targetField.id}`);
    setDropTargets(targets);
  }, [targetField]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      startPosition: { x: 0, y: 0 }
    });
    setDropTargets(new Set());
  }, []);

  // Drop handlers
  const handleDropOnFunctionParameter = useCallback((paramName: string) => {
    if (!dragState.isDragging || !dragState.draggedItem) return;
    
    const sourceField = dragState.draggedItem;
    
    setFunctionNode(prev => ({
      ...prev,
      sourceConnections: {
        ...prev.sourceConnections,
        [paramName]: [...(prev.sourceConnections[paramName] || []), sourceField.path]
      }
    }));

    // Add visual connection
    const connection: Connection = {
      id: `connection_${Date.now()}`,
      sourceId: sourceField.id,
      targetId: `${functionNode.id}-${paramName}`,
      sourceX: 200,
      sourceY: 100,
      targetX: functionNode.position.x,
      targetY: functionNode.position.y + 80
    };
    setConnections(prev => [...prev, connection]);

    handleDragEnd();
  }, [dragState, functionNode.id, functionNode.position, handleDragEnd]);

  const handleDropOnTarget = useCallback(() => {
    if (!targetField) return;
    
    setOutputConnected(true);
    
    // Add visual connection from function output to target
    const connection: Connection = {
      id: `connection_output_${Date.now()}`,
      sourceId: `${functionNode.id}-output`,
      targetId: targetField.id,
      sourceX: functionNode.position.x + 120,
      sourceY: functionNode.position.y + 160,
      targetX: 800,
      targetY: 100
    };
    setConnections(prev => [...prev, connection]);
  }, [functionNode.id, functionNode.position, targetField]);

  // Apply the function mapping
  const handleApplyFunction = useCallback(() => {
    if (!func || !outputConnected || !targetField) return;

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
      name: `${selectedFunction}_to_${targetField.name}`,
      sourceFields: connectedSourceFields,
      targetField: targetField.name,
      sourcePaths: connectedSourcePaths,
      targetPath: targetField.path,
      functionNode: {
        ...functionNode,
        id: `function_${Date.now()}` // Generate new ID for the actual mapping
      },
      requiresTransformation: true
    };

    onApplyMapping(newMapping);
    console.log('Applying function mapping and closing modal');
    onClose();
  }, [func, outputConnected, functionNode, selectedFunction, targetField, onApplyMapping, onClose]);

  if (!func) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Function Mapping: {func.name}</span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleApplyFunction}
                disabled={!outputConnected || Object.keys(functionNode.sourceConnections).length === 0}
                className="bg-primary text-primary-foreground"
              >
                <Check className="h-4 w-4 mr-2" />
                Apply Function
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div 
          ref={canvasRef}
          className="relative w-full flex-1 bg-background/50 overflow-hidden"
        >
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker
                id="arrowhead-modal"
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
            </defs>
            
            {connections.map(connection => (
              <path
                key={connection.id}
                d={`M ${connection.sourceX} ${connection.sourceY} 
                   C ${connection.sourceX + 100} ${connection.sourceY}, 
                     ${connection.targetX - 100} ${connection.targetY}, 
                     ${connection.targetX} ${connection.targetY}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead-modal)"
              />
            ))}
          </svg>

          {/* Source fields panel */}
          <div className="absolute left-4 top-4 w-72 h-96 overflow-y-auto">
            <div className="bg-card border rounded-lg p-4 shadow-sm h-full">
              <h3 className="font-semibold text-base mb-4 text-primary">Source Fields</h3>
              <div className="space-y-3">
                {sourceFields.map(field => (
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

          {/* Function node in center */}
          <div
            className="absolute bg-card border-2 border-primary/20 rounded-lg shadow-lg"
            style={{
              left: functionNode.position.x,
              top: functionNode.position.y,
              width: '280px'
            }}
          >
            {/* Function header */}
            <div className="bg-primary text-primary-foreground p-3 rounded-t-lg">
              <div className="font-medium">{func.name}</div>
              <div className="text-xs opacity-80">{func.description}</div>
            </div>

            {/* Function parameters */}
            <div className="p-3 space-y-3">
              {func.parameters.map(param => (
                <div
                  key={param.name}
                  className={cn(
                    "border border-dashed border-muted-foreground/30 rounded p-3 text-sm transition-colors min-h-12",
                    dropTargets.has(`param-${functionNode.id}-${param.name}`) && 
                    "border-primary bg-primary/10"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnFunctionParameter(param.name);
                  }}
                >
                  <div className="font-medium text-sm">{param.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{param.type}</div>
                  {functionNode.sourceConnections[param.name]?.map((path, idx) => (
                    <div key={idx} className="text-xs bg-primary/10 text-primary rounded px-2 py-1 mt-1 inline-block mr-1">
                      {path.split('.').pop()}
                    </div>
                  ))}
                  {!functionNode.sourceConnections[param.name]?.length && (
                    <div className="text-xs text-muted-foreground italic">
                      Drop source field here
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Function output */}
            <div
              className="bg-success/10 border-t border-success/20 p-3 text-center cursor-grab hover:bg-success/20 transition-colors"
              draggable="true"
              onDragStart={handleFunctionOutputDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="text-sm font-medium text-success">Output</div>
              <div className="text-xs text-success/80">Drag to target field</div>
            </div>
          </div>

          {/* Target field panel */}
          {targetField && (
            <div className="absolute right-4 top-4 w-72">
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-base mb-4 text-primary">Target Field</h3>
                <div
                  className={cn(
                    "bg-background border rounded p-4 transition-all",
                    dropTargets.has(`target-${targetField.id}`) && "border-primary bg-primary/10",
                    outputConnected && "border-success bg-success/10"
                  )}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropOnTarget();
                  }}
                >
                  <div className="font-medium text-base">{targetField.name}</div>
                  <div className="text-sm text-muted-foreground">{targetField.type}</div>
                  {outputConnected && (
                    <div className="text-xs text-success mt-2 font-medium">
                      ✓ Function output connected
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Drag overlay */}
          {dragState.isDragging && (
            <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-lg font-medium text-primary">
                  Drop to connect
                </div>
                <div className="text-sm text-muted-foreground">
                  Drop on function parameter or target field
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="border-t bg-muted/30 p-3">
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              Connect source fields to function parameters, then connect function output to target
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className={cn(
                "px-2 py-1 rounded",
                Object.keys(functionNode.sourceConnections).length > 0 
                  ? "bg-success/20 text-success" 
                  : "bg-muted text-muted-foreground"
              )}>
                Parameters: {Object.keys(functionNode.sourceConnections).length}/{func.parameters.length}
              </span>
              <span className={cn(
                "px-2 py-1 rounded",
                outputConnected 
                  ? "bg-success/20 text-success" 
                  : "bg-muted text-muted-foreground"
              )}>
                Output: {outputConnected ? 'Connected' : 'Not connected'}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};