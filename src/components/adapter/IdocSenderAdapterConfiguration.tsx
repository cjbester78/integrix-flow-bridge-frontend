import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface IdocSenderAdapterConfigurationProps {
  configuration: any;
  onConfigurationChange: (field: string, value: string | number) => void;
}

const connectionTypeOptions = [
  'Direct Application Server',
  'Load Balancing',
  'Message Server'
];

const idocTypeOptions = [
  'ORDERS05',
  'INVOIC02',
  'DELFOR03',
  'DESADV01',
  'MATMAS05'
];

const messageTypeOptions = [
  'ORDERS',
  'INVOIC',
  'DELFOR',
  'DESADV',
  'MATMAS'
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="security">Security / Encryption</TabsTrigger>
          </TabsList>

          <TabsContent value="source" className="space-y-6">
            {/* SAP System Identification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SAP System Identification</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sapSystemId">SAP System ID</Label>
                  <Input
                    id="sapSystemId"
                    type="text"
                    placeholder="Enter SAP System ID"
                    value={configuration.sapSystemId || ''}
                    onChange={(e) => onConfigurationChange('sapSystemId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientNumber">Client Number</Label>
                  <Input
                    id="clientNumber"
                    type="text"
                    placeholder="Enter client number"
                    value={configuration.clientNumber || ''}
                    onChange={(e) => onConfigurationChange('clientNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemNumber">System Number</Label>
                  <Input
                    id="systemNumber"
                    type="text"
                    placeholder="Enter system number"
                    value={configuration.systemNumber || ''}
                    onChange={(e) => onConfigurationChange('systemNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Connection Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sapAppServerHost">SAP App Server Host</Label>
                  <Input
                    id="sapAppServerHost"
                    type="text"
                    placeholder="Enter SAP application server host"
                    value={configuration.sapAppServerHost || ''}
                    onChange={(e) => onConfigurationChange('sapAppServerHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gatewayHostService">Gateway Host/Service</Label>
                  <Input
                    id="gatewayHostService"
                    type="text"
                    placeholder="Enter gateway host/service"
                    value={configuration.gatewayHostService || ''}
                    onChange={(e) => onConfigurationChange('gatewayHostService', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="Enter port number"
                    value={configuration.port || ''}
                    onChange={(e) => onConfigurationChange('port', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connectionType">Connection Type</Label>
                  <Select 
                    value={configuration.connectionType || ''} 
                    onValueChange={(value) => onConfigurationChange('connectionType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectionTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sapUser">SAP User</Label>
                  <Input
                    id="sapUser"
                    type="text"
                    placeholder="Enter SAP username"
                    value={configuration.sapUser || ''}
                    onChange={(e) => onConfigurationChange('sapUser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sapPassword">SAP Password</Label>
                  <Input
                    id="sapPassword"
                    type="password"
                    placeholder="Enter SAP password"
                    value={configuration.sapPassword || ''}
                    onChange={(e) => onConfigurationChange('sapPassword', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* RFC Destination */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">RFC Destination</h3>
              <div className="space-y-2">
                <Label htmlFor="rfcDestinationName">RFC Destination Name</Label>
                <Input
                  id="rfcDestinationName"
                  type="text"
                  placeholder="Enter RFC destination name"
                  value={configuration.rfcDestinationName || ''}
                  onChange={(e) => onConfigurationChange('rfcDestinationName', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            {/* IDoc Routing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">IDoc Routing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idocPort">IDoc Port</Label>
                  <Input
                    id="idocPort"
                    type="text"
                    placeholder="Enter IDoc port"
                    value={configuration.idocPort || ''}
                    onChange={(e) => onConfigurationChange('idocPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="listenerServiceName">Listener Service Name</Label>
                  <Input
                    id="listenerServiceName"
                    type="text"
                    placeholder="Enter listener service name"
                    value={configuration.listenerServiceName || ''}
                    onChange={(e) => onConfigurationChange('listenerServiceName', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* IDoc Identification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">IDoc Identification</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idocType">IDoc Type</Label>
                  <Select 
                    value={configuration.idocType || ''} 
                    onValueChange={(value) => onConfigurationChange('idocType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select IDoc type" />
                    </SelectTrigger>
                    <SelectContent>
                      {idocTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageType">Message Type</Label>
                  <Select 
                    value={configuration.messageType || ''} 
                    onValueChange={(value) => onConfigurationChange('messageType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processCode">Process Code</Label>
                  <Input
                    id="processCode"
                    type="text"
                    placeholder="Enter process code"
                    value={configuration.processCode || ''}
                    onChange={(e) => onConfigurationChange('processCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* SNC / Security Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">SNC / Security Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sncSettings">SNC Settings</Label>
                  <Textarea
                    id="sncSettings"
                    placeholder="Configure SNC (Secure Network Communications) settings"
                    value={configuration.sncSettings || ''}
                    onChange={(e) => onConfigurationChange('sncSettings', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sncMode">SNC Mode</Label>
                    <Select 
                      value={configuration.sncMode || ''} 
                      onValueChange={(value) => onConfigurationChange('sncMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SNC mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Disabled</SelectItem>
                        <SelectItem value="1">Authentication only</SelectItem>
                        <SelectItem value="2">Integrity protection</SelectItem>
                        <SelectItem value="3">Privacy protection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sncQoP">SNC Quality of Protection</Label>
                    <Select 
                      value={configuration.sncQoP || ''} 
                      onValueChange={(value) => onConfigurationChange('sncQoP', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select QoP level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Authentication</SelectItem>
                        <SelectItem value="2">Integrity</SelectItem>
                        <SelectItem value="3">Privacy</SelectItem>
                        <SelectItem value="8">Use SNC's default</SelectItem>
                        <SelectItem value="9">Use maximum available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}