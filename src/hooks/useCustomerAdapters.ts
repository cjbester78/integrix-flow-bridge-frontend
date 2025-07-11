import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { channelService } from '@/services/channelService';
import { structureService } from '@/services/structureService';

export const useCustomerAdapters = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [adapters, setAdapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [customersResponse, adaptersResponse] = await Promise.all([
      customerService.getAllCustomers(),
      channelService.getAvailableAdapters()
    ]);

    if (customersResponse.success && customersResponse.data) {
      setCustomers(customersResponse.data);
    }

    if (adaptersResponse.success && adaptersResponse.data) {
      setAdapters(adaptersResponse.data);
    }

    setLoading(false);
  };

  const getAdaptersForCustomer = async (customerId: string) => {
    const response = await channelService.getChannels(customerId);
    if (response.success && response.data) {
      const adapterIds = response.data.flatMap(channel => 
        channel.adapters.map(adapter => adapter.id)
      );
      return [...new Set(adapterIds)]; // Remove duplicates
    }
    return [];
  };

  const getStructuresForCustomer = async (customerId: string) => {
    const response = await structureService.getStructures();
    if (response.success && response.data) {
      return response.data.structures.filter(s => s.customerId === customerId).map(structure => structure.id);
    }
    return [];
  };

  return {
    customers,
    adapters,
    loading,
    getAdaptersForCustomer,
    getStructuresForCustomer,
    refreshData: loadData,
  };
};