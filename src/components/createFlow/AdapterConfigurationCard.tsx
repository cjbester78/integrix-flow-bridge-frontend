import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';
import { useCustomerAdapters } from '@/hooks/useCustomerAdapters';

interface Adapter {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface AdapterConfigurationCardProps {
  adapters: Adapter[];
  sourceCustomer: string;
  targetCustomer: string;
  sourceAdapter: string;
  targetAdapter: string;
  sourceAdapterActive: boolean;
  targetAdapterActive: boolean;
  onSourceCustomerChange: (value: string) => void;
  onTargetCustomerChange: (value: string) => void;
  onSourceAdapterChange: (value: string) => void;
  onTargetAdapterChange: (value: string) => void;
  onSourceAdapterActiveChange: (active: boolean) => void;
  onTargetAdapterActiveChange: (active: boolean) => void;
}

export const AdapterConfigurationCard = ({
  adapters,
  sourceCustomer,
  targetCustomer,
  sourceAdapter,
  targetAdapter,
  sourceAdapterActive,
  targetAdapterActive,
  onSourceCustomerChange,
  onTargetCustomerChange,
  onSourceAdapterChange,
  onTargetAdapterChange,
  onSourceAdapterActiveChange,
  onTargetAdapterActiveChange,
}: AdapterConfigurationCardProps) => {
  const { customers, loading, getAdaptersForCustomer } = useCustomerAdapters();
  
  const getAdapterById = (id: string) => adapters.find(adapter => adapter.id === id);

  const [customerAdapters, setCustomerAdapters] = useState<string[]>([]);

  useEffect(() => {
    if (sourceCustomer) {
      loadCustomerAdapters(sourceCustomer);
    }
  }, [sourceCustomer]);

  const loadCustomerAdapters = async (customerId: string) => {
    const allowedAdapterIds = await getAdaptersForCustomer(customerId);
    setCustomerAdapters(allowedAdapterIds);
  };

  const getFilteredAdapters = (customerId: string) => {
    if (!customerId) return adapters;
    return adapters.filter(adapter => customerAdapters.includes(adapter.id));
  };

  const handleSourceCustomerChange = async (customerId: string) => {
    onSourceCustomerChange(customerId);
    // Reset source adapter if it's not available for the new customer
    const adaptersForCustomer = await getAdaptersForCustomer(customerId);
    if (sourceAdapter && !adaptersForCustomer.includes(sourceAdapter)) {
      onSourceAdapterChange('');
    }
  };

  const handleTargetCustomerChange = async (customerId: string) => {
    onTargetCustomerChange(customerId);
    // Reset target adapter if it's not available for the new customer
    const adaptersForCustomer = await getAdaptersForCustomer(customerId);
    if (targetAdapter && !adaptersForCustomer.includes(targetAdapter)) {
      onTargetAdapterChange('');
    }
  };

  return (
    <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle>Source & Target Configuration</CardTitle>
        <CardDescription>Select the source and target systems for your integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Customer & Adapter */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Source Customer *</Label>
              <Select value={sourceCustomer} onValueChange={handleSourceCustomerChange} disabled={loading}>
                <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                  <SelectValue placeholder="Select source customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center gap-2">
                        <span>{customer.name}</span>
                        {customer.description && (
                          <Badge variant="outline" className="text-xs">{customer.description}</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Source Adapter *</Label>
              <Select 
                value={sourceAdapter} 
                onValueChange={onSourceAdapterChange}
                disabled={!sourceCustomer}
              >
                <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                  <SelectValue placeholder="Select source system" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredAdapters(sourceCustomer).map((adapter) => (
                    <SelectItem key={adapter.id} value={adapter.id}>
                      <div className="flex items-center gap-2">
                        <adapter.icon className="h-4 w-4" />
                        <span>{adapter.name}</span>
                        <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sourceAdapter && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getAdapterById(sourceAdapter) && (
                      <>
                        {(() => {
                          const adapter = getAdapterById(sourceAdapter)!;
                          const IconComponent = adapter.icon;
                          return (
                            <>
                              <IconComponent className="h-4 w-4 text-primary" />
                              <span className="font-medium">{adapter.name}</span>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Source Adapter Active Status */}
            {sourceAdapter && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sourceAdapterActive"
                  checked={sourceAdapterActive}
                  onCheckedChange={(checked) => onSourceAdapterActiveChange(checked === true)}
                />
                <Label htmlFor="sourceAdapterActive" className="text-sm font-normal flex items-center gap-1">
                  Active source adapter
                  <Badge variant={sourceAdapterActive ? "default" : "secondary"} className="text-xs">
                    {sourceAdapterActive ? "Active" : "Inactive"}
                  </Badge>
                </Label>
              </div>
            )}
          </div>

          {/* Target Customer & Adapter */}
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Target Customer *</Label>
              <Select value={targetCustomer} onValueChange={handleTargetCustomerChange} disabled={loading}>
                <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                  <SelectValue placeholder="Select target customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center gap-2">
                        <span>{customer.name}</span>
                        {customer.description && (
                          <Badge variant="outline" className="text-xs">{customer.description}</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>Target Adapter *</Label>
              <Select 
                value={targetAdapter} 
                onValueChange={onTargetAdapterChange}
                disabled={!targetCustomer}
              >
                <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                  <SelectValue placeholder="Select target system" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredAdapters(targetCustomer).map((adapter) => (
                    <SelectItem key={adapter.id} value={adapter.id}>
                      <div className="flex items-center gap-2">
                        <adapter.icon className="h-4 w-4" />
                        <span>{adapter.name}</span>
                        <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {targetAdapter && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getAdapterById(targetAdapter) && (
                      <>
                        {(() => {
                          const adapter = getAdapterById(targetAdapter)!;
                          const IconComponent = adapter.icon;
                          return (
                            <>
                              <IconComponent className="h-4 w-4 text-primary" />
                              <span className="font-medium">{adapter.name}</span>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Target Adapter Active Status */}
            {targetAdapter && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="targetAdapterActive"
                  checked={targetAdapterActive}
                  onCheckedChange={(checked) => onTargetAdapterActiveChange(checked === true)}
                />
                <Label htmlFor="targetAdapterActive" className="text-sm font-normal flex items-center gap-1">
                  Active target adapter
                  <Badge variant={targetAdapterActive ? "default" : "secondary"} className="text-xs">
                    {targetAdapterActive ? "Active" : "Inactive"}
                  </Badge>
                </Label>
              </div>
            )}
          </div>
        </div>

        {/* Flow Visualization */}
        {sourceAdapter && targetAdapter && (
          <div className="mt-6 p-4 bg-gradient-secondary rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-soft">
                {getAdapterById(sourceAdapter) && (
                  <>
                    {(() => {
                      const adapter = getAdapterById(sourceAdapter)!;
                      const IconComponent = adapter.icon;
                      return (
                        <>
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="font-medium">{adapter.name}</span>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
              <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
              <div className="flex items-center gap-2 bg-card p-3 rounded-lg shadow-soft">
                {getAdapterById(targetAdapter) && (
                  <>
                    {(() => {
                      const adapter = getAdapterById(targetAdapter)!;
                      const IconComponent = adapter.icon;
                      return (
                        <>
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="font-medium">{adapter.name}</span>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};