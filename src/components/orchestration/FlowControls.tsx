import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, RotateCcw, ZoomIn, ZoomOut, Square } from 'lucide-react';

interface FlowControlsProps {
  selectedNodes: string[];
  onDeleteNodes: () => void;
}

export const FlowControls: React.FC<FlowControlsProps> = ({ selectedNodes, onDeleteNodes }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => zoomIn()}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => zoomOut()}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fitView()}
          className="h-8 w-8 p-0"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* Selection Controls */}
      {selectedNodes.length > 0 && (
        <div className="flex flex-col gap-1 border-t pt-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={onDeleteNodes}
            className="h-8 w-8 p-0"
            title="Delete selected nodes"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};