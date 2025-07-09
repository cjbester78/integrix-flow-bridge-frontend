import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { JsonStructureTab } from './tabs/JsonStructureTab';
import { XsdStructureTab } from './tabs/XsdStructureTab';
import { WsdlStructureTab } from './tabs/WsdlStructureTab';
import { CustomStructureTab } from './tabs/CustomStructureTab';
import { Field } from '@/types/dataStructures';
import { Save } from 'lucide-react';

interface StructureDefinitionTabsProps {
  customFields: Field[];
  setCustomFields: (fields: Field[]) => void;
  jsonInput: string;
  setJsonInput: (input: string) => void;
  xsdInput: string;
  setXsdInput: (input: string) => void;
  wsdlInput: string;
  setWsdlInput: (input: string) => void;
  selectedStructureType: string;
  setSelectedStructureType: (type: string) => void;
  namespaceConfig: any;
  setNamespaceConfig: (config: any) => void;
  onSave: () => void;
}

export const StructureDefinitionTabs: React.FC<StructureDefinitionTabsProps> = ({
  customFields,
  setCustomFields,
  jsonInput,
  setJsonInput,
  xsdInput,
  setXsdInput,
  wsdlInput,
  setWsdlInput,
  selectedStructureType,
  setSelectedStructureType,
  namespaceConfig,
  setNamespaceConfig,
  onSave
}) => {

  return (
    <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle>Define Structure</CardTitle>
        <CardDescription>Choose your preferred method to define the data structure</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="structureType">Structure Type</Label>
            <Select value={selectedStructureType} onValueChange={setSelectedStructureType}>
              <SelectTrigger>
                <SelectValue placeholder="Select structure type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON Schema</SelectItem>
                <SelectItem value="xsd">XSD/XML</SelectItem>
                <SelectItem value="wsdl">WSDL</SelectItem>
                <SelectItem value="custom">Custom Builder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={selectedStructureType} className="w-full" onValueChange={(value) => setSelectedStructureType(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="json">JSON Schema</TabsTrigger>
              <TabsTrigger value="xsd">XSD/XML</TabsTrigger>
              <TabsTrigger value="wsdl">WSDL</TabsTrigger>
              <TabsTrigger value="custom">Custom Builder</TabsTrigger>
            </TabsList>
          
          <TabsContent value="json">
            <JsonStructureTab
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
            />
          </TabsContent>
          
          <TabsContent value="xsd">
            <XsdStructureTab
              xsdInput={xsdInput}
              setXsdInput={setXsdInput}
              namespaceConfig={namespaceConfig}
              setNamespaceConfig={setNamespaceConfig}
            />
          </TabsContent>
          
          <TabsContent value="wsdl">
            <WsdlStructureTab
              wsdlInput={wsdlInput}
              setWsdlInput={setWsdlInput}
              namespaceConfig={namespaceConfig}
              setNamespaceConfig={setNamespaceConfig}
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomStructureTab
              customFields={customFields}
              setCustomFields={setCustomFields}
            />
          </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button onClick={onSave} className="w-full bg-gradient-primary hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Save Data Structure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};