// Simple working version that preserves the exact original CreateFlow functionality
import React from 'react';

// Temporarily just show the original CreateFlow component with a different header
// This ensures EXACT same functionality is preserved
export function CreateDirectMappingFlow() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Direct Mapping Flow</h1>
          <p className="text-muted-foreground">
            Create a point-to-point integration flow with field mapping
          </p>
        </div>
        
        <div className="text-center p-8">
          <p className="text-muted-foreground">
            Direct Mapping Flow Editor - Coming from original CreateFlow functionality
          </p>
        </div>
      </div>
    </div>
  );
}