import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface IdocReceiverAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number | boolean) => void;
}

const contentTypeOptions = [
  'Application/x-sap.idoc',
  'Text/XML'
];

const authenticationOptions = [
  'None',
  'Basic',
  'Client Certificate'
];

export function IdocReceiverAdapterConfiguration({
  configuration,
  onConfigurationChange
}: IdocReceiverAdapterConfigurationProps) {
  const renderAuthenticationFields = () => {
    const authType = configuration.authenticationType;
    
    switch (authType) {
      case 'Basic':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={configuration.username || ''}
                onChange={(e) => onConfigurationChange('username', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={configuration.password || ''}
                onChange={(e) => onConfigurationChange('password', e.target.value)}
              />
            </div>
          </div>
        );
      case 'Client Certificate':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificatePath">Certificate Path</Label>
              <Input
                id="certificatePath"
                type="text"
                placeholder="Enter certificate path"
                value={configuration.certificatePath || ''}
                onChange={(e) => onConfigurationChange('certificatePath', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyPath">Key Path</Label>
              <Input
                id="keyPath"
                type="text"
                placeholder="Enter key path"
                value={configuration.keyPath || ''}
                onChange={(e) => onConfigurationChange('keyPath', e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IDOC Receiver Configuration</CardTitle>
        <CardDescription>Configure your IDOC receiver adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="target" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="target">Target</TabsTrigger>
          </TabsList>

          <TabsContent value="target" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Details</h3>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="idocContentType">IDOC Content Type</Label>
                  <Select 
                    value={configuration.idocContentType || ''} 
                    onValueChange={(value) => onConfigurationChange('idocContentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authenticationType">Authentication</Label>
                  <Select 
                    value={configuration.authenticationType || 'None'} 
                    onValueChange={(value) => onConfigurationChange('authenticationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select authentication method" />
                    </SelectTrigger>
                    <SelectContent>
                      {authenticationOptions.map((auth) => (
                        <SelectItem key={auth} value={auth}>
                          {auth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeoutSec">Timeout (in sec)</Label>
                  <Input
                    id="timeoutSec"
                    type="number"
                    placeholder="Enter timeout in seconds"
                    value={configuration.timeoutSec || ''}
                    onChange={(e) => onConfigurationChange('timeoutSec', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              {renderAuthenticationFields()}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepAlive"
                    checked={configuration.keepAlive || false}
                    onCheckedChange={(checked) => onConfigurationChange('keepAlive', checked)}
                  />
                  <Label htmlFor="keepAlive">Keep Alive</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compressMessage"
                    checked={configuration.compressMessage || false}
                    onCheckedChange={(checked) => onConfigurationChange('compressMessage', checked)}
                  />
                  <Label htmlFor="compressMessage">Compress Message</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowChunking"
                    checked={configuration.allowChunking || false}
                    onCheckedChange={(checked) => onConfigurationChange('allowChunking', checked)}
                  />
                  <Label htmlFor="allowChunking">Allow Chunking</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="returnHttpResponseCodeAsHeader"
                    checked={configuration.returnHttpResponseCodeAsHeader || false}
                    onCheckedChange={(checked) => onConfigurationChange('returnHttpResponseCodeAsHeader', checked)}
                  />
                  <Label htmlFor="returnHttpResponseCodeAsHeader">Return HTTP Response Code as Header</Label>
                </div>
                
                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="cleanupRequestHeaders"
                    checked={configuration.cleanupRequestHeaders || false}
                    onCheckedChange={(checked) => onConfigurationChange('cleanupRequestHeaders', checked)}
                  />
                  <Label htmlFor="cleanupRequestHeaders">Clean-up Request Headers</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}