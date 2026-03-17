-- Custom enum types used across tables

CREATE TYPE user_role AS ENUM (
  'admin',
  'technician',
  'client_user'
);

CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'resolved',
  'closed'
);

CREATE TYPE ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);
