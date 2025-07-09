export interface DataStructure {
  id: string;
  name: string;
  type: 'xsd' | 'soap' | 'json' | 'custom' | 'wsdl';
  description?: string;
  structure: any;
  createdAt: string;
  usage: 'source' | 'target' | 'both';
  namespace?: {
    uri: string;
    prefix?: string;
    targetNamespace?: string;
    schemaLocation?: string;
  };
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  children?: Field[];
  isComplexType?: boolean;
  minOccurs?: number;
  maxOccurs?: number | 'unbounded';
}