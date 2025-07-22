import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FunctionPicker } from './FunctionPicker';
import { FunctionNode } from './FunctionNode';
import { FieldNode, FieldMapping, FunctionNodeData } from './types';
import { functionsByCategory, TransformationFunction } from '@/services/transformationFunctions';
import { Plus, Zap, X } from 'lucide-react';

interface VisualMappingCanvasProps {
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  mappings: FieldMapping[];
  draggedField: FieldNode | null;
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
  onCreateMapping: (mapping: FieldMapping) => void;
  onRemoveMapping: (mappingId: string) => void;
  onDragEnd: () => void;
}

export const VisualMappingCanvas: React.FC<VisualMappingCanvasProps> = ({
  sourceFields,
  targetFields,
  mappings,
  draggedField,
  onUpdateMapping,
  onCreateMapping,
  onRemoveMapping,
  onDragEnd
}) => {
  const [functionNodes, setFunctionNodes] = useState<FunctionNodeData[]>([]);
  const [draggedFromFunction, setDraggedFromFunction] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addFunctionNode = (functionName: string) => {
    const allFunctions = Object.values(functionsByCategory).flat();
    const func = allFunctions.find(f => f.name === functionName);
    if (!func) return;

    const newFunctionNode: FunctionNodeData = {
      id: `function_${Date.now()}`,
      functionName,
      parameters: {},
      sourceConnections: {},
      position: { x: 300, y: 200 + functionNodes.length * 150 }
    };

    setFunctionNodes(prev => [...prev, newFunctionNode]);
  };

  const removeFunctionNode = (nodeId: string) => {
    setFunctionNodes(prev => prev.filter(n => n.id !== nodeId));
    // Also remove any mappings that use this function
    mappings.forEach(mapping => {
      if (mapping.functionNode?.id === nodeId) {
        onRemoveMapping(mapping.id);
      }
    });
  };

  const updateFunctionNodeParameter = (nodeId: string, paramName: string, value: string) => {
    setFunctionNodes(prev => prev.map(node =>
      node.id === nodeId
        ? {
            ...node,
            parameters: { ...node.parameters, [paramName]: value }
          }
        : node
    ));
  };

  const handleDropOnFunctionParameter = (nodeId: string, paramName: string) => {
    if (!draggedField) return;

    setFunctionNodes(prev => prev.map(node =>
      node.id === nodeId
        ? {
            ...node,
            sourceConnections: {
              ...node.sourceConnections,
              [paramName]: [...(node.sourceConnections[paramName] || []), draggedField.path]
            }
          }
        : node
    ));
    
    onDragEnd();
  };

  const handleDropOnTarget = (targetField: FieldNode) => {
    if (!draggedFromFunction && !draggedField) return;

    if (draggedFromFunction) {
      // Create mapping from function output to target field
      const functionNode = functionNodes.find(f => f.id === draggedFromFunction);
      if (!functionNode) return;

      // Get all source fields connected to this function
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
      setDraggedFromFunction(null);
    } else if (draggedField) {
      // Direct field mapping (existing logic)
      const newMapping: FieldMapping = {
        id: `mapping_${Date.now()}`,
        name: `${draggedField.name}_to_${targetField.name}`,
        sourceFields: [draggedField.name],
        targetField: targetField.name,
        sourcePaths: [draggedField.path],
        targetPath: targetField.path,
        requiresTransformation: false
      };

      onCreateMapping(newMapping);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getAllFunctions = () => {
    return Object.values(functionsByCategory).flat();
  };

  const renderConnectionLines = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none z-5" style={{ overflow: 'visible' }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="hsl(var(--primary))"
            />
          </marker>
        </defs>
        
        {/* Render connections from source fields to function parameters */}
        {functionNodes.map(functionNode => 
          Object.entries(functionNode.sourceConnections).map(([paramName, sourcePaths]) =>
            sourcePaths.map((sourcePath, index) => (
              <line
                key={`${functionNode.id}-${paramName}-${index}`}
                x1="200"
                y1="100"
                x2={functionNode.position.x}
                y2={functionNode.position.y + 80}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="animate-draw-line"
              />
            ))
          )
        )}
        
        {/* Render connections from function outputs to target fields */}
        {mappings
          .filter(mapping => mapping.functionNode)
          .map(mapping => (
            <line
              key={`output-${mapping.id}`}
              x1={mapping.functionNode!.position.x + 200}
              y1={mapping.functionNode!.position.y + 80}
              x2="800"
              y2="100"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className="animate-fade-in"
            />
          ))
        }
        
        {/* Render direct field mappings (no functions) */}
        {mappings
          .filter(mapping => !mapping.functionNode)
          .map(mapping => (
            <line
              key={`direct-${mapping.id}`}
              x1="200"
              y1="50"
              x2="800"
              y2="50"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              className="animate-fade-in"
              strokeDasharray="5,5"
            />
          ))
        }
      </svg>
    );
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full bg-muted/10 overflow-auto"
      onDragOver={handleDragOver}
    >
      <div className="absolute top-4 left-4 z-20">
        <FunctionPicker
          onFunctionSelect={(functionName) => addFunctionNode(functionName)}
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Function
            </Button>
          }
        />
      </div>

      {/* Function Nodes */}
      {functionNodes.map(functionNode => {
        const func = getAllFunctions().find(f => f.name === functionNode.functionName);
        if (!func) return null;

        return (
          <FunctionNode
            key={functionNode.id}
            id={functionNode.id}
            func={func}
            parameterValues={functionNode.parameters}
            sourceConnections={functionNode.sourceConnections}
            position={functionNode.position}
            onParameterChange={(paramName, value) => 
              updateFunctionNodeParameter(functionNode.id, paramName, value)
            }
            onRemove={() => removeFunctionNode(functionNode.id)}
            onDragOver={handleDragOver}
            onDropOnParameter={(paramName) => 
              handleDropOnFunctionParameter(functionNode.id, paramName)
            }
          />
        );
      })}

      {/* Function output drag handlers */}
      {functionNodes.map(functionNode => (
        <div
          key={`output-${functionNode.id}`}
          className="absolute bg-success/20 border border-success rounded p-2 cursor-grab z-10 hover:bg-success/30 transition-colors"
          style={{ 
            left: functionNode.position.x + 220, 
            top: functionNode.position.y + 160,
            width: '100px',
            textAlign: 'center'
          }}
          draggable
          onDragStart={() => setDraggedFromFunction(functionNode.id)}
          onDragEnd={() => setDraggedFromFunction(null)}
        >
          <div className="text-xs font-medium text-success">
            {functionNode.functionName} output
          </div>
        </div>
      ))}

      {/* Target field drop zones */}
      <div className="absolute right-4 top-4 space-y-2 z-10">
        {targetFields.map(field => (
          <div
            key={field.id}
            className="bg-card border rounded p-3 min-w-[120px] cursor-pointer hover:bg-accent/50 transition-colors animate-fade-in"
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnTarget(field);
              onDragEnd();
            }}
          >
            <div className="text-sm font-medium">{field.name}</div>
            <div className="text-xs text-muted-foreground">{field.type}</div>
          </div>
        ))}
      </div>

      {/* Existing mappings display */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-card border rounded p-3 max-h-32 overflow-y-auto animate-fade-in">
          <div className="text-sm font-medium mb-2">Active Mappings ({mappings.length})</div>
          <div className="space-y-1">
            {mappings.map(mapping => (
              <div key={mapping.id} className="text-xs p-2 bg-muted rounded flex justify-between items-center animate-scale-in">
                <span>
                  {mapping.functionNode ? (
                    <>
                      {mapping.sourceFields.join(', ')} → {mapping.functionNode.functionName} → {mapping.targetField}
                    </>
                  ) : (
                    <>
                      {mapping.sourceFields.join(', ')} → {mapping.targetField}
                    </>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMapping(mapping.id)}
                  className="h-6 w-6 p-0 text-destructive hover-scale"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      {renderConnectionLines()}

      {/* Drop hint overlay */}
      {draggedField && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center z-5">
          <div className="text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Drop on function parameter or target field</p>
          </div>
        </div>
      )}
    </div>
  );
};