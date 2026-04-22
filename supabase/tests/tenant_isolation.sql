-- Tenant isolation smoke tests for all user-scoped tables.
-- Run with: psql "$SUPABASE_DB_URL" -f supabase/tests/tenant_isolation.sql

DO $$
DECLARE
  rec RECORD;
  policy_count INTEGER;
BEGIN
  FOR rec IN
    SELECT c.table_schema, c.table_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema
     AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND c.column_name = 'user_id'
      AND t.table_type = 'BASE TABLE'
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_class pc
      JOIN pg_namespace pn ON pn.oid = pc.relnamespace
      WHERE pn.nspname = rec.table_schema
        AND pc.relname = rec.table_name
        AND pc.relrowsecurity = true
    ) THEN
      RAISE EXCEPTION 'RLS is not enabled for %.%', rec.table_schema, rec.table_name;
    END IF;

    SELECT COUNT(*)
      INTO policy_count
    FROM pg_policies p
    WHERE p.schemaname = rec.table_schema
      AND p.tablename = rec.table_name
      AND (
        p.qual ILIKE '%user_id%'
        OR p.qual ILIKE '%auth.uid()%'
        OR p.with_check ILIKE '%user_id%'
        OR p.with_check ILIKE '%auth.uid()%'
      );

    IF policy_count = 0 THEN
      RAISE EXCEPTION 'No tenant policy found for %.% (expected user_id/auth.uid checks)', rec.table_schema, rec.table_name;
    END IF;
  END LOOP;
END
$$;
