// Client-side transformation functions for preview and validation
export interface TransformationFunction {
  name: string;
  category: string;
  description: string;
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    required: boolean;
    description?: string;
  }>;
  execute: (...args: any[]) => any;
  javaTemplate: string;
}

// Math Functions
const mathFunctions: TransformationFunction[] = [
  {
    name: 'add',
    category: 'math',
    description: 'Add two numbers',
    parameters: [
      { name: 'a', type: 'number', required: true, description: 'First number' },
      { name: 'b', type: 'number', required: true, description: 'Second number' }
    ],
    execute: (a: number, b: number) => a + b,
    javaTemplate: 'add({0}, {1})'
  },
  {
    name: 'subtract',
    category: 'math',
    description: 'Subtract two numbers',
    parameters: [
      { name: 'a', type: 'number', required: true, description: 'First number' },
      { name: 'b', type: 'number', required: true, description: 'Second number' }
    ],
    execute: (a: number, b: number) => a - b,
    javaTemplate: 'subtract({0}, {1})'
  },
  {
    name: 'multiply',
    category: 'math',
    description: 'Multiply two numbers',
    parameters: [
      { name: 'a', type: 'number', required: true },
      { name: 'b', type: 'number', required: true }
    ],
    execute: (a: number, b: number) => a * b,
    javaTemplate: 'multiply({0}, {1})'
  },
  {
    name: 'formatNumber',
    category: 'math',
    description: 'Format number with decimal places',
    parameters: [
      { name: 'value', type: 'number', required: true },
      { name: 'decimals', type: 'number', required: false, description: 'Number of decimal places' }
    ],
    execute: (value: number, decimals: number = 2) => Number(value.toFixed(decimals)),
    javaTemplate: 'formatNumber({0}, {1})'
  }
];

// Text Functions
const textFunctions: TransformationFunction[] = [
  {
    name: 'concat',
    category: 'text',
    description: 'Concatenate multiple strings',
    parameters: [
      { name: 'strings', type: 'array', required: true, description: 'Array of strings to join' }
    ],
    execute: (...strings: string[]) => strings.join(''),
    javaTemplate: 'concat({0})'
  },
  {
    name: 'substring',
    category: 'text',
    description: 'Extract substring from text',
    parameters: [
      { name: 'text', type: 'string', required: true },
      { name: 'start', type: 'number', required: true },
      { name: 'end', type: 'number', required: false }
    ],
    execute: (text: string, start: number, end?: number) => text.substring(start, end),
    javaTemplate: 'substring({0}, {1}, {2})'
  },
  {
    name: 'toUpperCase',
    category: 'text',
    description: 'Convert text to uppercase',
    parameters: [
      { name: 'text', type: 'string', required: true }
    ],
    execute: (text: string) => text.toUpperCase(),
    javaTemplate: 'toUpperCase({0})'
  },
  {
    name: 'trim',
    category: 'text',
    description: 'Remove whitespace from both ends',
    parameters: [
      { name: 'text', type: 'string', required: true }
    ],
    execute: (text: string) => text.trim(),
    javaTemplate: 'trim({0})'
  }
];

// Boolean Functions
const booleanFunctions: TransformationFunction[] = [
  {
    name: 'and',
    category: 'boolean',
    description: 'Logical AND operation',
    parameters: [
      { name: 'a', type: 'boolean', required: true },
      { name: 'b', type: 'boolean', required: true }
    ],
    execute: (a: boolean, b: boolean) => a && b,
    javaTemplate: 'and({0}, {1})'
  },
  {
    name: 'or',
    category: 'boolean',
    description: 'Logical OR operation',
    parameters: [
      { name: 'a', type: 'boolean', required: true },
      { name: 'b', type: 'boolean', required: true }
    ],
    execute: (a: boolean, b: boolean) => a || b,
    javaTemplate: 'or({0}, {1})'
  },
  {
    name: 'if',
    category: 'boolean',
    description: 'Conditional logic with true/false branches',
    parameters: [
      { name: 'condition', type: 'boolean', required: true },
      { name: 'trueValue', type: 'string', required: true },
      { name: 'falseValue', type: 'string', required: true }
    ],
    execute: (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue,
    javaTemplate: 'if({0}, {1}, {2})'
  }
];

// Constants Functions
const constantFunctions: TransformationFunction[] = [
  {
    name: 'constant',
    category: 'constants',
    description: 'Set a fixed value',
    parameters: [
      { name: 'value', type: 'string', required: true, description: 'The constant value to return' }
    ],
    execute: (value: any) => value,
    javaTemplate: 'constant("{0}")'
  }
];

// All functions registry
export const allTransformationFunctions = [
  ...mathFunctions,
  ...textFunctions,
  ...booleanFunctions,
  ...constantFunctions
];

// Functions grouped by category
export const functionsByCategory = {
  math: mathFunctions,
  text: textFunctions,
  boolean: booleanFunctions,
  constants: constantFunctions
};

// Helper to get function by name
export const getTransformationFunction = (name: string): TransformationFunction | undefined => {
  return allTransformationFunctions.find(fn => fn.name === name);
};

// Helper to generate Java code from function calls
export const generateJavaFunctionCall = (functionName: string, parameters: any[]): string => {
  const func = getTransformationFunction(functionName);
  if (!func) return '';
  
  let template = func.javaTemplate;
  parameters.forEach((param, index) => {
    const placeholder = `{${index}}`;
    const value = typeof param === 'string' ? `"${param}"` : param;
    template = template.replace(placeholder, value);
  });
  
  return template;
};

// Service class for transformation functions
export class TransformationFunctionService {
  static getAllFunctions(): TransformationFunction[] {
    return allTransformationFunctions;
  }
  
  static getFunctionsByCategory(category: string): TransformationFunction[] {
    return functionsByCategory[category as keyof typeof functionsByCategory] || [];
  }
  
  static executeFunction(functionName: string, parameters: any[]): any {
    const func = getTransformationFunction(functionName);
    if (!func) throw new Error(`Function ${functionName} not found`);
    
    return func.execute(...parameters);
  }
  
  static validateParameters(functionName: string, parameters: any[]): { valid: boolean; errors: string[] } {
    const func = getTransformationFunction(functionName);
    if (!func) return { valid: false, errors: [`Function ${functionName} not found`] };
    
    const errors: string[] = [];
    const requiredParams = func.parameters.filter(p => p.required);
    
    if (parameters.length < requiredParams.length) {
      errors.push(`Function ${functionName} requires ${requiredParams.length} parameters, got ${parameters.length}`);
    }
    
    return { valid: errors.length === 0, errors };
  }
}