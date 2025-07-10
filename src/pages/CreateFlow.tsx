import { Plus } from 'lucide-react';
import { FieldMappingScreen } from '@/components/FieldMappingScreen';
import { useToast } from '@/hooks/use-toast';
import { DataStructure } from '@/types/dataStructures';
import { useFlowState } from '@/hooks/useFlowState';
import { useFlowActions } from '@/hooks/useFlowActions';
import { FlowDetailsCard } from '@/components/createFlow/FlowDetailsCard';
import { AdapterConfigurationCard } from '@/components/createFlow/AdapterConfigurationCard';
import { TransformationConfigurationCard } from '@/components/createFlow/TransformationConfigurationCard';
import { FlowActionsCard } from '@/components/createFlow/FlowActionsCard';
import { FlowSummaryCard } from '@/components/createFlow/FlowSummaryCard';
import { QuickTipsCard } from '@/components/createFlow/QuickTipsCard';
import { 
  Database,
  Globe,
  FileText,
  Mail,
  Smartphone,
  Server,
  Zap,
} from 'lucide-react';

const adapters = [
  { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
  { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
  { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
  { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' },
  { id: 'file', name: 'File System', icon: FileText, category: 'Storage' },
  { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' },
  { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' },
  { id: 'database', name: 'Database', icon: Database, category: 'Storage' },
];

const transformations = [
  { id: 'field-mapping', name: 'Field Mapping', description: 'Map fields between source and target' },
];

// Mock data structures - in a real app, this would come from your data structures API/state
const sampleStructures: DataStructure[] = [
  {
    id: '1',
    name: 'Customer Order',
    type: 'json',
    description: 'Standard customer order structure',
    structure: {
      orderId: 'string',
      customerId: 'string',
      items: 'array',
      totalAmount: 'decimal',
      orderDate: 'datetime'
    },
    createdAt: '2024-01-15',
    usage: 'source'
  },
  {
    id: '2',
    name: 'Payment Response',
    type: 'soap',
    description: 'Payment gateway response format',
    structure: {
      transactionId: 'string',
      status: 'string',
      amount: 'decimal',
      currency: 'string'
    },
    createdAt: '2024-01-10',
    usage: 'target'
  },
  {
    id: '3',
    name: 'User Profile',
    type: 'custom',
    description: 'Universal user profile structure',
    structure: {
      userId: 'string',
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      createdAt: 'datetime'
    },
    createdAt: '2024-01-12',
    usage: 'both'
  }
];

export const CreateFlow = () => {
  const flowState = useFlowState();
  const { toast } = useToast();

  const {
    flowName,
    description,
    sourceCustomer,
    targetCustomer,
    sourceAdapter,
    targetAdapter,
    sourceStructure,
    targetStructure,
    selectedTransformations,
    showFieldMapping,
    showMappingScreen,
    fieldMappings,
    selectedTargetField,
    javaFunction,
    mappingName,
    setFlowName,
    setDescription,
    setSourceCustomer,
    setTargetCustomer,
    setSourceAdapter,
    setTargetAdapter,
    setSourceStructure,
    setTargetStructure,
    setSelectedTransformations,
    setShowFieldMapping,
    setShowMappingScreen,
    setFieldMappings,
    setSelectedTargetField,
    setJavaFunction,
    setMappingName,
    resetForm,
  } = flowState;

  const { handleSaveFlow, handleTestFlow } = useFlowActions({
    flowName,
    description,
    sourceAdapter,
    targetAdapter,
    sourceStructure,
    targetStructure,
    selectedTransformations,
    fieldMappings,
    resetForm,
  });

  const handleMappingSave = (mappings: any[], newMappingName: string) => {
    const convertedMappings = mappings.map(mapping => ({
      id: mapping.id || `mapping_${Date.now()}`,
      name: mapping.name || 'Untitled Mapping',
      sourceFields: mapping.sourceFields || [],
      targetField: mapping.targetField || '',
      javaFunction: mapping.javaFunction || ''
    }));
    
    setFieldMappings(convertedMappings);
    setMappingName(newMappingName);
    setShowMappingScreen(false);
    
    toast({
      title: "Mappings Saved",
      description: `${mappings.length} field mapping(s) have been configured`,
      variant: "default",
    });
  };

  const handleAddTransformation = (transformationId: string) => {
    if (!selectedTransformations.includes(transformationId)) {
      setSelectedTransformations([...selectedTransformations, transformationId]);
      if (transformationId === 'field-mapping') {
        setShowFieldMapping(true);
      }
    }
  };

  const handleRemoveTransformation = (transformationId: string) => {
    setSelectedTransformations(selectedTransformations.filter(id => id !== transformationId));
    if (transformationId === 'field-mapping') {
      setFieldMappings([]);
      setMappingName('');
      // Keep showFieldMapping true so user can create a new mapping
    }
  };

  const handleAddMapping = () => {
    setFieldMappings([...fieldMappings, { 
      id: `mapping_${Date.now()}`,
      name: 'New Mapping',
      sourceFields: [], 
      targetField: '' 
    }]);
  };

  const handleRemoveMapping = (index: number) => {
    setFieldMappings(fieldMappings.filter((_, i) => i !== index));
  };

  const handleMappingChange = (index: number, field: 'targetField', value: string) => {
    const newMappings = [...fieldMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setFieldMappings(newMappings);
  };

  const handleAddSourceField = (mappingIndex: number, sourceField: string) => {
    const newMappings = [...fieldMappings];
    if (!newMappings[mappingIndex].sourceFields.includes(sourceField)) {
      newMappings[mappingIndex] = {
        ...newMappings[mappingIndex],
        sourceFields: [...newMappings[mappingIndex].sourceFields, sourceField]
      };
      setFieldMappings(newMappings);
    }
  };

  const handleRemoveSourceField = (mappingIndex: number, sourceFieldIndex: number) => {
    const newMappings = [...fieldMappings];
    newMappings[mappingIndex] = {
      ...newMappings[mappingIndex],
      sourceFields: newMappings[mappingIndex].sourceFields.filter((_, i) => i !== sourceFieldIndex)
    };
    setFieldMappings(newMappings);
  };

  const handleTargetFieldSelect = (fieldPath: string, mappingIndex: number) => {
    setSelectedTargetField(fieldPath);
    setJavaFunction(fieldMappings[mappingIndex]?.javaFunction || '');
  };

  const handleSaveJavaFunction = () => {
    if (selectedTargetField) {
      const mappingIndex = fieldMappings.findIndex(m => m.targetField === selectedTargetField);
      if (mappingIndex >= 0) {
        const newMappings = [...fieldMappings];
        newMappings[mappingIndex] = { ...newMappings[mappingIndex], javaFunction };
        setFieldMappings(newMappings);
      }
    }
    setSelectedTargetField(null);
    setJavaFunction('');
  };

  return (
    <>
      {showMappingScreen && (
        <FieldMappingScreen 
          onClose={() => setShowMappingScreen(false)}
          onSave={handleMappingSave}
          initialMappingName={mappingName}
        />
      )}
      
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Plus className="h-8 w-8" />
            Create Integration Flow
          </h1>
          <p className="text-muted-foreground">Design and configure a new message integration flow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FlowDetailsCard
              flowName={flowName}
              description={description}
              onFlowNameChange={setFlowName}
              onDescriptionChange={setDescription}
            />

            <AdapterConfigurationCard
              adapters={adapters}
              sourceCustomer={sourceCustomer}
              targetCustomer={targetCustomer}
              sourceAdapter={sourceAdapter}
              targetAdapter={targetAdapter}
              onSourceCustomerChange={setSourceCustomer}
              onTargetCustomerChange={setTargetCustomer}
              onSourceAdapterChange={setSourceAdapter}
              onTargetAdapterChange={setTargetAdapter}
            />

            <TransformationConfigurationCard
              transformations={transformations}
              selectedTransformations={selectedTransformations}
              showFieldMapping={showFieldMapping}
              sourceCustomer={sourceCustomer}
              targetCustomer={targetCustomer}
              sourceStructure={sourceStructure}
              targetStructure={targetStructure}
              fieldMappings={fieldMappings}
              selectedTargetField={selectedTargetField}
              javaFunction={javaFunction}
              mappingName={mappingName}
              sampleStructures={sampleStructures}
              onAddTransformation={handleAddTransformation}
              onRemoveTransformation={handleRemoveTransformation}
              onShowMappingScreen={() => setShowMappingScreen(true)}
              onSourceStructureChange={setSourceStructure}
              onTargetStructureChange={setTargetStructure}
              onAddMapping={handleAddMapping}
              onRemoveMapping={handleRemoveMapping}
              onMappingChange={handleMappingChange}
              onAddSourceField={handleAddSourceField}
              onRemoveSourceField={handleRemoveSourceField}
              onTargetFieldSelect={handleTargetFieldSelect}
              onJavaFunctionChange={setJavaFunction}
              onSaveJavaFunction={handleSaveJavaFunction}
              onCloseJavaEditor={() => setSelectedTargetField(null)}
            />
          </div>

          <div className="space-y-6">
            <FlowActionsCard
              onTestFlow={handleTestFlow}
              onSaveFlow={handleSaveFlow}
            />

            <FlowSummaryCard
              sourceAdapter={sourceAdapter}
              targetAdapter={targetAdapter}
              sourceStructure={sourceStructure}
              targetStructure={targetStructure}
              selectedTransformations={selectedTransformations}
              adapters={adapters}
              sampleStructures={sampleStructures}
            />

            <QuickTipsCard />
          </div>
        </div>
      </div>
    </>
  );
};
