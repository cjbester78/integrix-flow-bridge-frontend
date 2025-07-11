-- Integration Platform Database Schema (MySQL)
-- This schema supports the complete integration platform functionality

-- Set SQL mode for strict compliance
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- Roles table for admin management
CREATE TABLE roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users and Authentication
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id CHAR(36),
    role ENUM('administrator', 'integrator', 'viewer') NOT NULL DEFAULT 'viewer',
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
    permissions JSON, -- JSON array of permission strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Certificates table for admin management
CREATE TABLE certificates (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    issuer VARCHAR(255),
    certificate_data TEXT,
    private_key_data TEXT,
    valid_from DATE,
    valid_to DATE,
    status ENUM('active', 'expiring', 'expired', 'revoked') DEFAULT 'active',
    `usage` TEXT,
    fingerprint VARCHAR(128),
    serial_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- JAR Files table for admin management
CREATE TABLE jar_files (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    size_bytes BIGINT,
    driver_type VARCHAR(100),
    upload_date DATE DEFAULT (CURDATE()),
    checksum VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    uploaded_by CHAR(36),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- User Sessions/Tokens
CREATE TABLE user_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    refresh_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45), -- Supports IPv6
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Data Structures
CREATE TABLE data_structures (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    type ENUM('json', 'xsd', 'wsdl', 'custom') NOT NULL,
    description TEXT,
    `usage` ENUM('source', 'target', 'both') NOT NULL,
    structure JSON NOT NULL, -- The actual structure definition
    namespace_uri VARCHAR(500),
    namespace_prefix VARCHAR(50),
    schema_location VARCHAR(500),
    tags JSON, -- JSON array of tags for categorization
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Structure Versions (for version history)
CREATE TABLE structure_versions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    structure_id CHAR(36) NOT NULL,
    version INTEGER NOT NULL,
    structure JSON NOT NULL,
    changes TEXT, -- Description of changes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by CHAR(36),
    FOREIGN KEY (structure_id) REFERENCES data_structures(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    UNIQUE KEY unique_structure_version (structure_id, version)
);

-- Communication Adapters
CREATE TABLE communication_adapters (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    type ENUM('rest', 'soap', 'file', 'database', 'sap', 'salesforce', 'email', 'sms') NOT NULL,
    mode ENUM('inbound', 'outbound', 'bidirectional') NOT NULL,
    description TEXT,
    configuration JSON NOT NULL, -- Adapter-specific configuration
    status ENUM('active', 'inactive', 'error', 'testing') NOT NULL DEFAULT 'inactive',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    last_test_at TIMESTAMP NULL,
    last_test_result JSON,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Integration Flows
CREATE TABLE integration_flows (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_adapter_id CHAR(36) NOT NULL,
    target_adapter_id CHAR(36) NOT NULL,
    source_structure_id CHAR(36),
    target_structure_id CHAR(36),
    status ENUM('draft', 'active', 'inactive', 'error') NOT NULL DEFAULT 'draft',
    configuration JSON, -- Flow-specific configuration
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by CHAR(36),
    last_execution_at TIMESTAMP NULL,
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    FOREIGN KEY (source_adapter_id) REFERENCES communication_adapters(id),
    FOREIGN KEY (target_adapter_id) REFERENCES communication_adapters(id),
    FOREIGN KEY (source_structure_id) REFERENCES data_structures(id),
    FOREIGN KEY (target_structure_id) REFERENCES data_structures(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Flow Transformations
CREATE TABLE flow_transformations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    flow_id CHAR(36) NOT NULL,
    type ENUM('field-mapping', 'custom-function', 'filter', 'enrichment', 'validation') NOT NULL,
    configuration JSON NOT NULL, -- Transformation-specific configuration
    execution_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flow_id) REFERENCES integration_flows(id) ON DELETE CASCADE
);

-- Field Mappings
CREATE TABLE field_mappings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transformation_id CHAR(36) NOT NULL,
    source_fields JSON NOT NULL, -- JSON array of source field paths
    target_field VARCHAR(500) NOT NULL,
    java_function TEXT, -- Custom Java transformation function
    mapping_rule TEXT, -- Simple mapping rule description
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transformation_id) REFERENCES flow_transformations(id) ON DELETE CASCADE
);

-- Flow Executions (Audit/History)
CREATE TABLE flow_executions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    flow_id CHAR(36) NOT NULL,
    status ENUM('success', 'error', 'warning', 'running') NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    execution_time_ms INTEGER,
    input_data JSON,
    output_data JSON,
    error_message TEXT,
    error_details JSON,
    warnings JSON,
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    FOREIGN KEY (flow_id) REFERENCES integration_flows(id)
);

-- System Logs (enhanced for admin interface)
CREATE TABLE system_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level ENUM('info', 'warn', 'error', 'debug') NOT NULL,
    message TEXT NOT NULL,
    details JSON,
    source ENUM('adapter', 'system', 'channel', 'flow', 'api') NOT NULL,
    source_id VARCHAR(255),
    source_name VARCHAR(255),
    component VARCHAR(100), -- Legacy field for compatibility
    component_id CHAR(36), -- Legacy field for compatibility
    user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Adapter Statistics
CREATE TABLE adapter_statistics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    adapter_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    total_messages INTEGER DEFAULT 0,
    successful_messages INTEGER DEFAULT 0,
    failed_messages INTEGER DEFAULT 0,
    total_response_time_ms BIGINT DEFAULT 0,
    min_response_time_ms INTEGER,
    max_response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adapter_id) REFERENCES communication_adapters(id) ON DELETE CASCADE,
    UNIQUE KEY unique_adapter_date (adapter_id, date)
);

-- Flow Statistics
CREATE TABLE flow_statistics (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    flow_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    total_execution_time_ms BIGINT DEFAULT 0,
    total_records_processed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flow_id) REFERENCES integration_flows(id) ON DELETE CASCADE,
    UNIQUE KEY unique_flow_date (flow_id, date)
);

-- System Settings
CREATE TABLE system_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category VARCHAR(100) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `value` JSON NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by CHAR(36),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    UNIQUE KEY unique_category_key (category, `key`)
);

-- Indexes for better performance
CREATE INDEX idx_roles_name ON roles(name);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_valid_to ON certificates(valid_to);
CREATE INDEX idx_certificates_type ON certificates(type);
CREATE INDEX idx_certificates_issuer ON certificates(issuer);

CREATE INDEX idx_jar_files_driver_type ON jar_files(driver_type);
CREATE INDEX idx_jar_files_upload_date ON jar_files(upload_date);
CREATE INDEX idx_jar_files_is_active ON jar_files(is_active);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX idx_data_structures_type ON data_structures(type);
CREATE INDEX idx_data_structures_usage ON data_structures(`usage`);
CREATE INDEX idx_data_structures_created_by ON data_structures(created_by);

CREATE INDEX idx_structure_versions_structure_id ON structure_versions(structure_id);

CREATE INDEX idx_adapters_type ON communication_adapters(type);
CREATE INDEX idx_adapters_mode ON communication_adapters(mode);
CREATE INDEX idx_adapters_status ON communication_adapters(status);
CREATE INDEX idx_adapters_is_active ON communication_adapters(is_active);
CREATE INDEX idx_adapters_created_by ON communication_adapters(created_by);

CREATE INDEX idx_flows_source_adapter ON integration_flows(source_adapter_id);
CREATE INDEX idx_flows_target_adapter ON integration_flows(target_adapter_id);
CREATE INDEX idx_flows_status ON integration_flows(status);
CREATE INDEX idx_flows_created_by ON integration_flows(created_by);

CREATE INDEX idx_transformations_flow_id ON flow_transformations(flow_id);
CREATE INDEX idx_transformations_type ON flow_transformations(type);

CREATE INDEX idx_field_mappings_transformation_id ON field_mappings(transformation_id);

CREATE INDEX idx_executions_flow_id ON flow_executions(flow_id);
CREATE INDEX idx_executions_status ON flow_executions(status);
CREATE INDEX idx_executions_started_at ON flow_executions(started_at);

CREATE INDEX idx_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_source ON system_logs(source);
CREATE INDEX idx_logs_source_id ON system_logs(source_id);
CREATE INDEX idx_logs_component ON system_logs(component);
CREATE INDEX idx_logs_component_id ON system_logs(component_id);
CREATE INDEX idx_logs_created_at ON system_logs(created_at);

CREATE INDEX idx_adapter_stats_adapter_date ON adapter_statistics(adapter_id, date);
CREATE INDEX idx_flow_stats_flow_date ON flow_statistics(flow_id, date);