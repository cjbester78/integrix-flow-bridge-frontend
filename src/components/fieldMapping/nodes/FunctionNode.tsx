import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TransformationFunction, functionsByCategory } from '@/services/transformationFunctions';
import { Settings, Zap, X } from 'lucide-react';

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
  const { setNodes, setEdges } = useReactFlow();

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
          onClick={() => setShowConfig(!showConfig)}
          className="h-6 w-6 p-0"
        >
          <Settings className="h-3 w-3" />
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
        <div className="space-y-2 mb-3 border-t pt-2">
          <Label className="text-xs font-medium">Parameters</Label>
          {selectedFunction.parameters.map((param, index) => (
            <div key={param.name} className="space-y-1">
              <Label className="text-xs">{param.name}</Label>
              <Input
                placeholder={`${param.type} value`}
                value={parameters[param.name] || ''}
                onChange={(e) => handleParameterChange(param.name, e.target.value)}
                className="h-6 text-xs"
              />
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
            background: '#f97316',
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