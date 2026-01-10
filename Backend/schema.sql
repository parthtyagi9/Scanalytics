-- 1. CLEAN SLATE: Delete old tables if they exist
-- We use CASCADE to delete any connected data (like events linked to a project)
DROP TABLE IF EXISTS insights_config CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 2. Setup UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create Tables (Fresh)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    api_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    properties JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insights_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    insight_title TEXT,
    sql_query TEXT NOT NULL,
    threshold_condition TEXT,
    last_run_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_properties ON analytics_events USING GIN (properties);

-- 4. Seed a Test Project
INSERT INTO projects (name, description, api_key)
VALUES ('Demo Startup', 'We are a video streaming platform.', 'test-api-key-123');