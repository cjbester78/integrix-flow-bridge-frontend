import { Field } from '@/types/dataStructures';

const buildJsonStructure = (fields: Field[]): any => {
  const result: any = {};
  
  fields.forEach(field => {
    if (field.name) {
      const isArray = field.type === 'array' || 
                  (typeof field.maxOccurs === 'number' && field.maxOccurs > 1) || 
                  field.maxOccurs === 'unbounded';
      const isComplexType = field.isComplexType || (field.children && field.children.length > 0);
      
      if (isComplexType) {
        if (isArray) {
          // For arrays with children, create array with sample object
          result[field.name] = [buildJsonStructure(field.children!)];
        } else {
          // For complex types, build nested structure (no type property)
          result[field.name] = buildJsonStructure(field.children!);
        }
      } else {
        // Simple primitive field - show default values
        result[field.name] = field.type === 'integer' ? 0 : "";
      }
    }
  });
  
  return result;
};

export const generateJsonSchema = (fields: Field[]): string => {
  if (fields.length === 0) return '{}';
  
  // Use the first field as the root container
  if (fields.length === 1 && (fields[0].isComplexType || fields[0].children)) {
    const rootField = fields[0];
    const structure = {
      [rootField.name]: buildJsonStructure(rootField.children || [])
    };
    return JSON.stringify(structure, null, 2);
  }
  
  // Fallback: wrap all fields in a root container
  const structure = {
    root: buildJsonStructure(fields)
  };
  
  return JSON.stringify(structure, null, 2);
};

export const generateXmlSchema = (fields: Field[]): string => {
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
            const childMinOccurs = child.minOccurs || (child.required ? 1 : 0);
            const childMaxOccurs = child.maxOccurs === 'unbounded' ? 'unbounded' : (child.maxOccurs || 1);
            const childOccursAttr = `minOccurs="${childMinOccurs}" maxOccurs="${childMaxOccurs}"`;
            
            if (child.isComplexType || (child.children && child.children.length > 0)) {
              xsd += `
              <xs:element name="${child.name}">
                <xs:complexType>
                  <xs:sequence>`;
              
              child.children?.forEach(grandchild => {
                if (grandchild.name) {
                  const grandchildMinOccurs = grandchild.minOccurs || (grandchild.required ? 1 : 0);
                  const grandchildMaxOccurs = grandchild.maxOccurs === 'unbounded' ? 'unbounded' : (grandchild.maxOccurs || 1);
                  const grandchildOccursAttr = `minOccurs="${grandchildMinOccurs}" maxOccurs="${grandchildMaxOccurs}"`;
                  
                  xsd += `
                    <xs:element name="${grandchild.name}" type="xs:${grandchild.type === 'array' ? 'string' : grandchild.type}" ${grandchildOccursAttr}/>`;
                }
              });
              
              xsd += `
                  </xs:sequence>
                </xs:complexType>
              </xs:element>`;
            } else {
              xsd += `
              <xs:element name="${child.name}" type="xs:${child.type === 'array' ? 'string' : child.type}" ${childOccursAttr}/>`;
            }
          }
        });
        
        xsd += `
            </xs:sequence>
          </xs:complexType>
        </xs:element>`;
      } else {
        const minOccurs = field.minOccurs || (field.required ? 1 : 0);
        const maxOccurs = field.maxOccurs === 'unbounded' ? 'unbounded' : (field.maxOccurs || 1);
        const occursAttr = `minOccurs="${minOccurs}" maxOccurs="${maxOccurs}"`;
        
        xsd += `
        <xs:element name="${field.name}" type="xs:${field.type === 'array' ? 'string' : field.type}" ${occursAttr}/>`;
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

export const generateWsdlSchema = (fields: Field[]): string => {
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
      const minOccurs = field.minOccurs || (field.required ? 1 : 0);
      const maxOccurs = field.maxOccurs === 'unbounded' ? 'unbounded' : (field.maxOccurs || 1);
      const occursAttr = `minOccurs="${minOccurs}" maxOccurs="${maxOccurs}"`;
      
      wsdl += `
            <xsd:element name="${field.name}" type="xsd:${field.type === 'array' ? 'string' : field.type}" ${occursAttr}/>`;
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

export const generateSchemaPreview = (fields: Field[], schemaType: string): string => {
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