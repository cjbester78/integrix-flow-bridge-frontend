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
  Key,
  FileText,
  HardDrive,
  Lock,
  Network,
  ShieldCheck,
  Database,
  FileCode,
  MessageSquare,
  Layers,
  FileSpreadsheet,
  Cable,
  Cloud,
  Server,
  Activity
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
    id: 'file',
    name: 'FILE',
    icon: FileText,
    description: 'File system operations and transfers',
    category: 'File System',
    fields: [
      { name: 'basePath', label: 'Base Path', type: 'text', required: true, placeholder: '/data/files' },
      { name: 'encoding', label: 'File Encoding', type: 'select', required: false, options: ['UTF-8', 'ASCII', 'ISO-8859-1', 'UTF-16'] },
      { name: 'permissions', label: 'File Permissions', type: 'text', required: false, placeholder: '755' },
      { name: 'createDirs', label: 'Create Directories', type: 'select', required: false, options: ['true', 'false'] }
    ]
  },
  {
    id: 'ftp',
    name: 'FTP',
    icon: HardDrive,
    description: 'File Transfer Protocol connections',
    category: 'File Transfer',
    fields: [
      { name: 'host', label: 'FTP Host', type: 'text', required: true, placeholder: 'ftp.example.com' },
      { name: 'port', label: 'Port', type: 'number', required: false, placeholder: '21' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'ftpuser' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'FTP Password' },
      { name: 'passiveMode', label: 'Passive Mode', type: 'select', required: false, options: ['true', 'false'] },
      { name: 'transferMode', label: 'Transfer Mode', type: 'select', required: false, options: ['binary', 'ascii'] }
    ]
  },
  {
    id: 'sftp',
    name: 'SFTP',
    icon: Lock,
    description: 'Secure File Transfer Protocol',
    category: 'File Transfer',
    fields: [
      { name: 'host', label: 'SFTP Host', type: 'text', required: true, placeholder: 'sftp.example.com' },
      { name: 'port', label: 'Port', type: 'number', required: false, placeholder: '22' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'sftpuser' },
      { name: 'password', label: 'Password', type: 'password', required: false, placeholder: 'SFTP Password' },
      { name: 'privateKey', label: 'Private Key Path', type: 'text', required: false, placeholder: '/path/to/private/key' },
      { name: 'keyPassphrase', label: 'Key Passphrase', type: 'password', required: false, placeholder: 'Key passphrase' }
    ]
  },
  {
    id: 'http',
    name: 'HTTP',
    icon: Network,
    description: 'HTTP/HTTPS protocol connections',
    category: 'HTTP',
    fields: [
      { name: 'protocol', label: 'Protocol', type: 'select', required: true, options: ['HTTP', 'HTTPS'] },
      { name: 'url', label: 'URL', type: 'text', required: true, placeholder: 'https://api.example.com/endpoint' },
      { name: 'method', label: 'HTTP Method', type: 'select', required: true, options: ['POST', 'PUT', 'PATCH', 'GET'] },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['application/json', 'application/xml', 'application/x-www-form-urlencoded'] },
      { name: 'authType', label: 'Authentication', type: 'select', required: false, options: ['None', 'Basic Auth', 'Bearer Token', 'API Key', 'OAuth', 'OAuth 2.0'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: false, placeholder: 'Token or credentials' },
      { name: 'timeout', label: 'Timeout (ms)', type: 'number', required: false, placeholder: '30000' }
    ]
  },
  {
    id: 'rest',
    name: 'REST',
    icon: Globe,
    description: 'REST API integrations',
    category: 'API',
    fields: [
      { name: 'url', label: 'REST API URL', type: 'text', required: true, placeholder: 'https://api.example.com/v1/endpoint' },
      { name: 'method', label: 'HTTP Method', type: 'select', required: true, options: ['POST', 'PUT', 'PATCH', 'GET'] },
      { name: 'contentType', label: 'Content Type', type: 'select', required: true, options: ['application/json', 'application/xml', 'application/x-www-form-urlencoded'] },
      { name: 'authType', label: 'Authentication', type: 'select', required: false, options: ['None', 'Basic Auth', 'Bearer Token', 'API Key', 'OAuth', 'OAuth 2.0'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: false, placeholder: 'Token or credentials' },
      { name: 'timeout', label: 'Timeout (ms)', type: 'number', required: false, placeholder: '30000' }
    ]
  },
  {
    id: 'soap',
    name: 'SOAP',
    icon: FileCode,
    description: 'SOAP web services integration',
    category: 'Web Services',
    fields: [
      { name: 'wsdlUrl', label: 'WSDL URL', type: 'text', required: true, placeholder: 'https://example.com/service.wsdl' },
      { name: 'serviceName', label: 'Service Name', type: 'text', required: true, placeholder: 'MyWebService' },
      { name: 'portName', label: 'Port Name', type: 'text', required: true, placeholder: 'MyWebServicePort' },
      { name: 'authType', label: 'Authentication', type: 'select', required: false, options: ['None', 'Basic Auth', 'Bearer Token', 'API Key', 'OAuth', 'OAuth 2.0'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: false, placeholder: 'Token or credentials' },
      { name: 'timeout', label: 'Timeout (ms)', type: 'number', required: false, placeholder: '30000' }
    ]
  },
  {
    id: 'jms',
    name: 'JMS',
    icon: MessageSquare,
    description: 'Java Message Service connections',
    category: 'Messaging',
    fields: [
      { name: 'brokerUrl', label: 'Broker URL', type: 'text', required: true, placeholder: 'tcp://localhost:61616' },
      { name: 'queueName', label: 'Queue Name', type: 'text', required: false, placeholder: 'myqueue' },
      { name: 'topicName', label: 'Topic Name', type: 'text', required: false, placeholder: 'mytopic' },
      { name: 'username', label: 'Username', type: 'text', required: false, placeholder: 'JMS Username' },
      { name: 'password', label: 'Password', type: 'password', required: false, placeholder: 'JMS Password' },
      { name: 'connectionFactory', label: 'Connection Factory', type: 'text', required: false, placeholder: 'ConnectionFactory' }
    ]
  },
  {
    id: 'odata',
    name: 'ODATA',
    icon: Layers,
    description: 'Open Data Protocol services',
    category: 'API',
    fields: [
      { name: 'serviceUrl', label: 'Service URL', type: 'text', required: true, placeholder: 'https://services.odata.org/V4/service' },
      { name: 'version', label: 'OData Version', type: 'select', required: true, options: ['V4', 'V3', 'V2'] },
      { name: 'authType', label: 'Authentication', type: 'select', required: false, options: ['None', 'Basic Auth', 'Bearer Token', 'OAuth 2.0'] },
      { name: 'authValue', label: 'Auth Value', type: 'password', required: false, placeholder: 'Token or credentials' },
      { name: 'maxPageSize', label: 'Max Page Size', type: 'number', required: false, placeholder: '1000' }
    ]
  },
  {
    id: 'idoc',
    name: 'IDOC',
    icon: FileSpreadsheet,
    description: 'SAP Intermediate Document format',
    category: 'SAP',
    fields: [
      { name: 'sapHost', label: 'SAP Host', type: 'text', required: true, placeholder: 'sap.example.com' },
      { name: 'systemNumber', label: 'System Number', type: 'text', required: true, placeholder: '00' },
      { name: 'client', label: 'Client', type: 'text', required: true, placeholder: '100' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'SAP Username' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'SAP Password' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'EN' },
      { name: 'idocType', label: 'IDOC Type', type: 'text', required: false, placeholder: 'ORDERS05' }
    ]
  },
  {
    id: 'jdbc',
    name: 'JDBC',
    icon: Database,
    description: 'Java Database Connectivity',
    category: 'Database',
    fields: [
      { name: 'jdbcUrl', label: 'JDBC URL', type: 'text', required: true, placeholder: 'jdbc:postgresql://localhost:5432/mydb' },
      { name: 'driverClass', label: 'Driver Class', type: 'text', required: true, placeholder: 'org.postgresql.Driver' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'dbuser' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'Database Password' },
      { name: 'maxPoolSize', label: 'Max Pool Size', type: 'number', required: false, placeholder: '10' },
      { name: 'connectionTimeout', label: 'Connection Timeout (ms)', type: 'number', required: false, placeholder: '30000' }
    ]
  },
  {
    id: 'as2',
    name: 'AS2',
    icon: Cable,
    description: 'Applicability Statement 2 protocol',
    category: 'EDI',
    fields: [
      { name: 'as2Url', label: 'AS2 URL', type: 'text', required: true, placeholder: 'https://partner.example.com/as2' },
      { name: 'as2From', label: 'AS2 From', type: 'text', required: true, placeholder: 'MyCompany' },
      { name: 'as2To', label: 'AS2 To', type: 'text', required: true, placeholder: 'PartnerCompany' },
      { name: 'certificate', label: 'Certificate Path', type: 'text', required: true, placeholder: '/path/to/certificate.p12' },
      { name: 'certificatePassword', label: 'Certificate Password', type: 'password', required: true, placeholder: 'Certificate Password' },
      { name: 'encryptionAlgorithm', label: 'Encryption Algorithm', type: 'select', required: false, options: ['3DES', 'AES128', 'AES192', 'AES256'] }
    ]
  },
  {
    id: 'kafka',
    name: 'KAFKA',
    icon: Activity,
    description: 'Apache Kafka messaging platform',
    category: 'Streaming',
    fields: [
      { name: 'bootstrapServers', label: 'Bootstrap Servers', type: 'text', required: true, placeholder: 'localhost:9092' },
      { name: 'topicName', label: 'Topic Name', type: 'text', required: true, placeholder: 'my-topic' },
      { name: 'groupId', label: 'Consumer Group ID', type: 'text', required: false, placeholder: 'my-consumer-group' },
      { name: 'securityProtocol', label: 'Security Protocol', type: 'select', required: false, options: ['PLAINTEXT', 'SSL', 'SASL_PLAINTEXT', 'SASL_SSL'] },
      { name: 'saslMechanism', label: 'SASL Mechanism', type: 'select', required: false, options: ['PLAIN', 'SCRAM-SHA-256', 'SCRAM-SHA-512'] },
      { name: 'username', label: 'Username', type: 'text', required: false, placeholder: 'Kafka Username' },
      { name: 'password', label: 'Password', type: 'password', required: false, placeholder: 'Kafka Password' }
    ]
  },
  {
    id: 'rfc',
    name: 'RFC',
    icon: Server,
    description: 'SAP Remote Function Call',
    category: 'SAP',
    fields: [
      { name: 'sapHost', label: 'SAP Host', type: 'text', required: true, placeholder: 'sap.example.com' },
      { name: 'systemNumber', label: 'System Number', type: 'text', required: true, placeholder: '00' },
      { name: 'client', label: 'Client', type: 'text', required: true, placeholder: '100' },
      { name: 'username', label: 'Username', type: 'text', required: true, placeholder: 'SAP Username' },
      { name: 'password', label: 'Password', type: 'password', required: true, placeholder: 'SAP Password' },
      { name: 'language', label: 'Language', type: 'text', required: false, placeholder: 'EN' },
      { name: 'poolSize', label: 'Connection Pool Size', type: 'number', required: false, placeholder: '5' }
    ]
  }
];

export const CreateCommunicationAdapter = () => {
  const [selectedAdapter, setSelectedAdapter] = useState('');
  const [adapterName, setAdapterName] = useState('');
  const [adapterMode, setAdapterMode] = useState('');
  const [description, setDescription] = useState('');
  const [configuration, setConfiguration] = useState<Record<string, string>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const selectedAdapterConfig = communicationAdapters.find(adapter => adapter.id === selectedAdapter);

  // Get dynamic auth fields based on selected auth type
  const getAuthFields = (authType: string) => {
    switch (authType) {
      case 'Basic Auth':
        return [
          { name: 'authUsername', label: 'Username', type: 'text', required: true, placeholder: 'Enter username' },
          { name: 'authPassword', label: 'Password', type: 'password', required: true, placeholder: 'Enter password' }
        ];
      case 'Bearer Token':
        return [
          { name: 'bearerToken', label: 'Bearer Token', type: 'password', required: true, placeholder: 'Enter bearer token' }
        ];
      case 'API Key':
        return [
          { name: 'apiKeyValue', label: 'API Key', type: 'password', required: true, placeholder: 'Enter API key' },
          { name: 'apiKeyLocation', label: 'API Key Location', type: 'select', required: true, options: ['Header', 'Query Parameter'] },
          { name: 'apiKeyName', label: 'API Key Name', type: 'text', required: true, placeholder: 'e.g., X-API-Key or api_key' }
        ];
      case 'OAuth':
        return [
          { name: 'oauthClientId', label: 'Client ID', type: 'text', required: true, placeholder: 'Enter client ID' },
          { name: 'oauthClientSecret', label: 'Client Secret', type: 'password', required: true, placeholder: 'Enter client secret' },
          { name: 'oauthAuthUrl', label: 'Authorization URL', type: 'text', required: true, placeholder: 'https://auth.example.com/oauth/authorize' },
          { name: 'oauthTokenUrl', label: 'Token URL', type: 'text', required: true, placeholder: 'https://auth.example.com/oauth/token' },
          { name: 'oauthScope', label: 'Scope', type: 'text', required: false, placeholder: 'read write' }
        ];
      case 'OAuth 2.0':
        return [
          { name: 'oauth2ClientId', label: 'Client ID', type: 'text', required: true, placeholder: 'Enter client ID' },
          { name: 'oauth2ClientSecret', label: 'Client Secret', type: 'password', required: true, placeholder: 'Enter client secret' },
          { name: 'oauth2AuthUrl', label: 'Authorization URL', type: 'text', required: true, placeholder: 'https://auth.example.com/oauth2/authorize' },
          { name: 'oauth2TokenUrl', label: 'Token URL', type: 'text', required: true, placeholder: 'https://auth.example.com/oauth2/token' },
          { name: 'oauth2GrantType', label: 'Grant Type', type: 'select', required: true, options: ['authorization_code', 'client_credentials', 'password', 'refresh_token'] },
          { name: 'oauth2Scope', label: 'Scope', type: 'text', required: false, placeholder: 'read write' }
        ];
      default:
        return [];
    }
  };


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
    if (!adapterName || !selectedAdapter || !adapterMode) {
      toast({
        title: "Validation Error",
        description: "Please provide adapter name, select a type, and choose adapter mode",
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
    setAdapterMode('');
    setDescription('');
    setSelectedAdapter('');
    setConfiguration({});
    setConnectionStatus('idle');
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
                <Label htmlFor="adapterMode">Adapter Mode *</Label>
                <Select value={adapterMode} onValueChange={setAdapterMode}>
                  <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                    <SelectValue placeholder="Select adapter mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sender">Sender</SelectItem>
                    <SelectItem value="receiver">Receiver</SelectItem>
                  </SelectContent>
                </Select>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adapterType">Adapter Type *</Label>
                <Select value={selectedAdapter} onValueChange={setSelectedAdapter}>
                  <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                    <SelectValue placeholder="Select communication adapter type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-lg max-h-60">
                    {communicationAdapters.map((adapter) => (
                      <SelectItem key={adapter.id} value={adapter.id}>
                        <div className="flex items-center gap-3 py-1">
                          <adapter.icon className="h-4 w-4 text-primary" />
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{adapter.name}</span>
                            <Badge variant="outline" className="text-xs">{adapter.category}</Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedAdapterConfig && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <selectedAdapterConfig.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{selectedAdapterConfig.name}</span>
                    <Badge variant="outline" className="text-xs">{selectedAdapterConfig.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedAdapterConfig.description}
                  </p>
                </div>
              )}
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
                  
                  {/* Dynamic Authentication Fields */}
                  {configuration.authType && configuration.authType !== 'None' && (
                    <>
                      <div className="md:col-span-2">
                        <Separator className="my-4" />
                        <h4 className="font-medium text-sm text-muted-foreground mb-4">
                          {configuration.authType} Configuration
                        </h4>
                      </div>
                      {getAuthFields(configuration.authType).map((authField) => (
                        <div key={authField.name} className={authField.name.includes('Url') || authField.name.includes('url') ? 'md:col-span-2' : ''}>
                          <Label htmlFor={authField.name} className="flex items-center gap-1">
                            {authField.label}
                            {authField.required && <span className="text-destructive">*</span>}
                            {authField.type === 'password' && <Key className="h-3 w-3 text-muted-foreground" />}
                          </Label>
                          {authField.type === 'select' ? (
                            <Select 
                              value={configuration[authField.name] || ''} 
                              onValueChange={(value) => handleConfigurationChange(authField.name, value)}
                            >
                              <SelectTrigger className="transition-all duration-300 hover:bg-accent/50">
                                <SelectValue placeholder={`Select ${authField.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {authField.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={authField.name}
                              type={authField.type}
                              placeholder={authField.placeholder}
                              value={configuration[authField.name] || ''}
                              onChange={(e) => handleConfigurationChange(authField.name, e.target.value)}
                              className="transition-all duration-300 focus:scale-[1.01]"
                            />
                          )}
                        </div>
                      ))}
                    </>
                  )}
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
                  <span className="text-muted-foreground">Mode:</span>
                  <span>{adapterMode || 'Not selected'}</span>
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