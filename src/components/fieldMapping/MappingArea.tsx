
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Code, X, Zap } from 'lucide-react';
import { FieldMapping, FieldNode } from './types';
import { FunctionPicker } from './FunctionPicker';
import { FunctionMappingModal } from './FunctionMappingModal';

interface MappingAreaProps {
  mappings: FieldMapping[];
  sourceFields?: FieldNode[];
  targetFields?: FieldNode[];
  onRemoveMapping: (mappingId: string) => void;
  onEditJavaFunction: (mappingId: string) => void;
  onUpdateMapping?: (mappingId: string, updates: Partial<FieldMapping>) => void;
  onCreateMapping?: (mapping: FieldMapping) => void;
}

export function MappingArea({ 
  mappings, 
  sourceFields = [], 
  targetFields = [], 
  onRemoveMapping, 
  onEditJavaFunction, 
  onUpdateMapping,
  onCreateMapping
}: MappingAreaProps) {
  const [functionMappingModal, setFunctionMappingModal] = useState<{
    open: boolean;
    selectedFunction: string;
    targetField: FieldNode | null;
    existingMappingId?: string;
  }>({
    open: false,
    selectedFunction: '',
    targetField: null
  });

  const handleQuickFunction = (mappingId: string, functionName: string, javaCode: string) => {
    // Find the existing mapping to get the target field
    const existingMapping = mappings.find(m => m.id === mappingId);
    if (!existingMapping) return;

    // Find the target field node
    const targetField = targetFields.find(field => field.name === existingMapping.targetField);
    if (!targetField) {
      // Fallback to simple function update if target field not found
      if (onUpdateMapping) {
        onUpdateMapping(mappingId, { javaFunction: javaCode });
      }
      return;
    }

    // Open the visual mapping modal
    setFunctionMappingModal({
      open: true,
      selectedFunction: functionName,
      targetField,
      existingMappingId: mappingId
    });
  };

  const handleApplyFunctionMapping = (newMapping: FieldMapping) => {
    if (functionMappingModal.existingMappingId) {
      // Update existing mapping
      if (onUpdateMapping) {
        onUpdateMapping(functionMappingModal.existingMappingId, {
          functionNode: newMapping.functionNode,
          javaFunction: newMapping.javaFunction,
          sourceFields: newMapping.sourceFields,
          sourcePaths: newMapping.sourcePaths,
          requiresTransformation: true
        });
      }
    } else {
      // Create new mapping
      if (onCreateMapping) {
        onCreateMapping(newMapping);
      }
    }

    // Close the modal
    setFunctionMappingModal({
      open: false,
      selectedFunction: '',
      targetField: null
    });
  };

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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {mapping.sourceFields.length > 1 ? 'Multi-Source Mapping' : 'Mapping'}
                    </Badge>
                    {mapping.requiresTransformation === false && (
                      <Badge variant="secondary" className="text-xs">
                        Pass-through
                      </Badge>
                    )}
                    {mapping.functionNode && (
                      <Badge variant="default" className="text-xs">
                        Function: {mapping.functionNode.functionName}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {mapping.requiresTransformation !== false && (
                      <>
                        <FunctionPicker
                          onFunctionSelect={(functionName, javaCode) => handleQuickFunction(mapping.id, functionName, javaCode)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover-scale"
                              title="Visual Function Mapping"
                            >
                              <Zap className="h-3 w-3" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditJavaFunction(mapping.id)}
                          className="h-6 w-6 p-0 hover-scale"
                          title="Edit Java Function"
                        >
                          <Code className="h-3 w-3" />
                        </Button>
                      </>
                    )}
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
                  {mapping.requiresTransformation !== false && (
                    <>
                      {mapping.functionNode && (
                        <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-3 w-3 text-primary" />
                            <span className="font-medium text-primary">Function Mapping:</span>
                          </div>
                          <div className="text-muted-foreground">
                            {mapping.functionNode.functionName} with {Object.keys(mapping.functionNode.sourceConnections).length} parameter(s) connected
                          </div>
                        </div>
                      )}
                      {mapping.javaFunction && !mapping.functionNode && (
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
                      {!mapping.javaFunction && !mapping.functionNode && (
                        <div className="mt-2 text-xs text-muted-foreground italic">
                          Click the lightning icon for visual function mapping or code icon for custom Java
                        </div>
                      )}
                    </>
                  )}
                  {mapping.requiresTransformation === false && (
                    <div className="mt-2 text-xs text-muted-foreground italic">
                      Direct field mapping - no transformation required
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Function Mapping Modal */}
      {functionMappingModal.open && functionMappingModal.targetField && (
        <FunctionMappingModal
          open={functionMappingModal.open}
          onClose={() => setFunctionMappingModal({
            open: false,
            selectedFunction: '',
            targetField: null
          })}
          selectedFunction={functionMappingModal.selectedFunction}
          sourceFields={sourceFields}
          targetField={functionMappingModal.targetField}
          onApplyMapping={handleApplyFunctionMapping}
        />
      )}
    </div>
  );
}
