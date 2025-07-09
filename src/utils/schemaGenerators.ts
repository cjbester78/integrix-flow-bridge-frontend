import { Field } from '@/types/dataStructures';

export const generateJsonSchema = (fields: Field[]): string => {
  const schema: any = {
    type: "object",
    properties: {}
  };
  
  fields.forEach(field => {
    if (field.name) {
      const isArray = field.type === 'array' || 
                  (typeof field.maxOccurs === 'number' && field.maxOccurs > 1) || 
                  field.maxOccurs === 'unbounded';
      
      if (isArray) {
        schema.properties[field.name] = {
          type: 'array',
          items: {
            type: field.type === 'array' ? 'string' : // default item type for array
                   field.type === 'string' ? 'string' : 
                   field.type === 'number' || field.type === 'integer' ? 'number' :
                   field.type === 'boolean' ? 'boolean' :
                   field.type === 'object' || field.isComplexType ? 'object' : 'string'
          }
        };
      } else {
        schema.properties[field.name] = {
          type: field.type === 'string' ? 'string' : 
                field.type === 'number' || field.type === 'integer' ? 'number' :
                field.type === 'boolean' ? 'boolean' :
                field.type === 'object' || field.isComplexType ? 'object' : 'string'
        };
      }
      
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
            xsd += `
              <xs:element name="${child.name}" type="xs:${child.type}" ${child.required ? '' : 'minOccurs="0"'}/>`;
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