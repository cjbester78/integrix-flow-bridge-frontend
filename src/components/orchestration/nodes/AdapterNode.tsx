import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Inbox, Workflow, RefreshCw } from 'lucide-react';
import { AdapterConfigurationCard } from '@/components/createFlow/AdapterConfigurationCard';

interface AdapterNodeProps {
  id: string;
  data: {
    adapterType: string;
    adapterConfig: any;
    onConfigChange: (config: any) => void;
  };
}

const getAdapterIcon = (type: string) => {
  switch (type) {
    case 'http-sender':
    case 'http-receiver':
      return Globe;
    case 'soap-sender':
    case 'soap-receiver':
      return Workflow;
    case 'rest-sender':
    case 'rest-receiver':
      return RefreshCw;
    default:
      return Inbox;
  }
};

const getAdapterName = (type: string) => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const AdapterNode: React.FC<AdapterNodeProps> = ({ id, data }) => {
  console.log('[AdapterNode] Rendering node:', { id, data });
  
  const [configOpen, setConfigOpen] = useState(false);
  const Icon = getAdapterIcon(data.adapterType);
  const adapterName = getAdapterName(data.adapterType);
  const isConfigured = data.adapterConfig && Object.keys(data.adapterConfig).length > 0;
  
  console.log('[AdapterNode] Node state:', { 
    id, 
    adapterType: data.adapterType, 
    adapterName, 
    isConfigured,
    configOpen 
  });

  return (
    <>
      <Card className="min-w-[200px] shadow-lg border-2 hover:border-primary/20 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">{adapterName}</CardTitle>
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
            onClick={(e) => {
              console.log('[AdapterNode] Configure button clicked:', { id, adapterType: data.adapterType });
              e.stopPropagation();
              e.preventDefault();
              try {
                setConfigOpen(true);
                console.log('[AdapterNode] Dialog opened successfully');
              } catch (error) {
                console.error('[AdapterNode] Error opening dialog:', error);
              }
            }}
            onMouseDown={(e) => {
              console.log('[AdapterNode] Configure button mousedown');
              e.stopPropagation();
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </CardContent>
        
        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      </Card>

      {/* Configuration Dialog */}
      <Dialog 
        open={configOpen} 
        onOpenChange={(open) => {
          console.log('[AdapterNode] Dialog state changing:', { open, id });
          setConfigOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto z-[9999]" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Configure {adapterName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {(() => {
              console.log('[AdapterNode] Rendering AdapterConfigurationCard with props:', {
                adapters: [{
                  id: data.adapterType,
                  name: adapterName,
                  category: data.adapterType.split('-')[0].toUpperCase()
                }],
                sourceAdapter: data.adapterType
              });
              return (
                <AdapterConfigurationCard
                  adapters={[{
                    id: data.adapterType,
                    name: adapterName,
                    icon: Icon,
                    category: data.adapterType.split('-')[0].toUpperCase()
                  }]}
                  sourceBusinessComponent=""
                  targetBusinessComponent=""
                  sourceAdapter={data.adapterType}
                  targetAdapter=""
                  sourceAdapterActive={true}
                  targetAdapterActive={false}
                  onSourceBusinessComponentChange={(value) => {
                    console.log('[AdapterNode] Source business component changed:', value);
                  }}
                  onTargetBusinessComponentChange={(value) => {
                    console.log('[AdapterNode] Target business component changed:', value);
                  }}
                  onSourceAdapterChange={(value) => {
                    console.log('[AdapterNode] Source adapter changed:', value);
                  }}
                  onTargetAdapterChange={(value) => {
                    console.log('[AdapterNode] Target adapter changed:', value);
                  }}
                  onSourceAdapterActiveChange={(active) => {
                    console.log('[AdapterNode] Source adapter active changed:', active);
                  }}
                  onTargetAdapterActiveChange={(active) => {
                    console.log('[AdapterNode] Target adapter active changed:', active);
                  }}
                />
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};