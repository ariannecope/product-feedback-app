const { Pool } = require("pg");

// Connection string is supplied via env var (Neon Postgres in production,
// local Postgres in development) — see PRD section 5. No credentials
// hardcoded here, and no schema/queries are set up yet.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
