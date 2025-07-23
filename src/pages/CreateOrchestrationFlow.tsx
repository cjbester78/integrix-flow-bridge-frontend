import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Construction } from 'lucide-react';
import { VisualOrchestrationEditor } from '@/components/orchestration/VisualOrchestrationEditor';

export function CreateOrchestrationFlow() {
  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Compact header */}
      <div className="h-20 border-b border-border px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Orchestration Flow</h1>
          <p className="text-sm text-muted-foreground">
            Design complex workflows with multiple systems, routing, and business logic
          </p>
        </div>
        
        <Alert className="max-w-md">
          <Construction className="h-4 w-4" />
          <AlertDescription className="text-xs">
            The Visual Orchestration Flow Editor is currently under development. This includes
            drag-and-drop workflow design, message routing, and error handling capabilities.
          </AlertDescription>
        </Alert>
      </div>

      {/* Full height flow designer */}
      <div className="h-[calc(100vh-80px)]">
        <VisualOrchestrationEditor />
      </div>
    </div>
  );
}