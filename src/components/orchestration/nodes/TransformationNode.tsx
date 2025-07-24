import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, ArrowRightLeft, Code, Filter, Plus, X } from 'lucide-react';
import { FieldMappingScreen } from '@/components/FieldMappingScreen';

interface TransformationNodeProps {
  id: string;
  data: {
    transformationType: 'field-mapping' | 'custom-function' | 'filter' | 'enrichment';
    transformationConfig: any;
    showDeleteButton?: boolean;
    onConfigChange: (config: any) => void;
  };
  selected?: boolean;
}

const getTransformationIcon = (type: string) => {
  switch (type) {
    case 'field-mapping':
      return ArrowRightLeft;
    case 'custom-function':
      return Code;
    case 'filter':
      return Filter;
    case 'enrichment':
      return Plus;
    default:
      return ArrowRightLeft;
  }
};

const getTransformationName = (type: string) => {
  switch (type) {
    case 'field-mapping':
      return 'Field Mapping';
    case 'custom-function':
      return 'Custom Function';
    case 'filter':
      return 'Message Filter';
    case 'enrichment':
      return 'Data Enrichment';
    default:
      return 'Transformation';
  }
};

export const TransformationNode: React.FC<TransformationNodeProps> = ({ id, data, selected }) => {
  const [configOpen, setConfigOpen] = useState(false);
  const { setNodes, setEdges } = useReactFlow();
  const Icon = getTransformationIcon(data.transformationType);
  const transformationName = getTransformationName(data.transformationType);
  const isConfigured = data.transformationConfig && Object.keys(data.transformationConfig).length > 0;

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <>
      <Card 
        className="min-w-[64px] max-w-[129px] shadow-lg border-2 hover:border-primary/20 transition-colors bg-black text-white relative group"
      >
        {/* Delete button - only visible on double-click */}
        {data.showDeleteButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-destructive text-destructive-foreground opacity-100 transition-opacity rounded-full shadow-md hover:bg-destructive/80"
            title="Delete transformation"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <CardHeader className="pb-0 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon className="h-2.5 w-2.5 text-white" />
              <CardTitle className="text-[9px] font-medium text-white truncate">{transformationName}</CardTitle>
            </div>
            <Badge variant={isConfigured ? "default" : "secondary"} className="text-[9px] px-1.5 py-0 bg-white text-black">
              {isConfigured ? "✓" : "!"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-2">
          <Button
            size="sm"
            variant="outline"
            className="w-1/2 text-[4px] h-2.5 px-0.5 bg-white text-black border-white hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('[TransformationNode] Configure clicked:', { 
                id, 
                transformationType: data.transformationType, 
                config: data.transformationConfig,
                isFieldMapping: data.transformationType === 'field-mapping'
              });
              setConfigOpen(true);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Settings className="h-0.5 w-0.5 mr-0.5" />
            Config
          </Button>
        </CardContent>
        
        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-1 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-purple-500 border-1 border-white"
        />
      </Card>

      {/* Configuration Dialog */}
      {data.transformationType === 'field-mapping' ? (
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 z-[9999]" style={{ zIndex: 9999 }}>
            <FieldMappingScreen
              onClose={() => setConfigOpen(false)}
              onSave={(mappings) => {
                data.onConfigChange({ fieldMappings: mappings });
                setConfigOpen(false);
              }}
              initialMappingName={`${transformationName} - ${id}`}
              sampleStructures={[]}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogContent className="max-w-2xl z-[9999]" style={{ zIndex: 9999 }}>
            <DialogHeader>
              <DialogTitle>Configure {transformationName}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 p-4 border border-dashed border-muted-foreground rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {transformationName} configuration panel coming soon...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};