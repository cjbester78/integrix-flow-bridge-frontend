import { useState } from 'react';

export interface FieldMapping {
  id: string;
  name: string;
  sourceFields: string[];
  targetField: string;
  javaFunction?: string;
}

export interface FlowState {
  flowName: string;
  description: string;
  sourceAdapter: string;
  targetAdapter: string;
  sourceStructure: string;
  targetStructure: string;
  selectedTransformations: string[];
  isConfiguring: boolean;
  showStructurePreview: string | null;
  showFieldMapping: boolean;
  showMappingScreen: boolean;
  fieldMappings: FieldMapping[];
  selectedTargetField: string | null;
  javaFunction: string;
}

export const useFlowState = () => {
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceAdapter, setSourceAdapter] = useState('');
  const [targetAdapter, setTargetAdapter] = useState('');
  const [sourceStructure, setSourceStructure] = useState('');
  const [targetStructure, setTargetStructure] = useState('');
  const [selectedTransformations, setSelectedTransformations] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showStructurePreview, setShowStructurePreview] = useState<string | null>(null);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const [showMappingScreen, setShowMappingScreen] = useState(false);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [selectedTargetField, setSelectedTargetField] = useState<string | null>(null);
  const [javaFunction, setJavaFunction] = useState('');

  const resetForm = () => {
    setFlowName('');
    setDescription('');
    setSourceAdapter('');
    setTargetAdapter('');
    setSourceStructure('');
    setTargetStructure('');
    setSelectedTransformations([]);
    setFieldMappings([]);
    setShowFieldMapping(false);
  };

  return {
    // State values
    flowName,
    description,
    sourceAdapter,
    targetAdapter,
    sourceStructure,
    targetStructure,
    selectedTransformations,
    isConfiguring,
    showStructurePreview,
    showFieldMapping,
    showMappingScreen,
    fieldMappings,
    selectedTargetField,
    javaFunction,
    
    // Setters
    setFlowName,
    setDescription,
    setSourceAdapter,
    setTargetAdapter,
    setSourceStructure,
    setTargetStructure,
    setSelectedTransformations,
    setIsConfiguring,
    setShowStructurePreview,
    setShowFieldMapping,
    setShowMappingScreen,
    setFieldMappings,
    setSelectedTargetField,
    setJavaFunction,
    
    // Utilities
    resetForm,
  };
};