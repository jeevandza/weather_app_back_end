import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";

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
