import express from "express";
import { weatherController } from "../controllers/index.js";
import { weatherValidations } from "../middlewares/validations/index.js";
import { validate } from "../middlewares/validation.js";

const router = express.Router();

/**
 * GET based in q params
 */
router
  .route("/")
  .get(
    validate(weatherValidations.weatherQuerySchema),
    weatherController.getWeather
  );

/**
 * Complete list from database added to testing
 */
router
  .route("/list")
  .get(
    validate(weatherValidations.fetchAllWeatherSchema),
    weatherController.getWeatherList
  );

export default router;
