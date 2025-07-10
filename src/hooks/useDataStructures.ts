import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DataStructure, Field } from '@/types/dataStructures';
import { parseJsonStructure, parseWsdlStructure, buildNestedStructure } from '@/utils/structureParsers';

const sampleStructures: DataStructure[] = [
  {
    id: '1',
    name: 'Customer Order',
    type: 'json',
    description: 'Standard customer order structure',
    structure: {
      orderId: 'string',
      customerId: 'string',
      items: 'array',
      totalAmount: 'decimal',
      orderDate: 'datetime'
    },
    createdAt: '2024-01-15',
    usage: 'source'
  },
  {
    id: '2',
    name: 'Payment Response',
    type: 'soap',
    description: 'Payment gateway response format',
    structure: {
      transactionId: 'string',
      status: 'string',
      amount: 'decimal',
      currency: 'string'
    },
    createdAt: '2024-01-10',
    usage: 'target'
  }
];

export const useDataStructures = () => {
  const [structures, setStructures] = useState<DataStructure[]>(sampleStructures);
  const [selectedStructure, setSelectedStructure] = useState<DataStructure | null>(null);
  const { toast } = useToast();

  const saveStructure = (
    structureName: string,
    structureDescription: string,
    structureUsage: 'source' | 'target',
    jsonInput: string,
    xsdInput: string,
    wsdlInput: string,
    customFields: Field[],
    selectedStructureType: string,
    namespaceConfig: any
  ) => {
    if (!structureName) {
      toast({
        title: "Validation Error",
        description: "Please provide a structure name",
        variant: "destructive",
      });
      return false;
    }

    let structure: any = {};
    
    if (jsonInput) {
      structure = parseJsonStructure(jsonInput);
    } else if (wsdlInput) {
      structure = parseWsdlStructure(wsdlInput);
    } else if (xsdInput) {
      structure = { message: 'XSD parsing not fully implemented yet' };
    } else if (customFields.length > 0) {
      structure = buildNestedStructure(customFields);
    } else {
      toast({
        title: "Validation Error",
        description: "Please define a structure using JSON, XSD, WSDL, or custom fields",
        variant: "destructive",
      });
      return false;
    }

    const newStructure: DataStructure = {
      id: Date.now().toString(),
      name: structureName,
      type: jsonInput ? 'json' : wsdlInput ? 'wsdl' : xsdInput ? 'xsd' : 'custom',
      description: structureDescription,
      structure,
      createdAt: new Date().toISOString().split('T')[0],
      usage: structureUsage,
      namespace: (selectedStructureType === 'xsd' || selectedStructureType === 'wsdl') && namespaceConfig.uri ? namespaceConfig : undefined
    };

    setStructures([...structures, newStructure]);
    
    toast({
      title: "Structure Saved",
      description: `Data structure "${structureName}" has been created successfully`,
    });

    return true;
  };

  const deleteStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
    if (selectedStructure?.id === id) {
      setSelectedStructure(null);
    }
    toast({
      title: "Structure Deleted",
      description: "Data structure has been removed",
    });
  };

  const duplicateStructure = (structure: DataStructure) => {
    const duplicate = {
      ...structure,
      id: Date.now().toString(),
      name: `${structure.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStructures([...structures, duplicate]);
    toast({
      title: "Structure Duplicated",
      description: `Created copy of "${structure.name}"`,
    });
  };

  return {
    structures,
    selectedStructure,
    setSelectedStructure,
    saveStructure,
    deleteStructure,
    duplicateStructure
  };
};