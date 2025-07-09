import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploadZone } from './FileUploadZone';
import { NamespaceConfiguration } from './NamespaceConfiguration';
import { FieldBuilder } from '@/components/FieldBuilder';
import { Field } from '@/types/dataStructures';
import { useToast } from '@/hooks/use-toast';
import { 
  Save,
  Plus,
  Database,
  FileJson,
  FileCode
} from 'lucide-react';

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
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File, type: 'xsd' | 'json' | 'soap' | 'wsdl') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (type === 'json') {
        try {
          const parsed = JSON.parse(content);
          setJsonInput(JSON.stringify(parsed, null, 2));
          toast({
            title: "JSON File Loaded",
            description: `Successfully loaded ${file.name}`,
          });
        } catch (error) {
          toast({
            title: "Invalid JSON",
            description: "The uploaded file contains invalid JSON",
            variant: "destructive",
          });
        }
      } else if (type === 'wsdl') {
        setWsdlInput(content);
        toast({
          title: "WSDL File Loaded",
          description: `Successfully loaded ${file.name}`,
        });
      } else {
        setXsdInput(content);
        toast({
          title: `${type.toUpperCase()} File Loaded`,
          description: `Successfully loaded ${file.name}`,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'xsd' | 'json' | 'soap' | 'wsdl') => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

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
    <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle>Define Structure</CardTitle>
        <CardDescription>Choose your preferred method to define the data structure</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedStructureType} className="w-full" onValueChange={(value) => setSelectedStructureType(value)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="json">JSON Schema</TabsTrigger>
            <TabsTrigger value="xsd">XSD/XML</TabsTrigger>
            <TabsTrigger value="wsdl">WSDL</TabsTrigger>
            <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="space-y-4">
            <FileUploadZone
              icon={FileJson}
              title="JSON Upload"
              description="Drag & drop a JSON file or paste JSON structure below"
              acceptTypes=".json"
              dragOver={dragOver}
              onDrop={(e) => handleDrop(e, 'json')}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onFileSelect={(file) => handleFileUpload(file, 'json')}
              uploadId="json-upload"
              buttonText="Upload JSON File"
            />
            
            <div className="space-y-2">
              <Label>JSON Structure</Label>
              <Textarea
                placeholder='{"orderId": "string", "amount": 100.50, "items": []}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm"
                rows={8}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="xsd" className="space-y-4">
            <NamespaceConfiguration
              type="xml"
              namespaceConfig={namespaceConfig}
              setNamespaceConfig={setNamespaceConfig}
            />
            <FileUploadZone
              icon={FileCode}
              title="XSD Upload"
              description="Drag & drop XSD or WSDL files"
              acceptTypes=".xsd,.wsdl,.xml"
              dragOver={dragOver}
              onDrop={(e) => handleDrop(e, 'xsd')}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onFileSelect={(file) => handleFileUpload(file, 'xsd')}
              uploadId="xsd-upload"
              buttonText="Upload XSD/WSDL"
            />
            
            <div className="space-y-2">
              <Label>XSD/SOAP Content</Label>
              <Textarea
                placeholder="Paste your XSD or SOAP schema here..."
                value={xsdInput}
                onChange={(e) => setXsdInput(e.target.value)}
                className="font-mono text-sm"
                rows={8}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="wsdl" className="space-y-4">
            <NamespaceConfiguration
              type="wsdl"
              namespaceConfig={namespaceConfig}
              setNamespaceConfig={setNamespaceConfig}
            />
            <FileUploadZone
              icon={FileCode}
              title="WSDL Upload"
              description="Drag & drop a WSDL file or paste WSDL content below"
              acceptTypes=".wsdl,.xml"
              dragOver={dragOver}
              onDrop={(e) => handleDrop(e, 'wsdl')}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onFileSelect={(file) => handleFileUpload(file, 'wsdl')}
              uploadId="wsdl-upload"
              buttonText="Upload WSDL File"
            />
            
            <div className="space-y-2">
              <Label>WSDL Content</Label>
              <Textarea
                placeholder="Paste your WSDL definition here..."
                value={wsdlInput}
                onChange={(e) => setWsdlInput(e.target.value)}
                className="font-mono text-sm"
                rows={8}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
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
          </TabsContent>
        </Tabs>
        
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