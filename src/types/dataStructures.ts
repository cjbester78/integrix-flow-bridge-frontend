export interface DataStructure {
  id: string;
  name: string;
  type: 'xsd' | 'soap' | 'json' | 'custom';
  description?: string;
  structure: any;
  createdAt: string;
  usage: 'source' | 'target' | 'both';
}

export interface Field {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  children?: Field[];
}