import "dotenv/config";
import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import routes from "./routes/index.js";
import { initializeModels } from "./models/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

async function startServer() {
  try {
    await initializeModels(); 
    logger.info("✅ Models initialized successfully");

    app.use("/v1", routes);

    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Server failed to start:", err);
    process.exit(1); 
  }
}

startServer();
