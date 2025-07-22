import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FunctionPicker } from './FunctionPicker';
import { FunctionMappingModal } from './FunctionMappingModal';
import { FieldNode, FieldMapping } from './types';
import { Plus, Settings } from 'lucide-react';

interface VisualMappingCanvasProps {
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  mappings: FieldMapping[];
  draggedField: FieldNode | null;
  onUpdateMapping: (mappingId: string, updates: Partial<FieldMapping>) => void;
  onCreateMapping: (mapping: FieldMapping) => void;
  onRemoveMapping: (mappingId: string) => void;
  onDragEnd: () => void;
  currentTargetField?: FieldNode;
  selectedSourceStructure?: string;
}

export const VisualMappingCanvas: React.FC<VisualMappingCanvasProps> = ({
  sourceFields,
  targetFields,
  mappings,
  onCreateMapping,
  onRemoveMapping,
  currentTargetField,
  selectedSourceStructure
}) => {
  const [functionMappingModal, setFunctionMappingModal] = useState<{
    open: boolean;
    selectedFunction: string;
    targetField: FieldNode | null;
  }>({
    open: false,
    selectedFunction: '',
    targetField: null
  });

  // Filter fields based on current context
  const filteredSourceFields = currentTargetField && selectedSourceStructure 
    ? sourceFields 
    : sourceFields;

  // Handle function mapping from modal
  const handleApplyFunctionMapping = useCallback((mapping: FieldMapping) => {
    // Remove any existing mapping for this target field
    mappings.forEach(existingMapping => {
      if (existingMapping.targetField === mapping.targetField) {
        onRemoveMapping(existingMapping.id);
      }
    });
    
    // Create the new function-based mapping
    onCreateMapping(mapping);
    
    // Close the modal
    setFunctionMappingModal({
      open: false,
      selectedFunction: '',
      targetField: null
    });
  }, [mappings, onCreateMapping, onRemoveMapping]);

  return (
    <div className="relative w-full h-full bg-background overflow-hidden border rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FunctionPicker
            onFunctionSelect={(functionName, javaCode) => {
              console.log('Function selected from picker:', functionName, javaCode);
              // Open the function mapping modal
              if (currentTargetField) {
                setFunctionMappingModal({
                  open: true,
                  selectedFunction: functionName,
                  targetField: currentTargetField
                });
              }
            }}
            trigger={
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                disabled={!currentTargetField}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Function
              </Button>
            }
          />
          <Button variant="outline" size="sm" className="h-8">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {mappings.length} mapping(s) • Function-based mapping only
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-lg font-semibold text-primary mb-2">
            Function-Based Field Mapping
          </div>
          <div className="text-muted-foreground mb-6">
            {currentTargetField 
              ? `Select a function to map fields to "${currentTargetField.name}"`
              : "Select a target field first, then choose a function to create mappings"
            }
          </div>
          
          {!currentTargetField && (
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <div className="font-medium mb-2">To create a mapping:</div>
              <ol className="text-left space-y-1">
                <li>1. Select a target field from the right panel</li>
                <li>2. Click "Add Function" to choose a transformation</li>
                <li>3. Connect source fields to function parameters</li>
                <li>4. Connect function output to target field</li>
                <li>5. Apply the mapping</li>
              </ol>
            </div>
          )}
          
          {currentTargetField && (
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="text-sm font-medium text-primary mb-2">
                Target Field Selected
              </div>
              <div className="text-sm">
                <span className="font-medium">{currentTargetField.name}</span>
                <span className="text-muted-foreground ml-2">({currentTargetField.type})</span>
              </div>
              <div className="mt-3">
                <FunctionPicker
                  onFunctionSelect={(functionName, javaCode) => {
                    setFunctionMappingModal({
                      open: true,
                      selectedFunction: functionName,
                      targetField: currentTargetField
                    });
                  }}
                  trigger={
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4 mr-1" />
                      Choose Function
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-muted/30 p-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Function-based mapping • Select target field and function to create mappings
          </div>
          <div>
            {selectedSourceStructure && `Source: ${selectedSourceStructure}`}
          </div>
        </div>
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
          sourceFields={filteredSourceFields}
          targetField={functionMappingModal.targetField}
          onApplyMapping={handleApplyFunctionMapping}
        />
      )}
    </div>
  );
};