-- Seed Data for Integration Platform
-- This file contains sample data for development and testing

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, email, password_hash, first_name, last_name, role, status, permissions, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@integration-platform.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'System', 'Administrator', 'admin', 'active', 
 ARRAY['flows:create', 'flows:read', 'flows:update', 'flows:delete', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:delete', 'adapters:test', 'structures:create', 'structures:read', 'structures:update', 'structures:delete', 'users:create', 'users:read', 'users:update', 'users:delete', 'system:admin'], TRUE),

('550e8400-e29b-41d4-a716-446655440001', 'developer', 'developer@integration-platform.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'John', 'Developer', 'developer', 'active',
 ARRAY['flows:create', 'flows:read', 'flows:update', 'flows:execute', 'adapters:create', 'adapters:read', 'adapters:update', 'adapters:test', 'structures:create', 'structures:read', 'structures:update'], TRUE),

('550e8400-e29b-41d4-a716-446655440002', 'operator', 'operator@integration-platform.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'Jane', 'Operator', 'operator', 'active',
 ARRAY['flows:read', 'flows:execute', 'adapters:read', 'adapters:test', 'structures:read'], TRUE),

('550e8400-e29b-41d4-a716-446655440003', 'viewer', 'viewer@integration-platform.com', '$2b$10$rKjWJL8sZZ8fCLwn8yJLruN1.5HJLfMvKxWHNM3YzNHN1EpZUxzKu', 'Bob', 'Viewer', 'viewer', 'active',
 ARRAY['flows:read', 'adapters:read', 'structures:read'], TRUE);

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