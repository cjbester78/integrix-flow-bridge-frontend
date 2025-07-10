
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';
import { FieldMapping } from './types';

interface JavaEditorProps {
  isOpen: boolean;
  onClose: () => void;
  mapping: FieldMapping | null;
  javaFunction: string;
  onJavaFunctionChange: (value: string) => void;
  onSave: () => void;
}

export function JavaEditor({ 
  isOpen, 
  onClose, 
  mapping, 
  javaFunction, 
  onJavaFunctionChange, 
  onSave 
}: JavaEditorProps) {
  const getPlaceholder = () => {
    if (!mapping) return '';
    
    const sourceCount = mapping.sourceFields.length;
    const inputParams = sourceCount > 1 
      ? mapping.sourceFields.map((field, i) => `String ${field.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`).join(', ')
      : `String ${mapping.sourceFields[0]?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') || 'input'}`;
    
    const methodName = `transformTo${mapping.targetField.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    let exampleLogic = '';
    if (sourceCount === 1) {
      exampleLogic = `    // Transform single input
    if (${mapping.sourceFields[0]?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') || 'input'} == null || ${mapping.sourceFields[0]?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') || 'input'}.isEmpty()) {
        return "";
    }
    return ${mapping.sourceFields[0]?.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') || 'input'}.toUpperCase();`;
    } else {
      const paramNames = mapping.sourceFields.map(field => field.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
      exampleLogic = `    // Combine multiple inputs
    StringBuilder result = new StringBuilder();
${paramNames.map(param => `    if (${param} != null && !${param}.isEmpty()) {
        result.append(${param}).append(" ");
    }`).join('\n')}
    return result.toString().trim();`;
    }

    return `// Transform ${mapping.sourceFields.join(' + ')} → ${mapping.targetField}
public String ${methodName}(${inputParams}) {
${exampleLogic}
}`;
  };

  const getHelpText = () => {
    if (!mapping) return '';
    
    const sourceCount = mapping.sourceFields.length;
    if (sourceCount === 1) {
      return `Single source field: ${mapping.sourceFields[0]}`;
    } else {
      return `Multiple source fields: ${mapping.sourceFields.join(', ')}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Edit Java Function
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {mapping && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Mapping:</span>
                <Badge variant="outline" className="text-xs">{getHelpText()}</Badge>
                <span className="text-sm">→</span>
                <Badge variant="secondary" className="text-xs">{mapping.targetField}</Badge>
              </div>
            </div>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Write a custom Java function to transform the source field(s) to the target field.
              The function should return a String value that will be assigned to the target field.
            </p>
            
            <Textarea
              placeholder={getPlaceholder()}
              value={javaFunction}
              onChange={(e) => onJavaFunctionChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={!javaFunction.trim()}>
              Save Function
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
