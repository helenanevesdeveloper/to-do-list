#!/bin/sh
set -eu

set -- /migrations/*.sql
if [ "$1" = "/migrations/*.sql" ]; then
    echo "No migration files found"
    exit 0
fi

export PGPASSWORD="${POSTGRES_PASSWORD}"

psql \
    -h db \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    -v ON_ERROR_STOP=1 \
    -c "
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    "

for file in "$@"; do
    filename="$(basename "$file")"
    applied="$(
        psql \
            -h db \
            -U "${POSTGRES_USER}" \
            -d "${POSTGRES_DB}" \
            -tA \
            -c "SELECT 1 FROM schema_migrations WHERE filename = '$filename';"
    )"

    if [ "$applied" = "1" ]; then
        echo "Skipping migration: $filename"
        continue
    fi

    echo "Applying migration: $filename"
    psql \
        -h db \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        -v ON_ERROR_STOP=1 \
        -f "$file"

    psql \
        -h db \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        -v ON_ERROR_STOP=1 \
        -c "INSERT INTO schema_migrations (filename) VALUES ('$filename');"
done
