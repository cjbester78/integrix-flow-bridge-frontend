import React, { useState, useMemo } from 'react';
import { Field } from '@/types/dataStructures';
import { BusinessComponent } from '@/types/businessComponent';
import { useDataStructures } from '@/hooks/useDataStructures';
import { useToast } from '@/hooks/use-toast';
import { StructureCreationForm } from '@/components/dataStructures/StructureCreationForm';
import { BusinessComponentSelectionCard } from '@/components/dataStructures/BusinessComponentSelectionCard';
import { StructureDefinitionTabs } from '@/components/dataStructures/StructureDefinitionTabs';
import { StructureLibrary } from '@/components/dataStructures/StructureLibrary';
import { StructurePreview } from '@/components/dataStructures/StructurePreview';
import { parseJsonStructure, parseWsdlStructure, buildNestedStructure } from '@/utils/structureParsers';
import { Layers } from 'lucide-react';

export const DataStructures = () => {
  try {
    const {
      structures,
      selectedStructure,
      setSelectedStructure,
      saveStructure,
      deleteStructure,
      duplicateStructure,
      loading
    } = useDataStructures();
    
    console.log('DataStructures component rendering, structures:', structures?.length || 0, 'loading:', loading);
    const { toast } = useToast();

  // Form state
  const [structureName, setStructureName] = useState('');
  const [structureDescription, setStructureDescription] = useState('');
  const [selectedBusinessComponent, setSelectedBusinessComponent] = useState<BusinessComponent | null>(null);
  const [customFields, setCustomFields] = useState<Field[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [xsdInput, setXsdInput] = useState('');
  const [edmxInput, setEdmxInput] = useState('');
  const [wsdlInput, setWsdlInput] = useState('');
  const [selectedStructureType, setSelectedStructureType] = useState<string>('json');
  const [namespaceConfig, setNamespaceConfig] = useState({
    uri: '',
    prefix: '',
    targetNamespace: '',
    schemaLocation: ''
  });

  // Create a preview structure based on current inputs
  const previewStructure = useMemo(() => {
    if (!structureName) return null;

    let structure: any = {};
    
    if (selectedStructureType === 'json' && jsonInput) {
      structure = parseJsonStructure(jsonInput);
    } else if (selectedStructureType === 'wsdl' && wsdlInput) {
      structure = parseWsdlStructure(wsdlInput);
    } else if (selectedStructureType === 'xsd' && xsdInput) {
      structure = { message: 'XSD parsing not fully implemented yet' };
    } else if (selectedStructureType === 'edmx' && edmxInput) {
      structure = { message: 'EDMX parsing not fully implemented yet' };
    } else if (selectedStructureType === 'custom' && customFields.length > 0) {
      structure = buildNestedStructure(customFields);
    }

    if (Object.keys(structure).length === 0) return null;

    return {
      id: 'preview',
      name: structureName,
      type: selectedStructureType as 'json' | 'xsd' | 'wsdl' | 'edmx' | 'custom',
      description: structureDescription,
      structure,
      createdAt: new Date().toISOString().split('T')[0],
      usage: 'source' as 'source' | 'target', // Default to source, can be modified later
      namespace: (selectedStructureType === 'xsd' || selectedStructureType === 'wsdl' || selectedStructureType === 'edmx') && namespaceConfig.uri ? namespaceConfig : undefined
    };
  }, [structureName, structureDescription, selectedStructureType, jsonInput, xsdInput, edmxInput, wsdlInput, customFields, namespaceConfig]);

  const handleWsdlAnalyzed = (extractedName: string | null, namespaceInfo: any) => {
    if (extractedName && !structureName) {
      setStructureName(extractedName);
    }
    if (namespaceInfo) {
      setNamespaceConfig(namespaceInfo);
    }
  };

  const handleSave = async () => {
    if (!selectedBusinessComponent) {
      // Handle validation - business component is required
      toast({
        title: "Validation Error",
        description: "Please select a business component",
        variant: "destructive",
      });
      return;
    }
    
    const success = await saveStructure(
      structureName,
      structureDescription,
      'source', // Default to source
      jsonInput,
      xsdInput,
      edmxInput,
      wsdlInput,
      customFields,
      selectedStructureType,
      namespaceConfig
    );

    if (success) {
      // Reset form
      setStructureName('');
      setStructureDescription('');
      setSelectedBusinessComponent(null);
      setJsonInput('');
      setXsdInput('');
      setEdmxInput('');
      setWsdlInput('');
      setCustomFields([]);
      setNamespaceConfig({
        uri: '',
        prefix: '',
        targetNamespace: '',
        schemaLocation: ''
      });
    }
  };

  const handleResetAllFields = () => {
    setStructureName('');
    setStructureDescription('');
    setSelectedBusinessComponent(null);
    setJsonInput('');
    setXsdInput('');
    setEdmxInput('');
    setWsdlInput('');
    setCustomFields([]);
    setNamespaceConfig({
      uri: '',
      prefix: '',
      targetNamespace: '',
      schemaLocation: ''
    });
    setSelectedStructureType('json');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Layers className="h-8 w-8" />
            Data Structures
          </h1>
          <p className="text-muted-foreground">Loading data structures...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Layers className="h-8 w-8" />
          Data Structures
        </h1>
        <p className="text-muted-foreground">Define and manage data structures for source and target messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Structure Creation */}
        <div className="lg:col-span-2 space-y-6">
          <BusinessComponentSelectionCard
            selectedBusinessComponent={selectedBusinessComponent}
            setSelectedBusinessComponent={setSelectedBusinessComponent}
          />
          
          <StructureCreationForm
            structureName={structureName}
            setStructureName={setStructureName}
            structureDescription={structureDescription}
            setStructureDescription={setStructureDescription}
          />

          <StructureDefinitionTabs
            customFields={customFields}
            setCustomFields={setCustomFields}
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            xsdInput={xsdInput}
            setXsdInput={setXsdInput}
            edmxInput={edmxInput}
            setEdmxInput={setEdmxInput}
            wsdlInput={wsdlInput}
            setWsdlInput={setWsdlInput}
            selectedStructureType={selectedStructureType}
            setSelectedStructureType={setSelectedStructureType}
            namespaceConfig={namespaceConfig}
            setNamespaceConfig={setNamespaceConfig}
            onSave={handleSave}
            onWsdlAnalyzed={handleWsdlAnalyzed}
            onResetAllFields={handleResetAllFields}
          />

          {previewStructure && (
            <div className="animate-fade-in">
              <StructurePreview selectedStructure={previewStructure} />
            </div>
          )}
        </div>

        {/* Structure Library */}
        <div className="space-y-6">
          <StructureLibrary
            structures={structures || []}
            selectedStructure={selectedStructure}
            onSelectStructure={setSelectedStructure}
            onDuplicateStructure={duplicateStructure}
            onDeleteStructure={deleteStructure}
          />

          {selectedStructure && (
            <StructurePreview selectedStructure={selectedStructure} />
          )}
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error rendering DataStructures component:', error);
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Layers className="h-8 w-8" />
            Data Structures
          </h1>
          <p className="text-muted-foreground mt-4">
            There was an error loading the data structures page. Please check the browser console for details.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};