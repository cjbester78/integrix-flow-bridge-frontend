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
        { id: 'sap', name: 'SAP ERP', icon: Database, category: 'Enterprise' },
        { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' }
      ],
      errorRate: 0.2,
      totalMessages: 124567,
      avgResponseTime: '120ms'
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
        { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' },
        { id: 'database', name: 'Database', icon: Database, category: 'Storage' }
      ],
      errorRate: 0.0,
      totalMessages: 45890,
      avgResponseTime: '85ms'
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
        { id: 'soap', name: 'SOAP Service', icon: Server, category: 'Web Service' }
      ],
      errorRate: 0.0,
      totalMessages: 12345,
      avgResponseTime: '200ms'
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
        { id: 'salesforce', name: 'Salesforce CRM', icon: Globe, category: 'CRM' },
        { id: 'email', name: 'Email SMTP', icon: Mail, category: 'Communication' }
      ],
      errorRate: 1.5,
      totalMessages: 289456,
      avgResponseTime: '45ms'
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
        { id: 'sms', name: 'SMS Gateway', icon: Smartphone, category: 'Communication' }
      ],
      errorRate: 0.9,
      totalMessages: 67890,
      avgResponseTime: '180ms'
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
        { id: 'rest', name: 'REST API', icon: Zap, category: 'Web Service' }
      ],
      errorRate: 2.8,
      totalMessages: 23456,
      avgResponseTime: '350ms'
    }
  ]
};

export type ChannelStatus = 'running' | 'idle' | 'stopped';

export interface Channel {
  id: string;
  name: string;
  description: string;
  status: ChannelStatus;
  load: number;
  throughput: string;
  uptime: string;
  lastActivity: string;
  adapters: Array<{
    id: string;
    name: string;
    icon: any;
    category: string;
  }>;
  errorRate: number;
  totalMessages: number;
  avgResponseTime: string;
}