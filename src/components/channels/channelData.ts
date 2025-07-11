import { 
  Database, 
  Globe, 
  Zap, 
  Server, 
  FileText, 
  Mail, 
  Smartphone 
} from 'lucide-react';

// Adapter definitions
export const adapters = [
  { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
  { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
  { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
  { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' },
  { id: 'file', name: 'File System', icon: FileText, category: 'Storage' },
  { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' },
  { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' },
  { id: 'database', name: 'Database', icon: Database, category: 'Storage' },
];

// Customer-specific channel data
export const customerChannelData = {
  '1': [ // ACME Corporation
    {
      id: 'CH-001',
      name: 'SAP-to-Salesforce Integration',
      description: 'Customer data synchronization between SAP ERP and Salesforce CRM',
      status: 'running' as ChannelStatus,
      load: 85,
      throughput: '245 msg/min',
      uptime: '99.8%',
      lastActivity: '2 seconds ago',
      adapters: [
        { 
          id: 'sap', 
          name: 'SAP ERP', 
          icon: Database, 
          category: 'Enterprise',
          status: 'active' as AdapterStatus,
          lastExecution: '2 seconds ago',
          messagesProcessed: 62284,
          errorCount: 124,
          avgResponseTime: 120
        },
        { 
          id: 'salesforce', 
          name: 'Salesforce CRM', 
          icon: Globe, 
          category: 'CRM',
          status: 'active' as AdapterStatus,
          lastExecution: '2 seconds ago',
          messagesProcessed: 62283,
          errorCount: 124,
          avgResponseTime: 120
        }
      ],
      errorRate: 0.2,
      totalMessages: 124567,
      avgResponseTime: '120ms',
      healthScore: 98
    },
    {
      id: 'CH-002',
      name: 'REST-to-Database Processor',
      description: 'Automated REST API processing and database insertion workflow',
      status: 'running' as ChannelStatus,
      load: 45,
      throughput: '89 msg/min',
      uptime: '100%',
      lastActivity: '15 seconds ago',
      adapters: [
        { 
          id: 'rest', 
          name: 'REST API', 
          icon: Zap, 
          category: 'Web Service',
          status: 'active' as AdapterStatus,
          lastExecution: '15 seconds ago',
          messagesProcessed: 22945,
          errorCount: 0,
          avgResponseTime: 85
        },
        { 
          id: 'database', 
          name: 'Database', 
          icon: Database, 
          category: 'Storage',
          status: 'active' as AdapterStatus,
          lastExecution: '15 seconds ago',
          messagesProcessed: 22945,
          errorCount: 0,
          avgResponseTime: 85
        }
      ],
      errorRate: 0.0,
      totalMessages: 45890,
      avgResponseTime: '85ms',
      healthScore: 100
    },
    {
      id: 'CH-003',
      name: 'SOAP Service Bridge',
      description: 'Legacy SOAP to modern API transformation bridge',
      status: 'idle' as ChannelStatus,
      load: 12,
      throughput: '15 msg/min',
      uptime: '95.2%',
      lastActivity: '2 hours ago',
      adapters: [
        { 
          id: 'soap', 
          name: 'SOAP Service', 
          icon: Server, 
          category: 'Web Service',
          status: 'active' as AdapterStatus,
          lastExecution: '2 hours ago',
          messagesProcessed: 12345,
          errorCount: 0,
          avgResponseTime: 200
        }
      ],
      errorRate: 0.0,
      totalMessages: 12345,
      avgResponseTime: '200ms',
      healthScore: 95
    }
  ],
  '2': [ // TechStart Inc
    {
      id: 'CH-004',
      name: 'Salesforce-to-Email Gateway',
      description: 'Automated email notifications from Salesforce CRM',
      status: 'running' as ChannelStatus,
      load: 67,
      throughput: '156 msg/min',
      uptime: '98.5%',
      lastActivity: '1 second ago',
      adapters: [
        { 
          id: 'salesforce', 
          name: 'Salesforce CRM', 
          icon: Globe, 
          category: 'CRM',
          status: 'active' as AdapterStatus,
          lastExecution: '1 second ago',
          messagesProcessed: 144728,
          errorCount: 4342,
          avgResponseTime: 45
        },
        { 
          id: 'email', 
          name: 'Email SMTP', 
          icon: Mail, 
          category: 'Communication',
          status: 'active' as AdapterStatus,
          lastExecution: '1 second ago',
          messagesProcessed: 144728,
          errorCount: 4342,
          avgResponseTime: 45
        }
      ],
      errorRate: 1.5,
      totalMessages: 289456,
      avgResponseTime: '45ms',
      healthScore: 97
    },
    {
      id: 'CH-005',
      name: 'SMS Alert Service',
      description: 'Real-time SMS notifications and alerts system',
      status: 'running' as ChannelStatus,
      load: 78,
      throughput: '89 msg/min',
      uptime: '99.1%',
      lastActivity: '30 seconds ago',
      adapters: [
        { 
          id: 'sms', 
          name: 'SMS Gateway', 
          icon: Smartphone, 
          category: 'Communication',
          status: 'active' as AdapterStatus,
          lastExecution: '30 seconds ago',
          messagesProcessed: 67890,
          errorCount: 611,
          avgResponseTime: 180
        }
      ],
      errorRate: 0.9,
      totalMessages: 67890,
      avgResponseTime: '180ms',
      healthScore: 98
    },
    {
      id: 'CH-006',
      name: 'REST API Gateway',
      description: 'REST API request routing and transformation gateway',
      status: 'stopped' as ChannelStatus,
      load: 0,
      throughput: '0 msg/min',
      uptime: '87.3%',
      lastActivity: '6 hours ago',
      adapters: [
        { 
          id: 'rest', 
          name: 'REST API', 
          icon: Zap, 
          category: 'Web Service',
          status: 'inactive' as AdapterStatus,
          lastExecution: '6 hours ago',
          messagesProcessed: 23456,
          errorCount: 657,
          avgResponseTime: 350
        }
      ],
      errorRate: 2.8,
      totalMessages: 23456,
      avgResponseTime: '350ms',
      healthScore: 75
    }
  ]
};

// Sample log data for demonstration
export const sampleChannelLogs: ChannelLog[] = [
  {
    id: 'log-001',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    level: 'info',
    message: 'Message successfully processed and forwarded to Salesforce CRM',
    adapterId: 'salesforce',
    adapterName: 'Salesforce CRM',
    correlationId: 'msg-12345',
    duration: 120,
    details: {
      messageId: 'msg-12345',
      sourceSystem: 'SAP ERP',
      targetSystem: 'Salesforce CRM',
      recordCount: 1,
      processingSteps: ['validation', 'transformation', 'mapping', 'delivery']
    }
  },
  {
    id: 'log-002',
    timestamp: new Date(Date.now() - 45000).toISOString(),
    level: 'warn',
    message: 'Slow response detected from SAP ERP adapter',
    adapterId: 'sap',
    adapterName: 'SAP ERP',
    correlationId: 'msg-12344',
    duration: 2500,
    details: {
      expectedResponse: '< 500ms',
      actualResponse: '2500ms',
      recommendation: 'Check SAP system performance'
    }
  },
  {
    id: 'log-003',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    level: 'error',
    message: 'Failed to authenticate with REST API endpoint',
    adapterId: 'rest',
    adapterName: 'REST API',
    correlationId: 'msg-12343',
    details: {
      error: 'Unauthorized',
      statusCode: 401,
      endpoint: '/api/v1/customers',
      retryAttempt: 3
    }
  },
  {
    id: 'log-004',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    level: 'info',
    message: 'Channel health check completed successfully',
    details: {
      healthScore: 98,
      adaptersChecked: 2,
      issuesFound: 0
    }
  },
  {
    id: 'log-005',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    level: 'debug',
    message: 'Processing configuration reload for channel CH-001',
    details: {
      configVersion: '1.2.3',
      changesApplied: ['timeout increased', 'retry logic updated']
    }
  }
];

export type ChannelStatus = 'running' | 'idle' | 'stopped';
export type AdapterStatus = 'active' | 'inactive' | 'error' | 'testing';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ChannelAdapter {
  id: string;
  name: string;
  icon: any;
  category: string;
  status: AdapterStatus;
  lastExecution?: string;
  messagesProcessed: number;
  errorCount: number;
  avgResponseTime: number;
}

export interface ChannelLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  adapterId?: string;
  adapterName?: string;
  details?: any;
  correlationId?: string;
  duration?: number;
}

export interface FlowMetrics {
  flowId: string;
  flowName: string;
  messagesThisHour: number;
  messagesTotal: number;
  errorRate: number;
  avgProcessingTime: number;
  lastExecution?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  status: ChannelStatus;
  load: number;
  throughput: string;
  uptime: string;
  lastActivity: string;
  adapters: ChannelAdapter[];
  errorRate: number;
  totalMessages: number;
  avgResponseTime: string;
  customerId?: string;
  flowMetrics?: FlowMetrics[];
  recentLogs?: ChannelLog[];
  healthScore: number;
  tags?: string[];
}