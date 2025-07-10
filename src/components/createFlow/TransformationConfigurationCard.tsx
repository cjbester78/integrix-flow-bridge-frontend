import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Settings, 
  CheckCircle,
  Trash2,
  Code,
  Link,
  X,
  Save
} from 'lucide-react';
import { DataStructure } from '@/types/dataStructures';
import { FieldMapping } from '@/hooks/useFlowState';

interface Transformation {
  id: string;
  name: string;
  description: string;
}


interface TransformationConfigurationCardProps {
  transformations: Transformation[];
  selectedTransformations: string[];
  showFieldMapping: boolean;
  sourceStructure: string;
  targetStructure: string;
  fieldMappings: FieldMapping[];
  selectedTargetField: string | null;
  javaFunction: string;
  sampleStructures: DataStructure[];
  onAddTransformation: (transformationId: string) => void;
  onRemoveTransformation: (transformationId: string) => void;
  onShowMappingScreen: () => void;
  onAddMapping: () => void;
  onRemoveMapping: (index: number) => void;
  onMappingChange: (index: number, field: 'targetField', value: string) => void;
  onAddSourceField: (mappingIndex: number, sourceField: string) => void;
  onRemoveSourceField: (mappingIndex: number, sourceFieldIndex: number) => void;
  onTargetFieldSelect: (fieldPath: string, mappingIndex: number) => void;
  onJavaFunctionChange: (value: string) => void;
  onSaveJavaFunction: () => void;
  onCloseJavaEditor: () => void;
}

export const TransformationConfigurationCard = ({
  transformations,
  selectedTransformations,
  showFieldMapping,
  sourceStructure,
  targetStructure,
  fieldMappings,
  selectedTargetField,
  javaFunction,
  sampleStructures,
  onAddTransformation,
  onRemoveTransformation,
  onShowMappingScreen,
  onAddMapping,
  onRemoveMapping,
  onMappingChange,
  onAddSourceField,
  onRemoveSourceField,
  onTargetFieldSelect,
  onJavaFunctionChange,
  onSaveJavaFunction,
  onCloseJavaEditor,
}: TransformationConfigurationCardProps) => {
  const getStructureById = (id: string) => sampleStructures.find(s => s.id === id);

  const getFieldsFromStructure = (structure: any, prefix = ''): string[] => {
    if (!structure) return [];
    const fields: string[] = [];
    
    Object.entries(structure).forEach(([key, value]) => {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      fields.push(fieldPath);
      
      if (typeof value === 'object' && !Array.isArray(value) && typeof value !== 'string') {
        fields.push(...getFieldsFromStructure(value, fieldPath));
      }
    });
    
    return fields;
  };

  return (
    <>
      <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Data Transformations</CardTitle>
          <CardDescription>Configure how data should be transformed during the flow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Field Mapping Selection */}
          <div className="grid grid-cols-1 gap-3">
            {transformations.map((transformation) => (
              <div
                key={transformation.id}
                className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-all duration-300 cursor-pointer group"
                onClick={() => onAddTransformation(transformation.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors">
                      {transformation.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transformation.description}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Field Mapping Interface */}
          {showFieldMapping && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium">Field Mapping</span>
                </div>
                 <div className="flex items-center gap-2">
                   <Button 
                     variant="outline" 
                     size="sm"
                     onClick={onShowMappingScreen}
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Create Mapping
                   </Button>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => onRemoveTransformation('field-mapping')}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
              </div>

              {/* Show mappings if they exist, otherwise show create button */}
              {fieldMappings.length > 0 ? (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Current Mappings:</h4>
                      <Button 
                        onClick={onShowMappingScreen}
                        variant="outline"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Mapping
                      </Button>
                    </div>
                    {fieldMappings.map((mapping, index) => (
                      <div key={index} className="p-3 bg-background rounded border">
                        <div className="text-sm">
                          <span className="font-medium text-primary block mb-1">
                            {mapping.name}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {mapping.sourceFields.join(' + ')} → {mapping.targetField}
                          </span>
                          {mapping.javaFunction && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Custom Java function applied
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">Open the graphical mapping interface to configure field mappings</p>
                    <Button 
                      onClick={onShowMappingScreen}
                      className="bg-gradient-primary hover:opacity-90 transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Mapping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!showFieldMapping && selectedTransformations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select Field Mapping to configure data transformations</p>
              <p className="text-xs mt-2">Field mapping allows you to connect source and target fields with custom logic</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Java Function Editor Dialog */}
      {selectedTargetField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Custom Java Function</h3>
                <p className="text-sm text-muted-foreground">
                  Target Field: <Badge variant="outline" className="text-xs">{selectedTargetField}</Badge>
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onCloseJavaEditor}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="javaFunction">Java Function Code</Label>
                <Textarea
                  id="javaFunction"
                  placeholder={`// Example: Transform source data to target field
public Object transform(Object sourceValue) {
    // Your custom transformation logic here
    return sourceValue.toString().toUpperCase();
}`}
                  value={javaFunction}
                  onChange={(e) => onJavaFunctionChange(e.target.value)}
                  className="mt-2 font-mono text-sm"
                  rows={12}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={onCloseJavaEditor}
                >
                  Cancel
                </Button>
                <Button onClick={onSaveJavaFunction}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Function
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};