import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HttpSenderAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number) => void;
}

export function HttpSenderAdapterConfiguration({
  configuration,
  onConfigurationChange
}: HttpSenderAdapterConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HTTP Sender Configuration</CardTitle>
        <CardDescription>Configure your HTTP sender adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="source" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Parameters</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter request address"
                  value={configuration.address || ''}
                  onChange={(e) => onConfigurationChange('address', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maximum Message Size</h3>
              <div className="space-y-2">
                <Label htmlFor="bodySizeMB">Body Size (in MB)</Label>
                <Input
                  id="bodySizeMB"
                  type="number"
                  placeholder="Enter body size in MB"
                  value={configuration.bodySizeMB || ''}
                  onChange={(e) => onConfigurationChange('bodySizeMB', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}