import express from "express";
import { WeatherController } from "../controllers/index.js";
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
    WeatherController.getCurrentWeather
  );

/**
 * Complete list from database added to testing
 */
router
  .route("/list")
  .get(
    validate(weatherValidations.fetchAllWeatherSchema),
    WeatherController.getWeatherList
  );

export default router;
