import { Pool } from "pg";
import logger from "../utils/logger";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Connect postgres sql
 */
async function connectToDatabase() {
  try {
    const res = await pool.query("SELECT NOW()");
    logger.info("Connected to database");
  } catch (err) {
    logger.error(`Database error: ${err}`);
  }
}

export { connectToDatabase };
