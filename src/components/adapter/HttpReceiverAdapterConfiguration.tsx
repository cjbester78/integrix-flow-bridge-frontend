import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface HttpReceiverAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number | boolean) => void;
}

const methodOptions = [
  'Dynamic', 'Get', 'Post', 'Put', 'Delete', 'Head', 'Trace', 'Patch'
];

const authenticationOptions = [
  'None', 'Basic', 'OAuth2 Client Credentials', 'OAuth2 SAML Bearer Assertion', 'Client Certificate'
];

export function HttpReceiverAdapterConfiguration({
  configuration,
  onConfigurationChange
}: HttpReceiverAdapterConfigurationProps) {
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
      case 'OAuth2 Client Credentials':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                type="text"
                placeholder="Enter client ID"
                value={configuration.clientId || ''}
                onChange={(e) => onConfigurationChange('clientId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Enter client secret"
                value={configuration.clientSecret || ''}
                onChange={(e) => onConfigurationChange('clientSecret', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenUrl">Token URL</Label>
              <Input
                id="tokenUrl"
                type="text"
                placeholder="Enter token URL"
                value={configuration.tokenUrl || ''}
                onChange={(e) => onConfigurationChange('tokenUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope">Scope</Label>
              <Input
                id="scope"
                type="text"
                placeholder="Enter scope"
                value={configuration.scope || ''}
                onChange={(e) => onConfigurationChange('scope', e.target.value)}
              />
            </div>
          </div>
        );
      case 'OAuth2 SAML Bearer Assertion':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assertionToken">Assertion Token</Label>
              <Input
                id="assertionToken"
                type="text"
                placeholder="Enter assertion token"
                value={configuration.assertionToken || ''}
                onChange={(e) => onConfigurationChange('assertionToken', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenUrl">Token URL</Label>
              <Input
                id="tokenUrl"
                type="text"
                placeholder="Enter token URL"
                value={configuration.tokenUrl || ''}
                onChange={(e) => onConfigurationChange('tokenUrl', e.target.value)}
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
        <CardTitle>HTTP Receiver Configuration</CardTitle>
        <CardDescription>Configure your HTTP receiver adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="target" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="target">Target</TabsTrigger>
          </TabsList>

          <TabsContent value="target" className="space-y-6">
            {/* Connection Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    type="text"
                    placeholder="Enter host"
                    value={configuration.host || ''}
                    onChange={(e) => onConfigurationChange('host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="Enter port"
                    value={configuration.port || ''}
                    onChange={(e) => onConfigurationChange('port', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="path">Path</Label>
                  <Input
                    id="path"
                    type="text"
                    placeholder="Enter path"
                    value={configuration.path || ''}
                    onChange={(e) => onConfigurationChange('path', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="query">Query</Label>
                  <Input
                    id="query"
                    type="text"
                    placeholder="Enter query parameters"
                    value={configuration.query || ''}
                    onChange={(e) => onConfigurationChange('query', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <Select 
                    value={configuration.method || ''} 
                    onValueChange={(value) => onConfigurationChange('method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {methodOptions.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (in ms)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    placeholder="Enter timeout in milliseconds"
                    value={configuration.timeout || ''}
                    onChange={(e) => onConfigurationChange('timeout', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-4">
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
                
                {renderAuthenticationFields()}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="throwExceptionOnFailure"
                    checked={configuration.throwExceptionOnFailure || false}
                    onCheckedChange={(checked) => onConfigurationChange('throwExceptionOnFailure', checked)}
                  />
                  <Label htmlFor="throwExceptionOnFailure">Throw Exception on Failure</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attachErrorDetailsOnFailure"
                    checked={configuration.attachErrorDetailsOnFailure || false}
                    onCheckedChange={(checked) => onConfigurationChange('attachErrorDetailsOnFailure', checked)}
                  />
                  <Label htmlFor="attachErrorDetailsOnFailure">Attach Error Details on Failure</Label>
                </div>
              </div>
            </div>

            {/* Header Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Header Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestHeaders">Request Headers</Label>
                  <Textarea
                    id="requestHeaders"
                    placeholder="Enter request headers (key: value format, one per line)"
                    value={configuration.requestHeaders || ''}
                    onChange={(e) => onConfigurationChange('requestHeaders', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseHeaders">Response Headers</Label>
                  <Textarea
                    id="responseHeaders"
                    placeholder="Enter response headers (key: value format, one per line)"
                    value={configuration.responseHeaders || ''}
                    onChange={(e) => onConfigurationChange('responseHeaders', e.target.value)}
                    rows={4}
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