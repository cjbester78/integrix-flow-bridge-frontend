-- Integration Platform Database Schema
-- This schema supports the complete integration platform functionality

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Roles table for admin management
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('administrator', 'integrator', 'viewer')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE
);

-- Certificates table for admin management
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    issuer VARCHAR(255),
    certificate_data TEXT,
    private_key_data TEXT,
    valid_from DATE,
    valid_to DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired', 'revoked')),
    usage TEXT,
    fingerprint VARCHAR(128),
    serial_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- JAR Files table for admin management
CREATE TABLE jar_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    size_bytes BIGINT,
    driver_type VARCHAR(100),
    upload_date DATE DEFAULT CURRENT_DATE,
    checksum VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id)
);

-- User Sessions/Tokens
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Data Structures
CREATE TABLE data_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('json', 'xsd', 'wsdl', 'custom')),
    description TEXT,
    usage VARCHAR(20) NOT NULL CHECK (usage IN ('source', 'target', 'both')),
    structure JSONB NOT NULL, -- The actual structure definition
    namespace_uri VARCHAR(500),
    namespace_prefix VARCHAR(50),
    schema_location VARCHAR(500),
    tags TEXT[], -- Array of tags for categorization
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Structure Versions (for version history)
CREATE TABLE structure_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    structure_id UUID NOT NULL REFERENCES data_structures(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    structure JSONB NOT NULL,
    changes TEXT, -- Description of changes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    UNIQUE(structure_id, version)
);

-- Communication Adapters
CREATE TABLE communication_adapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('rest', 'soap', 'file', 'database', 'sap', 'salesforce', 'email', 'sms')),
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('inbound', 'outbound', 'bidirectional')),
    description TEXT,
    configuration JSONB NOT NULL, -- Adapter-specific configuration
    status VARCHAR(20) NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    last_test_at TIMESTAMP WITH TIME ZONE,
    last_test_result JSONB
);

-- Integration Flows
CREATE TABLE integration_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_adapter_id UUID NOT NULL REFERENCES communication_adapters(id),
    target_adapter_id UUID NOT NULL REFERENCES communication_adapters(id),
    source_structure_id UUID REFERENCES data_structures(id),
    target_structure_id UUID REFERENCES data_structures(id),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'error')),
    configuration JSONB, -- Flow-specific configuration
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    last_execution_at TIMESTAMP WITH TIME ZONE,
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0
);

-- Flow Transformations
CREATE TABLE flow_transformations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES integration_flows(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('field-mapping', 'custom-function', 'filter', 'enrichment', 'validation')),
    configuration JSONB NOT NULL, -- Transformation-specific configuration
    execution_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Field Mappings
CREATE TABLE field_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transformation_id UUID NOT NULL REFERENCES flow_transformations(id) ON DELETE CASCADE,
    source_fields TEXT[] NOT NULL, -- Array of source field paths
    target_field VARCHAR(500) NOT NULL,
    java_function TEXT, -- Custom Java transformation function
    mapping_rule TEXT, -- Simple mapping rule description
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Flow Executions (Audit/History)
CREATE TABLE flow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES integration_flows(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'error', 'warning', 'running')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    execution_time_ms INTEGER,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    error_details JSONB,
    warnings TEXT[],
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0
);

-- System Logs (enhanced for admin interface)
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(10) NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
    message TEXT NOT NULL,
    details JSONB,
    source VARCHAR(50) NOT NULL CHECK (source IN ('adapter', 'system', 'channel', 'flow', 'api')),
    source_id VARCHAR(255),
    source_name VARCHAR(255),
    component VARCHAR(100), -- Legacy field for compatibility
    component_id UUID, -- Legacy field for compatibility
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adapter Statistics
CREATE TABLE adapter_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adapter_id UUID NOT NULL REFERENCES communication_adapters(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_messages INTEGER DEFAULT 0,
    successful_messages INTEGER DEFAULT 0,
    failed_messages INTEGER DEFAULT 0,
    total_response_time_ms BIGINT DEFAULT 0,
    min_response_time_ms INTEGER,
    max_response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(adapter_id, date)
);

-- Flow Statistics
CREATE TABLE flow_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_id UUID NOT NULL REFERENCES integration_flows(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    total_execution_time_ms BIGINT DEFAULT 0,
    total_records_processed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flow_id, date)
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    UNIQUE(category, key)
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
CREATE INDEX idx_data_structures_usage ON data_structures(usage);
CREATE INDEX idx_data_structures_created_by ON data_structures(created_by);
CREATE INDEX idx_data_structures_tags ON data_structures USING GIN(tags);

CREATE INDEX idx_structure_versions_structure_id ON structure_versions(structure_id);
CREATE INDEX idx_structure_versions_version ON structure_versions(structure_id, version);

CREATE INDEX idx_adapters_type ON communication_adapters(type);
CREATE INDEX idx_adapters_mode ON communication_adapters(mode);
CREATE INDEX idx_adapters_status ON communication_adapters(status);
CREATE INDEX idx_adapters_created_by ON communication_adapters(created_by);

CREATE INDEX idx_flows_source_adapter ON integration_flows(source_adapter_id);
CREATE INDEX idx_flows_target_adapter ON integration_flows(target_adapter_id);
CREATE INDEX idx_flows_status ON integration_flows(status);
CREATE INDEX idx_flows_created_by ON integration_flows(created_by);

CREATE INDEX idx_transformations_flow_id ON flow_transformations(flow_id);
CREATE INDEX idx_transformations_type ON flow_transformations(type);
CREATE INDEX idx_transformations_order ON flow_transformations(flow_id, execution_order);

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

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jar_files_updated_at BEFORE UPDATE ON jar_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_structures_updated_at BEFORE UPDATE ON data_structures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adapters_updated_at BEFORE UPDATE ON communication_adapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON integration_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transformations_updated_at BEFORE UPDATE ON flow_transformations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_field_mappings_updated_at BEFORE UPDATE ON field_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();