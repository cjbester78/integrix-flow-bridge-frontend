import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadZone } from '../FileUploadZone';
import { NamespaceConfiguration } from '../NamespaceConfiguration';
import { FileCode } from 'lucide-react';

interface EdmxStructureTabProps {
  edmxInput: string;
  setEdmxInput: (input: string) => void;
  namespaceConfig: any;
  setNamespaceConfig: (config: any) => void;
}

export const EdmxStructureTab: React.FC<EdmxStructureTabProps> = ({
  edmxInput,
  setEdmxInput,
  namespaceConfig,
  setNamespaceConfig
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEdmxInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <FileUploadZone
        icon={FileCode}
        title="Upload EDMX File"
        description="Drag and drop your EDMX file here, or click to browse"
        acceptTypes=".edmx,.xml"
        dragOver={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileSelect={handleFileSelect}
        uploadId="edmx-upload"
        buttonText="Upload EDMX File"
      />
      
      <div className="space-y-2">
        <Label htmlFor="edmxInput">EDMX Structure</Label>
        <Textarea
          id="edmxInput"
          placeholder="Paste your EDMX content here or upload a file above..."
          value={edmxInput}
          onChange={(e) => setEdmxInput(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          rows={15}
        />
      </div>

      <NamespaceConfiguration
        type="xml"
        namespaceConfig={namespaceConfig}
        setNamespaceConfig={setNamespaceConfig}
      />
    </div>
  );
};