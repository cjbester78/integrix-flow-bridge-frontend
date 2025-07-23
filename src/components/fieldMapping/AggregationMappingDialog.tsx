import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Combine, Code, Target, FileText } from 'lucide-react';
import { FieldNode, FieldMapping } from './types';
import { functionsByCategory } from '@/services/transformationFunctions';

interface AggregationRule {
  id: string;
  sourceFields: string[];
  operation: 'concat' | 'sum' | 'avg' | 'max' | 'min' | 'count' | 'join' | 'custom';
  separator?: string;
  customFunction?: string;
  customJavaCode?: string;
}

interface AggregationMappingDialogProps {
  open: boolean;
  onClose: () => void;
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  onApplyAggregationMapping: (mapping: FieldMapping) => void;
}

const aggregationOperations = [
  { value: 'concat', label: 'Concatenate', description: 'Join string values together' },
  { value: 'sum', label: 'Sum', description: 'Add numeric values' },
  { value: 'avg', label: 'Average', description: 'Calculate average of numeric values' },
  { value: 'max', label: 'Maximum', description: 'Find maximum value' },
  { value: 'min', label: 'Minimum', description: 'Find minimum value' },
  { value: 'count', label: 'Count', description: 'Count non-empty values' },
  { value: 'join', label: 'Join with Delimiter', description: 'Join values with custom delimiter' },
  { value: 'custom', label: 'Custom Function', description: 'Use custom Java code' }
];

export const AggregationMappingDialog: React.FC<AggregationMappingDialogProps> = ({
  open,
  onClose,
  sourceFields,
  targetFields,
  onApplyAggregationMapping
}) => {
  const [mappingName, setMappingName] = useState('');
  const [selectedSourceFields, setSelectedSourceFields] = useState<string[]>([]);
  const [targetField, setTargetField] = useState('');
  const [operation, setOperation] = useState<string>('concat');
  const [separator, setSeparator] = useState(' ');
  const [customJavaCode, setCustomJavaCode] = useState('');
  const [previewResult, setPreviewResult] = useState('');

  const addSourceField = useCallback((fieldPath: string) => {
    if (!selectedSourceFields.includes(fieldPath)) {
      setSelectedSourceFields(prev => [...prev, fieldPath]);
    }
  }, [selectedSourceFields]);

  const removeSourceField = useCallback((fieldPath: string) => {
    setSelectedSourceFields(prev => prev.filter(f => f !== fieldPath));
  }, []);

  const generateJavaCode = useCallback(() => {
    const sourceFieldVars = selectedSourceFields.map((field, index) => 
      `Object field${index + 1} = sourceData.get("${field}");`
    ).join('\n');

    const sourceFieldStrings = selectedSourceFields.map((field, index) => 
      `String str${index + 1} = field${index + 1} != null ? field${index + 1}.toString() : "";`
    ).join('\n');

    let operationCode = '';
    
    switch (operation) {
      case 'concat':
        const concatFields = selectedSourceFields.map((_, index) => `str${index + 1}`).join(' + ');
        operationCode = `return ${concatFields};`;
        break;
        
      case 'sum':
        operationCode = `
double sum = 0;
${selectedSourceFields.map((_, index) => 
  `try { sum += Double.parseDouble(str${index + 1}); } catch (NumberFormatException e) {}`
).join('\n')}
return String.valueOf(sum);`;
        break;
        
      case 'avg':
        operationCode = `
double sum = 0;
int count = 0;
${selectedSourceFields.map((_, index) => 
  `try { sum += Double.parseDouble(str${index + 1}); count++; } catch (NumberFormatException e) {}`
).join('\n')}
return count > 0 ? String.valueOf(sum / count) : "0";`;
        break;
        
      case 'max':
        operationCode = `
double max = Double.MIN_VALUE;
${selectedSourceFields.map((_, index) => 
  `try { max = Math.max(max, Double.parseDouble(str${index + 1})); } catch (NumberFormatException e) {}`
).join('\n')}
return String.valueOf(max);`;
        break;
        
      case 'min':
        operationCode = `
double min = Double.MAX_VALUE;
${selectedSourceFields.map((_, index) => 
  `try { min = Math.min(min, Double.parseDouble(str${index + 1})); } catch (NumberFormatException e) {}`
).join('\n')}
return String.valueOf(min);`;
        break;
        
      case 'count':
        operationCode = `
int count = 0;
${selectedSourceFields.map((_, index) => 
  `if (!str${index + 1}.isEmpty()) count++;`
).join('\n')}
return String.valueOf(count);`;
        break;
        
      case 'join':
        const joinFields = selectedSourceFields.map((_, index) => `str${index + 1}`).join(` + "${separator || ' '}" + `);
        operationCode = `return ${joinFields};`;
        break;
        
      case 'custom':
        operationCode = customJavaCode || '// Add your custom aggregation logic here\nreturn "";';
        break;
    }

    return `// Multi-source field aggregation for ${mappingName || 'aggregation mapping'}
${sourceFieldVars}

${sourceFieldStrings}

${operationCode}`;
  }, [selectedSourceFields, operation, separator, customJavaCode, mappingName]);

  const generatePreview = useCallback(() => {
    // Mock data for preview
    const mockData: Record<string, any> = {};
    selectedSourceFields.forEach((field, index) => {
      mockData[field] = `Value${index + 1}`;
    });

    let preview = '';
    switch (operation) {
      case 'concat':
        preview = selectedSourceFields.map((_, index) => `Value${index + 1}`).join('');
        break;
      case 'sum':
        preview = `${selectedSourceFields.length * 10} (example sum)`;
        break;
      case 'avg':
        preview = `10 (example average)`;
        break;
      case 'max':
        preview = `Value${selectedSourceFields.length} (max)`;
        break;
      case 'min':
        preview = `Value1 (min)`;
        break;
      case 'count':
        preview = `${selectedSourceFields.length}`;
        break;
      case 'join':
        preview = selectedSourceFields.map((_, index) => `Value${index + 1}`).join(separator || ' ');
        break;
      case 'custom':
        preview = 'Custom result (depends on your code)';
        break;
    }
    
    setPreviewResult(preview);
  }, [selectedSourceFields, operation, separator]);

  React.useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const handleApply = useCallback(() => {
    if (!mappingName || selectedSourceFields.length === 0 || !targetField) return;

    const sourceFieldNodes = selectedSourceFields.map(path => 
      sourceFields.find(f => f.path === path)
    ).filter(Boolean) as FieldNode[];

    const targetFieldNode = targetFields.find(f => f.path === targetField);
    if (!targetFieldNode) return;

    const javaCode = generateJavaCode();

    const mapping: FieldMapping = {
      id: `aggregation_mapping_${Date.now()}`,
      name: mappingName,
      sourceFields: sourceFieldNodes.map(f => f.name),
      targetField: targetFieldNode.name,
      sourcePaths: selectedSourceFields,
      targetPath: targetField,
      requiresTransformation: true,
      functionNode: {
        id: `aggregation_function_${Date.now()}`,
        functionName: 'multi_source_aggregation',
        parameters: {
          operation,
          separator: separator || ' ',
          javaCode,
          sourceFields: selectedSourceFields.join(',')
        },
        sourceConnections: {
          input: selectedSourceFields
        },
        position: { x: 0, y: 0 }
      }
    };

    onApplyAggregationMapping(mapping);
    onClose();
  }, [
    mappingName,
    selectedSourceFields,
    targetField,
    sourceFields,
    targetFields,
    generateJavaCode,
    operation,
    separator,
    onApplyAggregationMapping,
    onClose
  ]);

  const flattenFields = (fields: FieldNode[]): Array<{value: string, label: string}> => {
    const result: Array<{value: string, label: string}> = [];
    
    const processField = (field: FieldNode, prefix = '') => {
      const path = prefix ? `${prefix}.${field.name}` : field.path;
      result.push({ value: path, label: path });
      
      if (field.children) {
        field.children.forEach(child => processField(child, path));
      }
    };
    
    fields.forEach(field => processField(field));
    return result;
  };

  const sourceFieldOptions = flattenFields(sourceFields);
  const targetFieldOptions = flattenFields(targetFields);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Combine className="h-5 w-5" />
            Multi-Source Field Aggregation
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Configuration */}
          <div className="w-2/3 p-6 overflow-y-auto">
            {/* Basic Configuration */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Basic Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mappingName">Mapping Name</Label>
                  <Input
                    id="mappingName"
                    value={mappingName}
                    onChange={(e) => setMappingName(e.target.value)}
                    placeholder="Enter aggregation mapping name"
                  />
                </div>

                <div>
                  <Label>Target Field</Label>
                  <Select value={targetField} onValueChange={setTargetField}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target field" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetFieldOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Source Fields Selection */}
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Source Fields ({selectedSourceFields.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-2 block">Available Fields</Label>
                    <ScrollArea className="h-40 border rounded-lg p-2">
                      {sourceFieldOptions.map(option => (
                        <div key={option.value} className="flex items-center justify-between py-1">
                          <span className="text-sm">{option.label}</span>
                          <Button
                            onClick={() => addSourceField(option.value)}
                            disabled={selectedSourceFields.includes(option.value)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>

                  <div>
                    <Label className="text-xs mb-2 block">Selected Fields</Label>
                    <ScrollArea className="h-40 border rounded-lg p-2">
                      {selectedSourceFields.map((fieldPath, index) => (
                        <div key={fieldPath} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                            <span className="text-sm">{fieldPath}</span>
                          </div>
                          <Button
                            onClick={() => removeSourceField(fieldPath)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aggregation Operation */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Aggregation Operation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Operation Type</Label>
                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aggregationOperations.map(op => (
                        <SelectItem key={op.value} value={op.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{op.label}</span>
                            <span className="text-xs text-muted-foreground">{op.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(operation === 'concat' || operation === 'join') && (
                  <div>
                    <Label htmlFor="separator">Separator</Label>
                    <Input
                      id="separator"
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      placeholder="Enter separator (e.g., ' ', ', ', '|')"
                    />
                  </div>
                )}

                {operation === 'custom' && (
                  <div>
                    <Label htmlFor="customCode">Custom Java Code</Label>
                    <Textarea
                      id="customCode"
                      value={customJavaCode}
                      onChange={(e) => setCustomJavaCode(e.target.value)}
                      placeholder="// Write your custom aggregation logic here
// Available variables: field1, field2, ... (Object type)
// Available variables: str1, str2, ... (String type)
// Return a String value"
                      rows={6}
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Java Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Generated Java Code</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generateJavaCode()}
                  readOnly
                  rows={12}
                  className="font-mono text-xs bg-muted"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 border-l bg-muted/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Preview & Configuration</h3>
              <Button 
                onClick={handleApply}
                disabled={!mappingName || selectedSourceFields.length === 0 || !targetField}
                size="sm"
              >
                <Target className="h-4 w-4 mr-2" />
                Apply Mapping
              </Button>
            </div>

            <div className="space-y-4">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Mapping Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {mappingName || 'Unnamed'}
                    </div>
                    <div>
                      <span className="font-medium">Source Fields:</span> {selectedSourceFields.length}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {targetField || 'Not selected'}
                    </div>
                    <div>
                      <span className="font-medium">Operation:</span> {
                        aggregationOperations.find(op => op.value === operation)?.label || operation
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Field Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Field Flow</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {selectedSourceFields.map((field, index) => (
                      <div key={field} className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                        <span className="truncate">{field}</span>
                      </div>
                    ))}
                    
                    {selectedSourceFields.length > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="default" className="text-xs">
                            {aggregationOperations.find(op => op.value === operation)?.label}
                          </Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <Target className="h-3 w-3" />
                          <span className="truncate">{targetField || 'Target Field'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preview Result */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Preview Result</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Example Output:</div>
                    <div className="font-mono text-sm">{previewResult || 'No preview available'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Operation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-xs space-y-2">
                    <div><strong>Concat:</strong> Joins all values together</div>
                    <div><strong>Sum:</strong> Adds numeric values (non-numeric ignored)</div>
                    <div><strong>Average:</strong> Calculates mean of numeric values</div>
                    <div><strong>Max/Min:</strong> Finds largest/smallest numeric value</div>
                    <div><strong>Count:</strong> Counts non-empty values</div>
                    <div><strong>Join:</strong> Joins values with custom separator</div>
                    <div><strong>Custom:</strong> Use your own Java logic</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};