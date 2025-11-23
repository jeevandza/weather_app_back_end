import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/sequelize.js";





(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
})();

const PORT = 8080;

const app = express();
dotenv.config();

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
  console.log(`Server listening on ${PORT}`);
});
