import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from '../FileUploadZone';
import { NamespaceConfiguration } from '../NamespaceConfiguration';
import { useToast } from '@/hooks/use-toast';
import { extractWsdlPartName, extractWsdlNamespaceInfo } from '@/utils/structureParsers';
import { FileCode } from 'lucide-react';

interface WsdlStructureTabProps {
  wsdlInput: string;
  setWsdlInput: (input: string) => void;
  namespaceConfig: any;
  setNamespaceConfig: (config: any) => void;
  onWsdlAnalyzed?: (name: string | null, namespaceInfo: any) => void;
}

export const WsdlStructureTab: React.FC<WsdlStructureTabProps> = ({
  wsdlInput,
  setWsdlInput,
  namespaceConfig,
  setNamespaceConfig,
  onWsdlAnalyzed
}) => {
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const analyzeWsdlContent = (content: string) => {
    const extractedName = extractWsdlPartName(content);
    const namespaceInfo = extractWsdlNamespaceInfo(content);
    
    if (namespaceInfo) {
      setNamespaceConfig(namespaceInfo);
    }
    
    if (onWsdlAnalyzed) {
      onWsdlAnalyzed(extractedName, namespaceInfo);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setWsdlInput(content);
      analyzeWsdlContent(content);
      toast({
        title: "WSDL File Loaded",
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
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onFileSelect={handleFileUpload}
        uploadId="wsdl-upload"
        buttonText="Upload WSDL File"
      />
      
      <div className="space-y-2">
        <Label>WSDL Content</Label>
        <Textarea
          placeholder="Paste your WSDL definition here..."
          value={wsdlInput}
          onChange={(e) => {
            const content = e.target.value;
            setWsdlInput(content);
            if (content.trim()) {
              analyzeWsdlContent(content);
            }
          }}
          className="font-mono text-sm"
          rows={8}
        />
      </div>
    </div>
  );
};