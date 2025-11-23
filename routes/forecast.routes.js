import express from "express";
import { ForecastController } from "../controllers/index.js";
import { validate } from "../middlewares/validation.js";
import { WeatherValidations } from "../middlewares/validations/index.js";


const router = express.Router();

/**
 * GET /forecast?q=<city>
 */
router
  .route("/")
  .get(
    validate(WeatherValidations.weatherQuerySchema),
    ForecastController.getForecast
  );

export default router;
