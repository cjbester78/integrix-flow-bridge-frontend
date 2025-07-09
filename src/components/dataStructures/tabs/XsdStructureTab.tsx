import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from '../FileUploadZone';
import { NamespaceConfiguration } from '../NamespaceConfiguration';
import { useToast } from '@/hooks/use-toast';
import { FileCode } from 'lucide-react';

interface XsdStructureTabProps {
  xsdInput: string;
  setXsdInput: (input: string) => void;
  namespaceConfig: any;
  setNamespaceConfig: (config: any) => void;
}

export const XsdStructureTab: React.FC<XsdStructureTabProps> = ({
  xsdInput,
  setXsdInput,
  namespaceConfig,
  setNamespaceConfig
}) => {
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setXsdInput(content);
      toast({
        title: "XSD File Loaded",
        description: `Successfully loaded ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="space-y-4">
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
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onFileSelect={handleFileUpload}
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
    </div>
  );
};