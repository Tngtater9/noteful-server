CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE folders (
    id uuid DEFAULT uuid_generate_v4 () UNIQUE NOT NULL,
    folder_name TEXT NOT NULL
);