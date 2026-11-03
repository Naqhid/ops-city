# CityOps database migrations

Your existing MySQL database created from `Avion.sql` is the source of truth. Do not re-import or replace it.

No schema-changing migration is included yet because the live schema must be compared with each feature's required columns before a safe migration can be authored. Do not add speculative `ALTER TABLE` statements.

When a verified schema change is needed, add a sequential SQL file such as `001_add_verified_missing_column.sql`, document its purpose and rollback considerations, and back up the database before applying it. Existing business records must be preserved.
