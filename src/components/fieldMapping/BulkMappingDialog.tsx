import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Upload, Download, Wand2, FileText, Plus, X, MapPin } from 'lucide-react';
import { FieldNode, FieldMapping } from './types';
import { functionsByCategory, TransformationFunction } from '@/services/transformationFunctions';

interface BulkMappingDialogProps {
  open: boolean;
  onClose: () => void;
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  onApplyBulkMappings: (mappings: FieldMapping[]) => void;
  existingMappings?: FieldMapping[];
}

interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  patterns: Array<{
    sourcePattern: string;
    targetPattern: string;
    transformation?: string;
  }>;
}

const defaultTemplates: MappingTemplate[] = [
  {
    id: 'name-matching',
    name: 'Exact Name Matching',
    description: 'Maps fields with identical names',
    patterns: [
      { sourcePattern: '{fieldName}', targetPattern: '{fieldName}' }
    ]
  },
  {
    id: 'prefix-mapping',
    name: 'Prefix-based Mapping',
    description: 'Maps fields by removing/adding prefixes',
    patterns: [
      { sourcePattern: 'src_{fieldName}', targetPattern: 'tgt_{fieldName}' }
    ]
  },
  {
    id: 'case-conversion',
    name: 'Case Conversion Mapping',
    description: 'Maps fields with case conversion',
    patterns: [
      { sourcePattern: '{fieldName}', targetPattern: '{FIELDNAME}', transformation: 'toUpperCase' }
    ]
  }
];

export const BulkMappingDialog: React.FC<BulkMappingDialogProps> = ({
  open,
  onClose,
  sourceFields,
  targetFields,
  onApplyBulkMappings,
  existingMappings = []
}) => {
  const [activeTab, setActiveTab] = useState('batch');
  const [selectedSourceFields, setSelectedSourceFields] = useState<string[]>([]);
  const [selectedTargetFields, setSelectedTargetFields] = useState<string[]>([]);
  const [bulkTransformation, setBulkTransformation] = useState<string>('');
  const [namePattern, setNamePattern] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [importData, setImportData] = useState<string>('');
  const [previewMappings, setPreviewMappings] = useState<FieldMapping[]>([]);

  const handleSourceFieldToggle = useCallback((fieldPath: string) => {
    setSelectedSourceFields(prev => 
      prev.includes(fieldPath) 
        ? prev.filter(p => p !== fieldPath)
        : [...prev, fieldPath]
    );
  }, []);

  const handleTargetFieldToggle = useCallback((fieldPath: string) => {
    setSelectedTargetFields(prev => 
      prev.includes(fieldPath) 
        ? prev.filter(p => p !== fieldPath)
        : [...prev, fieldPath]
    );
  }, []);

  const generateBatchMappings = useCallback(() => {
    const mappings: FieldMapping[] = [];
    
    // Simple 1:1 mapping between selected source and target fields
    const minLength = Math.min(selectedSourceFields.length, selectedTargetFields.length);
    
    for (let i = 0; i < minLength; i++) {
      const sourceField = sourceFields.find(f => f.path === selectedSourceFields[i]);
      const targetField = targetFields.find(f => f.path === selectedTargetFields[i]);
      
      if (sourceField && targetField) {
        mappings.push({
          id: `bulk_mapping_${Date.now()}_${i}`,
          name: `${sourceField.name}_to_${targetField.name}`,
          sourceFields: [sourceField.name],
          targetField: targetField.name,
          sourcePaths: [sourceField.path],
          targetPath: targetField.path,
          requiresTransformation: !!bulkTransformation,
          ...(bulkTransformation && {
            functionNode: {
              id: `bulk_function_${i}`,
              functionName: bulkTransformation,
              parameters: {},
              sourceConnections: { input: [sourceField.path] },
              position: { x: 0, y: 0 }
            }
          })
        });
      }
    }
    
    setPreviewMappings(mappings);
  }, [selectedSourceFields, selectedTargetFields, sourceFields, targetFields, bulkTransformation]);

  const generatePatternMappings = useCallback(() => {
    const mappings: FieldMapping[] = [];
    
    // Pattern-based matching
    if (namePattern) {
      sourceFields.forEach(sourceField => {
        // Simple pattern matching - find target field with similar name
        const regex = new RegExp(namePattern.replace('{fieldName}', '(.*)'), 'i');
        const match = sourceField.name.match(regex);
        
        if (match) {
          const baseName = match[1] || sourceField.name;
          const targetField = targetFields.find(tf => 
            tf.name.toLowerCase().includes(baseName.toLowerCase()) ||
            tf.name.toLowerCase() === baseName.toLowerCase()
          );
          
          if (targetField) {
            mappings.push({
              id: `pattern_mapping_${Date.now()}_${sourceField.id}`,
              name: `pattern_${sourceField.name}_to_${targetField.name}`,
              sourceFields: [sourceField.name],
              targetField: targetField.name,
              sourcePaths: [sourceField.path],
              targetPath: targetField.path,
              requiresTransformation: false
            });
          }
        }
      });
    }
    
    setPreviewMappings(mappings);
  }, [namePattern, sourceFields, targetFields]);

  const applyTemplate = useCallback((templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (!template) return;

    const mappings: FieldMapping[] = [];
    
    template.patterns.forEach(pattern => {
      sourceFields.forEach(sourceField => {
        // Simple template matching
        if (pattern.sourcePattern.includes('{fieldName}')) {
          const targetFieldName = pattern.targetPattern.replace('{fieldName}', sourceField.name);
          const targetField = targetFields.find(tf => tf.name === targetFieldName);
          
          if (targetField) {
            mappings.push({
              id: `template_mapping_${Date.now()}_${sourceField.id}`,
              name: `template_${sourceField.name}_to_${targetField.name}`,
              sourceFields: [sourceField.name],
              targetField: targetField.name,
              sourcePaths: [sourceField.path],
              targetPath: targetField.path,
              requiresTransformation: !!pattern.transformation,
              ...(pattern.transformation && {
                functionNode: {
                  id: `template_function_${sourceField.id}`,
                  functionName: pattern.transformation,
                  parameters: {},
                  sourceConnections: { input: [sourceField.path] },
                  position: { x: 0, y: 0 }
                }
              })
            });
          }
        }
      });
    });
    
    setPreviewMappings(mappings);
  }, [sourceFields, targetFields]);

  const importMappings = useCallback(() => {
    try {
      // Support CSV format: source_field,target_field,transformation
      const lines = importData.split('\n').filter(line => line.trim());
      const mappings: FieldMapping[] = [];
      
      lines.forEach((line, index) => {
        const [sourceName, targetName, transformation] = line.split(',').map(s => s.trim());
        
        if (sourceName && targetName) {
          const sourceField = sourceFields.find(f => f.name === sourceName || f.path === sourceName);
          const targetField = targetFields.find(f => f.name === targetName || f.path === targetName);
          
          if (sourceField && targetField) {
            mappings.push({
              id: `import_mapping_${Date.now()}_${index}`,
              name: `import_${sourceField.name}_to_${targetField.name}`,
              sourceFields: [sourceField.name],
              targetField: targetField.name,
              sourcePaths: [sourceField.path],
              targetPath: targetField.path,
              requiresTransformation: !!transformation,
              ...(transformation && {
                functionNode: {
                  id: `import_function_${index}`,
                  functionName: transformation,
                  parameters: {},
                  sourceConnections: { input: [sourceField.path] },
                  position: { x: 0, y: 0 }
                }
              })
            });
          }
        }
      });
      
      setPreviewMappings(mappings);
    } catch (error) {
      console.error('Error importing mappings:', error);
    }
  }, [importData, sourceFields, targetFields]);

  const exportMappings = useCallback(() => {
    const csvData = existingMappings.map(mapping => 
      `${mapping.sourceFields.join(';')},${mapping.targetField},${mapping.functionNode?.functionName || ''}`
    ).join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'field_mappings.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [existingMappings]);

  const flattenFields = (fields: FieldNode[], prefix = ''): FieldNode[] => {
    const result: FieldNode[] = [];
    
    fields.forEach(field => {
      const fullPath = prefix ? `${prefix}.${field.name}` : field.name;
      result.push({ ...field, path: fullPath });
      
      if (field.children && field.children.length > 0) {
        result.push(...flattenFields(field.children, fullPath));
      }
    });
    
    return result;
  };

  const flatSourceFields = flattenFields(sourceFields);
  const flatTargetFields = flattenFields(targetFields);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Bulk Field Mapping Operations
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Configuration */}
          <div className="w-2/3 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="batch">Batch Mapping</TabsTrigger>
                <TabsTrigger value="pattern">Pattern Matching</TabsTrigger>
                <TabsTrigger value="template">Templates</TabsTrigger>
                <TabsTrigger value="import">Import/Export</TabsTrigger>
              </TabsList>

              <TabsContent value="batch" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Source Fields</Label>
                    <ScrollArea className="h-40 border rounded-lg p-2">
                      {flatSourceFields.map(field => (
                        <div key={field.path} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            checked={selectedSourceFields.includes(field.path)}
                            onCheckedChange={() => handleSourceFieldToggle(field.path)}
                          />
                          <span className="text-sm">{field.path}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Target Fields</Label>
                    <ScrollArea className="h-40 border rounded-lg p-2">
                      {flatTargetFields.map(field => (
                        <div key={field.path} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            checked={selectedTargetFields.includes(field.path)}
                            onCheckedChange={() => handleTargetFieldToggle(field.path)}
                          />
                          <span className="text-sm">{field.path}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bulkTransformation">Bulk Transformation Function</Label>
                  <Select value={bulkTransformation} onValueChange={setBulkTransformation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transformation (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No transformation</SelectItem>
                      {Object.entries(functionsByCategory).map(([category, functions]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                            {category}
                          </div>
                          {functions.map(func => (
                            <SelectItem key={func.name} value={func.name}>
                              {func.name} - {func.description}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateBatchMappings} className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Generate Batch Mappings
                </Button>
              </TabsContent>

              <TabsContent value="pattern" className="space-y-4">
                <div>
                  <Label htmlFor="namePattern">Name Pattern</Label>
                  <Input
                    id="namePattern"
                    value={namePattern}
                    onChange={(e) => setNamePattern(e.target.value)}
                    placeholder="e.g., {fieldName}, src_{fieldName}, {fieldName}_v2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {'{fieldName}'} as placeholder for field names
                  </p>
                </div>

                <Button onClick={generatePatternMappings} className="w-full">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Pattern Mappings
                </Button>
              </TabsContent>

              <TabsContent value="template" className="space-y-4">
                <div className="space-y-3">
                  {defaultTemplates.map(template => (
                    <div key={template.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{template.name}</h4>
                        <Button 
                          size="sm" 
                          onClick={() => applyTemplate(template.id)}
                          variant="outline"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <Label htmlFor="customTemplate">Custom Template (JSON)</Label>
                  <Textarea
                    id="customTemplate"
                    value={customTemplate}
                    onChange={(e) => setCustomTemplate(e.target.value)}
                    placeholder='{"patterns": [{"sourcePattern": "{fieldName}", "targetPattern": "{fieldName}"}]}'
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={exportMappings} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Current Mappings
                  </Button>
                </div>

                <div>
                  <Label htmlFor="importData">Import Mappings (CSV format)</Label>
                  <Textarea
                    id="importData"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="source_field,target_field,transformation&#10;name,fullName,&#10;email,emailAddress,toLowerCase"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: source_field,target_field,transformation (one per line)
                  </p>
                </div>

                <Button onClick={importMappings} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Mappings
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 border-l bg-muted/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Preview ({previewMappings.length})</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setPreviewMappings([])}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
                <Button 
                  onClick={() => {
                    onApplyBulkMappings(previewMappings);
                    onClose();
                  }}
                  disabled={previewMappings.length === 0}
                  size="sm"
                >
                  Apply All
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-2">
                {previewMappings.map((mapping, index) => (
                  <div key={mapping.id} className="border rounded-lg p-3 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Mapping {index + 1}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewMappings(prev => 
                          prev.filter(m => m.id !== mapping.id)
                        )}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div>
                        <span className="font-medium">Source:</span> {mapping.sourceFields.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Target:</span> {mapping.targetField}
                      </div>
                      {mapping.functionNode && (
                        <div>
                          <span className="font-medium">Function:</span> {mapping.functionNode.functionName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};