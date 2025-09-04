-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the database if it doesn't exist
-- (This will be handled by the container environment)

-- Set timezone to UTC
SET timezone = 'UTC';

-- Create a function to set agency_id context (for RLS)
CREATE OR REPLACE FUNCTION set_agency_context(agency_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.agency_id', agency_id, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
