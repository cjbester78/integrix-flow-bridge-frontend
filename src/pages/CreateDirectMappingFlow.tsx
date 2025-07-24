import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { FlowDetailsCard } from '@/components/createFlow/FlowDetailsCard';
import { AdapterConfigurationCard } from '@/components/createFlow/AdapterConfigurationCard';
import { FlowActionsCard } from '@/components/createFlow/FlowActionsCard';
import { FieldMappingScreen } from '@/components/FieldMappingScreen';
import { Database, Server, Globe, Mail, FileText, Zap, Code, Settings } from 'lucide-react';

// Mock adapter data - you might want to move this to a service or hook
const mockAdapters = [
  { id: 'jdbc-receiver', name: 'JDBC Receiver', icon: Database, category: 'Database' },
  { id: 'jdbc-sender', name: 'JDBC Sender', icon: Database, category: 'Database' },
  { id: 'http-receiver', name: 'HTTP Receiver', icon: Globe, category: 'Web Service' },
  { id: 'http-sender', name: 'HTTP Sender', icon: Globe, category: 'Web Service' },
  { id: 'rest-receiver', name: 'REST Receiver', icon: Server, category: 'Web Service' },
  { id: 'rest-sender', name: 'REST Sender', icon: Server, category: 'Web Service' },
  { id: 'soap-receiver', name: 'SOAP Receiver', icon: Code, category: 'Web Service' },
  { id: 'soap-sender', name: 'SOAP Sender', icon: Code, category: 'Web Service' },
  { id: 'mail-receiver', name: 'Mail Receiver', icon: Mail, category: 'Communication' },
  { id: 'mail-sender', name: 'Mail Sender', icon: Mail, category: 'Communication' },
  { id: 'file-adapter', name: 'File Adapter', icon: FileText, category: 'File' },
  { id: 'ftp-adapter', name: 'FTP Adapter', icon: Settings, category: 'File' },
  { id: 'sftp-adapter', name: 'SFTP Adapter', icon: Settings, category: 'File' },
];

export function CreateDirectMappingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('details');
  
  // Flow state
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceBusinessComponent, setSourceBusinessComponent] = useState('');
  const [targetBusinessComponent, setTargetBusinessComponent] = useState('');
  const [sourceAdapter, setSourceAdapter] = useState('');
  const [targetAdapter, setTargetAdapter] = useState('');
  const [sourceAdapterActive, setSourceAdapterActive] = useState(true);
  const [targetAdapterActive, setTargetAdapterActive] = useState(true);

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSave = (mappings?: any[], mappingName?: string) => {
    console.log('Saving direct mapping flow:', { 
      flowName, 
      description, 
      sourceBusinessComponent, 
      targetBusinessComponent, 
      sourceAdapter, 
      targetAdapter,
      mappings, 
      mappingName 
    });
    navigate('/dashboard');
  };

  const handleTestFlow = () => {
    console.log('Testing flow...');
  };

  const canProceedToAdapters = flowName.trim() !== '';
  const canProceedToMapping = sourceBusinessComponent && targetBusinessComponent && sourceAdapter && targetAdapter;

  const steps = [
    { id: 'details', label: 'Flow Details', completed: canProceedToAdapters },
    { id: 'adapters', label: 'Adapters', completed: canProceedToMapping },
    { id: 'mapping', label: 'Field Mapping', completed: false },
  ];

  if (currentStep === 'mapping') {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentStep('adapters')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Adapters
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Field Mapping - {flowName}</h1>
                <p className="text-muted-foreground">
                  Map fields between {sourceAdapter} and {targetAdapter}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <FieldMappingScreen
          onClose={handleClose}
          onSave={handleSave}
          initialMappingName={flowName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Create Direct Mapping Flow</h1>
              <p className="text-muted-foreground">
                Create a point-to-point integration flow with field mapping
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  step.id === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : step.completed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="flex items-center justify-center w-4 h-4 text-sm font-medium rounded-full bg-current bg-opacity-20">
                      {index + 1}
                    </span>
                  )}
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={currentStep} onValueChange={setCurrentStep}>
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FlowDetailsCard
                  flowName={flowName}
                  description={description}
                  onFlowNameChange={setFlowName}
                  onDescriptionChange={setDescription}
                />
              </div>
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Complete the flow details to continue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setCurrentStep('adapters')}
                      disabled={!canProceedToAdapters}
                      className="w-full"
                    >
                      Configure Adapters
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adapters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdapterConfigurationCard
                  adapters={mockAdapters}
                  sourceBusinessComponent={sourceBusinessComponent}
                  targetBusinessComponent={targetBusinessComponent}
                  sourceAdapter={sourceAdapter}
                  targetAdapter={targetAdapter}
                  sourceAdapterActive={sourceAdapterActive}
                  targetAdapterActive={targetAdapterActive}
                  onSourceBusinessComponentChange={setSourceBusinessComponent}
                  onTargetBusinessComponentChange={setTargetBusinessComponent}
                  onSourceAdapterChange={setSourceAdapter}
                  onTargetAdapterChange={setTargetAdapter}
                  onSourceAdapterActiveChange={setSourceAdapterActive}
                  onTargetAdapterActiveChange={setTargetAdapterActive}
                />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Navigation</CardTitle>
                    <CardDescription>Move between flow configuration steps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setCurrentStep('details')}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Details
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep('mapping')}
                      disabled={!canProceedToMapping}
                      className="w-full"
                    >
                      Configure Mapping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
                <FlowActionsCard
                  onTestFlow={handleTestFlow}
                  onSaveFlow={() => handleSave()}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}