import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Globe, 
  Mail, 
  FileText, 
  Route, 
  GitBranch, 
  Zap, 
  Filter, 
  ArrowRightLeft, 
  Timer, 
  Shield, 
  AlertTriangle,
  Repeat,
  PauseCircle,
  Play,
  Workflow
} from 'lucide-react';

interface OrchestrationNodePaletteProps {
  onAddNode: (type: string, category: string) => void;
}

export const OrchestrationNodePalette: React.FC<OrchestrationNodePaletteProps> = ({ onAddNode }) => {
  const nodeCategories = [
    {
      category: 'Endpoints',
      icon: Globe,
      nodes: [
        { type: 'http-receiver', label: 'HTTP Receiver', icon: Globe },
        { type: 'http-sender', label: 'HTTP Sender', icon: Globe },
        { type: 'ftp-adapter', label: 'FTP Adapter', icon: FileText },
        { type: 'database-adapter', label: 'Database', icon: Database },
        { type: 'mail-adapter', label: 'Mail', icon: Mail },
      ]
    },
    {
      category: 'Routing & Logic',
      icon: Route,
      nodes: [
        { type: 'content-router', label: 'Content Router', icon: Route },
        { type: 'message-filter', label: 'Message Filter', icon: Filter },
        { type: 'splitter', label: 'Splitter', icon: GitBranch },
        { type: 'aggregator', label: 'Aggregator', icon: ArrowRightLeft },
        { type: 'conditional', label: 'Conditional', icon: GitBranch },
      ]
    },
    {
      category: 'Transformation',
      icon: ArrowRightLeft,
      nodes: [
        { type: 'data-mapper', label: 'Data Mapper', icon: ArrowRightLeft },
        { type: 'enricher', label: 'Enricher', icon: Zap },
        { type: 'translator', label: 'Translator', icon: ArrowRightLeft },
        { type: 'validator', label: 'Validator', icon: Shield },
      ]
    },
    {
      category: 'Control Flow',
      icon: Workflow,
      nodes: [
        { type: 'delay', label: 'Delay', icon: Timer },
        { type: 'retry', label: 'Retry', icon: Repeat },
        { type: 'stop', label: 'Stop', icon: PauseCircle },
        { type: 'start', label: 'Start', icon: Play },
      ]
    },
    {
      category: 'Error Handling',
      icon: AlertTriangle,
      nodes: [
        { type: 'error-handler', label: 'Error Handler', icon: AlertTriangle },
        { type: 'dead-letter', label: 'Dead Letter', icon: AlertTriangle },
        { type: 'circuit-breaker', label: 'Circuit Breaker', icon: Shield },
      ]
    }
  ];

  return (
    <Card className="w-64 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Process Steps</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {nodeCategories.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <category.icon className="h-3 w-3" />
              {category.category}
            </div>
            
            <div className="grid gap-1">
              {category.nodes.map((node) => (
                <Button
                  key={node.type}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 text-xs"
                  onClick={() => onAddNode(node.type, category.category)}
                >
                  <node.icon className="h-3 w-3 mr-2" />
                  {node.label}
                </Button>
              ))}
            </div>
            
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};