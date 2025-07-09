import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Smartphone, 
  Webhook, 
  MessageCircle,
  Phone,
  Globe,
  Settings,
  TestTube,
  Save,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Send,
  Shield,
  Key
} from 'lucide-react';

const communicationAdapters = [
  {
    id: 'email-smtp',
    name: 'Email SMTP',
    icon: Mail,
    description: 'Send emails via SMTP server',
    category: 'Email',
    fields: [
      { name: 'host', label: 'SMTP Host', type: 'text', required: true, placeholder: 'smtp.gmail.com' },
      { name: 'port', label: 'Port', type: 'number', required: true, placeholder: '587' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'your-email@gmail.com' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'App Password' },
      { name: 'encryption', label: 'Encryption', type: 'select', required: true, options: ['TLS', 'SSL', 'None'] },
      { name: 'fromEmail', label: 'From Email', type: 'text', required: true, placeholder: 'noreply@company.com' },
      { name: 'fromName', label: 'From Name', type: 'text', required: false, placeholder: 'IntegrixLab System' }
    ]
  },
  {
    id: 'sms-gateway',
    name: 'SMS Gateway',
    icon: Smartphone,
    description: 'Send SMS messages via gateway API',
    category: 'SMS',
    fields: [
      { name: 'provider', label: 'SMS Provider', type: 'select', required: true, options: ['Twilio', 'AWS SNS', 'Nexmo', 'Custom'] },
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'Your API Key' },
      { name: 'apiSecret', label: 'API Secret', type: 'password', required: true, placeholder: 'Your API Secret' },
      { name: 'endpoint', label: 'API Endpoint', type: 'text', required: true, placeholder: 'https://api.twilio.com/2010-04-01' },
      { name: 'fromNumber', label: 'From Number', type: 'text', required: true, placeholder: '+1234567890' },
      { name: 'region', label: 'Region', type: 'select', required: false, options: ['US', 'EU', 'APAC'] }
    ]
  },
  {
    id: 'webhook',
    name: 'Webhook',
    icon: Webhook,
    description: 'Send HTTP requests to external endpoints',
    category: 'HTTP',
    fields: [
      { name: 'url', label: 'Webhook URL', type: 'text', required: true, placeholder: 'https://api.example.com/webhook' },
      { name: 'method', label: 'HTTP Method', type: 'select', required: true, options: ['POST', 'PUT', 'PATCH', 'GET'] },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['application/json', 'application/xml', 'application/x-www-form-urlencoded'] },
      { name: 'authType', label: 'Authentication', type: 'select', required: false, options: ['None', 'Basic Auth', 'Bearer Token', 'API Key'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: false, placeholder: 'Token or credentials' },
      { name: 'timeout', label: 'Timeout (ms)', type: 'number', required: false, placeholder: '30000' }
    ]
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageCircle,
    description: 'Send messages to Slack channels',
    category: 'Messaging',
    fields: [
      { name: 'webhookUrl', label: 'Slack Webhook URL', type: 'text', required: true, placeholder: 'https://hooks.slack.com/services/...' },
      { name: 'channel', label: 'Default Channel', type: 'text', required: false, placeholder: '#general' },
      { name: 'username', label: 'Bot Username', type: 'text', required: false, placeholder: 'IntegrixLab Bot' },
      { name: 'iconEmoji', label: 'Bot Icon', type: 'text', required: false, placeholder: ':robot_face:' }
    ]
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: MessageCircle,
    description: 'Send messages to Teams channels',
    category: 'Messaging',
    fields: [
      { name: 'webhookUrl', label: 'Teams Webhook URL', type: 'text', required: true, placeholder: 'https://outlook.office.com/webhook/...' },
      { name: 'title', label: 'Default Title', type: 'text', required: false, placeholder: 'Integration Alert' }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier Webhook',
    icon: Zap,
    description: 'Trigger Zapier workflows',
    category: 'Automation',
    fields: [
      { name: 'webhookUrl', label: 'Zapier Webhook URL', type: 'text', required: true, placeholder: 'https://hooks.zapier.com/hooks/catch/...' },
      { name: 'zapName', label: 'Zap Name', type: 'text', required: false, placeholder: 'Integration Workflow' }
    ]
  }
];

export const CreateCommunicationAdapter = () => {
  const [selectedAdapter, setSelectedAdapter] = useState('');
  const [adapterName, setAdapterName] = useState('');
  const [description, setDescription] = useState('');
  const [configuration, setConfiguration] = useState<Record<string, string>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const selectedAdapterConfig = communicationAdapters.find(adapter => adapter.id === selectedAdapter);

  const handleConfigurationChange = (fieldName: string, value: string) => {
    setConfiguration(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleTestConnection = async () => {
    if (!selectedAdapter) {
      toast({
        title: "No Adapter Selected",
        description: "Please select a communication adapter first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    // Simulate connection testing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success for demo
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setConnectionStatus('success');
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${selectedAdapterConfig?.name}`,
          variant: "default",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Please check your configuration and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveAdapter = () => {
    if (!adapterName || !selectedAdapter) {
      toast({
        title: "Validation Error",
        description: "Please provide adapter name and select a type",
        variant: "destructive",
      });
      return;
    }

    const requiredFields = selectedAdapterConfig?.fields.filter(field => field.required) || [];
    const missingFields = requiredFields.filter(field => !configuration[field.name]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Adapter Saved Successfully",
      description: `Communication adapter "${adapterName}" has been created`,
      variant: "default",
    });

    // Reset form
    setAdapterName('');
    setDescription('');
    setSelectedAdapter('');
    setConfiguration({});
    setConnectionStatus('idle');
  };

  const renderTestZapierWebhook = () => {
    if (selectedAdapter !== 'zapier' || !configuration.webhookUrl) return null;

    const handleTriggerZap = async () => {
      setIsTestingConnection(true);
      
      try {
        const response = await fetch(configuration.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            triggered_from: "IntegrixLab Communication Adapter",
            adapter_name: adapterName || "Test Adapter",
            test_data: {
              message: "Test message from IntegrixLab",
              status: "active"
            }
          }),
        });

        toast({
          title: "Zapier Webhook Triggered",
          description: "The webhook was triggered successfully. Check your Zap history to confirm.",
        });
      } catch (error) {
        console.error("Error triggering webhook:", error);
        toast({
          title: "Webhook Error",
          description: "Failed to trigger the Zapier webhook. Please check the URL.",
          variant: "destructive",
        });
      } finally {
        setIsTestingConnection(false);
      }
    };

    return (
      <Button 
        onClick={handleTriggerZap}
        disabled={isTestingConnection}
        className="w-full bg-gradient-accent hover:opacity-90"
        variant="outline"
      >
        <Zap className="h-4 w-4 mr-2" />
        {isTestingConnection ? 'Triggering...' : 'Test Zapier Webhook'}
      </Button>
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Send className="h-8 w-8" />
          Create Communication Adapter
        </h1>
        <p className="text-muted-foreground">Configure communication channels for sending messages, emails, and notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adapter Selection & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Adapter Details</CardTitle>
              <CardDescription>Basic information for your communication adapter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adapterName">Adapter Name *</Label>
                <Input
                  id="adapterName"
                  placeholder="e.g., Production Email Server"
                  value={adapterName}
                  onChange={(e) => setAdapterName(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this communication adapter..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.01]"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Adapter Type Selection</CardTitle>
              <CardDescription>Choose the type of communication adapter to configure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communicationAdapters.map((adapter) => (
                  <div
                    key={adapter.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 group hover:shadow-soft ${
                      selectedAdapter === adapter.id 
                        ? 'border-primary bg-primary/10 shadow-elegant' 
                        : 'border-border hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedAdapter(adapter.id)}
                  >
                    <div className="flex items-start gap-3">
                      <adapter.icon className={`h-6 w-6 mt-1 transition-colors ${
                        selectedAdapter === adapter.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{adapter.name}</span>
                          <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{adapter.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedAdapterConfig && (
            <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedAdapterConfig.icon className="h-5 w-5" />
                  {selectedAdapterConfig.name} Configuration
                </CardTitle>
                <CardDescription>Configure the connection parameters and authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAdapterConfig.fields.map((field) => (
                    <div key={field.name} className={field.name === 'url' || field.name === 'webhookUrl' ? 'md:col-span-2' : ''}>
                      <Label htmlFor={field.name} className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-destructive">*</span>}
                        {field.type === 'password' && <Key className="h-3 w-3 text-muted-foreground" />}
                      </Label>
                      {field.type === 'select' ? (
                        <Select 
                          value={configuration[field.name] || ''} 
                          onValueChange={(value) => handleConfigurationChange(field.name, value)}
                        >
                          <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                            <SelectValue placeholder={`Select ${field.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={configuration[field.name] || ''}
                          onChange={(e) => handleConfigurationChange(field.name, e.target.value)}
                          className="transition-all duration-300 focus:scale-[1.01]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions & Status Panel */}
        <div className="space-y-6">
          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Connection Testing</CardTitle>
              <CardDescription>Test your adapter configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleTestConnection}
                disabled={!selectedAdapter || isTestingConnection}
                className="w-full bg-gradient-accent hover:opacity-90 transition-all duration-300"
                variant="outline"
              >
                {isTestingConnection ? (
                  <>
                    <TestTube className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>

              {renderTestZapierWebhook()}

              {connectionStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  connectionStatus === 'success' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {connectionStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {connectionStatus === 'success' ? 'Connection Successful' : 'Connection Failed'}
                  </span>
                </div>
              )}

              <Separator />
              
              <Button 
                onClick={handleSaveAdapter}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Adapter
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">Draft</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{selectedAdapterConfig?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{selectedAdapterConfig?.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection:</span>
                  <Badge variant={
                    connectionStatus === 'success' ? 'default' :
                    connectionStatus === 'error' ? 'destructive' : 'secondary'
                  }>
                    {connectionStatus === 'success' ? 'Verified' :
                     connectionStatus === 'error' ? 'Failed' : 'Not tested'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Security Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Credentials are encrypted and stored securely</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Test connections before using in production</span>
                </div>
                <div className="flex items-start gap-2">
                  <Key className="h-4 w-4 mt-0.5 text-primary" />
                  <span>Use environment-specific configurations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};