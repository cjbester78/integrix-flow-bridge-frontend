import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IdocSenderAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number) => void;
}

const invalidXmlCharacterOptions = [
  'Replace with space',
  'Remove',
  'Throw error',
  'Replace with underscore'
];

export function IdocSenderAdapterConfiguration({
  configuration,
  onConfigurationChange
}: IdocSenderAdapterConfigurationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IDOC Sender Configuration</CardTitle>
        <CardDescription>Configure your IDOC sender adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="source" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Details</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={configuration.address || ''}
                  onChange={(e) => onConfigurationChange('address', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">IDOC Processing Details</h3>
              <div className="space-y-2">
                <Label htmlFor="invalidXmlCharacterHandling">Invalid XML Character Handling</Label>
                <Select 
                  value={configuration.invalidXmlCharacterHandling || ''} 
                  onValueChange={(value) => onConfigurationChange('invalidXmlCharacterHandling', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select handling method" />
                  </SelectTrigger>
                  <SelectContent>
                    {invalidXmlCharacterOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maximum Message Size</h3>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="attachmentSizeMB">Attachment Size (in MB)</Label>
                  <Input
                    id="attachmentSizeMB"
                    type="number"
                    placeholder="Enter attachment size in MB"
                    value={configuration.attachmentSizeMB || ''}
                    onChange={(e) => onConfigurationChange('attachmentSizeMB', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}