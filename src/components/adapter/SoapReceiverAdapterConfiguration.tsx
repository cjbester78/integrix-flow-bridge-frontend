import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SoapReceiverAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: any) => void;
}

export function SoapReceiverAdapterConfiguration({
  configuration,
  onConfigurationChange
}: SoapReceiverAdapterConfigurationProps) {
  const handleAuthTypeChange = (authType: string) => {
    onConfigurationChange('authentication.type', authType);
    // Reset auth-specific fields when type changes
    onConfigurationChange('authentication.credentials', {});
  };

  const handleAuthFieldChange = (field: string, value: string) => {
    const credentials = { ...(configuration.authentication?.credentials || {}) };
    credentials[field] = value;
    onConfigurationChange('authentication.credentials', credentials);
  };

  const renderAuthFields = () => {
    const authType = configuration.authentication?.type;
    const credentials = configuration.authentication?.credentials || {};

    switch (authType) {
      case 'basic':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="auth-username">Username</Label>
              <Input
                id="auth-username"
                value={credentials.username || ''}
                onChange={(e) => handleAuthFieldChange('username', e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                value={credentials.password || ''}
                onChange={(e) => handleAuthFieldChange('password', e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
        );
      case 'ws-security':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="auth-username">Username</Label>
              <Input
                id="auth-username"
                value={credentials.username || ''}
                onChange={(e) => handleAuthFieldChange('username', e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                value={credentials.password || ''}
                onChange={(e) => handleAuthFieldChange('password', e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
        );
      case 'oauth':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="auth-client-id">Client ID</Label>
              <Input
                id="auth-client-id"
                value={credentials.clientId || ''}
                onChange={(e) => handleAuthFieldChange('clientId', e.target.value)}
                placeholder="Enter client ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-client-secret">Client Secret</Label>
              <Input
                id="auth-client-secret"
                type="password"
                value={credentials.clientSecret || ''}
                onChange={(e) => handleAuthFieldChange('clientSecret', e.target.value)}
                placeholder="Enter client secret"
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
        <CardTitle>SOAP Receiver Configuration</CardTitle>
        <CardDescription>Configure your SOAP receiver adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="target" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="target">Target</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="target" className="space-y-6">
            {/* Endpoint Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endpoint Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-endpoint">Target Endpoint URL</Label>
                  <Input
                    id="target-endpoint"
                    value={configuration.targetEndpointUrl || ''}
                    onChange={(e) => onConfigurationChange('targetEndpointUrl', e.target.value)}
                    placeholder="https://api.thirdparty.com/soap/service"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wsdl-url">WSDL URL</Label>
                  <Input
                    id="wsdl-url"
                    value={configuration.wsdlUrl || ''}
                    onChange={(e) => onConfigurationChange('wsdlUrl', e.target.value)}
                    placeholder="https://api.thirdparty.com/soap/service?wsdl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soap-action">SOAP Action</Label>
                  <Input
                    id="soap-action"
                    value={configuration.soapAction || ''}
                    onChange={(e) => onConfigurationChange('soapAction', e.target.value)}
                    placeholder="urn:submitOrder"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soap-version">SOAP Version</Label>
                  <Select
                    value={configuration.soapVersion || ''}
                    onValueChange={(value) => onConfigurationChange('soapVersion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select SOAP version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1">SOAP 1.1</SelectItem>
                      <SelectItem value="1.2">SOAP 1.2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Request Format Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Format</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-message">Request Message</Label>
                  <Textarea
                    id="request-message"
                    value={configuration.requestMessage || ''}
                    onChange={(e) => onConfigurationChange('requestMessage', e.target.value)}
                    placeholder="XML schema / structure sent in SOAP request"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content-Type</Label>
                  <Select
                    value={configuration.contentType || ''}
                    onValueChange={(value) => onConfigurationChange('contentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text/xml">text/xml</SelectItem>
                      <SelectItem value="application/soap+xml">application/soap+xml</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Connection Parameters Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="connection-timeout">Connection Timeout (seconds)</Label>
                  <Input
                    id="connection-timeout"
                    type="number"
                    value={configuration.connectionTimeout || ''}
                    onChange={(e) => onConfigurationChange('connectionTimeout', parseInt(e.target.value) || 0)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read-timeout">Read Timeout (seconds)</Label>
                  <Input
                    id="read-timeout"
                    type="number"
                    value={configuration.readTimeout || ''}
                    onChange={(e) => onConfigurationChange('readTimeout', parseInt(e.target.value) || 0)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="proxy-settings">Proxy Settings</Label>
                  <Input
                    id="proxy-settings"
                    value={configuration.proxySettings || ''}
                    onChange={(e) => onConfigurationChange('proxySettings', e.target.value)}
                    placeholder="Optional proxy hostname and port"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* Authentication & Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication & Security</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="auth-type">Authentication Type</Label>
                  <Select
                    value={configuration.authentication?.type || 'none'}
                    onValueChange={handleAuthTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select authentication type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="ws-security">WS-Security UsernameToken</SelectItem>
                      <SelectItem value="oauth">OAuth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {renderAuthFields()}
              </div>
            </div>

            {/* Headers and Metadata Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Headers and Metadata</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-headers">Custom SOAP Headers</Label>
                  <Textarea
                    id="custom-headers"
                    value={configuration.customHeaders || ''}
                    onChange={(e) => onConfigurationChange('customHeaders', e.target.value)}
                    placeholder="Additional SOAP headers required by service (WS-Addressing, Custom headers)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fault-handling">SOAP Fault Handling</Label>
                  <Textarea
                    id="fault-handling"
                    value={configuration.faultHandling || ''}
                    onChange={(e) => onConfigurationChange('faultHandling', e.target.value)}
                    placeholder="Expected fault codes and fault handling logic"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Response Format and Error Handling Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Response Format and Error Handling</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="response-message">Response Message</Label>
                  <Textarea
                    id="response-message"
                    value={configuration.responseMessage || ''}
                    onChange={(e) => onConfigurationChange('responseMessage', e.target.value)}
                    placeholder="Expected SOAP response XML schema"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error-handling">Error Handling</Label>
                  <Textarea
                    id="error-handling"
                    value={configuration.errorHandling || ''}
                    onChange={(e) => onConfigurationChange('errorHandling', e.target.value)}
                    placeholder="Expected SOAP fault codes and error handling"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry-policy">Retry Policy</Label>
                  <Textarea
                    id="retry-policy"
                    value={configuration.retryPolicy || ''}
                    onChange={(e) => onConfigurationChange('retryPolicy', e.target.value)}
                    placeholder="Rules for retrying failed SOAP calls (Number of retries, backoff strategy)"
                    rows={3}
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