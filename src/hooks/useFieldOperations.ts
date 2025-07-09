import { useCallback } from 'react';
import { Field } from '@/types/dataStructures';

export const useFieldOperations = (
  field: Field,
  path: number[],
  onUpdate: (path: number[], updates: Partial<Field>) => void,
  onRemove: (path: number[]) => void,
  onAddChild: (path: number[]) => void
) => {
  const handleUpdate = useCallback((updates: Partial<Field>) => {
    onUpdate(path, updates);
  }, [path, onUpdate]);

  const handleAddChild = useCallback(() => {
    // Mark as complex type when adding children
    if (!field.isComplexType && field.type !== 'object' && field.type !== 'array') {
      onUpdate(path, { isComplexType: true });
    }
    onAddChild(path);
  }, [field.isComplexType, field.type, path, onUpdate, onAddChild]);

  const handleRemoveChild = useCallback((childPath: number[]) => {
    onRemove(childPath);
  }, [onRemove]);

  const handleUpdateChild = useCallback((childPath: number[], updates: Partial<Field>) => {
    onUpdate(childPath, updates);
  }, [onUpdate]);

  const handleAddGrandChild = useCallback((childPath: number[]) => {
    onAddChild(childPath);
  }, [onAddChild]);

  return {
    handleUpdate,
    handleAddChild,
    handleRemoveChild,
    handleUpdateChild,
    handleAddGrandChild
  };
};