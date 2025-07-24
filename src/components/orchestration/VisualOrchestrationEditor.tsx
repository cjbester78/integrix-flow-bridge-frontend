import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import our custom node types and components
import { AdapterNode } from './nodes/AdapterNode';
import { TransformationNode } from './nodes/TransformationNode';
import { RoutingNode } from './nodes/RoutingNode';
import { OrchestrationNodePalette } from './OrchestrationNodePalette';
import { OrchestrationPropertiesPanel } from './OrchestrationPropertiesPanel';

// Define comprehensive node types for all orchestration components
const nodeTypes = {
  // Base types
  adapter: AdapterNode,
  transformation: TransformationNode,
  routing: RoutingNode,
  
  // Endpoints
  'http-receiver': AdapterNode,
  'http-sender': AdapterNode,
  'ftp-adapter': AdapterNode,
  'database-adapter': AdapterNode,
  'mail-adapter': AdapterNode,
  
  // Routing & Logic
  'content-router': RoutingNode,
  'message-filter': TransformationNode,
  'splitter': RoutingNode,
  'aggregator': RoutingNode,
  'conditional': RoutingNode,
  
  // Transformation
  'data-mapper': TransformationNode,
  'enricher': TransformationNode,
  'translator': TransformationNode,
  'validator': TransformationNode,
  
  // Control Flow
  'delay': TransformationNode,
  'retry': TransformationNode,
  'stop': AdapterNode,
  'start': AdapterNode,
  
  // Error Handling
  'error-handler': TransformationNode,
  'dead-letter': AdapterNode,
  'circuit-breaker': TransformationNode,
};
// Initial empty state for new orchestration flow
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function VisualOrchestrationEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: 'hsl(var(--primary))', 
          strokeWidth: 2 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))'
        }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Function to add a new node based on type and category
  const addNode = useCallback((type: string, category: string) => {
    const nodeId = `${type}-${Date.now()}`;
    const newNode: Node = {
      id: nodeId,
      type: type,
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 150 
      },
      data: { 
        adapterType: type,
        transformationType: type,
        routingType: type,
        configured: false,
        onConfigChange: (id: string, config: any) => {
          setNodes((nds) =>
            nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...config, configured: true } } : node))
          );
        }
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Calculate flow statistics
  const flowStats = useMemo(() => {
    const totalNodes = nodes.length;
    const totalConnections = edges.length;
    
    // Simple complexity calculation based on node count and connections
    let complexity: 'Low' | 'Medium' | 'High' = 'Low';
    if (totalNodes > 10 || totalConnections > 15) {
      complexity = 'High';
    } else if (totalNodes > 5 || totalConnections > 8) {
      complexity = 'Medium';
    }
    
    // Estimate execution time based on node types and connections
    const estimatedMs = totalNodes * 100 + totalConnections * 50; // rough estimate
    const estimatedExecutionTime = estimatedMs < 1000 ? `${estimatedMs}ms` : `${(estimatedMs / 1000).toFixed(1)}s`;
    
    return {
      totalNodes,
      totalConnections,
      estimatedExecutionTime,
      complexity
    };
  }, [nodes, edges]);

  return (
    <div className="h-full w-full flex">
      {/* Left Sidebar - Node Palette */}
      <div className="flex-shrink-0">
        <OrchestrationNodePalette onAddNode={addNode} />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Right Sidebar - Properties and Status */}
      <div className="flex-shrink-0">
        <OrchestrationPropertiesPanel 
          selectedNode={selectedNode} 
          flowStats={flowStats}
        />
      </div>
    </div>
  );
}