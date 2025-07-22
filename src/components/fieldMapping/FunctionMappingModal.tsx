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
    position: { x: 0, y: 0 }
  });

  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    startPosition: { x: 0, y: 0 }
  });
  const [dropTargets, setDropTargets] = useState<Set<string>>(new Set());
  const [outputConnected, setOutputConnected] = useState(false);

  const getAllFunctions = () => Object.values(functionsByCategory).flat();
  const func = getAllFunctions().find(f => f.name === selectedFunction);

  const handleSourceFieldDragStart = useCallback((field: FieldNode, event: React.DragEvent) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';

    setDragState({
      isDragging: true,
      draggedItem: field,
      startPosition: { x: event.clientX, y: event.clientY }
    });

    const targets = new Set<string>();
    func?.parameters.forEach(param => targets.add(`param-${functionNode.id}-${param.name}`));
    setDropTargets(targets);
  }, [func, functionNode.id]);

  const handleFunctionOutputDragStart = useCallback((event: React.DragEvent) => {
    if (!targetField) return;
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';

    const targets = new Set<string>();
    targets.add(`target-${targetField.id}`);
    setDropTargets(targets);
  }, [targetField]);

  const handleDragEnd = useCallback(() => {
    setDragState({ isDragging: false, draggedItem: null, startPosition: { x: 0, y: 0 } });
    setDropTargets(new Set());
  }, []);

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

  const handleApplyFunction = useCallback(() => {
    if (!func || !outputConnected || !targetField) return;

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
        id: `function_${Date.now()}`
      },
      requiresTransformation: true
    };

    onApplyMapping(newMapping);
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
              <Button variant="outline" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={canvasRef} className="relative w-full flex-1 bg-background/50 overflow-hidden">
          <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead-modal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            {connections.map(connection => (
              <path
                key={connection.id}
                d={`M ${connection.sourceX} ${connection.sourceY} C ${connection.sourceX + 100} ${connection.sourceY}, ${connection.targetX - 100} ${connection.targetY}, ${connection.targetX} ${connection.targetY}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead-modal)"
              />
            ))}
          </svg>

          <div className="flex justify-between items-start px-4 pt-4 space-x-4">
            {/* Source Fields */}
            <div className="w-72 h-60 overflow-y-auto">
              <div className="bg-card border rounded-lg p-2 shadow-sm h-full">
                <h3 className="font-semibold text-sm mb-2 text-primary">Source Fields</h3>
                <div className="space-y-2">
                  {sourceFields.map(field => (
                    <div key={field.id} className={cn("bg-background border rounded p-2 cursor-grab transition-all hover:shadow-md", dragState.isDragging && dragState.draggedItem?.id === field.id && "opacity-50")}
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

            {/* Function Node */}
            <div className="bg-card border-2 border-primary/20 rounded-lg shadow-lg overflow-visible w-60" style={{ zIndex: 5 }}>
              <div className="bg-primary text-primary-foreground p-2 rounded-t-lg">
                <div className="font-medium text-sm">{func.name}</div>
                <div className="text-xs opacity-80">{func.description}</div>
              </div>
              <div className="p-2 space-y-2">
                {func.parameters.map(param => (
                  <div key={param.name} className={cn("border border-dashed border-muted-foreground/30 rounded p-2 text-sm transition-colors min-h-10", dropTargets.has(`param-${functionNode.id}-${param.name}`) && "border-primary bg-primary/10")}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleDropOnFunctionParameter(param.name); }}
                  >
                    <div className="font-medium text-xs">{param.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">{param.type}</div>
                    {functionNode.sourceConnections[param.name]?.map((path, idx) => (
                      <div key={idx} className="text-xs bg-primary/10 text-primary rounded px-1 py-0.5 mt-1 inline-block mr-1">
                        {path.split('.').pop()}
                      </div>
                    ))}
                    {!functionNode.sourceConnections[param.name]?.length && (
                      <div className="text-xs text-muted-foreground italic">Drop here</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-success/10 border-t border-success/20 p-2 text-center cursor-grab hover:bg-success/20 transition-colors"
                draggable="true"
                onDragStart={handleFunctionOutputDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="text-xs font-medium text-success">Output</div>
                <div className="text-xs text-success/80">Drag to target</div>
              </div>
            </div>

            {/* Target Field */}
            {targetField && (
              <div className="w-72">
                <div className="bg-card border rounded-lg p-2 shadow-sm">
                  <h3 className="font-semibold text-sm mb-2 text-primary">Target Field</h3>
                  <div className={cn("bg-background border rounded p-3 transition-all", dropTargets.has(`target-${targetField.id}`) && "border-primary bg-primary/10", outputConnected && "border-success bg-success/10")}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleDropOnTarget(); }}
                  >
                    <div className="font-medium text-sm">{targetField.name}</div>
                    <div className="text-sm text-muted-foreground">{targetField.type}</div>
                    {outputConnected && <div className="text-xs text-success mt-2 font-medium">✓ Function output connected</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {dragState.isDragging && (
            <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-lg font-medium text-primary">Drop to connect</div>
                <div className="text-sm text-muted-foreground">Drop on function parameter or target field</div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t bg-muted/30 py-1 px-2 text-xs">
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">Connect source → function → target</div>
            <div className="flex items-center gap-2">
              <span className={cn("px-1.5 py-0.5 rounded", Object.keys(functionNode.sourceConnections).length > 0 ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>Params: {Object.keys(functionNode.sourceConnections).length}/{func.parameters.length}</span>
              <span className={cn("px-1.5 py-0.5 rounded", outputConnected ? "bg-success/20 text-success" : "bg-muted text-muted-foreground")}>Output: {outputConnected ? 'Connected' : 'Not connected'}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
