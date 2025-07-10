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

interface Transformation {
  id: string;
  name: string;
  description: string;
}

interface FieldMapping {
  sourceFields: string[];
  targetField: string;
  javaFunction?: string;
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
          {showFieldMapping && sourceStructure && targetStructure && (
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

              {/* Graphical Mapping Interface */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Source Fields */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Source Fields</Label>
                    <div className="border rounded-lg p-3 bg-card max-h-60 overflow-y-auto">
                      {getFieldsFromStructure(getStructureById(sourceStructure)?.structure || {}).map((field) => (
                        <div key={field} className="p-2 text-sm hover:bg-accent rounded cursor-default">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>{field}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mapping Configuration */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Field Mappings</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {fieldMappings.map((mapping, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-card space-y-3">
                          {/* Target Field Selection */}
                          <div className="flex items-center gap-2">
                            <Label className="text-xs font-medium min-w-[60px]">Target:</Label>
                            <Select 
                              value={mapping.targetField} 
                              onValueChange={(value) => onMappingChange(index, 'targetField', value)}
                            >
                              <SelectTrigger className="h-8 text-xs flex-1">
                                <SelectValue placeholder="Select target field" />
                              </SelectTrigger>
                              <SelectContent>
                                {getFieldsFromStructure(getStructureById(targetStructure)?.structure || {}).map((field) => (
                                  <SelectItem key={field} value={field} className="text-xs">
                                    {field}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onRemoveMapping(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Source Fields Section */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs font-medium">Sources:</Label>
                              <Select 
                                value="" 
                                onValueChange={(value) => onAddSourceField(index, value)}
                              >
                                <SelectTrigger className="h-7 text-xs flex-1">
                                  <SelectValue placeholder="Add source field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getFieldsFromStructure(getStructureById(sourceStructure)?.structure || {})
                                    .filter(field => !mapping.sourceFields.includes(field))
                                    .map((field) => (
                                    <SelectItem key={field} value={field} className="text-xs">
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Selected Source Fields */}
                            {mapping.sourceFields.length > 0 && (
                              <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded border-l-2 border-primary/20">
                                {mapping.sourceFields.map((sourceField, sourceIndex) => (
                                  <div key={sourceIndex} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded text-xs">
                                    <span>{sourceField}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onRemoveSourceField(index, sourceIndex)}
                                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                                    >
                                      <X className="h-2 w-2" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {mapping.sourceFields.length === 0 && (
                              <div className="text-xs text-muted-foreground italic p-2 bg-muted/30 rounded">
                                No source fields selected
                              </div>
                            )}
                          </div>

                          {/* Mapping Summary and Function */}
                          {mapping.targetField && mapping.sourceFields.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-accent/30 rounded text-xs">
                                <span className="font-medium">
                                  {mapping.sourceFields.length} source field{mapping.sourceFields.length !== 1 ? 's' : ''} → {mapping.targetField}
                                </span>
                                {mapping.sourceFields.length > 1 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Multi-field mapping
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onTargetFieldSelect(mapping.targetField, index)}
                                  className="text-xs"
                                >
                                  <Code className="h-3 w-3 mr-1" />
                                  {mapping.javaFunction ? 'Edit Function' : 'Add Function'}
                                </Button>
                                {mapping.javaFunction && (
                                  <Badge variant="secondary" className="text-xs">
                                    Function Added
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {fieldMappings.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No mappings configured</p>
                          <p className="text-xs">Click "Create Mapping" to start</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Target Fields */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Target Fields</Label>
                    <div className="border rounded-lg p-3 bg-card max-h-60 overflow-y-auto">
                      {getFieldsFromStructure(getStructureById(targetStructure)?.structure || {}).map((field) => (
                        <div key={field} className="p-2 text-sm hover:bg-accent rounded cursor-default">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-secondary" />
                            <span>{field}</span>
                            {fieldMappings.some(m => m.targetField === field) && (
                              <Badge variant="outline" className="text-xs ml-auto">Mapped</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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