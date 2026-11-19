// Applies prisma/migrations/*/migration.sql in order and records them in
// `_prisma_migrations`, exactly like `prisma migrate deploy` — but with just
// `pg`, so the runtime image doesn't need the full prisma CLI + engines.
// Checksums are real sha256 of the file, so a later `prisma migrate status`
// still reports "up to date".
const { readdirSync, readFileSync, existsSync } = require("node:fs");
const { createHash, randomUUID } = require("node:crypto");
const { join } = require("node:path");
const { Client } = require("pg");

const MIGRATIONS_DIR = join(process.cwd(), "prisma", "migrations");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[migrate] DATABASE_URL is not set");
    process.exit(1);
  }
  if (!existsSync(MIGRATIONS_DIR)) {
    console.log("[migrate] no prisma/migrations directory — nothing to do");
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        id                  varchar(36)  PRIMARY KEY NOT NULL,
        checksum            varchar(64)  NOT NULL,
        finished_at         timestamptz,
        migration_name      varchar(255) NOT NULL,
        logs                text,
        rolled_back_at      timestamptz,
        started_at          timestamptz  NOT NULL DEFAULT now(),
        applied_steps_count integer      NOT NULL DEFAULT 0
      )`);

    const applied = new Set(
      (
        await client.query(
          `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`
        )
      ).rows.map((r) => r.migration_name)
    );

    const names = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d/.test(d.name))
      .map((d) => d.name)
      .sort();

    let pending = 0;
    for (const name of names) {
      if (applied.has(name)) {
        console.log(`[migrate]  = ${name}`);
        continue;
      }
      const sql = readFileSync(
        join(MIGRATIONS_DIR, name, "migration.sql"),
        "utf8"
      );
      const checksum = createHash("sha256").update(sql).digest("hex");
      console.log(`[migrate]  + ${name}`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          `INSERT INTO "_prisma_migrations"
             (id, checksum, migration_name, finished_at, applied_steps_count)
           VALUES ($1, $2, $3, now(), 1)`,
          [randomUUID(), checksum, name]
        );
        await client.query("COMMIT");
        pending++;
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`[migrate] FAILED on ${name}:`, err.message);
        process.exit(1);
      }
    }
    console.log(
      pending === 0
        ? "[migrate] database already up to date"
        : `[migrate] applied ${pending} migration(s)`
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[migrate]", err);
  process.exit(1);
});
