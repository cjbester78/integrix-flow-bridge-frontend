import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { FlowActionsCard } from '@/components/createFlow/FlowActionsCard';
import { FlowSummaryCard } from '@/components/createFlow/FlowSummaryCard';
import { QuickTipsCard } from '@/components/createFlow/QuickTipsCard';
import { FieldMappingScreen } from '@/components/FieldMappingScreen';
import { Database, Server, Globe, Mail, FileText, Code } from 'lucide-react';
import { businessComponentService } from '@/services/businessComponentService';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Adapter icon mapping
const getAdapterIcon = (type: string) => {
  const typeUpper = type.toUpperCase();
  if (typeUpper.includes('JDBC')) return Database;
  if (typeUpper.includes('HTTP') || typeUpper.includes('REST')) return Globe;
  if (typeUpper.includes('SOAP')) return Code;
  if (typeUpper.includes('MAIL')) return Mail;
  if (typeUpper.includes('FILE') || typeUpper.includes('FTP')) return FileText;
  return Server;
};

export function CreateDirectMappingFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  
  // Flow state
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [sourceBusinessComponent, setSourceBusinessComponent] = useState('');
  const [targetBusinessComponent, setTargetBusinessComponent] = useState('');
  const [sourceAdapter, setSourceAdapter] = useState('');
  const [targetAdapter, setTargetAdapter] = useState('');
  const [sourceStructure, setSourceStructure] = useState('');
  const [targetStructure, setTargetStructure] = useState('');
  
  // Data state
  const [businessComponents, setBusinessComponents] = useState<any[]>([]);
  const [adapters, setAdapters] = useState<any[]>([]);
  const [dataStructures, setDataStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Load data on component mount
  useEffect(() => {
    loadComponentData();
  }, []);
  
  const loadComponentData = async () => {
    try {
      setLoading(true);
      
      // Load business components
      const businessResult = await businessComponentService.getAllBusinessComponents();
      if (businessResult.success && businessResult.data) {
        setBusinessComponents(businessResult.data);
      }
      
      // Load adapters
      try {
        const adaptersResponse = await api.get('/adapters');
        if (adaptersResponse.data) {
          setAdapters(adaptersResponse.data);
        }
      } catch (error) {
        console.warn('Could not load adapters:', error);
        setAdapters([]);
      }
      
      // Load data structures
      try {
        const structuresResponse = await api.get('/structures');
        if (structuresResponse.data) {
          setDataStructures(structuresResponse.data);
        }
      } catch (error) {
        console.warn('Could not load data structures:', error);
        setDataStructures([]);
      }
      
    } catch (error) {
      console.error('Error loading component data:', error);
      toast({
        title: "Error",
        description: "Failed to load component data. Some features may not work properly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSave = async (mappings?: any[], mappingName?: string) => {
    if (!flowName.trim()) {
      toast({
        title: "Validation Error",
        description: "Flow name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!sourceAdapter || !targetAdapter) {
      toast({
        title: "Validation Error", 
        description: "Both source and target adapters are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Prepare the direct mapping flow request
      const flowRequest = {
        flowName: flowName.trim(),
        description: description.trim(),
        sourceBusinessComponentId: sourceBusinessComponent || null,
        targetBusinessComponentId: targetBusinessComponent || null,
        sourceAdapterId: sourceAdapter,
        targetAdapterId: targetAdapter,
        sourceStructureId: sourceStructure || null,
        targetStructureId: targetStructure || null,
        createdBy: 'current-user', // TODO: Get from auth context
        fieldMappings: mappings || []
      };

      // Save the complete flow using the flow composition API
      const response = await api.post('/flow-composition/direct-mapping', flowRequest);
      
      if (response.data) {
        toast({
          title: "Success",
          description: `Integration flow "${flowName}" has been created successfully.`,
        });
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Error saving flow:', error);
      toast({
        title: "Save Failed",
        description: error.response?.data?.message || "Failed to save the integration flow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestFlow = async () => {
    if (!sourceAdapter || !targetAdapter) {
      toast({
        title: "Validation Error",
        description: "Both source and target adapters are required for testing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate the flow configuration before testing
      const validationRequest = {
        flowName: flowName.trim() || 'Test Flow',
        sourceAdapterId: sourceAdapter,
        targetAdapterId: targetAdapter,
        sourceBusinessComponentId: sourceBusinessComponent || null,
        targetBusinessComponentId: targetBusinessComponent || null
      };

      const response = await api.post('/flow-composition/validate/direct-mapping', validationRequest);
      
      if (response.data?.valid) {
        toast({
          title: "Validation Passed",
          description: "Flow configuration is valid and ready for execution.",
        });
      } else {
        const errors = response.data?.errors?.join(', ') || 'Unknown validation errors';
        toast({
          title: "Validation Failed",
          description: errors,
          variant: "destructive",
        });
      }
      
    } catch (error: any) {
      console.error('Error testing flow:', error);
      toast({
        title: "Test Failed",
        description: error.response?.data?.message || "Failed to test the flow configuration.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMapping = () => {
    setShowFieldMapping(true);
  };

  if (showFieldMapping) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFieldMapping(false)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Flow Configuration
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
          sourceAdapterType={sourceAdapter}
          targetAdapterType={targetAdapter}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4">
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
              <h1 className="text-2xl font-bold tracking-tight">Create Integration Flow</h1>
              <p className="text-muted-foreground">
                Design and configure a new message integration flow
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Flow Details */}
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Flow Details</CardTitle>
                <CardDescription>Configure the basic information for your integration flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flowName">Flow Name *</Label>
                  <Input
                    id="flowName"
                    placeholder="e.g., Customer Data Sync"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.01]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this integration flow does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.01]"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Source & Target Configuration */}
            <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Source & Target Configuration</CardTitle>
                <CardDescription>Select the source and target systems for your integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Source Configuration */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Source</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Source Business Component *</Label>
                        <Select value={sourceBusinessComponent} onValueChange={setSourceBusinessComponent} disabled={loading}>
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading..." : "Select source business component"} />
                          </SelectTrigger>
                          <SelectContent>
                            {businessComponents.map((component) => (
                              <SelectItem key={component.id} value={component.id}>
                                {component.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Source Adapter *</Label>
                        <Select value={sourceAdapter} onValueChange={setSourceAdapter} disabled={loading}>
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading..." : "Select source system"} />
                          </SelectTrigger>
                          <SelectContent>
                            {adapters.map((adapter) => {
                              const Icon = getAdapterIcon(adapter.type || adapter.name);
                              return (
                                <SelectItem key={adapter.name} value={adapter.name}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {adapter.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Target Configuration */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Target</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Target Business Component *</Label>
                        <Select value={targetBusinessComponent} onValueChange={setTargetBusinessComponent} disabled={loading}>
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading..." : "Select target business component"} />
                          </SelectTrigger>
                          <SelectContent>
                            {businessComponents.map((component) => (
                              <SelectItem key={component.id} value={component.id}>
                                {component.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Target Adapter *</Label>
                        <Select value={targetAdapter} onValueChange={setTargetAdapter} disabled={loading}>
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading..." : "Select target system"} />
                          </SelectTrigger>
                          <SelectContent>
                            {adapters.map((adapter) => {
                              const Icon = getAdapterIcon(adapter.type || adapter.name);
                              return (
                                <SelectItem key={adapter.name} value={adapter.name}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {adapter.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Transformations */}
            <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Data Transformations</CardTitle>
                <CardDescription>Configure how data should be transformed during the flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <SettingsIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Configure data transformations with field mapping</p>
                    <p className="text-sm text-muted-foreground">
                      Field mapping allows you to connect source and target fields with custom logic.
                    </p>
                    <p className="text-sm text-orange-600">
                      Please select both source and target business components AND their corresponding adapters above to enable mapping.
                    </p>
                  </div>
                  <Button 
                    onClick={handleCreateMapping}
                    disabled={!sourceBusinessComponent || !targetBusinessComponent || !sourceAdapter || !targetAdapter}
                    className="mt-4"
                  >
                    Create Mapping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FlowActionsCard
              onTestFlow={handleTestFlow}
              onSaveFlow={() => handleSave()}
              isLoading={saving}
              disabled={loading || !flowName.trim() || !sourceAdapter || !targetAdapter}
            />
            
            <FlowSummaryCard
              sourceAdapter={sourceAdapter}
              targetAdapter={targetAdapter}
              sourceStructure={sourceStructure}
              targetStructure={targetStructure}
              selectedTransformations={[]}
              adapters={adapters.map(adapter => ({
                id: adapter.name,
                name: adapter.name,
                icon: getAdapterIcon(adapter.type || adapter.name),
                category: adapter.type || 'General'
              }))}
              sampleStructures={dataStructures}
            />
            
            <QuickTipsCard />
            
            {loading && (
              <Card>
                <CardContent className="flex items-center justify-center py-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading component data...
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}