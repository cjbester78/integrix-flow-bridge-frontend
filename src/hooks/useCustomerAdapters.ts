import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { customerService } from '@/services/customerService';

// Mock customer relationships
const adapterCustomerMappings = {
  '1': ['sap', 'rest', 'soap', 'database'], // ACME Corporation
  '2': ['salesforce', 'rest', 'email', 'sms'], // TechStart Inc
};

const structureCustomerMappings = {
  '1': ['1', '2'], // ACME Corporation - Customer Order, Payment Response
  '2': ['2', '3'], // TechStart Inc - Payment Response, User Profile
};

export const useCustomerAdapters = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const response = await customerService.getAllCustomers();
    if (response.success && response.data) {
      setCustomers(response.data);
    }
    setLoading(false);
  };

  const getAdaptersForCustomer = (customerId: string): string[] => {
    return adapterCustomerMappings[customerId as keyof typeof adapterCustomerMappings] || [];
  };

  const getStructuresForCustomer = (customerId: string): string[] => {
    return structureCustomerMappings[customerId as keyof typeof structureCustomerMappings] || [];
  };

  return {
    customers,
    loading,
    getAdaptersForCustomer,
    getStructuresForCustomer,
  };
};