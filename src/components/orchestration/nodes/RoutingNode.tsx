import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, GitBranch } from 'lucide-react';

interface RoutingNodeProps {
  id: string;
  data: {
    routingConfig: {
      condition?: string;
      routes?: Array<{ id: string; condition: string; target: string }>;
    };
    onConfigChange: (config: any) => void;
  };
}

export const RoutingNode: React.FC<RoutingNodeProps> = ({ id, data }) => {
  const [configOpen, setConfigOpen] = useState(false);
  const [condition, setCondition] = useState(data.routingConfig?.condition || '');
  const isConfigured = data.routingConfig && data.routingConfig.condition;

  const handleSave = () => {
    data.onConfigChange({
      condition,
      routes: [
        { id: 'route-a', condition: condition, target: 'path-a' },
        { id: 'route-b', condition: `!(${condition})`, target: 'path-b' }
      ]
    });
    setConfigOpen(false);
  };

  return (
    <>
      <Card className="min-w-[180px] shadow-lg border-2 hover:border-primary/20 transition-colors bg-orange-50 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-sm font-medium">Message Router</CardTitle>
            </div>
            <Badge variant={isConfigured ? "default" : "secondary"} className="text-xs">
              {isConfigured ? "Configured" : "Setup Required"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setConfigOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </CardContent>
        
        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="route-a"
          style={{ top: '40%' }}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="route-b"
          style={{ top: '60%' }}
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Message Routing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="routing-condition">Routing Condition</Label>
              <Textarea
                id="routing-condition"
                placeholder="e.g., message.type === 'order' && message.amount > 1000"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                JavaScript expression to evaluate message routing
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Route A (True)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Messages matching the condition
                </p>
              </div>
              
              <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Route B (False)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Messages not matching the condition
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};