import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FieldNode } from '../types';
import { Database } from 'lucide-react';

interface SourceFieldNodeProps {
  data: {
    field: FieldNode;
  };
}

export const SourceFieldNode: React.FC<SourceFieldNodeProps> = ({ data }) => {
  const { field } = data;

  return (
    <div className="bg-card border-2 border-muted rounded-lg p-3 min-w-[160px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-foreground">Source Field</span>
      </div>
      
      <div className="space-y-1">
        <div className="text-sm font-semibold text-primary">{field.name}</div>
        <div className="text-xs text-muted-foreground">{field.type}</div>
        <div className="text-xs text-muted-foreground truncate max-w-[140px]" title={field.path}>
          {field.path}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  );
};