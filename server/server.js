const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users LIMIT 100");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(3000, () => console.log("Server running on port 3000"));
