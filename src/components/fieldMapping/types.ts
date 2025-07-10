export interface FieldNode {
  id: string;
  name: string;
  type: string;
  path: string;
  children?: FieldNode[];
  expanded?: boolean;
}

export interface FieldMapping {
  id: string;
  name: string;
  sourceFields: string[];
  targetField: string;
  sourcePaths: string[];
  targetPath: string;
  javaFunction?: string;
}

export interface WebserviceStructures {
  [key: string]: FieldNode[];
}