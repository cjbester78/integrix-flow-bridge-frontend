import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldBuilder } from '@/components/FieldBuilder';
import { Field } from '@/types/dataStructures';
import { Plus, Database } from 'lucide-react';

interface CustomStructureTabProps {
  customFields: Field[];
  setCustomFields: (fields: Field[]) => void;
  selectedStructureType: string;
  setSelectedStructureType: (type: string) => void;
}

export const CustomStructureTab: React.FC<CustomStructureTabProps> = ({
  customFields,
  setCustomFields,
  selectedStructureType,
  setSelectedStructureType
}) => {
  const [customStructureType, setCustomStructureType] = useState<string>('');
  const addCustomField = (fieldIndex?: number, parentIndex?: number) => {
    const newField: Field = {
      name: '',
      type: 'string',
      required: false,
      description: '',
      isComplexType: false,
      minOccurs: 0,
      maxOccurs: 1,
      children: []
    };

    if (parentIndex !== undefined && fieldIndex !== undefined) {
      // Adding child to a nested field
      const updated = [...customFields];
      if (!updated[parentIndex].children![fieldIndex].children) {
        updated[parentIndex].children![fieldIndex].children = [];
      }
      updated[parentIndex].children![fieldIndex].children!.push(newField);
      setCustomFields(updated);
    } else if (fieldIndex !== undefined) {
      // Adding child to a root level field
      const updated = [...customFields];
      if (!updated[fieldIndex].children) {
        updated[fieldIndex].children = [];
      }
      updated[fieldIndex].children!.push(newField);
      setCustomFields(updated);
    } else {
      // Adding new root level field
      setCustomFields([...customFields, newField]);
    }
  };

  const updateFieldAtPath = (path: number[], field: Partial<Field>) => {
    console.log('updateFieldAtPath called:', { path, field });
    
    const updated = [...customFields];
    let current = updated;
    
    // Navigate to the parent of the field we want to update
    for (let i = 0; i < path.length - 1; i++) {
      const index = path[i];
      if (!current[index].children) {
        current[index].children = [];
      }
      current = current[index].children!;
    }
    
    // Update the final field
    const finalIndex = path[path.length - 1];
    if (current[finalIndex]) {
      current[finalIndex] = { ...current[finalIndex], ...field };
      console.log('Updated field at path:', path, current[finalIndex]);
    }
    
    setCustomFields(updated);
  };

  const removeFieldAtPath = (path: number[]) => {
    const updated = [...customFields];
    
    if (path.length === 1) {
      // Remove root level field
      setCustomFields(updated.filter((_, i) => i !== path[0]));
    } else {
      // Navigate to parent and remove child
      let current = updated;
      for (let i = 0; i < path.length - 2; i++) {
        const index = path[i];
        if (!current[index].children) return;
        current = current[index].children!;
      }
      
      const parentIndex = path[path.length - 2];
      const childIndex = path[path.length - 1];
      
      if (current[parentIndex] && current[parentIndex].children) {
        current[parentIndex].children = current[parentIndex].children!.filter((_, i) => i !== childIndex);
      }
      
      setCustomFields(updated);
    }
  };

  const addChildAtPath = (path: number[]) => {
    const newField: Field = {
      name: '',
      type: 'string',
      required: false,
      description: '',
      isComplexType: false,
      minOccurs: 0,
      maxOccurs: 1,
      children: []
    };

    const updated = [...customFields];
    let current = updated;
    
    // Navigate to the target field
    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      if (!current[index].children) {
        current[index].children = [];
      }
      if (i === path.length - 1) {
        // Add child to this field
        current[index].children!.push(newField);
      } else {
        current = current[index].children!;
      }
    }
    
    setCustomFields(updated);
  };

  const generateSchemaPreview = (fields: Field[], schemaType: string): string => {
    if (fields.length === 0) return '';
    
    switch (schemaType) {
      case 'json':
        return generateJsonSchema(fields);
      case 'xml':
      case 'xsd':
        return generateXmlSchema(fields);
      case 'wsdl':
        return generateWsdlSchema(fields);
      default:
        return JSON.stringify(fields, null, 2);
    }
  };

  const generateJsonSchema = (fields: Field[]): string => {
    const schema: any = {
      type: "object",
      properties: {}
    };
    
    fields.forEach(field => {
      if (field.name) {
        schema.properties[field.name] = {
          type: field.type === 'string' ? 'string' : 
                field.type === 'number' || field.type === 'integer' ? 'number' :
                field.type === 'boolean' ? 'boolean' :
                field.type === 'array' ? 'array' :
                field.type === 'object' || field.isComplexType ? 'object' : 'string'
        };
        
        if (field.description) {
          schema.properties[field.name].description = field.description;
        }
        
        if (field.children && field.children.length > 0) {
          schema.properties[field.name].properties = {};
          field.children.forEach(child => {
            if (child.name) {
              schema.properties[field.name].properties[child.name] = {
                type: child.type,
                ...(child.description && { description: child.description })
              };
            }
          });
        }
      }
    });
    
    return JSON.stringify(schema, null, 2);
  };

  const generateXmlSchema = (fields: Field[]): string => {
    let xsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root">
    <xs:complexType>
      <xs:sequence>`;
    
    fields.forEach(field => {
      if (field.name) {
        if (field.isComplexType || (field.children && field.children.length > 0)) {
          xsd += `
        <xs:element name="${field.name}">
          <xs:complexType>
            <xs:sequence>`;
          
          field.children?.forEach(child => {
            if (child.name) {
              xsd += `
              <xs:element name="${child.name}" type="xs:${child.type}" ${child.required ? '' : 'minOccurs="0"'}/>`;
            }
          });
          
          xsd += `
            </xs:sequence>
          </xs:complexType>
        </xs:element>`;
        } else {
          xsd += `
        <xs:element name="${field.name}" type="xs:${field.type}" ${field.required ? '' : 'minOccurs="0"'}/>`;
        }
      }
    });
    
    xsd += `
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;
    
    return xsd;
  };

  const generateWsdlSchema = (fields: Field[]): string => {
    let wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:tns="http://example.com/schema"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             targetNamespace="http://example.com/schema">
  
  <types>
    <xsd:schema targetNamespace="http://example.com/schema">
      <xsd:element name="MessageType">
        <xsd:complexType>
          <xsd:sequence>`;
    
    fields.forEach(field => {
      if (field.name) {
        wsdl += `
            <xsd:element name="${field.name}" type="xsd:${field.type}" ${field.required ? '' : 'minOccurs="0"'}/>`;
      }
    });
    
    wsdl += `
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>
</definitions>`;
    
    return wsdl;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customStructureType">Structure Type</Label>
        <Select value={customStructureType} onValueChange={setCustomStructureType}>
          <SelectTrigger>
            <SelectValue placeholder="Select structure type to build" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON Schema</SelectItem>
            <SelectItem value="xsd">XSD Schema</SelectItem>
            <SelectItem value="xml">XML Schema</SelectItem>
            <SelectItem value="wsdl">WSDL Schema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!customStructureType ? (
        <div className="text-center py-8 space-y-4">
          <Database className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Custom Structure Builder</h3>
            <p className="text-sm text-muted-foreground">
              Select a structure type above to start building your custom data structure
            </p>
          </div>
        </div>
      ) : customFields.length === 0 ? (
        <div className="text-center py-8 space-y-4">
          <Database className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Build {customStructureType.toUpperCase()} Structure</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add fields to create your {customStructureType.toUpperCase()} data structure
            </p>
            <Button 
              onClick={() => addCustomField()}
              className="w-full max-w-xs bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Label>Structure Definition ({customStructureType.toUpperCase()})</Label>
            <Button onClick={() => addCustomField()} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>
          
          {customFields.map((field, index) => (
            <FieldBuilder
              key={index}
              field={field}
              index={index}
              onUpdate={updateFieldAtPath}
              onRemove={removeFieldAtPath}
              onAddChild={addChildAtPath}
              depth={0}
              path={[index]}
            />
          ))}
          
          {/* Live Schema Preview */}
          {customFields.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <Label className="text-sm font-semibold mb-2 block">Live {customStructureType.toUpperCase()} Preview:</Label>
              <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-64">
                {generateSchemaPreview(customFields, customStructureType)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
};