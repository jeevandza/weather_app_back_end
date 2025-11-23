import 'dotenv/config';
import express from "express";
import routes from "./routes/index.js";
import cors from "cors";
// import sequelize from "./config/sequelize.js";
import logger from "./utils/logger.js";


/**
 * Load env
 */


/**
 * Server port
 */
const PORT = 8080;

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
  logger.info(`Server listening on ${PORT}`)
    console.log(`Server running on port ${PORT}`);

});
