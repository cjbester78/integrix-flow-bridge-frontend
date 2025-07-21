import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
              <h3 className="text-lg font-medium">Connection Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="endpointUrl">Endpoint URL</Label>
                <Input
                  id="endpointUrl"
                  type="text"
                  placeholder="The URL where the 3rd party sends requests"
                  value={configuration.endpointUrl || ''}
                  onChange={(e) => onConfigurationChange('endpointUrl', e.target.value)}
                />
              </div>

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
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="text/xml">text/xml</SelectItem>
                    <SelectItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</SelectItem>
                    <SelectItem value="text/plain">text/plain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sslConfig">SSL/TLS Configuration</Label>
                <Textarea
                  id="sslConfig"
                  placeholder="SSL certificates/truststore info for HTTPS"
                  value={configuration.sslConfig || ''}
                  onChange={(e) => onConfigurationChange('sslConfig', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiVersion">API Version</Label>
                <Input
                  id="apiVersion"
                  type="text"
                  placeholder="Version of the API being called"
                  value={configuration.apiVersion || ''}
                  onChange={(e) => onConfigurationChange('apiVersion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimits">Throttling/Rate Limits</Label>
                <Input
                  id="rateLimits"
                  type="text"
                  placeholder="Limits on calls per time period"
                  value={configuration.rateLimits || ''}
                  onChange={(e) => onConfigurationChange('rateLimits', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* Data Handling Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Handling</h3>
              
              <div className="space-y-2">
                <Label htmlFor="requestPayloadFormat">Request Payload Format</Label>
                <Textarea
                  id="requestPayloadFormat"
                  placeholder="Expected format and schema of the incoming data"
                  value={configuration.requestPayloadFormat || ''}
                  onChange={(e) => onConfigurationChange('requestPayloadFormat', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseFormat">Response Format</Label>
                <Textarea
                  id="responseFormat"
                  placeholder="Format and schema of the response sent back"
                  value={configuration.responseFormat || ''}
                  onChange={(e) => onConfigurationChange('responseFormat', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customHeaders">Custom Headers</Label>
                <Textarea
                  id="customHeaders"
                  placeholder="Additional HTTP headers needed (e.g., correlation ID)"
                  value={configuration.customHeaders || ''}
                  onChange={(e) => onConfigurationChange('customHeaders', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security</h3>
              
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
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="oauth2-client-credentials">OAuth2 Client Credentials</SelectItem>
                    <SelectItem value="oauth2-saml-bearer">OAuth2 SAML Bearer Assertion</SelectItem>
                    <SelectItem value="client-certificate">Client Certificate</SelectItem>
                  </SelectContent>
                </Select>
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

              {configuration.authenticationType === 'oauth2-client-credentials' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      type="text"
                      placeholder="OAuth2 client ID"
                      value={configuration.clientId || ''}
                      onChange={(e) => onConfigurationChange('clientId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="OAuth2 client secret"
                      value={configuration.clientSecret || ''}
                      onChange={(e) => onConfigurationChange('clientSecret', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokenUrl">Token URL</Label>
                    <Input
                      id="tokenUrl"
                      type="text"
                      placeholder="OAuth2 token endpoint URL"
                      value={configuration.tokenUrl || ''}
                      onChange={(e) => onConfigurationChange('tokenUrl', e.target.value)}
                    />
                  </div>
                </>
              )}

              {configuration.authenticationType === 'client-certificate' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="certificatePath">Certificate Path</Label>
                    <Input
                      id="certificatePath"
                      type="text"
                      placeholder="Path to client certificate"
                      value={configuration.certificatePath || ''}
                      onChange={(e) => onConfigurationChange('certificatePath', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privateKeyPath">Private Key Path</Label>
                    <Input
                      id="privateKeyPath"
                      type="text"
                      placeholder="Path to private key"
                      value={configuration.privateKeyPath || ''}
                      onChange={(e) => onConfigurationChange('privateKeyPath', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Response & Error Handling Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Response & Error Handling</h3>
              
              <div className="space-y-2">
                <Label htmlFor="errorHandling">Error Handling</Label>
                <Textarea
                  id="errorHandling"
                  placeholder="Expected error codes and their meanings"
                  value={configuration.errorHandling || ''}
                  onChange={(e) => onConfigurationChange('errorHandling', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryPolicy">Retry Policy</Label>
                <Textarea
                  id="retryPolicy"
                  placeholder="Instructions on retries or idempotency"
                  value={configuration.retryPolicy || ''}
                  onChange={(e) => onConfigurationChange('retryPolicy', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}