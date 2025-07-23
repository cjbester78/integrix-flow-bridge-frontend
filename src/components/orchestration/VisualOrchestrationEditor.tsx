import React, { useState, useCallback } from 'react';
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
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Play, 
  Save, 
  Settings, 
  MessageSquare, 
  GitBranch, 
  Database,
  Workflow,
  AlertTriangle,
  CheckCircle,
  Globe,
  ArrowRightLeft,
  Filter
} from 'lucide-react';

// Import our custom node types
import { AdapterNode } from './nodes/AdapterNode';
import { TransformationNode } from './nodes/TransformationNode';
import { RoutingNode } from './nodes/RoutingNode';

// Define custom node types that wrap existing components
const nodeTypes = {
  adapter: AdapterNode,
  transformation: TransformationNode,
  routing: RoutingNode,
};
// Sample orchestration flow using reusable components
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 50, y: 100 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-green-500" />
          <span>Start Process</span>
        </div>
      )
    },
    deletable: false,
  },
  {
    id: 'http-receiver',
    type: 'adapter',
    position: { x: 250, y: 100 },
    data: {
      adapterType: 'http-receiver',
      adapterConfig: {},
      onConfigChange: (config: any) => console.log('HTTP Receiver config:', config)
    },
  },
  {
    id: 'message-router',
    type: 'routing',
    position: { x: 500, y: 100 },
    data: {
      routingConfig: {},
      onConfigChange: (config: any) => console.log('Router config:', config)
    },
  },
  {
    id: 'field-mapping-a',
    type: 'transformation',
    position: { x: 750, y: 50 },
    data: {
      transformationType: 'field-mapping' as const,
      transformationConfig: {},
      onConfigChange: (config: any) => console.log('Transform A config:', config)
    },
  },
  {
    id: 'field-mapping-b',
    type: 'transformation',
    position: { x: 750, y: 200 },
    data: {
      transformationType: 'field-mapping' as const,
      transformationConfig: {},
      onConfigChange: (config: any) => console.log('Transform B config:', config)
    },
  },
  {
    id: 'soap-sender',
    type: 'adapter',
    position: { x: 1000, y: 50 },
    data: {
      adapterType: 'soap-sender',
      adapterConfig: {},
      onConfigChange: (config: any) => console.log('SOAP Sender config:', config)
    },
  },
  {
    id: 'rest-sender',
    type: 'adapter',
    position: { x: 1000, y: 200 },
    data: {
      adapterType: 'rest-sender',
      adapterConfig: {},
      onConfigChange: (config: any) => console.log('REST Sender config:', config)
    },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 1250, y: 100 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>End Process</span>
        </div>
      )
    },
    deletable: false,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start', target: 'http-receiver', animated: true },
  { id: 'e2-3', source: 'http-receiver', target: 'message-router', animated: true },
  { id: 'e3-4a', source: 'message-router', sourceHandle: 'route-a', target: 'field-mapping-a', label: 'Path A' },
  { id: 'e3-4b', source: 'message-router', sourceHandle: 'route-b', target: 'field-mapping-b', label: 'Path B' },
  { id: 'e4a-5', source: 'field-mapping-a', target: 'soap-sender' },
  { id: 'e4b-5', source: 'field-mapping-b', target: 'rest-sender' },
  { id: 'e5a-6', source: 'soap-sender', target: 'end' },
  { id: 'e5b-6', source: 'rest-sender', target: 'end' },
];

export function VisualOrchestrationEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addAdapter = (adapterType: string) => {
    const newNode: Node = {
      id: `${adapterType}-${Date.now()}`,
      type: 'adapter',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        adapterType,
        adapterConfig: {},
        onConfigChange: (config: any) => console.log(`${adapterType} config:`, config)
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addTransformation = (transformationType: 'field-mapping' | 'custom-function' | 'filter' | 'enrichment') => {
    const newNode: Node = {
      id: `${transformationType}-${Date.now()}`,
      type: 'transformation',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        transformationType,
        transformationConfig: {},
        onConfigChange: (config: any) => console.log(`${transformationType} config:`, config)
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addRouting = () => {
    const newNode: Node = {
      id: `routing-${Date.now()}`,
      type: 'routing',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        routingConfig: {},
        onConfigChange: (config: any) => console.log('Routing config:', config)
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-full flex">
      {/* Main Canvas - Takes most of the space */}
      <div className="flex-1 h-full">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Orchestration Flow Designer
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Draft</Badge>
                <Button size="sm" variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Test Flow
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              style={{ background: 'hsl(var(--muted/50))' }}
            >
              <Controls />
              <MiniMap />
              <Background />
              <Panel position="top-left">
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => addAdapter('http-receiver')}>
                    <Globe className="h-4 w-4 mr-2" />
                    HTTP Receiver
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addTransformation('field-mapping')}>
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Field Mapping
                  </Button>
                  <Button size="sm" variant="outline" onClick={addRouting}>
                    <GitBranch className="h-4 w-4 mr-2" />
                    Router
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </CardContent>
        </Card>
      </div>

      {/* Compact Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Node Palette */}
          <Card>
            <CardHeader className="pb-3">
            <CardTitle className="text-base">Process Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addRouting}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Message Router
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addTransformation('field-mapping')}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Field Mapping
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addAdapter('http-sender')}
            >
              <Globe className="h-4 w-4 mr-2" />
              HTTP Adapter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addTransformation('filter')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Message Filter
            </Button>
            </CardContent>
          </Card>

          {/* Properties Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Properties</CardTitle>
          </CardHeader>
            <CardContent className="p-3">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Node ID</label>
                  <p className="text-sm text-muted-foreground">{selectedNode.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">{selectedNode.type || 'default'}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a node to view its properties
              </p>
            )}
            </CardContent>
          </Card>

          {/* Flow Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Flow Status</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nodes</span>
                <Badge variant="secondary">{nodes.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Connections</span>
                <Badge variant="secondary">{edges.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="outline">Design Mode</Badge>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}