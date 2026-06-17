const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => console.log("[db] new connection opened"));
pool.on("error", (err) => console.error("[db] pool error:", err.message));

app.get("/api/users", async (req, res) => {
  const start = Date.now();
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 100");
    const ms = Date.now() - start;
    console.log(`[ok] GET /api/users — ${result.rowCount} rows — ${ms}ms`);
    res.json(result.rows);
  } catch (err) {
    const ms = Date.now() - start;
    console.error(`[err] GET /api/users — ${ms}ms — ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(3000, () => {
  console.log("Server running on port 3000");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "set" : "NOT SET");
});
