import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessComponentAdapters } from '@/hooks/useBusinessComponentAdapters';
import { useDataStructures } from '@/hooks/useDataStructures';

interface RestReceiverAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number) => void;
}

export function RestReceiverAdapterConfiguration({
  configuration,
  onConfigurationChange
}: RestReceiverAdapterConfigurationProps) {
  const { businessComponents, loading } = useBusinessComponentAdapters();
  const { structures } = useDataStructures();
  const [selectedBusinessComponentId, setSelectedBusinessComponentId] = useState<string>('');
  const [sourceStructures, setSourceStructures] = useState<any[]>([]);

  // Filter structures based on selected business component
  useEffect(() => {
    if (selectedBusinessComponentId) {
      const filteredStructures = structures.filter(
        structure => structure.usage === 'source'
      );
      setSourceStructures(filteredStructures);
    } else {
      setSourceStructures([]);
    }
  }, [selectedBusinessComponentId, structures]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>REST Receiver Configuration</CardTitle>
        <CardDescription>Configure your REST receiver adapter settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="source" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-6">
            {/* Endpoint Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endpoint Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="targetEndpointUrl">Target Endpoint URL</Label>
                <Input
                  id="targetEndpointUrl"
                  type="text"
                  placeholder="https://api.thirdparty.com/endpoint"
                  value={configuration.targetEndpointUrl || ''}
                  onChange={(e) => onConfigurationChange('targetEndpointUrl', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Full URL of the 3rd party API</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourcePath">Resource Path</Label>
                <Input
                  id="resourcePath"
                  type="text"
                  placeholder="/submit, /orders"
                  value={configuration.resourcePath || ''}
                  onChange={(e) => onConfigurationChange('resourcePath', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Specific API resource or path</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiVersion">API Version</Label>
                <Input
                  id="apiVersion"
                  type="text"
                  placeholder="v1, v2"
                  value={configuration.apiVersion || ''}
                  onChange={(e) => onConfigurationChange('apiVersion', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">API version info</p>
              </div>
            </div>

            {/* Request Method and Format Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Method and Format</h3>
              
              <div className="space-y-2">
                <Label htmlFor="httpMethod">HTTP Method</Label>
                <Select
                  value={configuration.httpMethod || ''}
                  onValueChange={(value) => onConfigurationChange('httpMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select HTTP method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">HTTP verb to use</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentType">Content-Type</Label>
                <Select
                  value={configuration.contentType || ''}
                  onValueChange={(value) => onConfigurationChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application/json">application/json</SelectItem>
                    <SelectItem value="application/xml">application/xml</SelectItem>
                    <SelectItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</SelectItem>
                    <SelectItem value="text/plain">text/plain</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Media type sent in request body</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceptType">Accept</Label>
                <Select
                  value={configuration.acceptType || ''}
                  onValueChange={(value) => onConfigurationChange('acceptType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected response type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application/json">application/json</SelectItem>
                    <SelectItem value="application/xml">application/xml</SelectItem>
                    <SelectItem value="text/plain">text/plain</SelectItem>
                    <SelectItem value="text/html">text/html</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Expected media type in response</p>
              </div>
            </div>

            {/* Request Parameters Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Request Parameters</h3>
              
              <div className="space-y-2">
                <Label htmlFor="queryParameters">Query Parameters</Label>
                <Textarea
                  id="queryParameters"
                  placeholder="?page=1&size=10"
                  value={configuration.queryParameters || ''}
                  onChange={(e) => onConfigurationChange('queryParameters', e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">Optional query params for filtering/pagination</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeoutSettings">Timeout Settings (seconds)</Label>
                <Input
                  id="timeoutSettings"
                  type="number"
                  placeholder="30"
                  value={configuration.timeoutSettings || ''}
                  onChange={(e) => onConfigurationChange('timeoutSettings', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Connection and read timeout limits</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proxySettings">Proxy Settings</Label>
                <Textarea
                  id="proxySettings"
                  placeholder="Proxy host, port"
                  value={configuration.proxySettings || ''}
                  onChange={(e) => onConfigurationChange('proxySettings', e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">Optional HTTP proxy configuration</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* Authentication Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication</h3>
              
              <div className="space-y-2">
                <Label htmlFor="authenticationType">Authentication Type</Label>
                <Select
                  value={configuration.authenticationType || ''}
                  onValueChange={(value) => onConfigurationChange('authenticationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="oauth2-bearer">OAuth2 Bearer Token</SelectItem>
                    <SelectItem value="api-key">API Key</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Security method for outbound calls</p>
              </div>

              {configuration.authenticationType === 'basic' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="basicUsername">Username</Label>
                    <Input
                      id="basicUsername"
                      type="text"
                      placeholder="Basic auth username"
                      value={configuration.basicUsername || ''}
                      onChange={(e) => onConfigurationChange('basicUsername', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basicPassword">Password</Label>
                    <Input
                      id="basicPassword"
                      type="password"
                      placeholder="Basic auth password"
                      value={configuration.basicPassword || ''}
                      onChange={(e) => onConfigurationChange('basicPassword', e.target.value)}
                    />
                  </div>
                </>
              )}

              {configuration.authenticationType === 'oauth2-bearer' && (
                <div className="space-y-2">
                  <Label htmlFor="bearerToken">Bearer Token</Label>
                  <Input
                    id="bearerToken"
                    type="password"
                    placeholder="OAuth2 bearer token"
                    value={configuration.bearerToken || ''}
                    onChange={(e) => onConfigurationChange('bearerToken', e.target.value)}
                  />
                </div>
              )}

              {configuration.authenticationType === 'api-key' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="apiKeyName">API Key Name</Label>
                    <Input
                      id="apiKeyName"
                      type="text"
                      placeholder="X-API-Key"
                      value={configuration.apiKeyName || ''}
                      onChange={(e) => onConfigurationChange('apiKeyName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiKeyValue">API Key Value</Label>
                    <Input
                      id="apiKeyValue"
                      type="password"
                      placeholder="API key value"
                      value={configuration.apiKeyValue || ''}
                      onChange={(e) => onConfigurationChange('apiKeyValue', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Payload and Headers Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payload and Headers</h3>
              
              <div className="space-y-2">
                <Label htmlFor="businessComponent">Business Component</Label>
                <Select
                  value={selectedBusinessComponentId}
                  onValueChange={(value) => {
                    setSelectedBusinessComponentId(value);
                    onConfigurationChange('businessComponentId', value);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a business component" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {businessComponents.map((businessComponent) => (
                      <SelectItem key={businessComponent.id} value={businessComponent.id}>
                        {businessComponent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestPayloadFormat">Request Payload Format</Label>
                <Select
                  value={configuration.requestPayloadFormat || ''}
                  onValueChange={(value) => onConfigurationChange('requestPayloadFormat', value)}
                  disabled={!selectedBusinessComponentId || sourceStructures.length === 0}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select request structure" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {sourceStructures.map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.name} ({structure.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Schema and format of data sent</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseFormat">Response Format</Label>
                <Select
                  value={configuration.responseFormat || ''}
                  onValueChange={(value) => onConfigurationChange('responseFormat', value)}
                  disabled={!selectedBusinessComponentId || sourceStructures.length === 0}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select response structure" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {sourceStructures.map((structure) => (
                      <SelectItem key={structure.id} value={structure.id}>
                        {structure.name} ({structure.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Expected format of API response</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customHeaders">Custom Headers</Label>
                <Textarea
                  id="customHeaders"
                  placeholder="X-Request-ID, Authorization"
                  value={configuration.customHeaders || ''}
                  onChange={(e) => onConfigurationChange('customHeaders', e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">HTTP headers sent with requests</p>
              </div>
            </div>

            {/* Error Handling and Retry Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Error Handling and Retry</h3>
              
              <div className="space-y-2">
                <Label htmlFor="errorHandling">Error Handling</Label>
                <Textarea
                  id="errorHandling"
                  placeholder="HTTP 4xx/5xx codes, error JSON"
                  value={configuration.errorHandling || ''}
                  onChange={(e) => onConfigurationChange('errorHandling', e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">Expected error codes and handling logic</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryPolicy">Retry Policy</Label>
                <Textarea
                  id="retryPolicy"
                  placeholder="Number of retries, backoff strategy"
                  value={configuration.retryPolicy || ''}
                  onChange={(e) => onConfigurationChange('retryPolicy', e.target.value)}
                  className="min-h-[80px]"
                />
                <p className="text-sm text-muted-foreground">Rules for retrying failed requests</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}