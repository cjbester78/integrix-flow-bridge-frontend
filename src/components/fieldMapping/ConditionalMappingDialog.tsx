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
import { Plus, X, GitBranch, Code, Zap, Filter } from 'lucide-react';
import { FieldNode, FieldMapping } from './types';
import { functionsByCategory } from '@/services/transformationFunctions';

interface ConditionalRule {
  id: string;
  condition: {
    sourceField: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'greater' | 'less' | 'isEmpty' | 'isNotEmpty';
    value: string;
  };
  action: {
    type: 'map' | 'transform' | 'skip' | 'default';
    targetField?: string;
    transformation?: string;
    defaultValue?: string;
  };
}

interface ConditionalMappingDialogProps {
  open: boolean;
  onClose: () => void;
  sourceFields: FieldNode[];
  targetFields: FieldNode[];
  onApplyConditionalMapping: (mapping: FieldMapping) => void;
}

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' },
  { value: 'greater', label: 'Greater Than' },
  { value: 'less', label: 'Less Than' },
  { value: 'isEmpty', label: 'Is Empty' },
  { value: 'isNotEmpty', label: 'Is Not Empty' }
];

export const ConditionalMappingDialog: React.FC<ConditionalMappingDialogProps> = ({
  open,
  onClose,
  sourceFields,
  targetFields,
  onApplyConditionalMapping
}) => {
  const [mappingName, setMappingName] = useState('');
  const [primarySourceField, setPrimarySourceField] = useState('');
  const [primaryTargetField, setPrimaryTargetField] = useState('');
  const [rules, setRules] = useState<ConditionalRule[]>([]);
  const [defaultAction, setDefaultAction] = useState<'skip' | 'map' | 'default'>('skip');
  const [defaultValue, setDefaultValue] = useState('');
  const [customJavaCode, setCustomJavaCode] = useState('');
  const [useCustomCode, setUseCustomCode] = useState(false);

  const addRule = useCallback(() => {
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      condition: {
        sourceField: primarySourceField || '',
        operator: 'equals',
        value: ''
      },
      action: {
        type: 'map',
        targetField: primaryTargetField || ''
      }
    };
    
    setRules(prev => [...prev, newRule]);
  }, [primarySourceField, primaryTargetField]);

  const updateRule = useCallback((ruleId: string, updates: Partial<ConditionalRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  }, []);

  const removeRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  }, []);

  const generateJavaCode = useCallback(() => {
    if (rules.length === 0) return '';

    const sourceFieldVar = primarySourceField ? `sourceData.get("${primarySourceField}")` : 'sourceValue';
    let javaCode = `// Conditional mapping for ${mappingName || 'field mapping'}\n`;
    javaCode += `Object sourceValue = ${sourceFieldVar};\n`;
    javaCode += `String sourceStr = sourceValue != null ? sourceValue.toString() : "";\n\n`;

    rules.forEach((rule, index) => {
      const ifKeyword = index === 0 ? 'if' : 'else if';
      let condition = '';

      switch (rule.condition.operator) {
        case 'equals':
          condition = `sourceStr.equals("${rule.condition.value}")`;
          break;
        case 'notEquals':
          condition = `!sourceStr.equals("${rule.condition.value}")`;
          break;
        case 'contains':
          condition = `sourceStr.contains("${rule.condition.value}")`;
          break;
        case 'startsWith':
          condition = `sourceStr.startsWith("${rule.condition.value}")`;
          break;
        case 'endsWith':
          condition = `sourceStr.endsWith("${rule.condition.value}")`;
          break;
        case 'greater':
          condition = `Double.parseDouble(sourceStr) > ${rule.condition.value}`;
          break;
        case 'less':
          condition = `Double.parseDouble(sourceStr) < ${rule.condition.value}`;
          break;
        case 'isEmpty':
          condition = `sourceStr.isEmpty()`;
          break;
        case 'isNotEmpty':
          condition = `!sourceStr.isEmpty()`;
          break;
      }

      javaCode += `${ifKeyword} (${condition}) {\n`;
      
      switch (rule.action.type) {
        case 'map':
          javaCode += `    return sourceValue;\n`;
          break;
        case 'transform':
          javaCode += `    return ${rule.action.transformation}(sourceValue);\n`;
          break;
        case 'default':
          javaCode += `    return "${rule.action.defaultValue || ''}";\n`;
          break;
        case 'skip':
          javaCode += `    return null; // Skip this field\n`;
          break;
      }
      
      javaCode += `}\n`;
    });

    // Default action
    javaCode += `else {\n`;
    switch (defaultAction) {
      case 'map':
        javaCode += `    return sourceValue;\n`;
        break;
      case 'default':
        javaCode += `    return "${defaultValue}";\n`;
        break;
      case 'skip':
        javaCode += `    return null; // Skip by default\n`;
        break;
    }
    javaCode += `}\n`;

    return javaCode;
  }, [rules, primarySourceField, mappingName, defaultAction, defaultValue]);

  const handleApply = useCallback(() => {
    if (!primarySourceField || !primaryTargetField || !mappingName) return;

    const sourceField = sourceFields.find(f => f.path === primarySourceField);
    const targetField = targetFields.find(f => f.path === primaryTargetField);

    if (!sourceField || !targetField) return;

    const javaCode = useCustomCode ? customJavaCode : generateJavaCode();

    const mapping: FieldMapping = {
      id: `conditional_mapping_${Date.now()}`,
      name: mappingName,
      sourceFields: [sourceField.name],
      targetField: targetField.name,
      sourcePaths: [sourceField.path],
      targetPath: targetField.path,
      requiresTransformation: true,
      functionNode: {
        id: `conditional_function_${Date.now()}`,
        functionName: 'conditional_logic',
        parameters: {
          javaCode,
          rules: JSON.stringify(rules),
          defaultAction,
          defaultValue
        },
        sourceConnections: { input: [sourceField.path] },
        position: { x: 0, y: 0 }
      }
    };

    onApplyConditionalMapping(mapping);
    onClose();
  }, [
    primarySourceField, 
    primaryTargetField, 
    mappingName, 
    sourceFields, 
    targetFields,
    useCustomCode,
    customJavaCode,
    generateJavaCode,
    rules,
    defaultAction,
    defaultValue,
    onApplyConditionalMapping,
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
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Conditional Field Mapping
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
                    placeholder="Enter mapping name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Source Field</Label>
                    <Select value={primarySourceField} onValueChange={setPrimarySourceField}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source field" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceFieldOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Target Field</Label>
                    <Select value={primaryTargetField} onValueChange={setPrimaryTargetField}>
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
                </div>
              </CardContent>
            </Card>

            {/* Conditional Rules */}
            <Card className="mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Conditional Rules</CardTitle>
                  <Button onClick={addRule} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rules.map((rule, index) => (
                    <div key={rule.id} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">Rule {index + 1}</Badge>
                        <Button 
                          onClick={() => removeRule(rule.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <Label className="text-xs">Field</Label>
                          <Select 
                            value={rule.condition.sourceField} 
                            onValueChange={(value) => updateRule(rule.id, {
                              condition: { ...rule.condition, sourceField: value }
                            })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {sourceFieldOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Operator</Label>
                          <Select 
                            value={rule.condition.operator} 
                            onValueChange={(value: any) => updateRule(rule.id, {
                              condition: { ...rule.condition, operator: value }
                            })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map(op => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Value</Label>
                          <Input 
                            className="h-8"
                            value={rule.condition.value}
                            onChange={(e) => updateRule(rule.id, {
                              condition: { ...rule.condition, value: e.target.value }
                            })}
                            placeholder="Condition value"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Action</Label>
                          <Select 
                            value={rule.action.type} 
                            onValueChange={(value: any) => updateRule(rule.id, {
                              action: { ...rule.action, type: value }
                            })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="map">Map Value</SelectItem>
                              <SelectItem value="transform">Transform</SelectItem>
                              <SelectItem value="default">Set Default</SelectItem>
                              <SelectItem value="skip">Skip Field</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {rule.action.type === 'transform' && (
                          <div>
                            <Label className="text-xs">Function</Label>
                            <Select 
                              value={rule.action.transformation || ''} 
                              onValueChange={(value) => updateRule(rule.id, {
                                action: { ...rule.action, transformation: value }
                              })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(functionsByCategory).map(([category, functions]) => (
                                  <div key={category}>
                                    {functions.map(func => (
                                      <SelectItem key={func.name} value={func.name}>
                                        {func.name}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {rule.action.type === 'default' && (
                          <div>
                            <Label className="text-xs">Default Value</Label>
                            <Input 
                              className="h-8"
                              value={rule.action.defaultValue || ''}
                              onChange={(e) => updateRule(rule.id, {
                                action: { ...rule.action, defaultValue: e.target.value }
                              })}
                              placeholder="Default value"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Default Action */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Default Action (when no rules match)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Action</Label>
                    <Select value={defaultAction} onValueChange={(value) => setDefaultAction(value as 'skip' | 'map' | 'default')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="map">Map Value</SelectItem>
                        <SelectItem value="default">Set Default Value</SelectItem>
                        <SelectItem value="skip">Skip Field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {defaultAction === 'default' && (
                    <div>
                      <Label>Default Value</Label>
                      <Input 
                        value={defaultValue}
                        onChange={(e) => setDefaultValue(e.target.value)}
                        placeholder="Enter default value"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Custom Java Code */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Advanced: Custom Java Code</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setUseCustomCode(!useCustomCode)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    {useCustomCode ? 'Use Rules' : 'Use Custom Code'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={useCustomCode ? customJavaCode : generateJavaCode()}
                  onChange={(e) => setCustomJavaCode(e.target.value)}
                  placeholder="Enter custom Java code for conditional logic"
                  rows={8}
                  className="font-mono text-xs"
                  readOnly={!useCustomCode}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/3 border-l bg-muted/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Preview</h3>
              <Button 
                onClick={handleApply}
                disabled={!primarySourceField || !primaryTargetField || !mappingName}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Apply Mapping
              </Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium">Mapping:</span> {mappingName || 'Unnamed'}
                    </div>
                    <div>
                      <span className="font-medium">Source:</span> {primarySourceField || 'Not selected'}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {primaryTargetField || 'Not selected'}
                    </div>
                    <div>
                      <span className="font-medium">Rules:</span> {rules.length}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Logic Flow</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 text-xs">
                    {rules.map((rule, index) => (
                      <div key={rule.id} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {index === 0 ? 'If' : 'Else If'}
                        </Badge>
                        <span>{rule.condition.sourceField} {rule.condition.operator} "{rule.condition.value}"</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                      <Badge variant="secondary" className="text-xs">Else</Badge>
                      <span>{defaultAction === 'skip' ? 'Skip field' : defaultAction === 'default' ? `Set to "${defaultValue}"` : 'Map value'}</span>
                    </div>
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