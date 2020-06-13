CREATE TABLE notes (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    modified TIMESTAMPTZ DEFAULT now(),
    folder uuid REFERENCES folders(id) ON DELETE CASCADE NOT NULL
);