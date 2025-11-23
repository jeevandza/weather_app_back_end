import { Pool } from "pg"

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "admin@123",
  port: 5433,
});

/**
 * Connect postgres sql 
 */
async function connectToDatabase() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected! Time:", res.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
  }
}

export { connectToDatabase };
