import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ConnectionMode,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FieldNode, FieldMapping } from './types';
import { Plus, Save, X, Zap, Hash, GitBranch } from 'lucide-react';
import { SourceFieldNode } from './nodes/SourceFieldNode';
import { FunctionNode } from './nodes/FunctionNode';
import { ConstantNode } from './nodes/ConstantNode';
import { TargetFieldNode } from './nodes/TargetFieldNode';
import { ConditionalNode } from './nodes/ConditionalNode';
import { functionsByCategory } from '@/services/transformationFunctions';

interface VisualFlowEditorProps {
  open: boolean;
  onClose: () => void;
  sourceFields: FieldNode[];
  targetField: FieldNode | null;
  onApplyMapping: (mapping: FieldMapping) => void;
  initialMapping?: FieldMapping;
}

const nodeTypes = {
  sourceField: SourceFieldNode,
  function: FunctionNode,
  constant: ConstantNode,
  targetField: TargetFieldNode,
  conditional: ConditionalNode,
};

export const VisualFlowEditor: React.FC<VisualFlowEditorProps> = ({
  open,
  onClose,
  sourceFields,
  targetField,
  onApplyMapping,
  initialMapping
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  // Initialize nodes when dialog opens
  React.useEffect(() => {
    if (open && targetField) {
      const initialNodes: Node[] = [];
      
      // Add target field node
      initialNodes.push({
        id: 'target',
        type: 'targetField',
        position: { x: 800, y: 200 },
        data: { field: targetField },
        draggable: false,
      });

      // Add a few source field nodes to start
      sourceFields.slice(0, 3).forEach((field, index) => {
        initialNodes.push({
          id: `source-${field.id}`,
          type: 'sourceField',
          position: { x: 50, y: 50 + index * 100 },
          data: { field },
        });
      });

      setNodes(initialNodes);
      setEdges([]);
      setNodeIdCounter(sourceFields.length + 2);
    }
  }, [open, targetField, sourceFields, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--primary))' },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addSourceField = useCallback(() => {
    const availableFields = sourceFields.filter(field => 
      !nodes.some(node => node.id === `source-${field.id}`)
    );
    
    if (availableFields.length === 0) return;

    const field = availableFields[0];
    const newNode: Node = {
      id: `source-${field.id}`,
      type: 'sourceField',
      position: { x: 50, y: 50 + nodes.length * 80 },
      data: { field },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes, sourceFields, setNodes]);

  const addFunction = useCallback(() => {
    const allFunctions = Object.values(functionsByCategory).flat();
    const firstFunction = allFunctions[0];
    
    if (!firstFunction) return;

    const newNode: Node = {
      id: `function-${nodeIdCounter}`,
      type: 'function',
      position: { x: 300, y: 100 + (nodeIdCounter - 1) * 120 },
      data: { 
        function: firstFunction,
        parameters: {},
        showSelector: true
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(prev => prev + 1);
  }, [nodeIdCounter, setNodes]);

  const addConstant = useCallback(() => {
    const newNode: Node = {
      id: `constant-${nodeIdCounter}`,
      type: 'constant',
      position: { x: 150, y: 100 + (nodeIdCounter - 1) * 80 },
      data: { 
        value: '',
        type: 'string'
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(prev => prev + 1);
  }, [nodeIdCounter, setNodes]);

  const addConditional = useCallback(() => {
    const newNode: Node = {
      id: `conditional-${nodeIdCounter}`,
      type: 'conditional',
      position: { x: 450, y: 100 + (nodeIdCounter - 1) * 150 },
      data: { 
        condition: 'equals',
        compareValue: ''
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(prev => prev + 1);
  }, [nodeIdCounter, setNodes]);

  const handleSave = useCallback(() => {
    if (!targetField) return;

    // Find the target node and trace back all connections
    const targetNode = nodes.find(n => n.type === 'targetField');
    if (!targetNode) return;

    // Get all source field paths connected to the flow
    const connectedSourcePaths: string[] = [];
    const connectedSourceFields: string[] = [];

    nodes.forEach(node => {
      if (node.type === 'sourceField') {
        const hasConnections = edges.some(edge => edge.source === node.id);
        if (hasConnections) {
          connectedSourcePaths.push(node.data.field.path);
          connectedSourceFields.push(node.data.field.name);
        }
      }
    });

    // Create mapping object
    const mapping: FieldMapping = {
      id: initialMapping?.id || `mapping_${Date.now()}`,
      name: `visual_flow_to_${targetField.name}`,
      sourceFields: connectedSourceFields,
      targetField: targetField.name,
      sourcePaths: connectedSourcePaths,
      targetPath: targetField.path,
      requiresTransformation: true,
      // Store the flow configuration for future editing
      functionNode: {
        id: 'visual_flow',
        functionName: 'visual_flow',
        parameters: {},
        sourceConnections: {},
        position: { x: 0, y: 0 }
      }
    };

    onApplyMapping(mapping);
    onClose();
  }, [nodes, edges, targetField, initialMapping, onApplyMapping, onClose]);

  const isFlowValid = useMemo(() => {
    const targetNode = nodes.find(n => n.type === 'targetField');
    if (!targetNode) return false;
    
    // Check if target node has incoming connections
    const hasTargetConnection = edges.some(edge => edge.target === targetNode.id);
    return hasTargetConnection;
  }, [nodes, edges]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Visual Flow Editor</span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleSave}
                disabled={!isFlowValid}
                className="bg-primary text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Flow
              </Button>
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: 'hsl(var(--primary))' }
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
            
            <Panel position="top-left" className="bg-card border rounded-lg p-2 shadow-lg">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-primary mb-2">Add Nodes</h3>
                <Button
                  onClick={addSourceField}
                  size="sm"
                  variant="outline"
                  className="justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Source Field
                </Button>
                <Button
                  onClick={addFunction}
                  size="sm"
                  variant="outline"
                  className="justify-start"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Function
                </Button>
                <Button
                  onClick={addConstant}
                  size="sm"
                  variant="outline"
                  className="justify-start"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Constant
                </Button>
                <Button
                  onClick={addConditional}
                  size="sm"
                  variant="outline"
                  className="justify-start"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Conditional
                </Button>
              </div>
            </Panel>

            <Panel position="bottom-right" className="bg-card border rounded-lg p-2 shadow-lg">
              <div className="text-xs text-muted-foreground">
                {isFlowValid ? '✅ Flow is valid' : '❌ Connect nodes to target field'}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
};