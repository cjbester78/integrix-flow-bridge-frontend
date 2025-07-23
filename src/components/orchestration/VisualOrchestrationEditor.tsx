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
  CheckCircle
} from 'lucide-react';

// Initial nodes for the orchestration flow
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-green-500" />
          <span>Start Process</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
    deletable: false, // Prevent deletion of start node
  },
  {
    id: 'message-receive',
    position: { x: 250, y: 100 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" />
          <span>Message Reception</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'routing-decision',
    position: { x: 250, y: 200 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-orange-500" />
          <span>Routing Decision</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'transform-a',
    position: { x: 100, y: 320 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-purple-500" />
          <span>Transform A</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'transform-b',
    position: { x: 400, y: 320 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-purple-500" />
          <span>Transform B</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'system-delivery',
    position: { x: 250, y: 440 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-500" />
          <span>System Delivery</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'end',
    type: 'output',
    position: { x: 250, y: 540 },
    data: { 
      label: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>End Process</span>
        </div>
      )
    },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '10px',
    },
    deletable: false, // Prevent deletion of end node
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start',
    target: 'message-receive',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e2-3',
    source: 'message-receive',
    target: 'routing-decision',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e3-4a',
    source: 'routing-decision',
    target: 'transform-a',
    label: 'Path A',
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e3-4b',
    source: 'routing-decision',
    target: 'transform-b',
    label: 'Path B',
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e4a-5',
    source: 'transform-a',
    target: 'system-delivery',
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e4b-5',
    source: 'transform-b',
    target: 'system-delivery',
    style: { stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e5-6',
    source: 'system-delivery',
    target: 'end',
    animated: true,
    style: { stroke: 'hsl(var(--primary))' },
  },
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

  const addNewNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { 
        label: (
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-primary" />
            <span>{type}</span>
          </div>
        )
      },
      style: {
        background: 'hsl(var(--card))',
        border: '2px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '10px',
      },
      deletable: true, // Allow deletion of custom nodes
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-150px)]">
      {/* Main Canvas - Takes up 4/5 of the space */}
      <div className="lg:col-span-4">
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
          <CardContent className="p-0 h-[calc(100%-60px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              style={{ background: 'hsl(var(--muted/50))' }}
            >
              <Controls />
              <MiniMap />
              <Background />
              <Panel position="top-left">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addNewNode('Message Processor')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Takes up 1/5 of the space */}
      <div className="space-y-3">
        {/* Node Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Process Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNewNode('Message Router')}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Message Router
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNewNode('Data Transformer')}
            >
              <Workflow className="h-4 w-4 mr-2" />
              Data Transformer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNewNode('System Adapter')}
            >
              <Database className="h-4 w-4 mr-2" />
              System Adapter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addNewNode('Error Handler')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Error Handler
            </Button>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader>
            <CardTitle className="text-lg">Flow Status</CardTitle>
          </CardHeader>
          <CardContent>
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
  );
}