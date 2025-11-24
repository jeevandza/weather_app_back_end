/**
 * Load env
 */
import "dotenv/config";
import routes from "./routes/index.js";
import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
// import sequelize from "./config/sequelize.js";
import { initializeModels } from "./models/index.js";

// important! wait until models are ready
await initializeModels();

// // (async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log("Postgres connected successfully");
// //   } catch (err) {
// //     console.error("Postgres connection failed:", err);
// //   }
// // })();

/**
 * Server port
 */
const PORT = process.env.PORT || 3000;
/**
 * Express config
 */
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

/**
 * Combined routes
 */
app.use("/v1", routes);

app.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
});
