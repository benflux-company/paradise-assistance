# syntax=docker/dockerfile:1
#
# Multi-stage build for the Benflux k3s cluster. The Next.js app lives in
# web/ (the static reference site stays at the repo root until the client
# validates the migration — see web/README.md); this Dockerfile's build
# context is the repo root so both can coexist, with every COPY pointing
# into web/.
#
# Built by the platform's Tekton pipeline (kaniko) on every push to
# develop / main — see benflux-infra/tekton. No NEXT_PUBLIC_* build args are
# needed: this app reads all of its config server-side only.

FROM node:20-alpine AS base
# openssl + libc6-compat: Prisma's query engine needs them on musl/alpine.
RUN apk add --no-cache openssl libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"

# ── deps ─────────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci

# ── build ────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY web/ .
RUN npx prisma generate \
 && npm run build

# ── migrator deps ────────────────────────────────────────────────────────────
# `output: 'standalone'` only traces modules the Next.js server itself
# imports, so pg (migration runner), tsx and bcrypt (prisma/seed.ts, never
# imported by the app) are missing from .next/standalone/node_modules.
# Installed fresh here instead of pulling in the full prisma CLI at runtime.
FROM base AS migrator-deps
WORKDIR /opt/migrator
RUN npm init -y >/dev/null 2>&1 \
 && npm install --omit=dev --no-audit --no-fund pg@8 tsx@4 bcrypt@6 \
 && npm cache clean --force

# ── runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -G nodejs -S nextjs

COPY --from=builder      /app/.next/standalone/node_modules ./node_modules
COPY --from=migrator-deps /opt/migrator/node_modules        ./node_modules
COPY --from=builder      /app/public                        ./public
COPY --from=builder      /app/prisma                        ./prisma
COPY --from=builder      /app/lib                           ./lib
COPY --from=builder      /app/scripts/run-migrations.cjs    ./scripts/run-migrations.cjs
COPY web/docker-entrypoint.sh ./
COPY --from=builder      /app/.next/standalone/package.json ./package.json
COPY --from=builder      /app/.next/standalone/server.js    ./server.js
COPY --from=builder      /app/.next/standalone/.next        ./.next
COPY --from=builder      /app/.next/static                  ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
