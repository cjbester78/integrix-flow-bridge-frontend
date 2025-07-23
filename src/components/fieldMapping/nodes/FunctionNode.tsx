import React, { useState, useMemo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TransformationFunction, functionsByCategory } from '@/services/transformationFunctions';
import { Settings, Zap, X, Link2 } from 'lucide-react';

interface FunctionNodeProps {
  id: string;
  data: {
    function: TransformationFunction;
    parameters: Record<string, any>;
    showSelector?: boolean;
  };
}

export const FunctionNode: React.FC<FunctionNodeProps> = ({ id, data }) => {
  const [selectedFunction, setSelectedFunction] = useState(data.function);
  const [parameters, setParameters] = useState(data.parameters);
  const [showConfig, setShowConfig] = useState(false);
  const { setNodes, setEdges, getEdges, getNodes } = useReactFlow();

  // Get connected fields for each parameter
  const connectedFields = useMemo(() => {
    const edges = getEdges();
    const nodes = getNodes();
    const connections: Record<string, string> = {};
    
    edges.forEach(edge => {
      if (edge.target === id && edge.targetHandle) {
        // Find the source node
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'sourceField') {
          const fieldData = sourceNode.data as { field: { name: string } };
          if (fieldData?.field?.name) {
            connections[edge.targetHandle] = fieldData.field.name;
          }
        } else if (sourceNode && sourceNode.type === 'constant') {
          const constantData = sourceNode.data as { value: string };
          if (constantData?.value) {
            connections[edge.targetHandle] = `"${constantData.value}"`;
          }
        }
      }
    });
    
    return connections;
  }, [id, getEdges, getNodes]);

  const allFunctions = Object.values(functionsByCategory).flat();

  const handleFunctionChange = (functionName: string) => {
    const func = allFunctions.find(f => f.name === functionName);
    if (func) {
      setSelectedFunction(func);
      setParameters({});
    }
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleDelete = () => {
    // Remove the node
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    
    // Remove any edges connected to this node
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <div className="bg-card border-2 border-orange-200 rounded-lg p-3 min-w-[200px] shadow-sm relative group">
      {/* Delete button - only visible on hover */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md hover:bg-destructive/80"
        title="Delete function"
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500" />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Settings clicked, showConfig was:', showConfig);
            setShowConfig(!showConfig);
          }}
          className="h-6 w-6 p-0 hover:bg-muted rounded"
        >
          <Settings className={`h-3 w-3 ${showConfig ? 'text-primary' : ''}`} />
        </Button>
      </div>

      {data.showSelector ? (
        <Select value={selectedFunction.name} onValueChange={handleFunctionChange}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(functionsByCategory).map(([category, functions]) => (
              <div key={category}>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                  {category}
                </div>
                {functions.map((func) => (
                  <SelectItem key={func.name} value={func.name} className="text-xs">
                    {func.name}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-sm font-semibold text-primary">{selectedFunction.name}</div>
      )}

      <div className="text-xs text-muted-foreground mt-1 mb-3">
        {selectedFunction.description}
      </div>

      {showConfig && (
        <div className="space-y-2 mb-3 border-t pt-2 bg-muted/20 rounded p-2">
          <Label className="text-xs font-medium">Parameters</Label>
          {selectedFunction.parameters.length === 0 ? (
            <div className="text-xs text-muted-foreground">No parameters required</div>
          ) : (
            selectedFunction.parameters.map((param, index) => (
              <div key={param.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">
                    {param.name}
                    {param.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {connectedFields[param.name] && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Link2 className="h-2 w-2" />
                      {connectedFields[param.name]}
                    </Badge>
                  )}
                </div>
                <Input
                  placeholder={connectedFields[param.name] ? 'Connected' : `${param.type} value`}
                  value={parameters[param.name] || ''}
                  onChange={(e) => handleParameterChange(param.name, e.target.value)}
                  className="h-6 text-xs"
                  disabled={!!connectedFields[param.name]}
                />
                {param.description && (
                  <div className="text-xs text-muted-foreground">{param.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Connection status display when config is closed */}
      {!showConfig && Object.keys(connectedFields).length > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1 mb-1">
            <Link2 className="h-2 w-2" />
            <span>Connected:</span>
          </div>
          {Object.entries(connectedFields).map(([param, field]) => (
            <div key={param} className="ml-3 text-xs">
              <span className="font-medium">{param}</span> ← {field}
            </div>
          ))}
        </div>
      )}

      {/* Input handles for each parameter */}
      {selectedFunction.parameters.map((param, index) => (
        <Handle
          key={`input-${param.name}`}
          type="target"
          position={Position.Left}
          id={param.name}
          style={{ 
            top: `${60 + index * 20}px`,
            background: connectedFields[param.name] ? '#22c55e' : '#f97316',
            width: '8px',
            height: '8px'
          }}
          className="border-2 border-white"
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  );
};