#!/bin/sh
set -eu

# Runs before the Next.js server on every pod start. DATABASE_URL comes from
# the SealedSecret (envFrom in helm/templates/deployment.yaml) and points at
# the in-namespace Postgres (helm/templates/postgres.yaml).

echo "[entrypoint] applying database migrations"
node scripts/run-migrations.cjs

# Seeding is opt-in (RUN_SEED=true) and never runs automatically: the seed
# upserts content but still isn't something that should silently re-run on
# every pod restart. Set RUN_SEED=true in values-<env>.yaml for the first
# boot of an empty database, then remove it.
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] RUN_SEED=true — seeding database"
  npx tsx prisma/seed.ts
fi

echo "[entrypoint] starting Next.js standalone server on :${PORT:-3000}"
exec node server.js
