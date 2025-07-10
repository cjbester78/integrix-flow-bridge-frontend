
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Code, X } from 'lucide-react';
import { FieldMapping } from './types';

interface MappingAreaProps {
  mappings: FieldMapping[];
  onRemoveMapping: (mappingId: string) => void;
  onEditJavaFunction: (mappingId: string) => void;
}

export function MappingArea({ mappings, onRemoveMapping, onEditJavaFunction }: MappingAreaProps) {
  return (
    <div className="w-1/3 relative bg-background animate-fade-in">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <ArrowRight className="h-4 w-4" />
          Field Mappings ({mappings.length})
        </h3>
      </div>

      <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
        {mappings.length === 0 ? (
          <Alert className="mt-8">
            <AlertDescription>
              Drag fields from source to target to create mappings
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {mappings.map(mapping => (
              <div key={mapping.id} className="p-3 border rounded-lg bg-muted/30 animate-scale-in">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {mapping.sourceFields.length > 1 ? 'Multi-Source Mapping' : 'Mapping'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditJavaFunction(mapping.id)}
                      className="h-6 w-6 p-0 hover-scale"
                      title="Edit Java Function"
                    >
                      <Code className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveMapping(mapping.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover-scale"
                      title="Remove Mapping"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">{mapping.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Source:</span>
                    <span className="text-muted-foreground">
                      {mapping.sourceFields.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary" />
                    <span className="font-medium">Target:</span>
                    <span className="text-muted-foreground">{mapping.targetField}</span>
                  </div>
                  {mapping.javaFunction && (
                    <div className="mt-2 p-2 bg-background rounded text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Code className="h-3 w-3" />
                        <span className="font-medium">Java Function:</span>
                      </div>
                      <pre className="text-muted-foreground whitespace-pre-wrap text-xs font-mono">
                        {mapping.javaFunction}
                      </pre>
                    </div>
                  )}
                  {!mapping.javaFunction && (
                    <div className="mt-2 text-xs text-muted-foreground italic">
                      Click the code icon to add a custom Java function
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
