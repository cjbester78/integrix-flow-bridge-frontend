import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field } from '@/types/dataStructures';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const fieldTypes = [
  'string', 'number', 'boolean', 'date', 'datetime', 
  'object', 'array', 'integer', 'decimal', 'email', 'url'
];

interface FieldBuilderProps {
  field: Field;
  index: number;
  onUpdate: (path: number[], updates: Partial<Field>) => void;
  onRemove: (path: number[]) => void;
  onAddChild: (path: number[]) => void;
  depth: number;
  path: number[];
}

export const FieldBuilder: React.FC<FieldBuilderProps> = ({
  field,
  index,
  onUpdate,
  onRemove,
  onAddChild,
  depth,
  path
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const hasChildren = field.children && field.children.length > 0;
  const canHaveChildren = field.isComplexType || field.type === 'object' || field.type === 'array';

  const handleUpdate = (updates: Partial<Field>) => {
    onUpdate(path, updates);
  };

  const handleAddChild = () => {
    // Mark as complex type when adding children
    if (!field.isComplexType && field.type !== 'object' && field.type !== 'array') {
      onUpdate(path, { isComplexType: true });
    }
    onAddChild(path);
  };

  const handleRemoveChild = (childPath: number[]) => {
    onRemove(childPath);
  };

  const handleUpdateChild = (childPath: number[], updates: Partial<Field>) => {
    onUpdate(childPath, updates);
  };

  const handleAddGrandChild = (childPath: number[]) => {
    onAddChild(childPath);
  };

  return (
    <div className={`space-y-3 p-4 border rounded-lg ${depth > 0 ? 'ml-6 border-l-2 border-l-primary/30' : ''}`}>
      <div className="space-y-3">
        {/* Main Field Configuration */}
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-1 flex items-center">
            {canHaveChildren && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}
          </div>
          <div className="col-span-3">
            <Label className="text-xs">Field Name</Label>
            <Input
              placeholder="fieldName"
              value={field.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              className="text-sm"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Type</Label>
            <Select value={field.type} onValueChange={(value) => handleUpdate({ type: value })}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            <Label className="text-xs">Description</Label>
            <Input
              placeholder="Field description..."
              value={field.description || ''}
              onChange={(e) => handleUpdate({ description: e.target.value })}
              className="text-sm"
            />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleUpdate({ required: e.target.checked })}
                className="rounded"
              />
              <span>Required</span>
            </label>
          </div>
          <div className="col-span-1">
            <Button
              onClick={() => onRemove(path)}
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive h-6 w-6 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Advanced Options */}
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-1"></div>
          <div className="col-span-2">
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={field.isComplexType || false}
                onChange={(e) => handleUpdate({ isComplexType: e.target.checked })}
                className="rounded"
              />
              <span>Complex Type</span>
            </label>
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Min Occurs</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={field.minOccurs || 0}
              onChange={(e) => handleUpdate({ minOccurs: parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
          <div className="col-span-3">
            <Label className="text-xs">Max Occurs</Label>
            <Select 
              value={field.maxOccurs?.toString() || '1'} 
              onValueChange={(value) => handleUpdate({ maxOccurs: value === 'unbounded' ? 'unbounded' : parseInt(value) })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="unbounded">Unbounded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            {canHaveChildren && (
              <Button
                onClick={handleAddChild}
                size="sm"
                variant="outline"
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Child
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Child Fields */}
      {canHaveChildren && isExpanded && hasChildren && (
        <div className="space-y-3 pl-4 border-l border-border/50">
          <Label className="text-xs text-muted-foreground">Child Fields:</Label>
          {field.children!.map((childField, childIndex) => (
            <FieldBuilder
              key={childIndex}
              field={childField}
              index={childIndex}
              onUpdate={handleUpdateChild}
              onRemove={handleRemoveChild}
              onAddChild={handleAddGrandChild}
              depth={depth + 1}
              path={[...path, childIndex]}
            />
          ))}
        </div>
      )}
    </div>
  );
};