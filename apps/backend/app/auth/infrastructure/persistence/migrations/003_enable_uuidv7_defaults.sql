ALTER TABLE users
    ALTER COLUMN id SET DEFAULT uuidv7()::text;

ALTER TABLE auth_sessions
    ALTER COLUMN id SET DEFAULT uuidv7()::text;
