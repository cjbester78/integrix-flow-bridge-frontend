import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Construction } from 'lucide-react';
import { VisualOrchestrationEditor } from '@/components/orchestration/VisualOrchestrationEditor';

export function CreateOrchestrationFlow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Orchestration Flow</h1>
          <p className="text-muted-foreground">
            Design complex workflows with multiple systems, routing, and business logic
          </p>
        </div>

        <Alert className="mb-6">
          <Construction className="h-4 w-4" />
          <AlertDescription>
            The Visual Orchestration Flow Editor is currently under development. This will include
            drag-and-drop workflow design, message routing, multi-system orchestration, and error handling capabilities.
          </AlertDescription>
        </Alert>

        <VisualOrchestrationEditor />
      </div>
    </div>
  );
}