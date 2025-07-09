import { Field } from '@/types/dataStructures';

export const parseJsonStructure = (jsonString: string) => {
  try {
    const obj = JSON.parse(jsonString);
    return analyzeJsonStructure(obj);
  } catch {
    return null;
  }
};

export const analyzeJsonStructure = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.length > 0 ? ['array', analyzeJsonStructure(obj[0])] : 'array';
  } else if (obj !== null && typeof obj === 'object') {
    const structure: any = {};
    for (const [key, value] of Object.entries(obj)) {
      structure[key] = analyzeJsonStructure(value);
    }
    return structure;
  } else {
    return typeof obj;
  }
};

export const parseWsdlStructure = (wsdlString: string) => {
  try {
    // Basic WSDL parsing - extract complex types and elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(wsdlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return null;
    }
    
    const structure: any = {};
    
    // Extract complex types
    const complexTypes = doc.querySelectorAll('complexType, xs\\:complexType');
    complexTypes.forEach((complexType, index) => {
      const typeName = complexType.getAttribute('name') || `ComplexType${index + 1}`;
      const typeStructure: any = {};
      
      // Extract elements within the complex type
      const elements = complexType.querySelectorAll('element, xs\\:element');
      elements.forEach(element => {
        const elementName = element.getAttribute('name');
        const elementType = element.getAttribute('type') || 'string';
        if (elementName) {
          typeStructure[elementName] = elementType.replace(/^(xs:|xsd:)/, '');
        }
      });
      
      if (Object.keys(typeStructure).length > 0) {
        structure[typeName] = typeStructure;
      }
    });
    
    // Extract simple elements if no complex types found
    if (Object.keys(structure).length === 0) {
      const elements = doc.querySelectorAll('element, xs\\:element');
      elements.forEach(element => {
        const elementName = element.getAttribute('name');
        const elementType = element.getAttribute('type') || 'string';
        if (elementName) {
          structure[elementName] = elementType.replace(/^(xs:|xsd:)/, '');
        }
      });
    }
    
    return Object.keys(structure).length > 0 ? structure : null;
  } catch (error) {
    return null;
  }
};

export const buildNestedStructure = (fields: Field[]): any => {
  const structure: any = {};
  
  fields.forEach(field => {
    if (field.children && field.children.length > 0) {
      // Complex type with children
      structure[field.name] = buildNestedStructure(field.children);
    } else {
      // Simple field
      structure[field.name] = field.type;
    }
  });
  
  return structure;
};