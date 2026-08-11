CREATE TABLE IF NOT EXISTS task_categories (
    id TEXT PRIMARY KEY DEFAULT uuidv7()::text,
    owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    color VARCHAR(32) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_task_categories_owner_name UNIQUE (owner_user_id, name)
);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY DEFAULT uuidv7()::text,
    owner_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    task_category_id TEXT NULL REFERENCES task_categories (id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_shares (
    id TEXT PRIMARY KEY DEFAULT uuidv7()::text,
    task_id TEXT NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
    shared_with_user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    permission VARCHAR(16) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_task_shares_task_user UNIQUE (task_id, shared_with_user_id),
    CONSTRAINT chk_task_shares_permission CHECK (permission IN ('view', 'edit'))
);

CREATE INDEX IF NOT EXISTS idx_task_categories_owner_user_id
    ON task_categories (owner_user_id)
    INCLUDE (id, name, color, updated_at);

CREATE INDEX IF NOT EXISTS idx_tasks_owner_created_at
    ON tasks (owner_user_id, created_at DESC)
    INCLUDE (id, title, is_completed, task_category_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_tasks_owner_is_completed_created_at
    ON tasks (owner_user_id, is_completed, created_at DESC)
    INCLUDE (id, title, task_category_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_tasks_owner_task_category_created_at
    ON tasks (owner_user_id, task_category_id, created_at DESC)
    INCLUDE (id, title, is_completed, updated_at);

CREATE INDEX IF NOT EXISTS idx_task_shares_task_id
    ON task_shares (task_id)
    INCLUDE (shared_with_user_id, permission, created_at);

CREATE INDEX IF NOT EXISTS idx_task_shares_shared_with_user_id
    ON task_shares (shared_with_user_id, created_at DESC)
    INCLUDE (task_id, permission);
