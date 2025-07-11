-- Seed Data for Integration Platform
-- This file contains sample data for development and testing

-- Insert roles
INSERT INTO roles (id, name, description, permissions) VALUES
('440e8400-e29b-41d4-a716-446655440000', 'administrator', 'Full system access with user management capabilities', ARRAY['read', 'write', 'admin', 'user_management']),
('440e8400-e29b-41d4-a716-446655440001', 'integrator', 'Can create and manage integration flows', ARRAY['read', 'write', 'execute']),
('440e8400-e29b-41d4-a716-446655440002', 'viewer', 'Read-only access to monitoring and logs', ARRAY['read']);

-- Insert default admin users (password: admin123)
INSERT INTO users (id, username, email, password_hash, first_name, last_name, role_id, role, status, permissions, email_verified, last_login_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@integrixlab.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'System', 'Administrator', '440e8400-e29b-41d4-a716-446655440000', 'administrator', 'active', 
 ARRAY['flows:create', 'flows:read', 'flows:update', 'flows:delete', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:delete', 'adapters:test', 'structures:create', 'structures:read', 'structures:update', 'structures:delete', 'users:create', 'users:read', 'users:update', 'users:delete', 'system:admin'], TRUE, '2024-01-15 14:30:25'),

('550e8400-e29b-41d4-a716-446655440001', 'integrator1', 'integrator1@company.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'John', 'Integrator', '440e8400-e29b-41d4-a716-446655440001', 'integrator', 'active',
 ARRAY['flows:create', 'flows:read', 'flows:update', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:test', 'structures:create', 'structures:read', 'structures:update'], TRUE, '2024-01-15 12:15:30'),

('550e8400-e29b-41d4-a716-446655440002', 'viewer1', 'viewer1@company.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'Jane', 'Viewer', '440e8400-e29b-41d4-a716-446655440002', 'viewer', 'inactive',
 ARRAY['flows:read', 'adapters:read', 'structures:read'], TRUE, '2024-01-10 16:45:12');

-- Insert certificates
INSERT INTO certificates (id, name, type, issuer, valid_from, valid_to, status, usage, created_by) VALUES
('330e8400-e29b-41d4-a716-446655440000', 'SAP Production SSL', 'SSL Certificate', 'DigiCert Inc', '2024-01-01', '2025-01-01', 'active', 'SAP ERP Connection', '550e8400-e29b-41d4-a716-446655440000'),
('330e8400-e29b-41d4-a716-446655440001', 'Salesforce OAuth', 'OAuth Certificate', 'Salesforce.com', '2024-01-01', '2024-12-31', 'active', 'Salesforce API Authentication', '550e8400-e29b-41d4-a716-446655440000'),
('330e8400-e29b-41d4-a716-446655440002', 'Legacy System Cert', 'Client Certificate', 'Internal CA', '2023-06-01', '2024-02-01', 'expiring', 'Legacy SOAP Service', '550e8400-e29b-41d4-a716-446655440001'),
('330e8400-e29b-41d4-a716-446655440003', 'Database SSL Cert', 'SSL Certificate', 'Let''s Encrypt', '2024-01-01', '2024-12-31', 'active', 'Database Connection Security', '550e8400-e29b-41d4-a716-446655440000'),
('330e8400-e29b-41d4-a716-446655440004', 'API Gateway Cert', 'SSL Certificate', 'Verisign', '2024-01-01', '2025-06-01', 'active', 'External API Gateway', '550e8400-e29b-41d4-a716-446655440001');

-- Insert JAR files
INSERT INTO jar_files (id, name, version, description, file_name, size_bytes, driver_type, upload_date, uploaded_by) VALUES
('220e8400-e29b-41d4-a716-446655440000', 'MySQL JDBC Driver', '8.0.33', 'MySQL Connector/J JDBC Driver for database connectivity', 'mysql-connector-java-8.0.33.jar', 2456789, 'Database', '2024-01-15', '550e8400-e29b-41d4-a716-446655440000'),
('220e8400-e29b-41d4-a716-446655440001', 'PostgreSQL JDBC Driver', '42.6.0', 'PostgreSQL JDBC Driver for database operations', 'postgresql-42.6.0.jar', 1234567, 'Database', '2024-01-10', '550e8400-e29b-41d4-a716-446655440001'),
('220e8400-e29b-41d4-a716-446655440002', 'ActiveMQ Client', '5.18.3', 'ActiveMQ JMS Client for message queue operations', 'activemq-client-5.18.3.jar', 987654, 'Message Queue', '2024-01-08', '550e8400-e29b-41d4-a716-446655440001'),
('220e8400-e29b-41d4-a716-446655440003', 'Oracle JDBC Driver', '21.7.0.0', 'Oracle Database JDBC Driver', 'ojdbc11-21.7.0.0.jar', 4567890, 'Database', '2024-01-12', '550e8400-e29b-41d4-a716-446655440000'),
('220e8400-e29b-41d4-a716-446655440004', 'RabbitMQ Client', '5.16.0', 'RabbitMQ Java Client for AMQP messaging', 'amqp-client-5.16.0.jar', 876543, 'Message Queue', '2024-01-09', '550e8400-e29b-41d4-a716-446655440001'),
('220e8400-e29b-41d4-a716-446655440005', 'MongoDB Driver', '4.8.2', 'MongoDB Java Driver for NoSQL database operations', 'mongodb-driver-sync-4.8.2.jar', 1567890, 'Database', '2024-01-11', '550e8400-e29b-41d4-a716-446655440000');

-- Sample Data Structures
INSERT INTO data_structures (id, name, type, description, usage, structure, tags, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Customer Order', 'json', 'Standard customer order structure for e-commerce systems', 'source', 
 '{"orderId": "string", "customerId": "string", "customerEmail": "string", "orderDate": "datetime", "items": [{"productId": "string", "productName": "string", "quantity": "integer", "unitPrice": "decimal", "totalPrice": "decimal"}], "totalAmount": "decimal", "currency": "string", "shippingAddress": {"street": "string", "city": "string", "state": "string", "zipCode": "string", "country": "string"}, "status": "string"}',
 ARRAY['ecommerce', 'order', 'customer'], '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440001', 'Payment Response', 'json', 'Payment gateway response format', 'target',
 '{"transactionId": "string", "orderId": "string", "amount": "decimal", "currency": "string", "status": "string", "paymentMethod": "string", "processingTime": "datetime", "gatewayResponse": {"code": "string", "message": "string"}, "fees": {"processing": "decimal", "gateway": "decimal"}}',
 ARRAY['payment', 'gateway', 'transaction'], '550e8400-e29b-41d4-a716-446655440000'),

('660e8400-e29b-41d4-a716-446655440002', 'User Profile', 'json', 'Universal user profile structure', 'both',
 '{"userId": "string", "username": "string", "email": "string", "firstName": "string", "lastName": "string", "phone": "string", "dateOfBirth": "date", "address": {"street": "string", "city": "string", "state": "string", "zipCode": "string", "country": "string"}, "preferences": {"language": "string", "timezone": "string", "notifications": {"email": "boolean", "sms": "boolean"}}, "createdAt": "datetime", "updatedAt": "datetime", "status": "string"}',
 ARRAY['user', 'profile', 'universal'], '550e8400-e29b-41d4-a716-446655440001'),

('660e8400-e29b-41d4-a716-446655440003', 'Inventory Update', 'json', 'Product inventory update message', 'both',
 '{"productId": "string", "sku": "string", "name": "string", "category": "string", "currentStock": "integer", "reservedStock": "integer", "availableStock": "integer", "reorderLevel": "integer", "supplier": {"id": "string", "name": "string", "contact": "string"}, "lastUpdated": "datetime", "warehouse": {"id": "string", "name": "string", "location": "string"}}',
 ARRAY['inventory', 'product', 'stock'], '550e8400-e29b-41d4-a716-446655440001');

-- Sample Communication Adapters
INSERT INTO communication_adapters (id, name, type, mode, description, configuration, status, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'Shopify REST API', 'rest', 'bidirectional', 'Shopify e-commerce platform integration via REST API',
 '{"baseUrl": "https://your-shop.myshopify.com/admin/api/2023-10", "authentication": {"type": "api-key", "credentials": {"header": "X-Shopify-Access-Token", "token": "your-access-token"}}, "headers": {"Content-Type": "application/json", "Accept": "application/json"}, "timeout": 30000, "retryPolicy": {"maxRetries": 3, "backoffMultiplier": 2}}',
 'active', '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440001', 'PayPal Payment Gateway', 'rest', 'outbound', 'PayPal payment processing integration',
 '{"baseUrl": "https://api.paypal.com", "authentication": {"type": "oauth2", "credentials": {"clientId": "your-client-id", "clientSecret": "your-client-secret", "scope": "payments"}}, "headers": {"Content-Type": "application/json", "Accept": "application/json"}, "timeout": 45000}',
 'active', '550e8400-e29b-41d4-a716-446655440000'),

('770e8400-e29b-41d4-a716-446655440002', 'SFTP File Transfer', 'file', 'bidirectional', 'Secure file transfer for batch processing',
 '{"protocol": "sftp", "host": "files.example.com", "port": 22, "authentication": {"type": "key", "username": "integration", "privateKeyPath": "/keys/sftp-key"}, "directories": {"inbound": "/incoming", "outbound": "/outgoing", "archive": "/archive"}, "filePattern": "*.{json,xml,csv}", "encoding": "UTF-8"}',
 'active', '550e8400-e29b-41d4-a716-446655440001'),

('770e8400-e29b-41d4-a716-446655440003', 'PostgreSQL Database', 'database', 'bidirectional', 'Primary application database connection',
 '{"driver": "postgresql", "connectionString": "postgresql://username:password@localhost:5432/integration_db", "schema": "public", "poolSize": 10, "connectionTimeout": 30000, "queryTimeout": 60000, "ssl": {"enabled": true, "rejectUnauthorized": false}}',
 'active', '550e8400-e29b-41d4-a716-446655440001'),

('770e8400-e29b-41d4-a716-446655440004', 'Email Notification Service', 'email', 'outbound', 'SMTP service for system notifications',
 '{"smtpHost": "smtp.gmail.com", "smtpPort": 587, "encryption": "tls", "authentication": {"username": "notifications@company.com", "password": "app-password"}, "fromAddress": "Integration Platform <notifications@company.com>", "templates": {"success": "flow-success.html", "error": "flow-error.html"}}',
 'active', '550e8400-e29b-41d4-a716-446655440002');

-- Sample Integration Flows
INSERT INTO integration_flows (id, name, description, source_adapter_id, target_adapter_id, source_structure_id, target_structure_id, status, configuration, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'Shopify to PayPal Order Processing', 'Process new orders from Shopify and create payments in PayPal',
 '770e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 'active',
 '{"schedule": {"type": "webhook", "endpoint": "/webhooks/shopify/orders"}, "errorHandling": {"maxRetries": 3, "retryDelay": 5000, "notificationEmail": "admin@company.com"}, "logging": {"level": "INFO", "includePayload": true}}',
 '550e8400-e29b-41d4-a716-446655440000'),

('880e8400-e29b-41d4-a716-446655440001', 'File to Database Import', 'Import customer data from CSV files to database',
 '770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'active',
 '{"schedule": {"type": "cron", "expression": "0 2 * * *", "timezone": "UTC"}, "fileProcessing": {"archiveProcessed": true, "deleteAfterProcessing": false}, "batchSize": 1000}',
 '550e8400-e29b-41d4-a716-446655440001'),

('880e8400-e29b-41d4-a716-446655440002', 'Inventory Sync Flow', 'Synchronize inventory levels between systems',
 '770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'draft',
 '{"schedule": {"type": "interval", "intervalMinutes": 15}, "conflictResolution": "lastWriteWins", "deltaSync": true}',
 '550e8400-e29b-41d4-a716-446655440001');

-- Sample Flow Transformations
INSERT INTO flow_transformations (id, flow_id, type, configuration, execution_order) VALUES
('990e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'field-mapping', 
 '{"name": "Order to Payment Mapping", "description": "Map Shopify order fields to PayPal payment request"}', 1),

('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 'custom-function',
 '{"name": "Currency Conversion", "functionName": "convertCurrency", "parameters": {"from": "order.currency", "to": "USD", "source": "exchangeRateAPI"}}', 2),

('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'validation',
 '{"rules": [{"field": "email", "type": "email", "required": true}, {"field": "phone", "type": "phone", "required": false}]}', 1),

('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'field-mapping',
 '{"name": "CSV to Database Mapping", "description": "Map CSV columns to database fields"}', 2);

-- Sample Field Mappings
INSERT INTO field_mappings (id, transformation_id, source_fields, target_field, java_function, mapping_rule) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000', 
 ARRAY['orderId'], 'transactionId', NULL, 'Direct mapping with prefix "ORDER_"'),

('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440000',
 ARRAY['totalAmount'], 'amount', 'Math.round(value * 100) / 100', 'Round to 2 decimal places'),

('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440000',
 ARRAY['currency'], 'currency', NULL, 'Direct mapping'),

('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003',
 ARRAY['firstName', 'lastName'], 'fullName', 'firstName + " " + lastName', 'Concatenate first and last name'),

('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003',
 ARRAY['email'], 'email', 'value.toLowerCase()', 'Convert to lowercase');

-- Sample System Settings
INSERT INTO system_settings (category, key, value, description) VALUES
('integration', 'default_timeout', '30000', 'Default timeout for API calls in milliseconds'),
('integration', 'max_retries', '3', 'Maximum number of retries for failed operations'),
('integration', 'log_retention_days', '90', 'Number of days to retain execution logs'),
('security', 'session_timeout', '3600', 'User session timeout in seconds'),
('security', 'password_policy', '{"minLength": 8, "requireUppercase": true, "requireLowercase": true, "requireNumbers": true, "requireSpecialChars": false}', 'Password complexity requirements'),
('email', 'admin_notifications', '["admin@integration-platform.com"]', 'Email addresses for system notifications'),
('monitoring', 'health_check_interval', '300', 'Health check interval in seconds'),
('monitoring', 'alert_thresholds', '{"error_rate": 0.05, "response_time": 5000, "queue_depth": 1000}', 'Monitoring alert thresholds');

-- Sample Flow Executions (for demo/testing)
INSERT INTO flow_executions (id, flow_id, status, started_at, completed_at, execution_time_ms, processed_records, failed_records) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440000', 'success', 
 CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '59 minutes', 1250, 1, 0),

('bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440000', 'success',
 CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '119 minutes', 980, 1, 0),

('bb0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'success',
 CURRENT_TIMESTAMP - INTERVAL '12 hours', CURRENT_TIMESTAMP - INTERVAL '11 hours 58 minutes', 15000, 500, 0),

('bb0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 'error',
 CURRENT_TIMESTAMP - INTERVAL '36 hours', CURRENT_TIMESTAMP - INTERVAL '35 hours 59 minutes', 5000, 250, 250);

-- Update statistics tables with sample data
INSERT INTO flow_statistics (flow_id, date, total_executions, successful_executions, failed_executions, total_execution_time_ms, total_records_processed) VALUES
('880e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 24, 23, 1, 28500, 24),
('880e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 1, 1, 0, 15000, 500),
('880e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 22, 22, 0, 26400, 22),
('880e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 1, 0, 1, 5000, 250);

INSERT INTO adapter_statistics (adapter_id, date, total_messages, successful_messages, failed_messages, total_response_time_ms, min_response_time_ms, max_response_time_ms) VALUES
('770e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 48, 46, 2, 48000, 800, 2500),
('770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, 24, 23, 1, 28500, 950, 1800),
('770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, 2, 2, 0, 30000, 14000, 16000),
('770e8400-e29b-41d4-a716-446655440003', CURRENT_DATE, 1500, 1500, 0, 75000, 20, 250);

-- Insert enhanced system logs for admin interface
INSERT INTO system_logs (id, timestamp, level, message, details, source, source_id, source_name, user_id) VALUES
('110e8400-e29b-41d4-a716-446655440000', '2024-01-15 14:30:00', 'info', 'User logged in successfully', '{"ip": "192.168.1.100", "userAgent": "Mozilla/5.0"}', 'system', '550e8400-e29b-41d4-a716-446655440000', 'Authentication Service', '550e8400-e29b-41d4-a716-446655440000'),
('110e8400-e29b-41d4-a716-446655440001', '2024-01-15 14:25:00', 'info', 'Adapter started successfully', '{"adapterId": "770e8400-e29b-41d4-a716-446655440000", "version": "1.2.3"}', 'adapter', '770e8400-e29b-41d4-a716-446655440000', 'Shopify REST API', '550e8400-e29b-41d4-a716-446655440001'),
('110e8400-e29b-41d4-a716-446655440002', '2024-01-15 14:20:00', 'warn', 'Certificate expiring soon', '{"certificateId": "330e8400-e29b-41d4-a716-446655440002", "daysUntilExpiry": 15}', 'system', '330e8400-e29b-41d4-a716-446655440002', 'Certificate Manager', NULL),
('110e8400-e29b-41d4-a716-446655440003', '2024-01-15 14:15:00', 'error', 'Database connection failed', '{"host": "db.example.com", "port": 5432, "error": "Connection timeout"}', 'adapter', '770e8400-e29b-41d4-a716-446655440003', 'PostgreSQL Database', '550e8400-e29b-41d4-a716-446655440001'),
('110e8400-e29b-41d4-a716-446655440004', '2024-01-15 14:10:00', 'info', 'Message processed successfully', '{"messageId": "msg_12345", "processingTime": 150}', 'channel', 'ch_001', 'HTTP Channel', NULL),
('110e8400-e29b-41d4-a716-446655440005', '2024-01-15 14:05:00', 'debug', 'Flow execution started', '{"flowId": "880e8400-e29b-41d4-a716-446655440000", "trigger": "scheduler"}', 'flow', '880e8400-e29b-41d4-a716-446655440000', 'Shopify to PayPal Order Processing', '550e8400-e29b-41d4-a716-446655440001'),
('110e8400-e29b-41d4-a716-446655440006', '2024-01-15 14:00:00', 'info', 'System health check completed', '{"cpu": 45, "memory": 68, "disk": 23}', 'system', NULL, 'Health Monitor', NULL),
('110e8400-e29b-41d4-a716-446655440007', '2024-01-15 13:55:00', 'warn', 'High memory usage detected', '{"usage": 85, "threshold": 80}', 'system', NULL, 'Resource Monitor', NULL),
('110e8400-e29b-41d4-a716-446655440008', '2024-01-15 13:50:00', 'error', 'API rate limit exceeded', '{"endpoint": "/api/messages", "limit": 1000, "current": 1001}', 'api', NULL, 'API Gateway', NULL),
('110e8400-e29b-41d4-a716-446655440009', '2024-01-15 13:45:00', 'info', 'JAR file uploaded successfully', '{"fileName": "mysql-connector-java-8.0.33.jar", "size": 2456789}', 'system', '220e8400-e29b-41d4-a716-446655440000', 'File Manager', '550e8400-e29b-41d4-a716-446655440000'),
('110e8400-e29b-41d4-a716-446655440010', '2024-01-15 13:40:00', 'info', 'Configuration updated', '{"component": "adapter", "setting": "timeout", "oldValue": 30, "newValue": 60}', 'adapter', '770e8400-e29b-41d4-a716-446655440000', 'Shopify REST API', '550e8400-e29b-41d4-a716-446655440001'),
('110e8400-e29b-41d4-a716-446655440011', '2024-01-15 13:35:00', 'error', 'SSL handshake failed', '{"host": "external-api.com", "certificateIssuer": "Unknown"}', 'adapter', '770e8400-e29b-41d4-a716-446655440001', 'PayPal Payment Gateway', NULL),
('110e8400-e29b-41d4-a716-446655440012', '2024-01-15 13:30:00', 'info', 'Scheduled backup completed', '{"backupSize": "2.3GB", "duration": "15min"}', 'system', NULL, 'Backup Service', NULL),
('110e8400-e29b-41d4-a716-446655440013', '2024-01-15 13:25:00', 'warn', 'Disk space low', '{"available": "2GB", "threshold": "5GB"}', 'system', NULL, 'Storage Monitor', NULL),
('110e8400-e29b-41d4-a716-446655440014', '2024-01-15 13:20:00', 'info', 'User role updated', '{"userId": "550e8400-e29b-41d4-a716-446655440002", "oldRole": "integrator", "newRole": "viewer"}', 'system', '550e8400-e29b-41d4-a716-446655440002', 'User Management', '550e8400-e29b-41d4-a716-446655440000'),
('110e8400-e29b-41d4-a716-446655440015', '2024-01-15 13:15:00', 'error', 'Certificate validation failed', '{"certificateId": "330e8400-e29b-41d4-a716-446655440002", "error": "Certificate has expired"}', 'system', '330e8400-e29b-41d4-a716-446655440002', 'Certificate Validator', NULL);