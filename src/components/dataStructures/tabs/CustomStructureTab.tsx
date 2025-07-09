import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FieldBuilder } from '@/components/FieldBuilder';
import { Field } from '@/types/dataStructures';
import { Plus, Database } from 'lucide-react';

interface CustomStructureTabProps {
  customFields: Field[];
  setCustomFields: (fields: Field[]) => void;
}

export const CustomStructureTab: React.FC<CustomStructureTabProps> = ({
  customFields,
  setCustomFields
}) => {
  const addCustomField = (parentIndex?: number) => {
    const newField: Field = {
      name: '',
      type: 'string',
      required: false,
      description: '',
      isComplexType: false,
      minOccurs: 1,
      maxOccurs: 1,
      children: []
    };

    if (parentIndex !== undefined) {
      const updated = [...customFields];
      if (!updated[parentIndex].children) {
        updated[parentIndex].children = [];
      }
      updated[parentIndex].children!.push(newField);
      setCustomFields(updated);
    } else {
      setCustomFields([...customFields, newField]);
    }
  };

  const updateCustomField = (index: number, field: Partial<Field>, parentIndex?: number) => {
    const updated = [...customFields];
    if (parentIndex !== undefined) {
      const findAndUpdate = (fields: Field[], targetParent: number, targetChild: number, updates: Partial<Field>) => {
        if (targetParent < fields.length && fields[targetParent].children) {
          if (targetChild < fields[targetParent].children!.length) {
            fields[targetParent].children![targetChild] = { ...fields[targetParent].children![targetChild], ...updates };
          }
        }
      };
      findAndUpdate(updated, parentIndex, index, field);
    } else {
      updated[index] = { ...updated[index], ...field };
    }
    setCustomFields(updated);
  };

  const removeCustomField = (index: number, parentIndex?: number) => {
    if (parentIndex !== undefined) {
      const updated = [...customFields];
      if (updated[parentIndex].children) {
        updated[parentIndex].children = updated[parentIndex].children!.filter((_, i) => i !== index);
      }
      setCustomFields(updated);
    } else {
      setCustomFields(customFields.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Structure Definition</Label>
        <Button onClick={() => addCustomField()} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Root Field
        </Button>
      </div>
      
      {customFields.map((field, index) => (
        <FieldBuilder
          key={index}
          field={field}
          index={index}
          onUpdate={(idx, updates) => updateCustomField(idx, updates)}
          onRemove={(idx) => removeCustomField(idx)}
          onAddChild={(idx) => addCustomField(idx)}
          depth={0}
        />
      ))}
      
      {customFields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No fields defined. Click "Add Root Field" to get started.</p>
        </div>
      )}
    </div>
  );
};