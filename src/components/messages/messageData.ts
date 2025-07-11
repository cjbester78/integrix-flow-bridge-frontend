export type MessageStatus = 'success' | 'failed' | 'processing';

export interface Message {
  id: string;
  timestamp: string;
  source: string;
  target: string;
  type: string;
  status: MessageStatus;
  processingTime: string;
  size: string;
  logs: Array<{
    timestamp: string;
    level: string;
    message: string;
  }>;
}

// Customer-specific message data
export const customerMessageData = {
  '1': [ // ACME Corporation
    {
      id: 'MSG-001',
      timestamp: '2024-01-15 14:30:25',
      source: 'SAP ERP',
      target: 'Salesforce CRM',
      type: 'Customer Update',
      status: 'success' as MessageStatus,
      processingTime: '245ms',
      size: '2.4KB',
      logs: [
        { timestamp: '2024-01-15 14:30:25.001', level: 'INFO', message: 'Message received from SAP ERP' },
        { timestamp: '2024-01-15 14:30:25.015', level: 'INFO', message: 'Validating customer data format' },
        { timestamp: '2024-01-15 14:30:25.089', level: 'INFO', message: 'Data transformation: SAP → Salesforce format' },
        { timestamp: '2024-01-15 14:30:25.156', level: 'INFO', message: 'Connecting to Salesforce API' },
        { timestamp: '2024-01-15 14:30:25.203', level: 'INFO', message: 'Customer record updated successfully' },
        { timestamp: '2024-01-15 14:30:25.245', level: 'SUCCESS', message: 'Message processing completed' }
      ]
    },
    {
      id: 'MSG-002',
      timestamp: '2024-01-15 14:28:12',
      source: 'REST API',
      target: 'MySQL Database',
      type: 'Order Creation',
      status: 'success' as MessageStatus,
      processingTime: '156ms',
      size: '5.2KB',
      logs: [
        { timestamp: '2024-01-15 14:28:12.001', level: 'INFO', message: 'REST API request received' },
        { timestamp: '2024-01-15 14:28:12.025', level: 'INFO', message: 'Parsing JSON payload' },
        { timestamp: '2024-01-15 14:28:12.067', level: 'INFO', message: 'Validating order data' },
        { timestamp: '2024-01-15 14:28:12.098', level: 'INFO', message: 'Database connection established' },
        { timestamp: '2024-01-15 14:28:12.134', level: 'INFO', message: 'Order inserted with ID: ORD-12345' },
        { timestamp: '2024-01-15 14:28:12.156', level: 'SUCCESS', message: 'Order creation completed' }
      ]
    },
    {
      id: 'MSG-003',
      timestamp: '2024-01-15 14:25:45',
      source: 'File System',
      target: 'HTTP Endpoint',
      type: 'Batch Upload',
      status: 'failed' as MessageStatus,
      processingTime: '1.2s',
      size: '15.8KB',
      logs: [
        { timestamp: '2024-01-15 14:25:45.001', level: 'INFO', message: 'File detected: batch_data_20240115.csv' },
        { timestamp: '2024-01-15 14:25:45.156', level: 'INFO', message: 'Reading file content' },
        { timestamp: '2024-01-15 14:25:45.234', level: 'INFO', message: 'Processing 500 records' },
        { timestamp: '2024-01-15 14:25:45.789', level: 'WARN', message: 'Invalid data format detected in row 245' },
        { timestamp: '2024-01-15 14:25:46.023', level: 'ERROR', message: 'HTTP endpoint returned 500 Internal Server Error' },
        { timestamp: '2024-01-15 14:25:46.200', level: 'ERROR', message: 'Batch upload failed - transaction rolled back' }
      ]
    }
  ],
  '2': [ // TechStart Inc
    {
      id: 'MSG-004',
      timestamp: '2024-01-15 14:23:18',
      source: 'SOAP Service',
      target: 'JSON API',
      type: 'Data Sync',
      status: 'processing' as MessageStatus,
      processingTime: '-',
      size: '3.7KB',
      logs: [
        { timestamp: '2024-01-15 14:23:18.001', level: 'INFO', message: 'SOAP request received' },
        { timestamp: '2024-01-15 14:23:18.045', level: 'INFO', message: 'Parsing SOAP envelope' },
        { timestamp: '2024-01-15 14:23:18.089', level: 'INFO', message: 'Converting SOAP to JSON format' },
        { timestamp: '2024-01-15 14:23:18.156', level: 'INFO', message: 'Waiting for target API response...' }
      ]
    },
    {
      id: 'MSG-005',
      timestamp: '2024-01-15 14:20:33',
      source: 'SFTP Server',
      target: 'Document Store',
      type: 'File Transfer',
      status: 'success' as MessageStatus,
      processingTime: '2.1s',
      size: '28.5KB',
      logs: [
        { timestamp: '2024-01-15 14:20:33.001', level: 'INFO', message: 'SFTP connection established' },
        { timestamp: '2024-01-15 14:20:33.234', level: 'INFO', message: 'File download started: report_2024_01_15.pdf' },
        { timestamp: '2024-01-15 14:20:34.567', level: 'INFO', message: 'File download completed (28.5KB)' },
        { timestamp: '2024-01-15 14:20:34.789', level: 'INFO', message: 'Uploading to document store' },
        { timestamp: '2024-01-15 14:20:35.100', level: 'SUCCESS', message: 'File transfer completed successfully' }
      ]
    },
    {
      id: 'MSG-006',
      timestamp: '2024-01-15 14:18:45',
      source: 'Email SMTP',
      target: 'SMS Gateway',
      type: 'Notification',
      status: 'failed' as MessageStatus,
      processingTime: '890ms',
      size: '1.2KB',
      logs: [
        { timestamp: '2024-01-15 14:18:45.001', level: 'INFO', message: 'Email notification received' },
        { timestamp: '2024-01-15 14:18:45.234', level: 'INFO', message: 'Converting email to SMS format' },
        { timestamp: '2024-01-15 14:18:45.567', level: 'ERROR', message: 'SMS gateway timeout - message not delivered' },
        { timestamp: '2024-01-15 14:18:45.890', level: 'ERROR', message: 'Notification failed after 3 retries' }
      ]
    }
  ]
};