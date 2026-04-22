# Edge Function Security Audit (April 22, 2026)

## Scope
All functions under `supabase/functions/*/index.ts` were reviewed for:
1. per-action authorization,
2. least-privilege DB use,
3. secret leakage in logs/errors,
4. request schema + rate limiting,
5. tenant isolation.

## High-risk findings
- Multiple functions used `SUPABASE_SERVICE_ROLE_KEY` for user-scoped reads/writes.
- Several functions duplicated ad-hoc Clerk auth logic and lacked strict action allowlists.
- Some error handlers returned raw exception messages.
- Request shape validation and endpoint-level rate-limits were inconsistent.

## Changes made
- Added centralized request middleware in `_shared/request-guard.ts` with:
  - auth handling,
  - action-level validation hooks,
  - in-memory rate limiting,
  - user-scoped and admin Supabase clients,
  - sanitized error responses.
- Migrated `emma-db-proxy`, `emma-benchmark`, and `emma-safety` to shared middleware.
- Added tenant isolation SQL checks for every `public` table containing a `user_id` column.

## Remaining rollout work
- Migrate remaining functions to `guardRequest` to remove duplicated auth and enforce per-action validators consistently.
- Replace service-role clients in user-scoped paths with `guard.userClient` where feasible.
- Add per-function action validation maps in remaining endpoints.
