import React from 'react';
import { FieldMappingScreen } from '@/components/FieldMappingScreen';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function CreateDirectMappingFlow() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSave = (mappings: any[], mappingName: string) => {
    console.log('Saving direct mapping flow:', { mappings, mappingName });
    // TODO: Implement actual save logic
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create Direct Mapping Flow</h1>
              <p className="text-muted-foreground">
                Create a point-to-point integration flow with field mapping
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <FieldMappingScreen
        onClose={handleClose}
        onSave={handleSave}
        initialMappingName="New Direct Mapping Flow"
      />
    </div>
  );
}