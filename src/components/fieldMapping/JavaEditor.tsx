import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    
    const inputParams = mapping.sourceFields.length > 1 
      ? mapping.sourceFields.map((field, i) => `String input${i + 1}`).join(', ')
      : 'String input';
    
    const exampleReturn = mapping.sourceFields.length > 1 
      ? 'input1 + " " + input2'
      : 'input.toUpperCase()';

    return `// Example function:
public String transform(${inputParams}) {
    // Your transformation logic here
    return ${exampleReturn};
}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl animate-scale-in">
        <DialogHeader>
          <DialogTitle>Edit Java Function</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Write a custom Java function to transform the source field(s) to the target field.
            {mapping && mapping.sourceFields.length > 1 && (
              <span className="block mt-1 font-medium">
                Multiple inputs: {mapping.sourceFields.join(', ')}
              </span>
            )}
          </p>
          <Textarea
            placeholder={getPlaceholder()}
            value={javaFunction}
            onChange={(e) => onJavaFunctionChange(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              Save Function
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}