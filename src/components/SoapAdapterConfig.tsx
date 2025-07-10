import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface SoapAdapterConfigProps {
  adapterMode: 'sender' | 'receiver';
  configuration: Record<string, any>;
  onConfigurationChange: (fieldName: string, value: any) => void;
}

export const SoapAdapterConfig = ({ 
  adapterMode, 
  configuration, 
  onConfigurationChange 
}: SoapAdapterConfigProps) => {
  const [activeTab, setActiveTab] = useState('sender');

  const handleCheckboxChange = (fieldName: string, checked: boolean) => {
    onConfigurationChange(fieldName, checked);
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          SOAP Adapter Configuration
        </CardTitle>
        <CardDescription>Configure SOAP web services integration with Sender, Receiver, and additional settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sender">Sender</TabsTrigger>
            <TabsTrigger value="receiver">Receiver</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>

          {/* Sender Tab */}
          <TabsContent value="sender" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sender">Sender *</Label>
                <Select 
                  value={configuration.sender || ''} 
                  onValueChange={(value) => onConfigurationChange('sender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S4H">S4H</SelectItem>
                    <SelectItem value="CPI">CPI</SelectItem>
                    <SelectItem value="BTP">BTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adapterType">Adapter Type *</Label>
                <Select 
                  value="SOAP" 
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Connection</h4>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="senderAddress">Address *</Label>
                <Input
                  id="senderAddress"
                  placeholder="/UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation"
                  value={configuration.senderAddress || ''}
                  onChange={(e) => onConfigurationChange('senderAddress', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="senderWsdlUrl" className="flex items-center gap-2">
                  URL to WSDL *
                  <Button variant="outline" size="sm">Select</Button>
                </Label>
                <Input
                  id="senderWsdlUrl"
                  placeholder="/wsdl/UtilitiesDeviceERPSmartMeterRegisterBulkCreateConfirmation_Out.wsdl"
                  value={configuration.senderWsdlUrl || ''}
                  onChange={(e) => onConfigurationChange('senderWsdlUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="senderAuthorization">Authorization *</Label>
                <Select 
                  value={configuration.senderAuthorization || ''} 
                  onValueChange={(value) => onConfigurationChange('senderAuthorization', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authorization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User Role">User Role</SelectItem>
                    <SelectItem value="Basic Auth">Basic Auth</SelectItem>
                    <SelectItem value="Client Certificate">Client Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="senderUserRole" className="flex items-center gap-2">
                  User Role *
                  <Button variant="outline" size="sm">Select</Button>
                </Label>
                <Input
                  id="senderUserRole"
                  placeholder="ESBMessaging.send"
                  value={configuration.senderUserRole || ''}
                  onChange={(e) => onConfigurationChange('senderUserRole', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Conditions</h4>
              </div>

              <div>
                <Label htmlFor="bodySizeMB">Body Size (in MB)</Label>
                <Input
                  id="bodySizeMB"
                  type="number"
                  placeholder="40"
                  value={configuration.bodySizeMB || ''}
                  onChange={(e) => onConfigurationChange('bodySizeMB', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="attachmentsSizeMB">Attachments Size (in MB)</Label>
                <Input
                  id="attachmentsSizeMB"
                  type="number"
                  placeholder="100"
                  value={configuration.attachmentsSizeMB || ''}
                  onChange={(e) => onConfigurationChange('attachmentsSizeMB', e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Receiver Tab */}
          <TabsContent value="receiver" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="receiver">Receiver *</Label>
                <Select 
                  value={configuration.receiver || ''} 
                  onValueChange={(value) => onConfigurationChange('receiver', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select receiver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MDUS">MDUS</SelectItem>
                    <SelectItem value="CPI">CPI</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adapterTypeReceiver">Adapter Type *</Label>
                <Select 
                  value="SOAP" 
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Connection</h4>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="receiverAddress">Address *</Label>
                <Input
                  id="receiverAddress"
                  placeholder="Target system endpoint address"
                  value={configuration.receiverAddress || ''}
                  onChange={(e) => onConfigurationChange('receiverAddress', e.target.value)}
                  className="bg-red-50 border-red-200"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="receiverWsdlUrl" className="flex items-center gap-2">
                  URL to WSDL *
                  <Button variant="outline" size="sm">Select</Button>
                </Label>
                <Input
                  id="receiverWsdlUrl"
                  placeholder="WSDL URL for receiver service"
                  value={configuration.receiverWsdlUrl || ''}
                  onChange={(e) => onConfigurationChange('receiverWsdlUrl', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="service" className="flex items-center gap-2">
                  Service *
                </Label>
                <Input
                  id="service"
                  placeholder="Service name from WSDL"
                  value={configuration.service || ''}
                  onChange={(e) => onConfigurationChange('service', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endpoint" className="flex items-center gap-2">
                  Endpoint *
                </Label>
                <Input
                  id="endpoint"
                  placeholder="Endpoint name from WSDL"
                  value={configuration.endpoint || ''}
                  onChange={(e) => onConfigurationChange('endpoint', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="operationName" className="flex items-center gap-2">
                  Operation Name *
                </Label>
                <Input
                  id="operationName"
                  placeholder="Operation name from WSDL"
                  value={configuration.operationName || ''}
                  onChange={(e) => onConfigurationChange('operationName', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="proxyType">Proxy Type</Label>
                <Select 
                  value={configuration.proxyType || 'Internet'} 
                  onValueChange={(value) => onConfigurationChange('proxyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internet">Internet</SelectItem>
                    <SelectItem value="On-Premise">On-Premise</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="receiverAuthentication">Authentication</Label>
                <Select 
                  value={configuration.receiverAuthentication || 'Basic'} 
                  onValueChange={(value) => onConfigurationChange('receiverAuthentication', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Client Certificate">Client Certificate</SelectItem>
                    <SelectItem value="OAuth">OAuth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="credentialName">Credential Name</Label>
                <Input
                  id="credentialName"
                  placeholder="Credential alias for authentication"
                  value={configuration.credentialName || ''}
                  onChange={(e) => onConfigurationChange('credentialName', e.target.value)}
                  className="bg-red-50 border-red-200"
                />
              </div>

              <div>
                <Label htmlFor="receiverTimeout">Timeout (in ms)</Label>
                <Input
                  id="receiverTimeout"
                  type="number"
                  placeholder="60000"
                  value={configuration.receiverTimeout || '60000'}
                  onChange={(e) => onConfigurationChange('receiverTimeout', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepAlive" 
                  checked={configuration.keepAlive || false}
                  onCheckedChange={(checked) => handleCheckboxChange('keepAlive', checked as boolean)}
                />
                <Label htmlFor="keepAlive">Keep-Alive</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="compressMessage" 
                  checked={configuration.compressMessage || false}
                  onCheckedChange={(checked) => handleCheckboxChange('compressMessage', checked as boolean)}
                />
                <Label htmlFor="compressMessage">Compress Message</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allowChunking" 
                  checked={configuration.allowChunking || false}
                  onCheckedChange={(checked) => handleCheckboxChange('allowChunking', checked as boolean)}
                />
                <Label htmlFor="allowChunking">Allow Chunking</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="returnHttpResponseCodeAsHeader" 
                  checked={configuration.returnHttpResponseCodeAsHeader || false}
                  onCheckedChange={(checked) => handleCheckboxChange('returnHttpResponseCodeAsHeader', checked as boolean)}
                />
                <Label htmlFor="returnHttpResponseCodeAsHeader">Return HTTP Response Code as Header</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cleanupRequestHeaders" 
                  checked={configuration.cleanupRequestHeaders || false}
                  onCheckedChange={(checked) => handleCheckboxChange('cleanupRequestHeaders', checked as boolean)}
                />
                <Label htmlFor="cleanupRequestHeaders">Clean-up Request Headers</Label>
              </div>

              <div className="md:col-span-2">
                <Separator className="my-4" />
                <h4 className="font-medium text-sm text-muted-foreground mb-4">Processing</h4>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="sapRmMessageIdDetermination">SAP RM Message ID Determination</Label>
                <Select 
                  value={configuration.sapRmMessageIdDetermination || 'Reuse'} 
                  onValueChange={(value) => onConfigurationChange('sapRmMessageIdDetermination', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reuse">Reuse</SelectItem>
                    <SelectItem value="Generate">Generate</SelectItem>
                    <SelectItem value="Map">Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* More Tab */}
          <TabsContent value="more" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parameterType">Type</Label>
                <Select 
                  value={configuration.parameterType || 'All Parameters'} 
                  onValueChange={(value) => onConfigurationChange('parameterType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Parameters">All Parameters</SelectItem>
                    <SelectItem value="Selected Parameters">Selected Parameters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="allowHeader">Allow_Header</Label>
                <Input
                  id="allowHeader"
                  placeholder="Header configuration"
                  value={configuration.allowHeader || ''}
                  onChange={(e) => onConfigurationChange('allowHeader', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="httpSessionReuse">HTTP_Session_Reuse</Label>
                <Select 
                  value={configuration.httpSessionReuse || 'None'} 
                  onValueChange={(value) => onConfigurationChange('httpSessionReuse', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Session">Session</SelectItem>
                    <SelectItem value="Connection">Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="returnExceptionToSender" 
                  checked={configuration.returnExceptionToSender || false}
                  onCheckedChange={(checked) => handleCheckboxChange('returnExceptionToSender', checked as boolean)}
                />
                <Label htmlFor="returnExceptionToSender">Return_Exception_to_Sender</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};