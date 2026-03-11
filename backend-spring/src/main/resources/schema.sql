-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- GIN index on analytics_events.properties for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_events_properties ON analytics_events USING GIN (properties);
